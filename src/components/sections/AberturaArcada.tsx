import { useEffect, useRef, useState } from "react";
import type { AberturaContent, ArcadaContent } from "@/content/types";

/**
 * ABERTURA DA HOME: a marca em cima, e a arcada em 3D girando embaixo dela. A
 * composição fica PARADA e a rolagem só comanda o tempo do vídeo — a arcada gira
 * numa vista de três quartos conforme a página desce.
 *
 * A forma veio do template `hero-scrub` (o hero escrubado do Ferrari Amalfi) que o
 * usuário mandou em 19/08, e foi despida em duas rodadas do mesmo dia: primeiro o zoom
 * e o afastamento das pontas, depois a assinatura de texto.
 *
 * ═══ ⚠️ TRÊS MUDANÇAS DE 19/08, TODAS PEDIDAS, E O QUE CADA UMA CUSTOU ═══
 *
 * 1. "tire o odontologia especializada" — a assinatura embaixo do quadro saiu, e com
 *    ela a classe `.abertura-linha`, que era a ÚNICA exceção à escala tipográfica
 *    fechada de cinco degraus. A abertura hoje não tem texto nenhum na tela.
 *
 * 2. "faça a arcada em 3D meio de lado, bem diferente e alto nível de 3D" — o clipe
 *    trocou. ⚠️ E A TROCA TEM UM CUSTO DE CONTEÚDO: o clipe anterior era a SEQUÊNCIA
 *    DE FORMAÇÃO (os dentes entrando um por vez, de cima e depois de baixo, que foi
 *    pedido explícito em 17/08). O novo é a arcada COMPLETA girando — de três quartos,
 *    que é o que ele pediu agora. Os dois são clipes DIFERENTES, e ter as duas coisas
 *    juntas (vista de lado + dentes entrando) exige geração nova: nenhum dos quatro
 *    masters que ele mandou tem isso. O de formação está no git e em
 *    `assets-originais/2-dentes-um-a-um.mp4`.
 *
 * 3. "sem estar em um placeholder, como se ela fizesse parte do site, sem sombras" —
 *    o cartão saiu inteiro: sem raio, sem fio, sem sombra e sem fundo. O que faz o
 *    retângulo do vídeo desaparecer é `mix-blend-mode: screen`; ver a nota no `<video>`,
 *    porque isso impõe uma condição ao DOM em volta.
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
 * quadro correspondente ao scroll. Aqui a mídia é VÍDEO, e a decisão foi MEDIDA no
 * clipe anterior: 193 quadros a 1280px em WebP q72 davam 6,3 MB em 193 requisições
 * contra 3,4 MB do WebM em 1080p. Com o clipe de ROTAÇÃO a conta fica ainda mais
 * desfavorável à pilha de imagens: a câmera se move, então cada quadro é novo e
 * nenhuma imagem se parece com a vizinha o bastante para o WebP aproveitar.
 *
 * ⚠️ E NÃO EM 4K, apesar de "em 4K" estar no pedido. O master é 1080p e o quadro exibe
 * 490px no desktop — 980px numa tela retina, ou seja o arquivo de 1500px já entrega
 * 1,5× mais do que a tela mostra. Chegar a 4K só por upscale de IA, que num render 3D
 * de gradiente liso inventa micro-textura na gengiva e serrilha a borda do dente: numa
 * peça apresentada como ilustração técnica isso é inventar detalhe anatômico. Recusado
 * pelo mesmo motivo em 18/08.
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

/**
 * Largura do quadro, como fração da largura do palco.
 *
 * ⚠️ Este número mediu 0,48, depois 0,38 ("diminua o tamanho de tudo dessa sessão"),
 * depois 0,34, e voltou a 0,42 — e a subida NÃO desfaz o pedido dele. Enquanto havia
 * CARTÃO, o que a pessoa via era a moldura inteira; sem cartão, o que se vê é só a
 * arcada, que ocupa 72% da largura e ~76% da altura do quadro. A 0,34 ela media 353px de
 * largura numa janela de 1440 — menor do que era com o cartão, não maior. A 0,42 o
 * quadro fecha em 605px e a arcada em ~436px, que é a mesma presença de antes sem a
 * caixa em volta.
 */
const LARGURA_DESKTOP = 0.42;
const LARGURA_COMPACTA = 0.8;
/**
 * Teto pela ALTURA do palco. É a guarda de janela baixa e larga: sem ele, num monitor
 * 21:9 o quadro passaria da altura da tela.
 */
const ALTURA_MAX = 0.5;

/**
 * Distância, em px, entre a base da marca e o topo do quadro. ⚠️ É AQUI que se sobe ou
 * desce a marca, e é o único lugar — era o `gap` de 16px da coluna até 19/08, quando o
 * usuário pediu "suba um pouco a logo da Suzuki".
 *
 * A coluna é CENTRADA como um grupo, e não o quadro sozinho no meio do palco. Tentei o
 * quadro centrado primeiro, porque com ele no centro exato "subir a logo" mexe só na
 * logo — e o render mostrou o problema: com nada abaixo da arcada, o grupo fica acima do
 * centro e sobram 330px de vazio embaixo contra 55px acima. Centrando o grupo, os dois
 * vazios ficam iguais.
 *
 * O desvio que isso introduz é desprezível AQUI, e vale conferir se o clipe trocar: o
 * quadro tem margem vazia de 10,3% em cima e 13,8% embaixo, então centrar a CAIXA em vez
 * do assunto desloca a arcada só ~7px em 1440.
 */
const VAO_MARCA = 64;
const VAO_MARCA_COMPACTO = 40;

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
  /* Proporção do CONTEÚDO, não cravada aqui. Ver a nota de `videoLargura` no types.ts:
     a do hero ficou cravada no componente e passou a recortar no dia em que o arquivo
     mudou. O `|| 16/9` é só a guarda de conteúdo incompleto. */
  const aspecto =
    arcada.videoLargura && arcada.videoAltura
      ? arcada.videoLargura / arcada.videoAltura
      : 16 / 9;
  /* UM tamanho, do começo ao fim da rolagem. Não há mais escala de repouso nem de
     abertura — o pedido foi o quadro manter o tamanho com que começa. */
  const quadroW = Math.max(
    1,
    Math.round(Math.min(fracao * palco.w, ALTURA_MAX * palco.h * aspecto)),
  );
  const quadroH = Math.max(1, Math.round(quadroW / aspecto));

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
    <span className="display-2 text-ink-foreground">{data.wordmark}</span>
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
        <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-10 text-center">
          {marcaEl}
          {ultima?.src ? (
            <img
              src={ultima.src}
              alt={ultima.alt}
              className="h-auto w-full max-w-[30rem]"
            />
          ) : null}
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
        /* ⚠️ `bg-ink` AQUI e não só na seção, e é REQUISITO do `mix-blend-mode` do
           vídeo: `position: sticky` cria um contexto de empilhamento, então o vídeo
           mistura contra o que está pintado DENTRO deste palco, não contra o fundo da
           seção atrás dele. Sem esta cor, o `screen` misturaria contra transparência e
           o retângulo preto do clipe continuaria preto. */
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink"
      >
        {/* Atmosfera. Duas camadas e não quatro: o template pinta um accent claro e
            escurece com `black/30` por cima. Aqui o fundo já É o petróleo da paleta,
            então sobra o realce e a vinheta. As duas são pintadas ANTES do vídeo, então
            fazem parte do fundo com que ele se mistura. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 38%, oklch(1 0 0 / 0.07) 0%, transparent 58%)",
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

        {/* ⚠️ COLUNA CENTRADA COMO GRUPO — marca em cima, quadro embaixo, e o vão
            entre os dois é `VAO_MARCA`. Ver a nota da constante: o quadro centrado
            sozinho no palco também funciona e foi tentado, mas deixa 330px de vazio
            abaixo da arcada contra 55px acima da marca, porque não há nada embaixo dela
            para equilibrar.

            ⚠️ SEM `z-index` NESTA COLUNA, e não é descuido: `z-index` num elemento
            posicionado cria contexto de empilhamento, e isso ISOLA o
            `mix-blend-mode: screen` do vídeo — o retângulo do clipe volta a aparecer.
            Medido: com `z-10` aqui, o interior do quadro fica em luminância 8 contra 26
            do fundo da página. A ordem de pintura já vem da ordem no DOM (a atmosfera
            está antes), então o z-index não fazia falta. */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ gap: compacto ? VAO_MARCA_COMPACTO : VAO_MARCA }}
        >
          <div className="abertura-entra-marca">{marcaEl}</div>

          <div
            /* SEM CARTÃO: sem raio, sem fio, sem sombra e sem fundo — pedido do usuário
               em 19/08, "sem estar em um placeholder, como se ela fizesse parte do
               site, sem sombras". Este `div` só existe para dar tamanho ao vídeo. */
            style={{ width: quadroW, height: quadroH }}
            className="relative"
          >
            {arcada.video ? (
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                poster={primeira?.src ?? undefined}
                aria-label={primeira?.alt}
                /* SEM `autoplay` e SEM `loop`: quem controla o tempo é a rolagem.
                   ⚠️ E SEM atributo `src` — com `src` e `<source>` juntos alguns
                   navegadores buscam o arquivo duas vezes. */
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                /* ⚠️ `mix-blend-mode: screen` É O QUE FAZ O RETÂNGULO DESAPARECER, e
                   substitui tanto o cartão quanto a máscara `.video-fundido`.
                   O fundo deste clipe é praticamente PRETO — medido no arquivo, os
                   quatro cantos ficam em rgb(0–3, 2–4, 7–11), luminância 6 a 8. Com
                   `screen`, `1−(1−a)(1−b)`, um fundo nesse nível soma ~1% ao que está
                   atrás: o petróleo da página atravessa intacto e a moldura do vídeo
                   deixa de existir. A arcada, que é clara, passa por cima.
                   Isso vale mais que a máscara de borda, que era a outra saída: a
                   máscara apagava 26% de cada lado, e NESTE clipe a arcada chega a
                   97,2% da largura do quadro — seria recortar dente.
                   ⚠️ CONDIÇÃO: nenhum ancestral entre este vídeo e o fundo pode
                   ISOLAR o grupo. `opacity` menor que 1, `filter`, `will-change` de
                   opacidade e `isolation: isolate` todos isolam, e o efeito morre em
                   silêncio — foi por isso que a animação de entrada saiu daqui e a cor
                   de fundo entrou no palco. */
                className="absolute inset-0 h-full w-full object-cover"
                style={{ mixBlendMode: "screen" }}
              >
                {/* ⚠️ O MP4 VEM PRIMEIRO, e a ordem é o conserto do iOS: o Safari
                    escolhe a PRIMEIRA `<source>` que declara poder tocar, e há versões
                    de iOS que aceitam VP9 no papel e escrubam mal na prática. Chrome,
                    Firefox e Edge testam as duas e preferem o WebM, que é menor. */}
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
                style={{ mixBlendMode: "screen" }}
              />
            ) : (
              <div
                role="img"
                aria-label={primeira?.alt ?? data.marcaAlt}
                className="slot-grid-ink flex h-full w-full items-end rounded-xl p-4 md:p-6"
              >
                <span className="rounded-md border border-ink-border bg-ink/80 px-2 py-1 text-small text-ink-muted backdrop-blur">
                  {arcada.slotRotulo}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
