import { useEffect, useId, useRef, useState } from "react";
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
 * ⚠️ O FIO É DESENHADO PELA ROLAGEM desde 08/10, a pedido: "conforme eu
 * escrolar, os traços vão se complementando até chegar na próxima etapa", do
 * 01 até o 06, que é onde ele está hoje. A ponta do fio acompanha uma linha de
 * leitura fixa na janela (`LINHA_LEITURA`), então quem rola vê o percurso
 * sair de uma ficha e chegar na seguinte, e o nó da ficha acende quando o fio
 * chega nele. Subindo a página, o fio recolhe. O tracejado que MARCHAVA sozinho
 * (`.fio-marcha`, um laço infinito) saiu junto: dois movimentos no mesmo traço,
 * um da rolagem e um do relógio, competem, e o pedido é que o movimento seja
 * o da rolagem.
 *
 * ⚠️ E O FIO NÃO PASSA MAIS POR CIMA DAS FICHAS, que foi a outra metade do
 * pedido ("não tenha aquelas linhas ali em cima dos cards"). Ele saía do TOPO
 * de cada ficha, e como a ficha é inclinada, o primeiro trecho corria rente à
 * quina de cima e cruzava a borda dela. Agora ele corre no CORREDOR entre as
 * duas colunas e encosta na LATERAL de cada ficha, na altura do número, por um
 * nó: em nenhum ponto o traço cruza uma ficha, por construção.
 *
 * ⚠️ `motion/react` continua FORA, e é a QUINTA vez que esta recusa aparece no
 * projeto (GSAP e `motion/react` em 19/08, `motion/react` de novo em 19/08,
 * `framer-motion` em 25/09). O motivo é duro e o sintoma é silencioso: essas
 * libs escrevem a propriedade `transform`, o Tailwind v4 escreve `translate` /
 * `scale` / `rotate` SEPARADAS, e misturar as duas famílias no mesmo elemento
 * faz uma apagar a outra sem erro nenhum. O desenho pela rolagem é o mesmo
 * mecanismo provado aqui desde 13/08: a fração que a seção já rolou, lida em
 * `requestAnimationFrame`, escrevendo `stroke-dashoffset` numa máscara.
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

/* O FIO, em pixels do contêiner e não mais em unidades de um viewBox esticado:
   os nós saem da posição MEDIDA de cada ficha, então o desenho acompanha a
   largura real e a altura real de cada uma (que sai do texto do marco). */
const INCLINACAO = 2.5; // graus; fichas da esquerda giram +, da direita −
const RESPIRO_NO = 14; // px entre a lateral da ficha e o centro do nó
const TRILHO_X = 9; // px: x do trilho no celular, onde as fichas empilham
/* ⚠️ A ponta do fio fica a 62% da altura da janela. Mais alto (50%), o fio só
   chega numa ficha quando ela já passou do meio da tela e a leitura dela já
   começou sem ele; mais baixo (75%), ele corre na frente de fichas que ainda
   nem entraram direito. 62% é onde o número da ficha costuma estar quando a
   pessoa começa a ler o título dela. */
const LINHA_LEITURA = 0.62;

type No = { x: number; y: number };
type Geometria = { w: number; h: number; nos: No[]; d: string };

/**
 * O caminho que liga os nós, em ordem.
 *
 * No desktop é uma ONDA: cada trecho é uma cúbica com as tangentes na
 * VERTICAL nas duas pontas, então o fio desce pelo corredor, encosta no nó de
 * uma ficha descendo, e segue descendo até o nó do outro lado. Com tangente
 * horizontal (como era) o fio teria de dar meia-volta em cada nó, e o
 * tracejado se sobreporia a ele mesmo numa ponta de seta. Tangente vertical
 * também garante que o y só CRESCE ao longo do caminho, e é isso que permite
 * achar "até onde desenhar" por uma busca simples (ver `comprimentoNoY`).
 *
 * No celular é uma RETA: as fichas empilham numa coluna e os nós ficam todos
 * no mesmo trilho, à esquerda delas.
 */
function caminho(nos: No[], onda: boolean) {
  if (nos.length < 2) return "";
  const f = (n: number) => n.toFixed(1);
  let d = `M ${f(nos[0].x)} ${f(nos[0].y)}`;
  for (let i = 1; i < nos.length; i++) {
    const a = nos[i - 1];
    const b = nos[i];
    if (!onda) {
      d += ` L ${f(b.x)} ${f(b.y)}`;
      continue;
    }
    const k = (b.y - a.y) * 0.5;
    d += ` C ${f(a.x)} ${f(a.y + k)}, ${f(b.x)} ${f(b.y - k)}, ${f(b.x)} ${f(b.y)}`;
  }
  return d;
}

/** Soma os offsets de `el` até `alvo`. Offsets IGNORAM `transform`, que é o
 *  que se quer aqui: a ficha está girada e o `Reveal` a desloca na entrada, e o
 *  nó tem de ser calculado a partir da caixa de layout, girada à mão depois. */
function offsetAte(el: HTMLElement, alvo: HTMLElement) {
  let x = 0;
  let y = 0;
  let e: HTMLElement | null = el;
  while (e && e !== alvo) {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent as HTMLElement | null;
  }
  return { x, y };
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

  /**
   * GEOMETRIA DO FIO, medida: um nó por ficha, na altura do NÚMERO dela.
   *
   * No desktop o nó fica no lado da ficha que dá para o corredor (direito nas
   * da esquerda, esquerdo nas da direita), `RESPIRO_NO` para fora da borda, e
   * GIRADO junto com a ficha em volta do centro dela — senão, nos 2,5° de
   * inclinação, o nó descola da lateral em ~6px. No celular o nó fica no
   * trilho, à esquerda da pilha.
   *
   * ⚠️ Remedido por `ResizeObserver` na caixa e em cada ficha: a altura da
   * ficha muda quando a fonte termina de carregar, e o número desce junto.
   */
  const caixaRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometria | null>(null);
  useEffect(() => {
    const caixa = caixaRef.current;
    const ol = olRef.current;
    if (!caixa || !ol) return;
    const lis = [...ol.children] as HTMLElement[];
    const medir = () => {
      const nos = lis.map((li, i): No => {
        const art = li.querySelector("article") as HTMLElement | null;
        const num = li.querySelector("[data-numero]") as HTMLElement | null;
        if (!art || !num) return { x: 0, y: 0 };
        const n = offsetAte(num, caixa);
        const yNum = n.y + num.offsetHeight / 2;
        if (!espalhado) return { x: TRILHO_X, y: yNum };
        const a = offsetAte(art, caixa);
        const cx = a.x + art.offsetWidth / 2;
        const cy = a.y + art.offsetHeight / 2;
        const esquerda = i % 2 === 0;
        const lx = (esquerda ? 1 : -1) * (art.offsetWidth / 2 + RESPIRO_NO);
        const ly = yNum - cy;
        const t = ((esquerda ? 1 : -1) * INCLINACAO * Math.PI) / 180;
        return {
          x: cx + lx * Math.cos(t) - ly * Math.sin(t),
          y: cy + lx * Math.sin(t) + ly * Math.cos(t),
        };
      });
      const d = caminho(nos, espalhado);
      const w = caixa.offsetWidth;
      const h = caixa.offsetHeight;
      setGeo((g) => (g && g.d === d && g.w === w && g.h === h ? g : { w, h, nos, d }));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(caixa);
    lis.forEach((li) => {
      const art = li.querySelector("article");
      if (art) ro.observe(art);
    });
    return () => ro.disconnect();
  }, [espalhado, data.marcos.length]);

  /**
   * O DESENHO PELA ROLAGEM.
   *
   * O traço visível é tracejado e fica INTEIRO o tempo todo; quem decide quanto
   * dele aparece é uma MÁSCARA com o mesmo caminho em traço contínuo, revelada
   * por `stroke-dashoffset`. Revelar o próprio tracejado por dashoffset não
   * funciona: o padrão 8/6 é ele mesmo um dasharray, e um segundo apagaria o
   * primeiro.
   *
   * ⚠️ "Até onde desenhar" é o comprimento do caminho em que ele cruza a linha
   * de leitura. O caminho só DESCE (tangentes verticais, ver `caminho`), então
   * uma tabela comprimento → y amostrada uma vez basta, e a busca é binária.
   *
   * O laço só roda com a seção perto da tela (IntersectionObserver com 300px
   * de folga) e só escreve quando o valor muda — a lição de 15/09, quando um
   * laço que rodava a página inteira foi suspeito do travamento no celular.
   *
   * Sob `prefers-reduced-motion` o fio fica inteiro e todos os nós acesos: o
   * percurso é conteúdo, e quem pede menos movimento não pode perdê-lo.
   */
  const svgRef = useRef<SVGSVGElement>(null);
  const fioRef = useRef<SVGPathElement>(null);
  const revelaRef = useRef<SVGPathElement>(null);
  const pontaRef = useRef<SVGGElement>(null);
  const nosRef = useRef<(SVGCircleElement | null)[]>([]);
  useEffect(() => {
    const svg = svgRef.current;
    const fio = fioRef.current;
    const revela = revelaRef.current;
    const caixa = caixaRef.current;
    const ol = olRef.current;
    if (!geo || !svg || !fio || !revela || !caixa || !ol) return;

    const L = fio.getTotalLength();
    /* Um marco só (variante com outra contagem): não há fio a desenhar, e a
       tabela abaixo dividiria por zero. O nó fica aceso e o laço não roda. */
    if (L < 1) {
      svg.style.opacity = "1";
      nosRef.current.forEach((c) => c && (c.dataset.alcancado = "true"));
      return;
    }
    const N = 320;
    const tabela = Array.from({ length: N + 1 }, (_, i) => {
      const s = (L * i) / N;
      const p = fio.getPointAtLength(s);
      return { s, x: p.x, y: p.y };
    });
    /** Comprimento do caminho no ponto em que ele chega à altura `y`.
     *  −1 antes do primeiro nó: aí o fio ainda não começou. */
    const comprimentoNoY = (y: number) => {
      if (y < tabela[0].y) return -1;
      if (y >= tabela[N].y) return L;
      let lo = 0;
      let hi = N;
      while (hi - lo > 1) {
        const m = (lo + hi) >> 1;
        if (tabela[m].y <= y) lo = m;
        else hi = m;
      }
      const a = tabela[lo];
      const b = tabela[hi];
      const t = b.y > a.y ? (y - a.y) / (b.y - a.y) : 0;
      return a.s + (b.s - a.s) * t;
    };
    const pontoEm = (s: number) => {
      const f = (Math.max(0, Math.min(L, s)) / L) * N;
      const i = Math.min(N - 1, Math.floor(f));
      const t = f - i;
      return {
        x: tabela[i].x + (tabela[i + 1].x - tabela[i].x) * t,
        y: tabela[i].y + (tabela[i + 1].y - tabela[i].y) * t,
      };
    };
    /* `max(0, …)`: o caminho é escrito com uma casa decimal e o nó não, então
       o primeiro nó pode cair um décimo ACIMA do início do caminho, voltar −1 e
       acender antes de o fio começar (medido: o 01 aceso com 0% desenhado). */
    const sNo = geo.nos.map((n) => Math.max(0, comprimentoNoY(n.y)));

    revela.style.strokeDasharray = `${L} ${L}`;
    const lis = [...ol.children] as HTMLElement[];
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ultimo = Number.NaN;
    let raf = 0;
    let perto = false;

    const aplicar = () => {
      raf = 0;
      const s = reduz.matches
        ? L
        : comprimentoNoY(window.innerHeight * LINHA_LEITURA - caixa.getBoundingClientRect().top);
      if (Math.abs(s - ultimo) < 0.25) return;
      ultimo = s;
      revela.style.strokeDashoffset = `${L - Math.max(0, s)}`;
      svg.style.opacity = "1";
      const ponta = pontaRef.current;
      if (ponta) {
        const p = pontoEm(s);
        ponta.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        ponta.style.opacity = s > 0 && s < L ? "1" : "0";
      }
      sNo.forEach((sn, k) => {
        const v = s >= sn - 0.5 ? "true" : "false";
        if (lis[k] && lis[k].dataset.alcancado !== v) lis[k].dataset.alcancado = v;
        const c = nosRef.current[k];
        if (c && c.dataset.alcancado !== v) c.dataset.alcancado = v;
      });
    };
    const pedir = () => {
      if (perto && !raf) raf = requestAnimationFrame(aplicar);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        perto = e.isIntersecting;
        pedir();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(caixa);
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    reduz.addEventListener("change", pedir);
    // Primeira leitura já, para o estado inicial não depender de rolar.
    aplicar();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      reduz.removeEventListener("change", pedir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [geo]);

  /* O id da máscara não pode ter os dois-pontos do `useId`: dentro de
     `url(#...)` eles quebram a referência e a máscara some sem erro. */
  const mascaraId = `fio-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <Section id="trajetoria">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      {/* `isolate`: as fichas usam `z-index` interno para subir no hover, e
          ordenação interna que escapa para o contexto RAIZ é o defeito que a
          pilha de casos pagou em 20/08, passando por cima da pílula fixa. */}
      <div ref={caixaRef} className="relative isolate mx-auto mt-12 max-w-[62.5rem] md:mt-16">
        {/* O fio vem ANTES da lista no DOM e as duas camadas são posicionadas,
            então as fichas pintam por cima dele mesmo que algum dia se cruzem.
            Hoje não se cruzam: ele corre no corredor (desktop) ou no trilho à
            esquerda (celular). Nasce em opacidade 0 e o laço o acende na
            primeira leitura — sem isso, o fio apareceria inteiro por um quadro
            antes de a máscara recolhê-lo. Sem JS não há geometria, e a lista
            numerada continua contando a sequência sozinha. */}
        {geo ? (
          <svg
            ref={svgRef}
            aria-hidden="true"
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: 0 }}
          >
            <mask
              id={mascaraId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={geo.w}
              height={geo.h}
            >
              <path ref={revelaRef} d={geo.d} fill="none" stroke="white" strokeWidth="12" />
            </mask>
            <path
              ref={fioRef}
              d={geo.d}
              mask={`url(#${mascaraId})`}
              className="stroke-accent/55"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 6"
            />
            {/* Um nó por ficha: vazado enquanto o fio não chegou, cheio quando
                chega. O estado é escrito pelo laço em `data-alcancado`. */}
            {geo.nos.map((n, k) => (
              <circle
                key={k}
                ref={(el) => {
                  nosRef.current[k] = el;
                }}
                cx={n.x}
                cy={n.y}
                r="5.5"
                strokeWidth="1.5"
                className="fill-background stroke-accent/45 transition-[fill,stroke] duration-500 data-[alcancado=true]:fill-accent data-[alcancado=true]:stroke-accent"
              />
            ))}
            {/* A ponta: o ponto que caminha na frente do traço enquanto ele
                está sendo desenhado. Some com o fio parado num nó das pontas. */}
            <g ref={pontaRef} style={{ opacity: 0 }}>
              <circle r="9" className="fill-accent/15" />
              <circle r="3.5" className="fill-accent" />
            </g>
          </svg>
        ) : null}

        {/* No celular as fichas abrem espaço à esquerda para o trilho (`pl-8`):
            é ali que o fio desce, fora das fichas. */}
        <ol
          ref={olRef}
          className={espalhado ? "relative" : "relative flex flex-col gap-7 pl-8"}
          style={espalhado ? { height: `${altura}px` } : undefined}
        >
          {data.marcos.map((marco, i) => {
            const p = pontos[i];
            return (
              <li
                key={marco.etapa + marco.titulo}
                className={`group/marco ${espalhado ? "absolute w-[19rem]" : "relative"}`}
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
                      {/* `data-numero`: é a altura dele que o nó do fio segue.
                          Enquanto o fio não chega, o número fica em 40% — é o
                          sinal de "próxima etapa" que acende com a chegada. Sem
                          o atributo (sem JS, ou movimento reduzido) fica cheio. */}
                      <p
                        data-numero
                        className="display-2 text-accent transition-colors duration-500 group-data-[alcancado=false]/marco:text-accent/40"
                      >{`0${i + 1}`}</p>

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
