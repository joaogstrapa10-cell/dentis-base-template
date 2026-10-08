import { useEffect, useRef, useState } from "react";
import type { TrajetoriaContent } from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeader } from "./Section";

/**
 * Trajetória do responsável técnico, em PERCURSO: fichas presas por alfinete,
 * alternando de lado, costuradas por um fio tracejado que caminha.
 *
 * Do template `how-it-works` que o usuário mandou em 08/10 entrou o GESTO —
 * fichas espalhadas, alfinete, numeração, fio pontilhado em marcha. A seção era
 * TRILHO VERTICAL com marcos (01/10) e continua sendo um percurso; o que mudou
 * é que o percurso passou a serpentear e os marcos viraram fichas.
 *
 * ⚠️ `motion/react` NÃO entrou, e é a QUINTA vez que esta recusa aparece no
 * projeto (GSAP e `motion/react` em 19/08, `motion/react` de novo em 19/08,
 * `framer-motion` em 25/09). O motivo é duro e o sintoma é silencioso: essas
 * libs escrevem a propriedade `transform`, o Tailwind v4 escreve `translate` /
 * `scale` / `rotate` SEPARADAS, e misturar as duas famílias no mesmo elemento
 * faz uma apagar a outra sem erro nenhum. O template usa a lib para UMA coisa:
 * animar `strokeDashoffset` num laço infinito. Isso é um keyframe de CSS de
 * três linhas (`.fio-marcha` no `styles.css`), roda no compositor, e de quebra
 * entra de graça no `body.pausado` (aba escondida) e no `prefers-reduced-motion`
 * globais, que a lib ignoraria.
 *
 * ⚠️ O que mais ficou de fora do template, cada um por regra já paga aqui:
 *   · `dark:` em toda classe — o projeto não tem modo escuro por classe;
 *   · laranja / azul / roxo por item — a paleta é a medida da Suzuki, e três
 *     matizes decorativas numa seção é o que o §4 chama de clichê;
 *   · Comic Sans no número — a tipografia é a identidade da clínica;
 *   · `text-4xl` / `text-2xl` / `text-sm/5` — a escala está FECHADA em cinco
 *     degraus desde 03/08, então viraram `.display-2` / `.display-3` /
 *     `text-small`. Nenhum tamanho novo entrou;
 *   · as CINCO posições cravadas e o caminho de quatro curvas escritas à mão —
 *     esta seção tem SEIS marcos, e as variantes do Rogério e do Décio terão
 *     outra contagem. Posição e caminho são CALCULADOS (ver `ancoras`).
 *
 * ⚠️ ISSO DEVOLVE "cartão com fundo e sombra próprios", que o §5.2 lista entre
 * as formas removidas em 03/08. Voltou por pedido explícito e NESTA seção só —
 * é o mesmo caso da sombra do retrato da tela de entrada em 15/09, e **não é
 * licença para devolver sombra às outras seções**. A ficha precisa da sombra
 * para existir: `--surface` é branco e `--background` mede 1,6% de diferença
 * dele (medido em 19/08, no painel do carrossel), então sem a sombra a ficha
 * desapareceria no campo claro.
 */

/* GEOMETRIA DO PERCURSO, em unidades do viewBox (1000 de largura).
   O alfinete de cada ficha é o ponto de ancoragem: é nele que o fio encosta e
   é nele que a ficha é centrada. Tudo abaixo deriva daqui. */
const COLUNA_X = [0.19, 0.81]; // fração da largura: ímpares à esquerda, pares à direita
/* ⚠️ 10 e não 136, que foi a primeira versão e abriu ~200px de VAZIO entre a
   descrição e a primeira ficha — o `TOPO` SOMA ao `mt-12 md:mt-16` do contêiner
   em vez de substituí-lo, e o fio começa no primeiro alfinete, não no topo do
   quadro, então não há nada para esse espaço segurar. Os 10 existem só para a
   quina da ficha inclinada 2,5° não ser cortada: ela sobe `318·sen(2,5°)/2`,
   ou seja 7px, acima da borda do `li`. */
const TOPO = 10; // y do primeiro alfinete

/* ⚠️ O PASSO É MEDIDO, não escolhido. Fichas vizinhas caem em lados OPOSTOS, e
   por isso podem se cruzar na vertical à vontade; quem limita são as do MESMO
   lado, que estão a DOIS passos uma da outra. Com a ficha medindo 350px de
   altura (a mais alta das seis em 1440), a folga entre as do mesmo lado vale
   `2·PASSO − 350`. A 212 isso dava 74px de ar, mais do que a peça precisa e
   ~85px de página a mais; a 196 fecha em 42px, que é folga de sobra e não
   deixa par nenhum encostar. Medido nas seis larguras. */
const PASSO = 196; // distância vertical entre alfinetes consecutivos
const FOLGA_PE = 8; // respiro abaixo da última ficha

/** Pontos de ancoragem do percurso. Um por marco, em ordem. */
function ancoras(total: number) {
  return Array.from({ length: total }, (_, i) => ({
    x: COLUNA_X[i % 2],
    y: TOPO + i * PASSO,
    esquerda: i % 2 === 0,
  }));
}

/**
 * O fio: uma cúbica por par de alfinetes consecutivos, com os pontos de
 * controle na HORIZONTAL. É isso que faz a curva sair de um alfinete na
 * horizontal e chegar no outro na horizontal, em vez de cortar reto na
 * diagonal — o gesto do template.
 *
 * ⚠️ O desvio é 0,52 da distância entre as colunas e não um número por
 * segmento: com seis marcos (e com qualquer outra contagem) escrever curva por
 * curva à mão é o que quebra na variante seguinte.
 */
function caminho(pontos: ReturnType<typeof ancoras>) {
  if (pontos.length < 2) return "";
  const L = 1000;
  let d = `M ${(pontos[0].x * L).toFixed(0)} ${pontos[0].y}`;
  for (let i = 1; i < pontos.length; i++) {
    const a = pontos[i - 1];
    const b = pontos[i];
    const x1 = a.x * L;
    const x2 = b.x * L;
    const desvio = (x2 - x1) * 0.52;
    d += ` C ${(x1 + desvio).toFixed(0)} ${a.y}, ${(x2 - desvio).toFixed(0)} ${b.y}, ${x2.toFixed(0)} ${b.y}`;
  }
  return d;
}

/** O alfinete do template, redesenhado em `currentColor` para seguir o token. */
function Alfinete({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
    </svg>
  );
}

export function Trajetoria({ data }: { data: TrajetoriaContent }) {
  /**
   * ⚠️ DUAS GEOMETRIAS, UMA IDEIA — e a do celular é o caso DEGENERADO da
   * outra, não um segundo layout. O template simplesmente APAGA o fio abaixo de
   * `md` e empilha os cartões, o que custaria justamente o percurso, que é o
   * assunto da seção. Aqui o fio continua: as fichas empilham numa coluna só e
   * o fio vira uma reta vertical que aparece nos VÃOS entre elas, marchando com
   * a mesma animação. Espalhar seis fichas numa tela de 390px é impossível —
   * cada uma ficaria com ~170px de largura.
   *
   * `matchMedia` e não classe de breakpoint porque a POSIÇÃO é calculada em JS:
   * é o mesmo padrão do `empilhado` do `CarrosselDeCartoes` (15/09).
   */
  const [espalhado, setEspalhado] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const ler = () => setEspalhado(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  /**
   * ALTURA DO CONTÊINER, medida e não cravada.
   *
   * ⚠️ As fichas são `absolute` e portanto NÃO empurram a altura do `<ol>` — ela
   * tem de ser escrita. Na primeira versão eu cravei o valor e a última ficha
   * passou **109px além do contêiner**, comendo o vão até a seção seguinte, que
   * é a família de defeito paga em 13/08, 15/09 e 25/09.
   *
   * Cravar também quebraria nas variantes do Rogério e do Décio: a altura da
   * ficha sai do TEXTO de cada marco, e a deles será outro.
   *
   * `getBoundingClientRect` e NÃO `offsetHeight`: a ficha é inclinada 2,5°, e o
   * que precisa caber é a caixa alinhada aos eixos, que a rotação deixa ~14px
   * mais alta. É o inverso da escolha de 15/09 na tela de entrada, onde o certo
   * era `offsetWidth` justamente por ignorar o `transform`.
   */
  const olRef = useRef<HTMLOListElement>(null);
  const [alturaFicha, setAlturaFicha] = useState(364);
  useEffect(() => {
    const ol = olRef.current;
    if (!espalhado || !ol) return;
    const fichas = [...ol.querySelectorAll("article")];
    const medir = () => {
      const alturas = fichas.map((f) => f.getBoundingClientRect().height);
      if (alturas.length) setAlturaFicha(Math.max(...alturas));
    };
    medir();
    const ro = new ResizeObserver(medir);
    fichas.forEach((f) => ro.observe(f));
    return () => ro.disconnect();
  }, [espalhado, data.marcos.length]);

  const pontos = ancoras(data.marcos.length);
  const altura = TOPO + (data.marcos.length - 1) * PASSO + alturaFicha + FOLGA_PE;

  return (
    <Section id="trajetoria">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      {/* `isolate`: as fichas usam `z-index` interno para subir no hover, e
          ordenação interna que escapa para o contexto RAIZ é o defeito que a
          pilha de casos pagou em 20/08, passando por cima da pílula fixa. */}
      <div className="relative isolate mx-auto mt-12 max-w-[62.5rem] md:mt-16">
        {espalhado ? (
          <svg
            aria-hidden="true"
            viewBox={`0 0 1000 ${altura}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {/* `vectorEffect` mantém espessura E tracejado em unidades de TELA,
                então o `preserveAspectRatio="none"` estica a curva junto com o
                contêiner sem esticar os traços. */}
            <path
              d={caminho(pontos)}
              className="fio-marcha stroke-accent/35"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : (
          /* O mesmo fio, reto, atrás da pilha. É elemento pintado e não `<svg>`
             porque num empilhamento em FLUXO a altura sai do texto, e o SVG
             precisaria dela medida em runtime para desenhar o traço no lugar. */
          <span aria-hidden="true" className="fio-reto absolute inset-y-0 left-1/2 w-px" />
        )}

        <ol
          ref={olRef}
          className={espalhado ? "relative" : "relative flex flex-col gap-7"}
          style={espalhado ? { height: `${altura}px` } : undefined}
        >
          {data.marcos.map((marco, i) => {
            const p = pontos[i];
            return (
              <li
                key={marco.etapa + marco.titulo}
                className={espalhado ? "absolute w-[19rem]" : "relative"}
                style={
                  espalhado
                    ? { left: `calc(${(p.x * 100).toFixed(1)}% - 9.5rem)`, top: `${p.y}px` }
                    : undefined
                }
              >
                <Reveal delay={i * 70}>
                  {/* A inclinação alterna de lado, e é 2,5° e não os 8° do
                      template: a 8 a ficha lê como recado de mural, e esta
                      seção carrega a formação de um cirurgião-dentista.
                      ⚠️ `rotate` e `scale` como utilitários do Tailwind v4 são
                      propriedades CSS separadas, então convivem com o
                      `translate` que o `Reveal` escreve no elemento de FORA —
                      é exatamente o que uma lib de animação quebraria aqui. */}
                  <article
                    className={`rounded-[25px] border border-border bg-surface p-2 shadow-[0_18px_36px_-22px_oklch(0.19_0.008_200/0.45)] transition-[rotate,scale] duration-300 hover:z-30 hover:scale-[1.03] hover:rotate-0 ${
                      espalhado ? (p.esquerda ? "rotate-[2.5deg]" : "rotate-[-2.5deg]") : ""
                    }`}
                  >
                    <Alfinete className="mx-auto mb-5 block h-7 w-7 text-accent" />

                    {/* O painel interno do template, numa cor só. Petróleo a
                        5,5% e não `--surface-raised`: a diferença entre as duas
                        superfícies claras do projeto é de 1,6%, e o painel
                        sumiria dentro da ficha (medido em 19/08). */}
                    <div className="rounded-[15px] border border-accent/15 bg-accent/[0.055] p-4 md:p-5">
                      <p className="display-2 text-accent">{`0${i + 1}`}</p>

                      {/* `text-small` em elemento SEM classe de cor: o `cn()`
                          não conhece esse token, trata como cor de texto, e uma
                          classe de cor depois dele o descarta em silêncio
                          (custou uma rodada em 19/08). E sem caixa alta com
                          tracking largo, que é o rótulo que saiu do site em
                          03/08. */}
                      <p className="mt-3 text-muted">
                        <span className="text-small">
                          {marco.ano ? `${marco.ano} · ${marco.etapa}` : marco.etapa}
                        </span>
                      </p>

                      <h3 className="display-3 mt-1 text-foreground">{marco.titulo}</h3>

                      {marco.instituicao ? (
                        /* Instituição em `--foreground` e NÃO em `--muted`, e é
                           o ponto da seção: ILAPEO, ABO-PR, APCD Bauru e PUC-PR
                           são o sinal de autoridade, e em cinza secundário liam
                           mais fracas que a palavra genérica do título logo
                           acima. */
                        <p className="mt-1 text-base font-medium text-foreground">
                          {marco.instituicao}
                        </p>
                      ) : null}

                      <p className="mt-3 text-small text-muted">{marco.descricao}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
