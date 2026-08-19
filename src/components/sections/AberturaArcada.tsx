import { useEffect, useRef, useState } from "react";
import type { AberturaContent, ArcadaContent } from "@/content/types";

/**
 * ABERTURA DA HOME: marca em cima, arcada se formando no meio, linha embaixo.
 *
 * Forma pedida pelo usuário em 19/08, a partir do template `hero-scrub` (o hero
 * escrubado do Ferrari Amalfi), com o mapeamento dito por ele:
 *   · onde estava "FERRARI"  → o lockup da Suzuki;
 *   · onde estava "AMALFI"   → "ODONTOLOGIA ESPECIALIZADA";
 *   · onde estava o 3D do carro → a arcada se formando, implantes e dentes brancos,
 *     um por sequência, em cima e embaixo.
 *
 * A COREOGRAFIA é a do template, nas mesmas frações de rolagem: as duas pontas se
 * afastam para os lados enquanto o quadro cresce, o quadro toma a tela inteira
 * durante o miolo (é onde a arcada se forma), e no fim tudo volta à pose de abertura.
 *
 * ═══ O QUE NÃO VEIO DO TEMPLATE, e por quê ═══
 *
 * ⚠️ SEM GSAP e SEM ScrollTrigger. O progresso sai da fração que o TRILHO desta seção
 * já rolou por dentro de si, lido em `requestAnimationFrame` — o mesmo mecanismo já
 * provado três vezes neste projeto (a órbita do corpo clínico, a abertura em vídeo, a
 * marca da abertura anterior). Três razões somadas, e nenhuma é preferência de estilo:
 *   1. o template usa `sticky` e NÃO usa o `pin` do ScrollTrigger, então a única coisa
 *      que a biblioteca faria aqui é interpolar números — que é uma linha de conta;
 *   2. `gsap.set/to` escreve a propriedade `transform`, e o Tailwind v4 escreve
 *      `translate`/`scale`/`rotate` SEPARADAS: misturar as duas famílias no mesmo
 *      elemento é a armadilha já registrada no CLAUDE.md, e o sintoma é silencioso;
 *   3. o projeto não tem nenhuma dependência de animação, e a home já tem peso medido.
 *
 * ⚠️ SEM SEQUÊNCIA DE QUADROS EM `<canvas>`. O template baixa 300 WebP e desenha o
 * quadro correspondente ao scroll. Aqui a mídia é VÍDEO, e a decisão foi MEDIDA:
 * exportar os 193 quadros deste clipe a 1280px em WebP q72 dá **6,3 MB em 193
 * requisições**, contra **3,4 MB do WebM a 1920×1080** que já está no repo. A razão é
 * o material: a câmera é travada e a diferença entre quadros vizinhos é um dente, ou
 * seja o melhor caso possível para compressão interframe e o pior para uma pilha de
 * imagens independentes. Reduzir para 12fps empata no peso e ainda perde resolução e
 * pede 97 requisições.
 *
 * ⚠️ SEM `letterSpacing` animado. O template interpola o tracking das duas palavras;
 * animar `letter-spacing` refaz o layout do texto a cada quadro, e o ganho é
 * invisível ao lado do deslocamento de meia tela.
 *
 * ⚠️ E o azul-claro `#3a9b8a`/`#62B2FE` do template não entra em lugar nenhum: a
 * paleta é a medida da Suzuki (petróleo `--ink`, dourado só como ornamento), e
 * azul-claro de consultório é um dos clichês proibidos no §4 do CLAUDE.md.
 */

/* ── Frações do trilho. Mudar uma destas muda o ritmo da abertura inteira. ── */

/**
 * Quantas telas de ROLAGEM a abertura consome, além da tela que ela ocupa parada.
 * A seção mede `(MULT + 1) × 100svh` e o palco `sticky` gruda por `MULT` telas.
 *
 * O template usa 3,2. Aqui é 2,6, e o número tem uma conta atrás: o miolo (63% do
 * curso) carrega os 8,04s do clipe, o que dá ~184px de rolagem por segundo de vídeo,
 * ou ~7,7px por quadro a 24fps — folgado para a escrubagem ler contínua. Abaixo de
 * ~2,0 os dentes começam a aparecer mais rápido do que se lê.
 *
 * ⚠️ CUSTO DE PÁGINA: 3,6 telas. É a seção mais alta do site, e é inerente ao pedido
 * — sequência comandada por rolagem gasta distância de rolagem por definição. Se
 * incomodar, é ESTE número, e mais nada.
 */
const TRILHO_MULT = 2.6;

/** Fim do afastamento: aqui o quadro chegou ao tamanho aberto e as pontas saíram. */
const PARTE_ATE = 0.15;
/** Fim da imersão: o quadro tomou a tela e a arcada está completa. */
const IMERSAO_ATE = 0.78;

/**
 * Quanto o quadro passa da tela na imersão. O template usa 1,04; aqui é 1,06 porque o
 * palco mede `100svh` e a conta usa a altura MEDIDA dele — no celular, com a barra do
 * navegador entrando e saindo, `svh` e `innerHeight` divergem, e a folga extra é o que
 * impede uma faixa de fundo aparecer na borda durante o movimento.
 */
const TRANSBORDA = 1.06;

/**
 * Tamanho de repouso do quadro, como fração do tamanho aberto.
 *
 * 0,6 no desktop é do template. No celular o template usa 0,82 e aqui é 0,86, porque
 * lá a caixa é limitada pela LARGURA e não pela altura: a 96vw ela já mede 374px numa
 * tela de 390, então o passo repouso→aberto vale no máximo uns 16% — abaixo disso o
 * gesto de abrir não é percebido, e a 0,82 o quadro ficava pequeno demais no campo.
 * Quem carrega o movimento no celular é a imersão (337 → 542px, +61%).
 */
const REPOUSO_DESKTOP = 0.6;
const REPOUSO_COMPACTO = 0.86;

/** 16:9, a proporção nativa do clipe. Recorte zero em qualquer ponto da animação. */
const ASPECTO = 16 / 9;

/**
 * ⚠️ QUANTO DO QUADRO O ASSUNTO OCUPA — os dois números MEDIDOS, e são eles que
 * impedem o defeito mais grave que esta peça pode ter.
 *
 * Varredura de luminância nos quadros de 0s, 4s e 8s do clipe, contra o pixel de
 * fundo: a arcada vive entre 15,4% e 84,5% da LARGURA e entre 9,3% e 93,1% da
 * ALTURA. Ou seja o quadro traz ~15% de vazio de cada lado — o que dá folga para a
 * imersão cortar sem tocar em dente nenhum, mas só até certo ponto.
 *
 * O ponto: a fórmula de cobertura do template (`max(vw/w, vh/h)`) é escrita para
 * janela deitada. Numa janela EM PÉ o termo da altura domina, e medido em 390×844 o
 * quadro ia a 1588px de largura — a tela mostraria 25% dele, ou seja um TALHO
 * VERTICAL no meio da arcada. É exatamente a armadilha já paga em 12/08 (arquivo
 * 3,6:1 numa faixa 0,83:1) e em 17/08 (16:9 interpolado até 0,46:1). Com o teto
 * abaixo, o celular fecha em 542px em vez de 1588.
 *
 * Se o clipe for regerado, REMEDIR: um enquadramento mais fechado muda os dois
 * números e afrouxa o teto sem avisar.
 */
const ASSUNTO_LARGURA = 0.691;
const ASSUNTO_ALTURA = 0.839;
/** A arcada nunca encosta na borda: 2% de folga de cada lado, no pior eixo. */
const MARGEM_ASSUNTO = 0.96;

/**
 * Altura total da seção, em vh. Exportada porque o Header precisa saber onde a
 * abertura acaba. Um número, num lugar só.
 */
export const ABERTURA_VH = (TRILHO_MULT + 1) * 100;

/**
 * Deslocamento de rolagem, em vh, a partir do qual a arcada está COMPLETA — é o
 * instante em que a navegação pode aparecer.
 *
 * Derivado, não escolhido: é o fim da imersão, `TRILHO_MULT × IMERSAO_ATE`. O pedido
 * do usuário em 17/08 foi "a aba de navegação só vai aparecer após a gente terminar de
 * rolar e aparecer todo o vídeo completo", e este é exatamente esse ponto. Os 22%
 * finais — a volta à pose de abertura — já rolam com o menu na tela.
 */
export const ABERTURA_NAV_VH = TRILHO_MULT * IMERSAO_ATE * 100;

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
  const caixaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const marcaRef = useRef<HTMLDivElement | null>(null);
  const linhaRef = useRef<HTMLDivElement | null>(null);
  /**
   * Quantos px o centro do QUADRO está abaixo do centro do palco na pose de repouso.
   * Vale `(altura da marca − altura da linha) / 2`, ~61px em 1440 — ver a nota do
   * layout lá embaixo.
   *
   * ⚠️ MEDIDO, e remedido sozinho: o laço o relê sempre que a página está parada no
   * topo (`p < 0.02`), onde a escala é 1 e o `getBoundingClientRect` do quadro é a
   * caixa de layout. Isso custa uma leitura por quadro só enquanto ninguém rolou, e
   * dispensa listener de `load`/`resize` — se a fonte carregar depois e a linha mudar
   * de altura, a próxima visita ao topo corrige. Calcular de cabeça a partir do CSS
   * é o que errou o alvo por 131px na viagem do vídeo em 18/08.
   */
  const desvioRef = useRef(0);

  const [semAnimacao, setSemAnimacao] = useState(false);
  /* Medidas do PALCO, em px, e medidas de verdade: `getBoundingClientRect` do próprio
     elemento `sticky`, não `innerWidth`/`innerHeight`. É o que garante que a conta da
     imersão use a mesma altura que o CSS usou (`100svh`), que no celular não é
     `innerHeight`. Nascem no caso desktop porque não há `window` no SSR; o primeiro
     quadro errado é invisível, porque a entrada do quadro só acende aos 350ms. */
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
  const escalaRepouso = compacto ? REPOUSO_COMPACTO : REPOUSO_DESKTOP;

  /* GEOMETRIA DO QUADRO.
     ⚠️ A caixa de LAYOUT é o tamanho de REPOUSO, e a animação só cresce a partir
     dele — nunca o contrário. Com o layout no tamanho ABERTO (o que o template faz,
     porque `scale` não mexe no layout), a coluna `flex` pediria marca + 72svh + linha
     numa tela de 100svh: medido em 1440, 972px de conteúdo em 900px de palco, com as
     duas pontas cortadas pela borda. Partindo do repouso, a pilha fecha em 746px e
     nada é cortado na pose de abertura. */
  const abertaW = Math.min(0.96 * palco.w, 0.72 * palco.h * ASPECTO);
  const repousoW = Math.max(1, Math.round(abertaW * escalaRepouso));
  const repousoH = Math.max(1, Math.round(repousoW / ASPECTO));
  const escalaAberta = 1 / escalaRepouso;
  /* IMERSÃO: cobrir a tela é o gesto do template, mas com TETO — e o teto é o que
     mantém a arcada inteira na tela em qualquer proporção de janela. Ver a nota de
     ASSUNTO_LARGURA: sem ele, em 390×844 a peça vira um talho vertical. */
  const cobre = Math.max(palco.w / repousoW, palco.h / repousoH) * TRANSBORDA;
  const tetoLargura = (MARGEM_ASSUNTO * palco.w) / ASSUNTO_LARGURA / repousoW;
  const tetoAltura =
    ((MARGEM_ASSUNTO * palco.h) / ASSUNTO_ALTURA) * ASPECTO / repousoW;
  /* O `max` com `escalaAberta` é guarda de janela extrema: a imersão pode ser
     limitada, mas nunca pode ficar MENOR que o quadro já aberto — isso faria o
     movimento inverter no meio. */
  const escalaImersao = Math.max(
    escalaAberta,
    Math.min(cobre, tetoLargura, tetoAltura),
  );
  /* Quanto as pontas caminham para os lados. Do template: 60vw, 70vw no compacto. */
  const viagem = (compacto ? 0.7 : 0.6) * palco.w;

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
      const caixa = caixaRef.current;
      if (!trilho || !caixa) return;
      const r = trilho.getBoundingClientRect();
      /* Fora da tela não custa nada. */
      if (r.bottom < 0 || r.top > palco.h) return;

      /* O progresso é a fração que ESTE trilho já rolou por dentro de si — nunca
         `window.scrollY`. A abertura é a primeira seção hoje, mas a lição vem da
         órbita de 13/08: com `scrollY` a peça nasce terminada no dia em que deixar de
         ser a primeira, e o defeito é silencioso. */
      const curso = r.height - palco.h;
      const p = curso <= 0 ? 0 : trava01(-r.top / curso);

      /* ── As três curvas. Somadas, e não encadeadas com `if`: em p = 1 as três
            valem 1 e o resultado volta exatamente ao estado de repouso. ── */
      /* afastamento, ease-out */
      const bruta1 = trava01(p / PARTE_ATE);
      const parte = 1 - (1 - bruta1) * (1 - bruta1);
      /* imersão, ease-in — o quadro ACELERA ao tomar a tela */
      const bruta2 = trava01((p - PARTE_ATE) / (IMERSAO_ATE - PARTE_ATE));
      const imersao = bruta2 * bruta2;
      /* volta, ease-in-out */
      const bruta3 = trava01((p - IMERSAO_ATE) / (1 - IMERSAO_ATE));
      const volta =
        bruta3 < 0.5
          ? 2 * bruta3 * bruta3
          : 1 - 2 * (1 - bruta3) * (1 - bruta3);

      const escala =
        1 +
        (escalaAberta - 1) * parte +
        (escalaImersao - escalaAberta) * imersao +
        (1 - escalaImersao) * volta;

      /* CONVERGÊNCIA PARA O CENTRO DO PALCO. Enquanto a página está no topo, mede o
         desvio; a partir daí, sobe o quadro por esse tanto conforme a imersão avança, e
         desfaz na volta. Sem isto a imersão cresce em volta de um centro 61px abaixo do
         da tela e sobra fundo no topo — ver a nota de `desvioRef`. */
      if (p < 0.02) {
        const rc = caixa.getBoundingClientRect();
        desvioRef.current = rc.top + rc.height / 2 - palco.h / 2;
      }
      /* ⚠️ A ORDEM da lista importa: `translate3d(...) scale(...)` aplica a escala
         primeiro e o deslocamento depois, em px NÃO escalados. Invertida, os 61px
         viriam multiplicados por 2,45 na imersão. */
      const dy = -desvioRef.current * (imersao - volta);
      caixa.style.transform = `translate3d(0, ${dy}px, 0) scale(${escala})`;

      /* As pontas: saem para os lados no afastamento e voltam no fim. A opacidade
         some durante os 22% seguintes ao afastamento — elas já estão a meia tela de
         distância quando começam a se apagar, então não há um instante em que fiquem
         penduradas semitransparentes no meio do caminho. */
      const dx = viagem * (parte - volta);
      const apaga = trava01((p - PARTE_ATE) / 0.22);
      const opac = Math.min(1, 1 - apaga + volta);
      const marca = marcaRef.current;
      const linha = linhaRef.current;
      if (marca) {
        marca.style.transform = `translate3d(${-dx}px, 0, 0)`;
        marca.style.opacity = String(opac);
      }
      if (linha) {
        linha.style.transform = `translate3d(${dx}px, 0, 0)`;
        linha.style.opacity = String(opac);
      }

      /* ── ESCRUBAGEM, com INTERPOLAÇÃO. ──
         O alvo sai da fração CRUA da imersão, não da curva suavizada: os dentes
         entram a ritmo constante enquanto o quadro cresce acelerando. Setar
         `currentTime` direto no valor da rolagem produz movimento serrilhado, porque
         a rolagem chega em degraus (a roda anda de 100 em 100px) — aqui o tempo
         persegue o alvo movendo 18% da distância por quadro, o que fecha 90% dela em
         ~200ms sem atraso perceptível.
         `readyState >= 1` garante que a duração já é conhecida: sem isso o
         `currentTime` é descartado em silêncio e a peça parece travada. */
      const v = videoRef.current;
      if (v && v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0) {
        if (!v.paused) v.pause();
        const alvo = bruta2 * v.duration;
        const d = alvo - v.currentTime;
        if (Math.abs(d) > 0.01) v.currentTime += d * 0.18;
      }
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [semAnimacao, palco.h, escalaAberta, escalaImersao, viagem]);

  const primeira = arcada.etapas[0];
  const ultima = arcada.etapas[arcada.etapas.length - 1];

  const marcaEl = data.marca ? (
    <img
      src={data.marca}
      alt={data.marcaAlt}
      /* Largura em `vw` com teto em `rem`: sem o teto vira cartaz em monitor
         ultralargo. Maior no compacto porque lá a coluna sobra altura. */
      className="w-[min(80vw,20rem)] md:w-[min(40vw,30rem)]"
    />
  ) : (
    <span className="abertura-linha text-ink-foreground">{data.wordmark}</span>
  );

  /* ── SEM ANIMAÇÃO: uma tela curta, o estado FINAL da arcada, e nada de trilho.
        Desligar movimento não pode custar o conteúdo — a sequência é o assunto, então
        o que fica é o resultado dela, parado. Sem `sticky`, sem vídeo, sem 3,6 telas
        de rolagem para quem pediu para não haver movimento. ── */
  if (semAnimacao) {
    return (
      <section
        ref={trilhoRef}
        id="abertura"
        className="relative bg-ink px-6 py-20 md:py-24"
      >
        <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-8 text-center">
          {marcaEl}
          {ultima?.src ? (
            <img
              src={ultima.src}
              alt={ultima.alt}
              className="h-auto w-full max-w-[44rem]"
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
         `sticky` — recortar a si mesmo é permitido. Armadilha já paga no bloco da
         Bio, registrada no CLAUDE.md. */
      style={{ height: `${ABERTURA_VH}svh` }}
      aria-label={data.marcaAlt}
    >
      <div
        ref={palcoRef}
        className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
      >
        {/* Atmosfera. Duas camadas e não quatro: o template pinta um accent sólido e
            escurece com `black/30` por cima, porque o accent dele é claro. Aqui o
            fundo já É o petróleo da paleta, então sobra o realce e a vinheta. */}
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

        {/* ⚠️ A COLUNA é centrada, mas o QUADRO não nasce no centro da tela — e essa
            diferença tem de ser corrigida na animação, não ignorada.

            O que a coluna centra é a PILHA (marca + quadro + linha). Como a marca é
            197px de altura e a linha 74px, o centro do quadro cai
            `(197 − 74) / 2 ≈ 61px` ABAIXO do centro do palco. E `scale` cresce em
            volta do próprio centro do elemento: medido no render, a imersão subia fora
            de eixo e sobrava uma faixa de 29px de fundo no TOPO da tela enquanto a base
            transbordava. O template tem a mesma geometria, e lá o defeito passa
            despercebido porque as duas palavras dele têm a MESMA altura.

            Tentei primeiro pôr as três peças em `absolute` em volta do centro, o que
            centra o quadro por construção. Funcionava e ficou pior de olhar: com o
            quadro no centro exato, sobravam 42px de ar acima da marca contra 165px
            abaixo da linha, e a composição inteira lia como se tivesse escorregado para
            cima. A assimetria é estrutural — vale `marca − linha` e não há tamanho de
            fonte que a resolva sem encolher a marca a 180px.

            A saída é o quadro CONVERGIR para o centro do palco enquanto cresce (ver
            `desvioRef` no laço). Isso conserta o eixo E acrescenta um movimento que
            ajuda: a peça sobe para o meio da tela à medida que assume a página. */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 md:gap-4">
          {/* ⚠️ TRÊS NÍVEIS em cada peça, cada um dono de UMA propriedade: o wrapper de
              entrada recebe `transform` pelo `@keyframes`, e o filho recebe o
              `transform` inline da rolagem. Empilhá-los é o que evita a disputa — no
              template a `gsap.from` de entrada e a `gsap.to` de rolagem escrevem no
              MESMO elemento, e a última a rodar apaga a outra. */}
          <div className="abertura-entra-marca">
            <div ref={marcaRef} style={{ willChange: "transform, opacity" }}>
              {marcaEl}
            </div>
          </div>

          <div className="abertura-entra-quadro">
            <div
              ref={caixaRef}
              /* O quadro É um objeto: raio, fio e sombra. Isso resolve, de graça, o
                 problema que a máscara `.video-fundido` existia para resolver na
                 abertura anterior — o fundo do clipe é mais escuro que o `--ink` da
                 página e desenhava um retângulo no meio da tela. Sendo um cartão
                 declarado, o retângulo passa a ser a intenção. Na imersão ele
                 transborda a tela e o fio sai de cena junto.
                 ⚠️ O FUNDO é a cor da vinheta, não `--ink-elevated`: a caixa fecha em
                 1694×954 e o vídeo em 16:9 exato, então sobra meio pixel de
                 arredondamento na borda — com um fundo mais CLARO que o clipe, esse
                 meio pixel virava um fio de 2px visível a 2,45× de escala. */
              className="relative overflow-hidden rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] ring-1 ring-ink-border md:rounded-2xl"
              style={{
                width: repousoW,
                height: repousoH,
                background: "var(--abertura-vinheta)",
                willChange: "transform",
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
                      prática. Chrome, Firefox e Edge testam as duas e preferem o
                      WebM, que é menor. */}
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

          <div className="abertura-entra-linha">
            <div ref={linhaRef} style={{ willChange: "transform, opacity" }}>
              {/* `<p>` e não `<h1>`/`<h2>`: a headline da página é a do hero, logo
                  abaixo, e dois h1 quebram o esqueleto de títulos. É uma assinatura de
                  posicionamento, e o texto é real — não `aria-hidden` como no template,
                  que esconde as duas palavras do leitor de tela. */}
              <p className="abertura-linha text-ink-foreground">{data.linha}</p>
            </div>
          </div>
        </div>
        {/* Sem fio de progresso: removido a pedido do usuário em 17/08. Ele existia
            como pista de que a seção tem fim. Aqui o risco de ler como "página
            travada" é menor do que no template, porque a barra de rolagem do navegador
            continua andando durante a abertura — é o trilho que rola, e em nenhum
            momento o scroll é sequestrado. Não reintroduzir sem pedido. */}
      </div>
    </section>
  );
}
