import { useEffect, useRef, useState } from "react";
import type { ContatoContent } from "@/content/types";

/**
 * Mapa da clínica em MOSAICO DE TILES, com marcador, coordenadas e inclinação 3D
 * ao passar o mouse. Adaptado do componente que o cliente trouxe em 12/08.
 *
 * ---------------------------------------------------------------------------
 * O QUE FOI TROCADO DO TEMPLATE
 * ---------------------------------------------------------------------------
 * - `next/image` não existe aqui: o projeto é TanStack Start, não Next. Virou
 *   `<img>` puro, que para tile de 256px é o certo de todo modo — não há o que
 *   otimizar num PNG já dimensionado.
 * - `motion/react` não está no projeto. A inclinação virou duas variáveis CSS
 *   escritas no `pointermove` com transição de saída; a mola do original não se
 *   distingue disso num movimento de 8 graus.
 * - Sem clique-para-expandir. No template o cartão nasce 240×140 e cresce ao
 *   clicar, o que faz sentido num widget solto; aqui o mapa é o conteúdo da
 *   seção e nascer pequeno seria esconder a informação atrás de um clique que
 *   ninguém sabe que existe.
 * - A cor do marcador saiu do verde-menta `#34D399` cravado para o petróleo da
 *   Suzuki, e o `font-mono` das coordenadas continua — é um dos dois únicos usos
 *   de monoespaçada que sobreviveram, e aqui ela é literal: coordenada é dado.
 *
 * ---------------------------------------------------------------------------
 * ATRIBUIÇÃO — É OBRIGAÇÃO DE LICENÇA, NÃO CORTESIA
 * ---------------------------------------------------------------------------
 * ⚠️ Os tiles vêm do OpenStreetMap (dados sob ODbL) servidos pela CARTO, e as
 * duas licenças EXIGEM crédito visível. O template não tem nenhum. O crédito
 * abaixo do mapa não é decoração e não deve ser removido para "limpar" o layout.
 *
 * Nota para a publicação: a política de uso dos tiles públicos do OSM desencoraja
 * apontar site de produção para `tile.openstreetmap.org`. O provedor padrão aqui é
 * a CARTO, cujo basemap gratuito tem limite próprio de requisições. Para um site
 * com tráfego real, vale contratar um provedor de tiles ou voltar ao mapa do
 * Google — a troca é uma linha em `provedorTile`.
 *
 * ---------------------------------------------------------------------------
 * SEM COORDENADAS, CAI NO MAPA DO GOOGLE
 * ---------------------------------------------------------------------------
 * O mosaico precisa de latitude e longitude. Enquanto elas não vierem, a seção
 * renderiza o embed do Google, que funciona pelo endereço em texto. Isso é
 * deliberado: NÃO se estima coordenada de clínica. Um pino a 300m do lugar certo
 * manda o paciente para a esquina errada, e o erro é invisível para quem publica.
 */

type Provedor = "carto-light" | "carto-dark" | "openstreetmap";

function urlDoTile(provedor: Provedor, x: number, y: number, z: number) {
  switch (provedor) {
    case "carto-light":
      return `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;
    case "carto-dark":
      return `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/${z}/${x}/${y}.png`;
    default:
      return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  }
}

/**
 * Projeção Web Mercator, devolvendo a posição FRACIONÁRIA em tiles.
 *
 * A fração é o ponto: o template usa só a parte inteira e centraliza o mosaico
 * pelo tile do meio, o que põe o pino no centro do TILE e não no endereço. No
 * zoom 16 um tile cobre ~600m, então o erro chega a ~300m — o suficiente para
 * apontar outra quadra. Com a fração, o pino cai no lugar.
 */
function projetar(lat: number, lng: number, z: number) {
  const n = 2 ** z;
  const x = ((lng + 180) / 360) * n;
  const radianos = (lat * Math.PI) / 180;
  const y =
    ((1 -
      Math.log(Math.tan(radianos) + 1 / Math.cos(radianos)) / Math.PI) /
      2) *
    n;
  return { x, y };
}

function coordenadasLegiveis(lat: number, lng: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "L" : "O";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

const TILE = 256;

export function MapaLocalizacao({
  contato,
  zoom = 16,
  provedorTile = "carto-light",
}: {
  contato: ContatoContent;
  zoom?: number;
  provedorTile?: Provedor;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const [inclina, setInclina] = useState({ rx: 0, ry: 0 });
  const [semMovimento, setSemMovimento] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemMovimento(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  const { latitude, longitude } = contato;
  const temCoordenadas = latitude !== null && longitude !== null;

  /* Inclinação: 8 graus no máximo, como no template. O eixo é invertido de
     propósito — mouse à direita inclina a borda direita para LONGE, que é o que
     dá a sensação de superfície física em vez de painel girando. */
  const aoMover = (e: React.PointerEvent) => {
    if (semMovimento || !caixa.current) return;
    const r = caixa.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    setInclina({ rx: -dy * 8, ry: dx * 8 });
  };

  return (
    <div>
      <div
        ref={caixa}
        onPointerMove={aoMover}
        onPointerLeave={() => setInclina({ rx: 0, ry: 0 })}
        style={{ perspective: "1200px" }}
        className="select-none"
      >
        <div
          style={{
            transform: `rotateX(${inclina.rx}deg) rotateY(${inclina.ry}deg)`,
            transformStyle: "preserve-3d",
          }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface-raised transition-transform duration-300 ease-out sm:aspect-[16/10]"
        >
          {temCoordenadas ? (
            <MosaicoDeTiles
              lat={latitude}
              lng={longitude}
              zoom={zoom}
              provedor={provedorTile}
              alt={contato.mapaTitle}
            />
          ) : (
            /* Enquanto não há coordenadas: o mapa do Google, que resolve o
               endereço em texto. Funciona e aponta para o lugar certo, que é o
               que importa mais que o acabamento. */
            <iframe
              src={contato.mapaEmbedSrc}
              title={contato.mapaTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-tint absolute inset-0 h-full w-full"
              style={{ border: 0 }}
            />
          )}

          {/* Véu de leitura no pé do cartão, para o crédito e as coordenadas
              terem contraste sobre qualquer tile. */}
          {temCoordenadas ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/70 to-transparent"
            />
          ) : null}

          {temCoordenadas ? (
            <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-end justify-between gap-4">
              <p className="font-mono text-small text-muted">
                {coordenadasLegiveis(latitude, longitude)}
              </p>
              {/* ATRIBUIÇÃO OBRIGATÓRIA. Ver a nota no topo do arquivo. */}
              <p className="pointer-events-auto text-right text-small leading-[1.35] text-muted">
                ©{" "}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-border-strong underline-offset-2 hover:text-accent"
                >
                  OpenStreetMap
                </a>{" "}
                ©{" "}
                <a
                  href="https://carto.com/attributions"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-border-strong underline-offset-2 hover:text-accent"
                >
                  CARTO
                </a>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Mosaico 3×3 de tiles, deslocado para o endereço cair no centro do cartão. */
function MosaicoDeTiles({
  lat,
  lng,
  zoom,
  provedor,
  alt,
}: {
  lat: number;
  lng: number;
  zoom: number;
  provedor: Provedor;
  alt: string;
}) {
  const p = projetar(lat, lng, zoom);
  const x0 = Math.floor(p.x);
  const y0 = Math.floor(p.y);
  /* Onde o endereço cai DENTRO do tile central, em pixels. */
  const dentroX = (p.x - x0) * TILE;
  const dentroY = (p.y - y0) * TILE;

  const tiles = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({ dx, dy, url: urlDoTile(provedor, x0 + dx, y0 + dy, zoom) });
    }
  }

  return (
    <>
      <div
        role="img"
        aria-label={alt}
        className="absolute left-1/2 top-1/2"
        style={{
          width: TILE * 3,
          height: TILE * 3,
          /* O ponto do endereço está em (TILE + dentroX, TILE + dentroY) dentro
             do mosaico. Trazê-lo ao centro do cartão é deslocar o mosaico por
             menos isso. */
          translate: `${-(TILE + dentroX)}px ${-(TILE + dentroY)}px`,
        }}
      >
        {tiles.map((t) => (
          <img
            key={`${t.dx},${t.dy}`}
            src={t.url}
            alt=""
            width={TILE}
            height={TILE}
            loading="lazy"
            draggable={false}
            className="absolute"
            /* Tamanho também por CSS, não só nos atributos: um tile que não
               carrega — rede instável, provedor fora — colapsa para a altura da
               imagem quebrada e desenha uma TIRA FINA no meio do mapa. Com o
               tamanho fixo, a falha vira um bloco transparente do tamanho do
               tile, que desaparece contra o fundo do cartão. Visto aqui porque o
               host dos tiles é bloqueado neste ambiente. */
            style={{
              left: (t.dx + 1) * TILE,
              top: (t.dy + 1) * TILE,
              width: TILE,
              height: TILE,
            }}
          />
        ))}
      </div>

      {/* Marcador, no centro exato do cartão. A ponta do pino é a base do
          desenho, então ele sobe metade da própria altura para a PONTA cair no
          ponto, e não o meio do balão. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
            className="fill-accent"
          />
          <circle cx="12" cy="9" r="2.6" className="fill-surface" />
        </svg>
      </span>
    </>
  );
}
