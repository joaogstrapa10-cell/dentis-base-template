import { useEffect, useRef, useState } from "react";
import type { ArcadaContent, ArcadaEtapa } from "@/content/types";

/**
 * ArcadaHero: abertura da página. Começa com a marca grande no centro; ao rolar, ela
 * cede lugar à arcada, que se FORMA — gengiva, implantes, coroas — e então viaja até o
 * lugar do sorriso no hero, onde a troca para a imagem parada acontece.
 *
 * Do template `scroll-expansion-hero` que o usuário mandou vem o gesto: mídia que
 * cresce com a rolagem e conteúdo que só aparece depois. Sem texto nenhum na seção —
 * ele foi explícito, "sem nada de escrita".
 *
 * ⚠️ POR QUE É VÍDEO ESCRUBADO E NÃO PILHA DE QUADROS
 * A primeira versão trocava cinco imagens por opacidade. O usuário reprovou com a
 * razão exata: "não tá fluido, não tá animado, apenas frame a frame". E estava certo —
 * cinco estados são cinco estados, e nenhuma transição de opacidade inventa os quadros
 * que faltam no meio. Houve também uma tentativa de revelar dentes por `clip-path`
 * sobre um quadro estático, reprovada na hora ("você apenas colocou uma imagem em
 * cima"). Quem coloca os dentes é o vídeo. Não reintroduzir nenhuma das duas.
 *
 * ⚠️ O QUE NÃO VEIO DO TEMPLATE, E CONTINUA FORA
 * Ele comanda o progresso sequestrando a rolagem: `preventDefault` em `wheel` e
 * `touchmove` mais `window.scrollTo(0,0)` a cada evento. Três quebras concretas aqui:
 * a pílula de navegação é fixa e tem âncoras, então clicar em "Áreas" durante a
 * animação voltaria ao topo; teclado não dispara `wheel`, então Espaço e Page Down
 * deixariam o site inalcançável para quem não usa roda; e arrastar a barra, idem.
 * O progresso vem da fração que o TRILHO desta seção já rolou.
 *
 * ⚠️ NADA AQUI ANIMA LAYOUT. A caixa da mídia tem tamanho FIXO em px durante toda a
 * seção — ele só muda no `resize`. Todo movimento é `transform: translate3d() scale()`
 * com `will-change: transform`. A versão anterior animava `width`/`height` em vw a cada
 * quadro de rolagem, o que é reflow por quadro. Não voltar a animar dimensão.
 *
 * ⚠️ E NADA AQUI PASSA POR ESTADO DO REACT. O laço de `requestAnimationFrame` escreve
 * `style` direto por ref. Antes o progresso vivia num `useState`, o que forçava um
 * re-render do componente inteiro a cada quadro — até 60 por segundo. Não reintroduzir
 * `setState` no laço.
 *
 * ⚠️ `sticky` exige que nenhum ancestral tenha `overflow` diferente de `visible`,
 * senão o ancestral vira o contêiner de rolagem e o palco não gruda — foi o que
 * obrigou o bloco da Bio a perder o `overflow-hidden` em 13/08.
 */

/**
 * Altura do trilho, em vh. O Header importa: é ele que precisa saber quando a
 * abertura acaba para revelar a navegação. Um número, num lugar só.
 *
 * ⚠️ Este número acompanha a DURAÇÃO do vídeo, e não é gosto. A velocidade percebida
 * é segundos de vídeo por pixel de rolagem: se o vídeo encurta e o trilho não, a peça
 * fica mais lenta; se o vídeo cresce e o trilho não, fica mais rápida — que foi a
 * reclamação de 17/08.
 *
 * Histórico: 300vh para 20s, 560vh para 50s, 380vh para ~30s, 280vh para dois clipes
 * (~20s), 240vh para um clipe de 10s, e 210vh agora, com o clipe de 8,04s.
 *
 * A conta, para a próxima vez que o clipe mudar: o trecho escrubado é `SCRUB_ATE` do
 * curso, e o curso é `trilho - 100vh`. Aqui: 0,90 × 110vh = 99vh de rolagem para
 * 8,04s, ou seja 0,081 s/vh. Ficou MAIS LENTO que os 0,12 s/vh anteriores porque a
 * janela de escrubagem cresceu de 0,60 para 0,90 do curso — foi o pedido de 18/08 de
 * acabar com o trecho morto, e o efeito colateral é ritmo mais calmo, não mais rápido.
 *
 * Custo: a abertura ocupa 2,1 telas de rolagem.
 */
export const ARCADA_TRILHO_VH = 210;

/**
 * Fração do curso em que a marca grande do centro termina de sair. Exportada porque a
 * abertura e o Header têm de concordar sobre quando a marca deixa a tela.
 */
export const ARCADA_INTRO_ATE = 0.14;

/* ── MAPA DA ROLAGEM, definido pelo usuário em 18/08 ──────────────────────────────
   O ponto dele, e é o que consertou a segunda metade da seção: a VIAGEM e o resto do
   VÍDEO acontecem ao mesmo tempo. Antes o vídeo fechava em 0,74 e a viagem só começava
   ali, então o último quarto da seção era a arcada sendo arrastada por uma tela sem
   nada acontecendo dentro dela.

     0,00 → 0,90   o vídeo roda do início ao fim
     0,55 → 0,92   em paralelo, a arcada viaja e encolhe até o slot do hero
     0,92 → 1,00   troca do vídeo para a imagem final, já no tamanho do slot

   Os dois primeiros se sobrepõem em 0,55–0,90 de propósito: é ali que a peça está
   viva nos dois eixos ao mesmo tempo. Mexer num destes números sem remedir o vão da
   sobreposição devolve o trecho morto. */
const SCRUB_ATE = 0.9;
const VIAGEM_DE = 0.55;
const VIAGEM_ATE = 0.92;
const TROCA_DE = 0.92;

/** A EXPANSÃO fecha aqui. Vira escala, não largura — ver o aviso do cabeçalho. */
const ABERTURA_ATE = 0.45;

/* ⚠️ O CODEC VAI DENTRO DO `type`, e isso não é preciosismo — é o conserto de um
   download desperdiçado. Medido em 18/08: com `type="video/mp4"` puro o
   `canPlayType` responde "maybe" (o navegador reconhece o CONTÊINER e não sabe do
   codec), então o Chromium BAIXA os 4,9MB do mp4, descobre que não decodifica H.264
   e só então busca o WebM — duas requisições de vídeo. Com a string completa ele
   responde "" e pula sem pedir nada: uma requisição.

   `avc1.640032` = High (0x64) + flags 0x00 + level 5.0 (0x32). O encode fixa
   `-level 4.0` justamente para esta string ficar estável e para não exigir DPB de
   iPhone antigo — daí `640028` (0x28 = 40 = level 4.0).

   ⚠️ SE O ENCODE MUDAR DE PERFIL OU NÍVEL, ESTA STRING TEM DE MUDAR JUNTO. Errada,
   ela faz TODO navegador pular o mp4 — inclusive o Safari, que é a única razão de o
   mp4 existir. Os parâmetros do encode estão em public/imagens/arcada/LEIA-ME.txt. */
const TIPO_MP4 = 'video/mp4; codecs="avc1.640028"';
const TIPO_WEBM = 'video/webm; codecs="vp9"';

const trava01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Estado de repouso e fallback: o quadro, ou o slot nomeado se o arquivo faltar. */
function Quadro({ etapa, slotRotulo }: { etapa: ArcadaEtapa; slotRotulo: string }) {
  if (!etapa.src) {
    return (
      <div
        role="img"
        aria-label={etapa.alt}
        className="slot-grid-ink flex h-full w-full items-end bg-ink-elevated p-4 md:p-6"
      >
        <span className="rounded-md border border-ink-border bg-ink/80 px-2 py-1 text-small text-ink-muted backdrop-blur">
          {slotRotulo} {etapa.rotulo}
        </span>
      </div>
    );
  }
  return <img src={etapa.src} alt={etapa.alt} className="h-full w-full object-cover" />;
}

export function ArcadaHero({
  data,
  logo,
  logoAlt,
}: {
  data: ArcadaContent;
  /** Marca CLARA. É a mesma do header — não é asset novo. `null` cai no wordmark. */
  logo?: string | null;
  logoAlt?: string;
}) {
  const trilhoRef = useRef<HTMLDivElement | null>(null);
  const caixaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imagemRef = useRef<HTMLImageElement | null>(null);
  const marcaRef = useRef<HTMLDivElement | null>(null);
  const [semAnimacao, setSemAnimacao] = useState(false);
  /* Medidas da janela em px. Não há `window` no SSR, então nascem no caso desktop e o
     efeito corrige na montagem. O custo é um quadro com a caixa no tamanho errado, e
     ele é invisível porque em `p = 0` a mídia ainda está transparente. */
  const [janela, setJanela] = useState({ w: 1440, h: 900 });
  const compacto = janela.w < 768;

  /* TAMANHO FIXO DA CAIXA, em px, recalculado só no resize. É o tamanho do estado
     ABERTO; a expansão do começo é `scale` partindo de `escalaInicial`.
     O `min` é a guarda de janela baixa e larga: sem ela a altura passa da tela e o
     palco corta a caixa. */
  const fimL = compacto ? 88 : 66;
  const inicioL = compacto ? 60 : 40;
  const caixaW = Math.round(
    Math.min((fimL / 100) * janela.w, 0.84 * janela.h * (16 / 9)),
  );
  const caixaH = Math.round(caixaW / (16 / 9));
  const escalaInicial = inicioL / fimL;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemAnimacao(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  useEffect(() => {
    const ver = () =>
      setJanela((a) =>
        a.w === window.innerWidth && a.h === window.innerHeight
          ? a
          : { w: window.innerWidth, h: window.innerHeight },
      );
    ver();
    window.addEventListener("resize", ver);
    return () => window.removeEventListener("resize", ver);
  }, []);

  /* DESTRAVAMENTO DO iOS. O Safari do iPhone recusa `currentTime` antes de o vídeo ter
     sido tocado por gesto do usuário: sem isto a escrubagem simplesmente não anda no
     iPhone, e o sintoma parece bug de código. Um `play()` seguido de `pause()` no
     primeiro toque ou clique da página basta, e é silencioso porque o vídeo é `muted`.
     Uma vez só — os listeners se removem. */
  useEffect(() => {
    if (semAnimacao) return;
    let feito = false;
    const destravar = () => {
      if (feito) return;
      feito = true;
      const v = videoRef.current;
      if (v) {
        const t = v.play();
        if (t && typeof t.then === "function") t.then(() => v.pause()).catch(() => {});
        else v.pause();
      }
      window.removeEventListener("touchstart", destravar);
      window.removeEventListener("click", destravar);
    };
    window.addEventListener("touchstart", destravar, { passive: true, once: true });
    window.addEventListener("click", destravar, { once: true });
    return () => {
      window.removeEventListener("touchstart", destravar);
      window.removeEventListener("click", destravar);
    };
  }, [semAnimacao]);

  useEffect(() => {
    if (semAnimacao) return;
    let raf = 0;
    /* Destino da viagem, MEDIDO no DOM e não calculado a partir do CSS do hero. Até
       17/08 este componente repetia as classes da coluna do hero para adivinhar o
       alvo; era duplicação e errou o alvo por 131px em 1440 e 192px em 390. Agora sai
       de `getBoundingClientRect()` do elemento marcado com `data-arcada-slot`. */
    let destino = { dx: 0, dy: 0, escala: 1 };

    const medirDestino = () => {
      const trilho = trilhoRef.current;
      const caixa = caixaRef.current;
      const slot = document.querySelector<HTMLElement>("[data-arcada-slot]");
      if (!trilho || !caixa || !slot || !caixa.offsetWidth) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = slot.getBoundingClientRect();
      if (!r.width) return;
      /* Centro do slot em coordenadas do DOCUMENTO — `getBoundingClientRect` é
         relativo à janela, e o alvo precisa ser estável enquanto a página rola. */
      const alvoX = r.left + r.width / 2 + window.scrollX;
      const alvoY = r.top + r.height / 2 + window.scrollY;
      /* No fim do trilho o palco ocupa a janela inteira e a caixa está no centro
         dela, então é desse centro que o deslocamento se mede. */
      const fimDoTrilho = trilho.offsetTop + Math.max(0, trilho.offsetHeight - vh);
      const dx = alvoX - vw / 2;
      /* ⚠️ O `dy` cru é grande e POSITIVO, porque o hero começa logo depois do trilho
         e o slot ainda está abaixo da janela no fim da abertura. Usá-lo cru arrastaria
         a arcada para fora da tela, e a troca para a imagem aconteceria onde ninguém
         vê. Por isso o teto de 30% da altura: a viagem persegue a LARGURA e o CENTRO
         HORIZONTAL do slot, que é o que faz a entrega ler como o mesmo objeto, e
         desce só o suficiente para o gesto existir. */
      const dyCru = alvoY - fimDoTrilho - vh / 2;
      const dy = Math.max(0, Math.min(dyCru, 0.3 * vh));
      const escala = r.width / caixa.offsetWidth;
      destino = { dx, dy, escala: Math.min(1.45, Math.max(0.3, escala)) };
    };

    const quadro = () => {
      raf = requestAnimationFrame(quadro);
      const trilho = trilhoRef.current;
      const caixa = caixaRef.current;
      if (!trilho || !caixa) return;
      const vh = window.innerHeight;
      const r = trilho.getBoundingClientRect();
      /* Longe da tela não custa nada: sai antes de tocar em estilo ou em vídeo. */
      if (r.bottom < -vh || r.top > vh) return;
      const curso = r.height - vh;
      const p = curso <= 0 ? 0 : trava01(-r.top / curso);

      /* ── MARCA: encolhe e sai nos primeiros 14%. ── */
      const intro = Math.min(1, p / ARCADA_INTRO_ATE);
      const marca = marcaRef.current;
      if (marca) {
        marca.style.opacity = String(Math.max(0, 1 - intro / 0.8));
        marca.style.transform = `scale(${1 - 0.5 * intro})`;
      }

      /* ── CAIXA: entrada, expansão e viagem, tudo em transform. ──
         A mídia entra ATRÁS da marca e as duas curvas se cruzam de propósito: sem a
         sobreposição há um instante de tela vazia entre as duas, que lê como falha de
         carregamento. */
      const entrada = trava01((p - ARCADA_INTRO_ATE * 0.35) / (ARCADA_INTRO_ATE * 0.9));
      const abertura = Math.min(1, p / ABERTURA_ATE);
      const suave = 1 - (1 - abertura) * (1 - abertura);
      const cresce = escalaInicial + (1 - escalaInicial) * suave;
      /* A curva da viagem é `ease-out` à mão (1-(1-x)³) e não linear: é o que faz a
         peça DESACELERAR ao chegar em vez de bater. Foi o pedido de "bem feito". */
      const bruta = trava01((p - VIAGEM_DE) / (VIAGEM_ATE - VIAGEM_DE));
      const viaja = 1 - Math.pow(1 - bruta, 3);
      const escala = cresce * (1 + (destino.escala - 1) * viaja);
      caixa.style.opacity = String(entrada);
      caixa.style.transform =
        `translate3d(${destino.dx * viaja}px, ${destino.dy * viaja}px, 0)` +
        ` scale(${escala})`;

      /* ── TROCA para a imagem final nos últimos 8%. ──
         A IMAGEM fica ATRÁS e acende primeiro; o VÍDEO desaparece por cima dela. É o
         que torna a troca imperceptível: sendo o mesmo quadro, apagar o vídeo sobre
         uma imagem já opaca não tem instante de vazio nem de dupla exposição. O
         contrário — imagem entrando por cima — piscaria, e além disso o vídeo carrega
         a máscara `.video-fundido` e a imagem não, então nos 26% da borda o vídeo é
         mais fraco: se ele estivesse por cima, as pontas da arcada clareariam na
         troca. */
      const troca = trava01((p - TROCA_DE) / (1 - TROCA_DE));
      const v = videoRef.current;
      const img = imagemRef.current;
      if (img) img.style.opacity = String(Math.min(1, troca * 4));
      if (v) v.style.opacity = String(1 - troca);

      /* ── ESCRUBAGEM, com INTERPOLAÇÃO. ──
         Setar `currentTime` direto no valor da rolagem produz movimento serrilhado,
         porque a rolagem chega em degraus (a roda do mouse anda de 100 em 100px). Aqui
         o tempo persegue o alvo movendo uma fração da distância por quadro, o que
         suaviza sem introduzir atraso perceptível: 18% por quadro fecha 90% da
         distância em ~12 quadros, ou seja ~200ms.
         `readyState >= 1` garante que a duração já é conhecida; sem isso o
         `currentTime` é descartado em silêncio e a peça parece travada. */
      if (v && v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0) {
        if (!v.paused) v.pause();
        const alvo = trava01(p / SCRUB_ATE) * v.duration;
        const d = alvo - v.currentTime;
        if (Math.abs(d) > 0.01) v.currentTime += d * 0.18;
      }
    };

    medirDestino();
    /* O alvo depende do layout do hero, que só está final depois das fontes e das
       imagens. Remede no resize e uma vez depois do load, e nunca no laço — ler
       `getBoundingClientRect` de outra seção a 60fps é justamente o custo que este
       componente existe para evitar. */
    const remedir = () => medirDestino();
    window.addEventListener("resize", remedir);
    window.addEventListener("load", remedir);
    const atraso = window.setTimeout(remedir, 1200);
    raf = requestAnimationFrame(quadro);
    return () => {
      window.removeEventListener("resize", remedir);
      window.removeEventListener("load", remedir);
      window.clearTimeout(atraso);
      cancelAnimationFrame(raf);
    };
  }, [semAnimacao, escalaInicial, caixaW, caixaH]);

  const primeira = data.etapas[0];
  const ultima = data.etapas[data.etapas.length - 1];

  /* ── Sem animação: um quadro só, o estado final, em tamanho contido. Nada de
     trilho, nada de sticky, nada de vídeo — animação comandada por rolagem é o caso
     que a WCAG 2.3.3 pede para poder desligar. ── */
  if (semAnimacao) {
    return (
      <section id="arcada" className="relative bg-ink py-16">
        <div className="mx-auto w-full max-w-[1000px] px-5 md:px-10">
          <div className="aspect-video w-full overflow-hidden rounded-2xl">
            <Quadro etapa={ultima} slotRotulo={data.slotRotulo} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="arcada" className="relative bg-ink">
      <div
        ref={trilhoRef}
        className="relative"
        style={{ height: `${ARCADA_TRILHO_VH}vh` }}
      >
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          {/* MARCA GRANDE, centralizada — a abertura pedida em 17/08. Encolhe e sai
              conforme a rolagem começa. `pointer-events-none` porque depois de
              invisível ela continuaria interceptando clique no meio da tela. */}
          <div
            ref={marcaRef}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8"
            style={{ opacity: 1, willChange: "transform, opacity" }}
          >
            {logo ? (
              <img
                src={logo}
                alt={logoAlt ?? ""}
                /* Grande de verdade: metade da largura da janela no desktop, quase
                   toda no celular. Teto em `rem` para não virar um cartaz em
                   monitor ultralargo. */
                className="w-[min(50vw,34rem)] max-w-[86vw]"
              />
            ) : null}
          </div>

          {/* A MÍDIA. Tamanho FIXO; só o transform muda. */}
          <div
            ref={caixaRef}
            className="relative"
            style={{
              width: `${caixaW}px`,
              height: `${caixaH}px`,
              opacity: 0,
              transform: `scale(${escalaInicial})`,
              willChange: "transform, opacity",
              /* ⚠️ SEM `borderRadius`, SEM `overflow: hidden` e SEM `boxShadow`, a
                 pedido do usuário em 17/08: "não quero aquela borda que está no
                 vídeo". O cartão arredondado com sombra desenhava um retângulo
                 visível em volta da animação. */
            }}
          >
            {data.video ? (
              <>
                {/* A IMAGEM FINAL, ATRÁS do vídeo e no MESMO tamanho e recorte. É o
                    destino da troca dos últimos 8%. Mesmo `object-cover` e mesma
                    proporção do vídeo de propósito: qualquer diferença aqui aparece
                    como salto no instante da troca.
                    ⚠️ SEM `.video-fundido`: este arquivo tem alpha próprio, e a
                    máscara comeria a borda da gengiva. */}
                <img
                  ref={imagemRef}
                  src={ultima.src ?? undefined}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ opacity: 0 }}
                />
                <video
                  ref={videoRef}
                  /* `poster` é o primeiro quadro: sem ele há um retângulo preto até o
                     vídeo ter dados, e este é o topo da página. */
                  poster={primeira.src ?? undefined}
                  aria-label={primeira.alt}
                  muted
                  playsInline
                  preload="auto"
                  /* SEM `autoplay` e SEM `loop`: quem controla o tempo é a rolagem.
                     `controls={false}` e os dois `disable*` para o navegador não
                     oferecer UI de reprodução numa peça que não é para ser tocada.
                     ⚠️ E SEM atributo `src`: com `src` e `<source>` juntos alguns
                     navegadores buscam o arquivo duas vezes. As fontes vivem só nos
                     `<source>` abaixo. */
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  /* `video-fundido` fica AQUI, no vídeo, e não no contêiner: o
                     contêiner também carrega a imagem final, que tem alpha e não pode
                     ser mascarada. Ver a nota da classe no styles.css — tirar raio e
                     sombra não bastou, porque o fundo do clipe é `#001518`, mais
                     ESCURO que o `--ink` da página (~`#013435`), e os quatro cantos
                     desenhavam um retângulo. */
                  className="video-fundido absolute inset-0 h-full w-full object-cover"
                  style={{ opacity: 1 }}
                >
                  {/* ⚠️ O MP4 VEM PRIMEIRO, e a ordem é o conserto do iOS: o Safari
                      escolhe a PRIMEIRA `<source>` que declara poder tocar, e há
                      versões de iOS que aceitam VP9 no papel e escrubam mal na
                      prática. Com o mp4 na frente, o iPhone nunca chega no WebM.
                      Chrome, Firefox e Edge continuam pegando o WebM, que é menor,
                      porque testam as duas e preferem a mais eficiente. */}
                  <source src={data.video} type={TIPO_MP4} />
                  {data.videoWebm ? (
                    <source src={data.videoWebm} type={TIPO_WEBM} />
                  ) : null}
                </video>
              </>
            ) : (
              <Quadro etapa={primeira} slotRotulo={data.slotRotulo} />
            )}
          </div>

          {/* Sem fio de progresso: removido a pedido do usuário em 17/08. Ele existia
              como pista de que a seção tem fim — faixa que não rola junto pode ler
              como página travada. Aqui o risco é menor do que no template original,
              porque a barra de rolagem do navegador continua andando durante a
              abertura (é o trilho que rola, não um sequestro de scroll). Não
              reintroduzir sem pedido. */}
        </div>
      </div>
    </section>
  );
}
