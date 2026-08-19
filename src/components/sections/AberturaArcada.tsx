import { useEffect, useRef, useState } from "react";
import type { AberturaContent, ArcadaContent } from "@/content/types";

/**
 * ABERTURA DA HOME: a marca em cima, a arcada se formando no meio, a assinatura
 * embaixo. A composição fica PARADA e a rolagem só comanda o tempo do vídeo — os
 * dentes entram um por vez, primeiro na arcada de cima, depois na de baixo.
 *
 * A forma veio do template `hero-scrub` (o hero escrubado do Ferrari Amalfi) que o
 * usuário mandou em 19/08, com o mapeamento que ele ditou: a logo da Suzuki onde
 * estava "FERRARI", "ODONTOLOGIA ESPECIALIZADA" onde estava "AMALFI", e a arcada onde
 * estava o 3D do carro.
 *
 * ═══ ⚠️ O ZOOM DO TEMPLATE SAIU, e com ele o afastamento das pontas ═══
 *
 * Pedido do usuário no mesmo dia, depois de ver a primeira versão: "a arcada tá muito
 * grande no final, é para ela manter do mesmo tamanho que inicia, sem o efeito de
 * aproximação". Então o quadro tem UM tamanho, do começo ao fim.
 *
 * O afastamento lateral das pontas saiu JUNTO, e não por descuido: no template ele
 * existe para abrir espaço para o quadro que cresce. Sem o crescimento, mandar a marca
 * e a assinatura para fora da tela deixaria o miolo da seção com um quadro pequeno
 * sozinho num campo escuro vazio. ⚠️ Voltar a ter o afastamento SEM o zoom é possível,
 * mas é decisão de composição e não conserto — a versão com os dois está em `98bf5e7`.
 *
 * O que morreu com o zoom, e está no git: a escala em três curvas (afastamento,
 * imersão, volta), o teto de imersão derivado do tamanho do assunto dentro do quadro, e
 * a convergência do quadro para o centro do palco. Nada disso tem sentido com escala
 * fixa — a última só existia porque `scale` cresce em volta do próprio centro, e o
 * centro do quadro caía 61px abaixo do centro da tela.
 *
 * ═══ O QUE NUNCA VEIO DO TEMPLATE, e por quê ═══
 *
 * ⚠️ SEM GSAP e SEM ScrollTrigger. O progresso sai da fração que o TRILHO desta seção
 * já rolou por dentro de si, lido em `requestAnimationFrame` — o mesmo mecanismo já
 * provado três vezes neste projeto. Três razões somadas, e nenhuma é gosto:
 *   1. o template usa `sticky` e NÃO usa o `pin` do ScrollTrigger, então a única coisa
 *      que a biblioteca faria aqui é interpolar números — e agora que a escala é fixa,
 *      sobrou UMA linha de conta;
 *   2. `gsap.set/to` escreve a propriedade `transform`, e o Tailwind v4 escreve
 *      `translate`/`scale`/`rotate` SEPARADAS: misturar as duas famílias no mesmo
 *      elemento é a armadilha já registrada no CLAUDE.md, e o sintoma é silencioso;
 *   3. o projeto não tem nenhuma dependência de animação.
 *
 * ⚠️ SEM SEQUÊNCIA DE QUADROS EM `<canvas>`. O template baixa 300 WebP e desenha o
 * quadro correspondente ao scroll. Aqui a mídia é VÍDEO, e a decisão foi MEDIDA:
 * exportar os 193 quadros deste clipe a 1280px em WebP q72 dá **6,3 MB em 193
 * requisições**, contra **3,4 MB do WebM a 1920×1080** que já está no repo. A câmera é
 * travada e a diferença entre quadros vizinhos é um dente — o melhor caso possível para
 * compressão interframe e o pior para uma pilha de imagens independentes.
 *
 * ⚠️ E o azul-claro `#3a9b8a` do template não entra em lugar nenhum: a paleta é a
 * medida da Suzuki, e azul-claro de consultório é clichê proibido no §4 do CLAUDE.md.
 */

/**
 * Quantas telas de ROLAGEM a abertura consome, além da tela que ela ocupa parada.
 * A seção mede `(MULT + 1) × 100svh` e o palco `sticky` gruda por `MULT` telas.
 *
 * ⚠️ CAIU DE 2,6 PARA 1,6 quando o zoom saiu, e o número tem conta atrás: sem a
 * imersão, o curso INTEIRO carrega os 8,04s do clipe em vez de só 63% dele. A 1,6 telas
 * isso dá ~180px de rolagem por segundo de vídeo (~7,5px por quadro a 24fps), ou seja
 * praticamente o mesmo ritmo de escrubagem de antes num trilho um terço menor.
 *
 * Custo de página: 2,6 telas, contra 3,6 da versão com zoom e 1 da abertura só com a
 * marca. Se incomodar, é ESTE número, e mais nada — abaixo de ~1,2 os dentes começam a
 * aparecer mais rápido do que se lê.
 */
const TRILHO_MULT = 1.6;

/**
 * Onde a escrubagem começa e acaba, em fração do curso. As sobras nas duas pontas
 * seguram o primeiro e o último quadro por um instante — sem elas, a arcada completa
 * aparece no mesmo pixel em que a seção acaba, e o fim do procedimento passa batido.
 */
const SCRUB_DE = 0.05;
const SCRUB_ATE = 0.95;

/** 16:9, a proporção nativa do clipe. Recorte zero: `object-cover` não corta nada. */
const ASPECTO = 16 / 9;

/**
 * Largura do quadro, como fração da largura do palco.
 *
 * ⚠️ Diminuiu a pedido do usuário em 19/08 ("diminua o tamanho de tudo dessa sessão, tá
 * muito grande"): era 0,48 no desktop, com o quadro em 691px numa janela de 1440.
 */
const LARGURA_DESKTOP = 0.38;
const LARGURA_COMPACTA = 0.8;
/**
 * Teto pela ALTURA do palco. É a guarda de janela baixa e larga: sem ele, num monitor
 * 21:9 o quadro de 0,38 de largura passaria da altura da tela.
 */
const ALTURA_MAX = 0.4;

/**
 * Altura total da seção, em vh. Exportada porque o Header precisa saber onde a
 * abertura acaba. Um número, num lugar só.
 */
export const ABERTURA_VH = (TRILHO_MULT + 1) * 100;

/**
 * Deslocamento de rolagem, em vh, a partir do qual a arcada está COMPLETA — é o
 * instante em que a navegação pode aparecer.
 *
 * Derivado, não escolhido: é o fim da escrubagem. O pedido do usuário em 17/08 foi "a
 * aba de navegação só vai aparecer após a gente terminar de rolar e aparecer todo o
 * vídeo completo", e este é exatamente esse ponto.
 */
export const ABERTURA_NAV_VH = TRILHO_MULT * SCRUB_ATE * 100;

/**
 * ⚠️ AS DUAS STRINGS DE CODEC SÃO ACOPLADAS AO ENCODE, e errá-las é caro.
 *
 * Sem os `codecs`, `canPlayType("video/mp4")` responde "maybe" — o navegador reconhece
 * o CONTÊINER e não sabe do codec — então o Chromium BAIXA o mp4 inteiro, descobre que
 * não decodifica H.264 e só então busca o WebM: duas requisições de vídeo. Com a
 * string completa ele responde "" e pula sem pedir nada.
 *
 * `avc1.640028` = High (0x64) + flags 0x00 + level 4.0 (0x28). O encode fixa
 * `-level 4.0` para esta string ficar estável. SE O PERFIL OU O NÍVEL DO ENCODE MUDAR,
 * esta string tem de mudar junto — errada, ela faz TODO navegador pular o mp4,
 * inclusive o Safari, que é a única razão de o mp4 existir. Parâmetros em
 * public/imagens/arcada/LEIA-ME.txt.
 */
const TIPO_MP4 = 'video/mp4; codecs="avc1.640028"';
const TIPO_WEBM = 'video/webm; codecs="vp9"';

const trava01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

export function AberturaArcada({
  data,
  arcada,
}: {
  data: AberturaContent;
  /** O vídeo, os quadros e o aviso legal. Não é duplicado aqui. */
  arcada: ArcadaContent;
}) {
  const trilhoRef = useRef<HTMLElement | null>(null);
  const palcoRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [semAnimacao, setSemAnimacao] = useState(false);
  /* Medidas do PALCO, em px, e medidas de verdade: `getBoundingClientRect` do próprio
     elemento `sticky`, não `innerWidth`/`innerHeight`. É o que garante que a conta use
     a mesma altura que o CSS usou (`100svh`), que no celular não é `innerHeight`.
     Nascem no caso desktop porque não há `window` no SSR; o primeiro quadro com o
     tamanho errado é invisível, porque a entrada só acende aos 350ms. */
  const [palco, setPalco] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemAnimacao(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  useEffect(() => {
    const el = palcoRef.current;
    if (!el) return;
    const medir = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      setPalco((a) => (a.w === w && a.h === h ? a : { w, h }));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [semAnimacao]);

  const compacto = palco.w < 768;
  const fracao = compacto ? LARGURA_COMPACTA : LARGURA_DESKTOP;
  /* UM tamanho, do começo ao fim da rolagem. Não há mais escala de repouso nem de
     abertura — o pedido foi o quadro manter o tamanho com que começa. */
  const quadroW = Math.max(
    1,
    Math.round(Math.min(fracao * palco.w, ALTURA_MAX * palco.h * ASPECTO)),
  );
  const quadroH = Math.max(1, Math.round(quadroW / ASPECTO));

  /* DESTRAVAMENTO DO iOS. O Safari do iPhone recusa `currentTime` antes de o vídeo ter
     sido tocado por gesto: sem isto a escrubagem não anda no iPhone, e o sintoma
     parece bug de código. Um `play()` seguido de `pause()` no primeiro toque basta, e
     é silencioso porque o vídeo é `muted`. Uma vez só. */
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
    const quadro = () => {
      raf = requestAnimationFrame(quadro);
      const trilho = trilhoRef.current;
      const v = videoRef.current;
      if (!trilho || !v) return;
      const r = trilho.getBoundingClientRect();
      /* Fora da tela não custa nada. */
      if (r.bottom < 0 || r.top > palco.h) return;

      /* O progresso é a fração que ESTE trilho já rolou por dentro de si — nunca
         `window.scrollY`. A abertura é a primeira seção hoje, mas a lição vem da
         órbita de 13/08: com `scrollY` a peça nasce terminada no dia em que deixar de
         ser a primeira, e o defeito é silencioso. */
      const curso = r.height - palco.h;
      const p = curso <= 0 ? 0 : trava01(-r.top / curso);

      /* ── ESCRUBAGEM, com INTERPOLAÇÃO. É a única coisa que a rolagem comanda. ──
         Setar `currentTime` direto no valor da rolagem produz movimento serrilhado,
         porque a rolagem chega em degraus (a roda anda de 100 em 100px) — aqui o tempo
         persegue o alvo movendo 18% da distância por quadro, o que fecha 90% dela em
         ~200ms sem atraso perceptível.
         `readyState >= 1` garante que a duração já é conhecida: sem isso o
         `currentTime` é descartado em silêncio e a peça parece travada. */
      if (v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0) {
        if (!v.paused) v.pause();
        const alvo =
          trava01((p - SCRUB_DE) / (SCRUB_ATE - SCRUB_DE)) * v.duration;
        const d = alvo - v.currentTime;
        if (Math.abs(d) > 0.01) v.currentTime += d * 0.18;
      }
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [semAnimacao, palco.h]);

  const primeira = arcada.etapas[0];
  const ultima = arcada.etapas[arcada.etapas.length - 1];

  const marcaEl = data.marca ? (
    <img
      src={data.marca}
      alt={data.marcaAlt}
      /* Largura em `vw` com teto em `rem`: sem o teto vira cartaz em monitor
         ultralargo. Diminuiu a pedido em 19/08 — era `min(40vw,30rem)` no desktop, o
         que dava 480px de marca numa janela de 1440. */
      className="w-[min(58vw,15rem)] md:w-[min(26vw,19rem)]"
    />
  ) : (
    <span className="abertura-linha text-ink-foreground">{data.wordmark}</span>
  );

  /* ── SEM ANIMAÇÃO: uma tela curta, o estado FINAL da arcada, e nada de trilho.
        Desligar movimento não pode custar o conteúdo — a sequência é o assunto, então
        o que fica é o resultado dela, parado. ── */
  if (semAnimacao) {
    return (
      <section
        ref={trilhoRef}
        id="abertura"
        className="relative bg-ink px-6 py-20 md:py-24"
      >
        <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-6 text-center">
          {marcaEl}
          {ultima?.src ? (
            <img
              src={ultima.src}
              alt={ultima.alt}
              className="h-auto w-full max-w-[34rem]"
            />
          ) : null}
          <p className="abertura-linha text-ink-foreground">{data.linha}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trilhoRef}
      id="abertura"
      className="relative w-full bg-ink"
      /* ⚠️ SEM `overflow` nesta seção, e não é esquecimento: ancestral com `overflow`
         diferente de `visible` vira o contêiner de rolagem do `sticky` e, como não
         rola, o palco não gruda. Quem recorta é o próprio palco, que É o elemento
         `sticky` — recortar a si mesmo é permitido. Armadilha já paga no bloco da Bio,
         registrada no CLAUDE.md. */
      style={{ height: `${ABERTURA_VH}svh` }}
      aria-label={data.marcaAlt}
    >
      <div
        ref={palcoRef}
        className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
      >
        {/* Atmosfera. Duas camadas e não quatro: o template pinta um accent claro e
            escurece com `black/30` por cima. Aqui o fundo já É o petróleo da paleta,
            então sobra o realce e a vinheta. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 34%, oklch(1 0 0 / 0.07) 0%, transparent 58%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 52%, var(--abertura-vinheta) 100%)",
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-5 md:gap-4">
          <div className="abertura-entra-marca">{marcaEl}</div>

          <div className="abertura-entra-quadro">
            <div
              /* O quadro É um objeto: raio, fio e sombra. Isso resolve, de graça, o
                 problema que a máscara `.video-fundido` existia para resolver na
                 abertura em vídeo de 17/08 — o fundo do clipe é mais escuro que o
                 `--ink` da página e desenhava um retângulo no meio da tela. Sendo um
                 cartão declarado, o retângulo passa a ser a intenção. E sai de graça o
                 que a máscara cobrava: ela apagava 26% de cada borda, então os molares
                 das duas pontas renderizavam a 60% de opacidade.
                 ⚠️ O FUNDO é a cor da vinheta, não `--ink-elevated`: o vídeo é 16:9
                 exato e sobra meio pixel de arredondamento na borda — com um fundo mais
                 CLARO que o clipe, esse meio pixel vira um fio visível. */
              className="relative overflow-hidden rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] ring-1 ring-ink-border md:rounded-2xl"
              style={{
                width: quadroW,
                height: quadroH,
                background: "var(--abertura-vinheta)",
              }}
            >
              {arcada.video ? (
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  preload="auto"
                  poster={primeira?.src ?? undefined}
                  aria-label={ultima?.alt}
                  /* SEM `autoplay` e SEM `loop`: quem controla o tempo é a rolagem.
                     ⚠️ E SEM atributo `src` — com `src` e `<source>` juntos alguns
                     navegadores buscam o arquivo duas vezes. */
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  {/* ⚠️ O MP4 VEM PRIMEIRO, e a ordem é o conserto do iOS: o Safari
                      escolhe a PRIMEIRA `<source>` que declara poder tocar, e há
                      versões de iOS que aceitam VP9 no papel e escrubam mal na
                      prática. Chrome, Firefox e Edge testam as duas e preferem o WebM,
                      que é menor. */}
                  <source src={arcada.video} type={TIPO_MP4} />
                  {arcada.videoWebm ? (
                    <source src={arcada.videoWebm} type={TIPO_WEBM} />
                  ) : null}
                </video>
              ) : primeira?.src ? (
                <img
                  src={primeira.src}
                  alt={primeira.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  role="img"
                  aria-label={primeira?.alt ?? data.marcaAlt}
                  className="slot-grid-ink flex h-full w-full items-end p-4 md:p-6"
                >
                  <span className="rounded-md border border-ink-border bg-ink/80 px-2 py-1 text-small text-ink-muted backdrop-blur">
                    {arcada.slotRotulo}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* `<p>` e não `<h1>`/`<h2>`: a headline da página é a do hero, logo abaixo, e
              dois h1 quebram o esqueleto de títulos. É uma assinatura de posicionamento,
              e o texto é real — não `aria-hidden` como no template, que esconde as duas
              palavras do leitor de tela. */}
          <div className="abertura-entra-linha">
            <p className="abertura-linha text-ink-foreground">{data.linha}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
