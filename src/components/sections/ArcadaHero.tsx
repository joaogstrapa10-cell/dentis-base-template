import { useEffect, useRef, useState } from "react";
import type { ArcadaContent, ArcadaEtapa } from "@/content/types";

/**
 * ArcadaHero: abertura da página. Começa com a marca grande no centro; ao rolar, ela
 * cede lugar à arcada, que se FORMA — gengiva, implantes, coroas — até ficar
 * completa. Terminada a abertura, o site começa embaixo.
 *
 * Do template `scroll-expansion-hero` que o usuário mandou vem o gesto: mídia que
 * cresce com a rolagem e conteúdo que só aparece depois. Sem texto nenhum na seção
 * — ele foi explícito, "sem nada de escrita".
 *
 * ⚠️ POR QUE É VÍDEO ESCRUBADO E NÃO MAIS PILHA DE QUADROS
 * A primeira versão trocava cinco imagens por opacidade. O usuário reprovou com a
 * razão exata: "não tá fluido, não tá animado, apenas frame a frame". E estava
 * certo — cinco estados são cinco estados, e nenhuma transição de opacidade
 * inventa os quadros que faltam no meio.
 *
 * Agora os dois quadros do conteúdo são as PONTAS de um clipe gerado por
 * interpolação entre eles, e a rolagem controla o `currentTime` dele. Isso resolve
 * dois problemas de uma vez: a fluidez, e a inconsistência de enquadramento — o
 * modelo interpola entre duas pontas fixas, então a câmera não pula mais.
 *
 * Os dois quadros CONTINUAM no conteúdo e não são resíduo: o primeiro é o `poster`
 * do vídeo (o que aparece antes de o arquivo carregar) e o último é o estado
 * mostrado sob `prefers-reduced-motion`, onde não há animação nenhuma. Os dois são
 * os quadros EXATOS de início e fim extraídos do próprio clipe, não gerações
 * separadas — é o que garante que a troca de poster para vídeo não salte.
 *
 * ⚠️ O QUE NÃO VEIO DO TEMPLATE, E CONTINUA FORA
 * Ele comanda o progresso sequestrando a rolagem: `preventDefault` em `wheel` e
 * `touchmove` mais `window.scrollTo(0,0)` a cada evento. Três quebras concretas
 * aqui: a pílula de navegação é fixa e tem âncoras, então clicar em "Áreas" durante
 * a animação voltaria ao topo; teclado não dispara `wheel`, então Espaço e Page Down
 * deixariam o site inalcançável para quem não usa roda; e arrastar a barra, idem.
 * O progresso vem da fração que o TRILHO desta seção já rolou, em
 * `requestAnimationFrame`.
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
 * é segundos de vídeo por pixel de rolagem: se o vídeo encurta e o trilho não, a
 * peça fica mais lenta; se o vídeo cresce e o trilho não, fica mais rápida — que foi
 * a reclamação de 17/08.
 *
 * Histórico: 300vh para 20s, 560vh quando o vídeo foi para 50s, 380vh quando voltou a
 * ~30s, 280vh com dois clipes (~20s), 240vh com um clipe de 10s, e 210vh agora, com o
 * clipe de 8,04s que o usuário mandou. A taxa fica em ~0,12 s/vh em todas, que é o
 * ritmo aprovado — o número anda junto com a duração, sempre.
 *
 * A conta, para a próxima vez que o clipe mudar: o trecho escrubado é
 * `ARCADA_DESCIDA_INICIO - ARCADA_INTRO_ATE` do curso, e o curso é `trilho - 100vh`.
 * Aqui: 0,60 × 110vh = 66vh de rolagem para 8,04s, ou seja 0,122 s/vh.
 *
 * Custo: a abertura ocupa 2,1 telas de rolagem — o menor que já teve. Encurtar mais
 * significa passar dente antes de dar para ver, porque a duração do clipe é o piso.
 */
export const ARCADA_TRILHO_VH = 210;

/**
 * Fração do curso em que a marca grande do centro termina de sair.
 *
 * Caiu de 0,22 para 0,10 quando o trilho foi para 560vh: 22% de um curso de 460vh
 * seriam ~101vh de rolagem só para a logo encolher, ou seja uma tela inteira antes
 * de a arcada começar. Em fração de curso, este número tem de ser relido a cada
 * mudança do trilho — e subiu para 0,14 quando o trilho caiu para 240vh, justamente
 * para a logo continuar levando ~20vh de rolagem em vez de 13vh.
 */
export const ARCADA_INTRO_ATE = 0.14;

/**
 * Fração do curso em que o vídeo ACABA e a descida começa.
 *
 * É constante de módulo, e não um número solto no corpo do componente, porque dois
 * lugares dependem dela: a escrubagem termina aqui, e a descida começa aqui. Se as
 * duas divergirem, a arcada desce enquanto ainda está ganhando dentes — que é o
 * oposto do pedido, "AO FINALIZAR, essa arcada precisa ir descendo".
 */
const ARCADA_DESCIDA_INICIO = 0.74;

/**
 * ONDE A DESCIDA TEM DE PARAR: largura e centro horizontal da arcada do hero, em px,
 * calculados a partir da janela.
 *
 * Isso não é refinamento, é o pedido: "precisa parar no lugar desse sorriso na seção
 * onde começa o site de fato". Com escala e deslocamento cravados a mão a peça errava
 * o alvo por 131px em 1440 e por 192px em 390 — no celular ela terminava com menos da
 * metade do tamanho do sorriso que deveria virar, e aí a aterrissagem não lê como o
 * mesmo objeto, lê como duas imagens diferentes.
 *
 * ⚠️ ESTES NÚMEROS ESPELHAM AS CLASSES DE `Hero.tsx`, e é a única duplicação do
 * projeto que não dá para evitar: o alvo tem de ser conhecido ANTES de o hero existir
 * na tela, então não há como medi-lo no DOM. Se mudar lá a trilha da coluna
 * (`lg:grid-cols-[1fr_min(38vw,26rem)]`), a sangria (`lg:mr-[…min(12rem,…)]`), o
 * `gap-10`, o `max-w-[1200px]` ou o `px-5`/`md:px-10`, muda aqui na mesma rodada.
 */
function alvoDoHero(vw: number) {
  const rem = 16;
  if (vw >= 1024) {
    /* Em `lg`+ a arcada vive na coluna da direita e SANGRA para fora do container. */
    const trilha = Math.min(0.38 * vw, 26 * rem);
    const sangria = Math.min(12 * rem, Math.max(0, 0.5 * vw - 600) + 2 * rem);
    const largura = trilha + sangria;
    const conteudo = Math.min(vw, 1200) - 2 * 40;
    const colunaTexto = conteudo - 40 - trilha;
    const inicio = (vw - conteudo) / 2 + colunaTexto + 40;
    return { largura, centroX: inicio + largura / 2 };
  }
  /* Abaixo de `lg` a grade colapsa: a arcada ocupa a largura do conteúdo e fica
     centrada, então o deslocamento horizontal da descida tem de ser ZERO. */
  const px = vw >= 768 ? 40 : 20;
  return { largura: Math.min(vw, 1200) - 2 * px, centroX: vw / 2 };
}

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [p, setP] = useState(0);
  const [semAnimacao, setSemAnimacao] = useState(false);
  /* Medidas da janela em px. Não há `window` no SSR, então nascem no caso desktop e o
     efeito corrige na montagem — mesmo padrão do `compacto` que existia aqui antes. O
     custo é um quadro com o alvo errado, e ele é invisível porque em `p = 0` a descida
     vale zero de todo jeito. */
  const [janela, setJanela] = useState({ w: 1440, h: 900 });
  const compacto = janela.w < 768;

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

  useEffect(() => {
    if (semAnimacao) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const trilho = trilhoRef.current;
      if (!trilho) return;
      const r = trilho.getBoundingClientRect();
      const curso = r.height - window.innerHeight;
      if (curso <= 0) {
        setP(0);
        return;
      }
      const bruto = -r.top / curso;
      const fr = bruto < 0 ? 0 : bruto > 1 ? 1 : bruto;
      setP(fr);

      /* ESCRUBAGEM: a rolagem define o instante do vídeo. O trecho útil começa
         quando a marca sai (`ARCADA_INTRO_ATE`) e termina onde a descida começa
         (`ARCADA_DESCIDA_INICIO`) — o último dente tem de estar no lugar ANTES de a
         arcada começar a descer, senão ela desce se formando.
         `readyState >= 1` garante que a duração já é conhecida; sem isso o
         `currentTime` é descartado em silêncio. O limiar de 1/50s evita mandar
         `currentTime` a cada quadro para o mesmo instante, o que engasga a
         decodificação. */
      const v = videoRef.current;
      if (v && v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0) {
        const janela = ARCADA_DESCIDA_INICIO - ARCADA_INTRO_ATE;
        const t =
          Math.min(1, Math.max(0, (fr - ARCADA_INTRO_ATE) / janela)) * v.duration;
        if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t;
      }
    };
    const agendar = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [semAnimacao]);

  /* A INTRO: a marca grande no centro sai nos primeiros 22% do curso, e a mídia
     entra atrás dela. As duas curvas se cruzam de propósito — a mídia começa a
     aparecer antes de a marca terminar de sair, senão há um instante de tela vazia
     entre as duas, que lê como falha de carregamento. */
  const intro = Math.min(1, p / ARCADA_INTRO_ATE);
  const marcaEscala = 1 - 0.5 * intro;
  const marcaOpacidade = Math.max(0, 1 - intro / 0.8);
  const midiaEntra = Math.min(1, Math.max(0, (p - ARCADA_INTRO_ATE * 0.35) / (ARCADA_INTRO_ATE * 0.9)));

  /* A EXPANSÃO fecha em 45% do curso; o resto passa a arcada se formando em tamanho
     cheio, que é onde o interesse está.

     ⚠️ Os tetos são MENORES que na versão anterior, a pedido: "tá muito grande a
     gengiva, diminua o tamanho para que fique proporcional tanto na versão de
     desktop quanto na versão de celular". Antes a caixa terminava em 100vw — no
     desktop isso dava 1440×810 e a gengiva enchia a tela. Agora fecha em 66vw
     (950×535 em 1440) e 88vw no celular (343×193 em 390), sempre em 16:9, que é a
     proporção nativa dos arquivos: recorte ZERO em qualquer ponto da abertura. */
  const abertura = Math.min(1, p / 0.45);
  const suave = 1 - (1 - abertura) * (1 - abertura);
  const inicioL = compacto ? 60 : 40;
  const fimL = compacto ? 88 : 66;
  const largura = inicioL + (fimL - inicioL) * suave;
  const altura = largura / (16 / 9);

  /* A DESCIDA do fecho, pedida em 17/08: "ao finalizar, essa arcada precisa ir
     descendo, com efeitos e bem feito, e precisa parar no lugar desse sorriso na
     seção onde começa o site de fato".
     Ela SUBSTITUI o giro de 360° da versão anterior — o usuário trocou a ideia.
     Nos últimos 26% do trilho a arcada desce, encolhe e escorrega para a direita,
     mirando a coluna direita do hero, que é onde o sorriso agora vive.

     A curva é `ease-out` calculada à mão (1 - (1-x)³) e não linear, e é isso que faz
     a peça DESACELERAR ao chegar em vez de bater: é a diferença entre "descer" e
     "cair". Foi o pedido de "bem feito".

     A escala e o deslocamento horizontal do fim NÃO são valores escolhidos: saem de
     `alvoDoHero`, ou seja da geometria da coluna onde o sorriso vive. Foram números
     cravados até esta rodada, e a medição mostrou que erravam o alvo por 131px em 1440
     e por 192px em 390 — ver a nota da função. */
  const bruta = Math.min(
    1,
    Math.max(0, (p - ARCADA_DESCIDA_INICIO) / (1 - ARCADA_DESCIDA_INICIO)),
  );
  const desce = 1 - Math.pow(1 - bruta, 3);
  const descidaY = desce * 26;

  const alvo = alvoDoHero(janela.w);
  /* Largura REAL da caixa no fim da abertura, para a escala sair de uma razão entre
     duas medidas e não de um palpite. O `min` repete a guarda de `maxHeight: 84svh`:
     em janela baixa e larga é a altura que limita, e ignorar isso daria uma escala
     calculada sobre uma largura que a caixa nunca teve. */
  const larguraFinal = Math.min((fimL / 100) * janela.w, 0.84 * janela.h * (16 / 9));
  /* Teto e piso por segurança: janela extrema não deve produzir escala absurda. Acima
     de 1 é legítimo e acontece no celular e no tablet, onde o sorriso do hero é mais
     largo que a caixa da abertura — ali a arcada desce CRESCENDO um pouco.
     ⚠️ O teto era 1,2 e ERRAVA a faixa de tablet: em 768 o alvo pede 1,357 e em 1023
     pede 1,397, então a arcada parava 80px e 133px menor que o sorriso. 1,45 cobre a
     faixa inteira; medido em 360, 767, 768, 1023, 1024, 1440 e 1920. */
  const escalaAlvo = Math.min(1.45, Math.max(0.3, alvo.largura / larguraFinal));
  const encolhe = 1 - (1 - escalaAlvo) * desce;
  const descidaX = ((alvo.centroX - janela.w / 2) * desce) / janela.w * 100;

  const primeira = data.etapas[0];
  const ultima = data.etapas[data.etapas.length - 1];

  /* ⚠️ NÃO EXISTE MAIS a revelação por `clip-path` que empilhava um quadro com
     dentes sobre o quadro com implantes e ia descobrindo em faixas. Ela entregava a
     ordem certa (superior da esquerda para a direita, depois a inferior) mas o
     usuário reprovou na hora, e com razão: "você apenas colocou uma imagem em cima,
     quero algo intuitivo e profissional, como a gente já havia feito mais cedo".

     Quem coloca os dentes é o VÍDEO ESCRUBADO pela rolagem, que é o mecanismo que
     ele aprovou antes — a rolagem controla o `currentTime` e os dentes entram um a
     um dentro da própria animação. A ordem passou a ser responsabilidade do prompt
     do clipe, e o clipe é gerado entre dois quadros fixos: as duas arcadas
     implantadas e as duas com os dentes. Não reintroduzir a sobreposição. */

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
            aria-hidden={marcaOpacidade < 0.02 || undefined}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8"
            style={{ opacity: marcaOpacidade }}
          >
            {logo ? (
              <img
                src={logo}
                alt={logoAlt ?? ""}
                /* Grande de verdade: metade da largura da janela no desktop, quase
                   toda no celular. Teto em `rem` para não virar um cartaz em
                   monitor ultralargo. */
                className="w-[min(50vw,34rem)] max-w-[86vw]"
                style={{ scale: `${marcaEscala}` }}
              />
            ) : null}
          </div>

          {/* A MÍDIA. Aparece atrás da marca e cresce. */}
          <div
            /* `video-fundido`: dissolve as quatro bordas no fundo. Ver a nota da
               classe no styles.css — tirar raio e sombra não bastou, e a medição diz
               por quê: o fundo do clipe é `#001518`, MAIS ESCURO que o `--ink` da
               página (~`#013435`). Sem a máscara, os 4 cantos desenham um retângulo
               escuro, que é o "quadrado" que o usuário reclamou duas vezes. */
            className="video-fundido relative"
            style={{
              width: `${largura}vw`,
              height: `${altura}vw`,
              /* Guarda para janela baixa e larga: sem ela, 37vw de altura passam da
                 tela em 1440×700 e a caixa é cortada pelo palco. */
              maxHeight: "84svh",
              opacity: midiaEntra,
              /* Duas escalas multiplicadas de propósito: `midiaEntra` é a entrada no
                 começo e `encolhe` é a saída no fim. */
              scale: `${(0.92 + 0.08 * midiaEntra) * encolhe}`,
              /* `translate` e não `top`/`left`: é propriedade animável sem reflow, e
                 no Tailwind v4 é a mesma propriedade que o resto do projeto usa. */
              translate: `${descidaX}vw ${descidaY}svh`,
              /* ⚠️ SEM `borderRadius`, SEM `overflow: hidden` e SEM `boxShadow`, a
                 pedido do usuário em 17/08: "não quero aquela borda que está no
                 vídeo". O cartão arredondado com sombra desenhava um retângulo
                 visível em volta da animação. Sem ele, e como o fundo do vídeo é o
                 mesmo verde-petróleo da seção (hex 013435 = `--ink`), a mídia se
                 dissolve no fundo e não há aresta nenhuma. */
            }}
          >
            {data.video ? (
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
                   oferecer UI de reprodução numa peça que não é para ser tocada. */
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                className="h-full w-full object-cover"
              >
                {/* WebM primeiro: menor, e é o que o Chromium deste ambiente
                    decodifica — o mp4 é o par universal para Safari e o resto. */}
                {data.videoWebm ? (
                  <source src={data.videoWebm} type="video/webm" />
                ) : null}
                <source src={data.video} type="video/mp4" />
              </video>
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
