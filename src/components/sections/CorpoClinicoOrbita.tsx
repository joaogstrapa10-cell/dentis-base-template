import { useEffect, useRef, useState } from "react";
import type { BioMembro } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Corpo clínico em ÓRBITA, com a abertura comandada pela ROLAGEM: os retratos
 * começam empilhados no centro e se afastam num raio conforme a página desce, até
 * ficarem distribuídos num círculo com o nome de cada pessoa embaixo. Adaptado do
 * template que o usuário trouxe em 13/08.
 *
 * ---------------------------------------------------------------------------
 * O QUE FOI TROCADO DO TEMPLATE
 * ---------------------------------------------------------------------------
 * - O progresso NÃO vem de `window.scrollY / 500`. Aquilo só funciona quando a
 *   seção é a primeira da página; esta está na quarta posição, e ali `scrollY` já
 *   vale alguns milhares — a animação nasceria terminada. Aqui o progresso é a
 *   fração que o TRILHO desta seção já rolou por dentro de si mesmo, medida pelo
 *   `getBoundingClientRect().top` do próprio elemento. É o que faz a abertura
 *   acontecer enquanto a seção passa pela tela, em qualquer posição da página.
 * - A leitura fica dentro de `requestAnimationFrame`, como no header: ler
 *   `getBoundingClientRect` a cada evento de scroll força layout e engasga a
 *   rolagem no celular.
 * - As três circunferências eram cinza, azul-claro e um degradê roxo→rosa→
 *   vermelho, com variante `dark:`. O projeto não tem modo escuro por classe, e o
 *   pedido foi explícito: as três em cores da identidade e NENHUMA igual à outra.
 *   Ficou o fio claro do bloco (`--ink-border`) na de fora, dourado na do meio e
 *   degradê petróleo→dourado na de dentro.
 * - O raio e o TAMANHO DO RETRATO são calculados do palco, não cravados em 300px e
 *   96px. Com valor fixo, em janela baixa os retratos saíam da área visível — e o
 *   palco é `sticky`, então "sair" ali significa ficar escondido para sempre —, e um
 *   tamanho que cabe em 1440 colide em 1280. Ver a nota da medição.
 * - `transform: translate(...)` do template virou a propriedade `translate`. No
 *   Tailwind v4 é ela que os utilitários usam, e misturar as duas faz uma
 *   sobrescrever a outra em silêncio. Aqui a centralização (`-50%`) e o
 *   deslocamento radial vivem na MESMA declaração, por isso não há conflito.
 *
 * ---------------------------------------------------------------------------
 * SÓ EM TELA LARGA, E NÃO É PREGUIÇA
 * ---------------------------------------------------------------------------
 * O retrato só pode ter `0,293·raioX` de lado — o vão entre a peça diagonal e a
 * lateral —, e o raio sai da largura do palco. Num celular de 390px sobram ~350px
 * úteis, o que daria retrato de ~45px: menor que a miniatura que esta seção existe
 * para eliminar. Abaixo de `lg` a seção usa a GRADE de sempre, que está no
 * `Bio.tsx`. Duas formas para o mesmo conteúdo, escolhidas pelo espaço disponível.
 *
 * ---------------------------------------------------------------------------
 * O QUE ACONTECE SEM ROLAGEM, SEM JS E COM MOVIMENTO REDUZIDO
 * ---------------------------------------------------------------------------
 * `prefers-reduced-motion: reduce` trava o progresso em 1: a órbita nasce aberta,
 * com os nomes visíveis, e a rolagem não mexe em nada. Os nomes ficam no DOM em
 * todos os estados — a opacidade os esconde do olho, não do leitor de tela, então
 * a lista é legível mesmo antes de qualquer rolagem.
 */

/** Quanto do palco cada anel ocupa, em fração do raio dos retratos. */
const ANEL_INTERNO = 0.62;
const ANEL_MEIO = 0.82;

/**
 * Ângulo do primeiro retrato: -90°, ou seja meio-dia, girando no sentido do
 * relógio — assim a ordem visual bate com a ordem da lista lida em voz alta.
 *
 * ⚠️ Tentei girar meio passo (`+π/n`) para tirar os retratos dos extremos dos
 * eixos, e é PIOR: com meio passo passam a existir dois pares de mesmo X (os dois
 * de cada lado), separados só pelo vão VERTICAL, que é menor que a altura da peça.
 * Medido: 17px de sobreposição em 1440×900 e 55px em 1280×800. Com a fase em -90°
 * nenhum par vizinho compartilha X e todos se separam na horizontal.
 */
const FASE = -Math.PI / 2;

/** Vão mínimo entre duas peças vizinhas, em px. */
const FOLGA = 8;

export function CorpoClinicoOrbita({
  membros,
  label,
  nota,
}: {
  membros: BioMembro[];
  label: string;
  /** Linha curta no centro, que aparece quando os retratos saem de cima dela. */
  nota: string;
}) {
  const trilho = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  /** Uma peça basta: as oito têm o mesmo tamanho. */
  const primeiraPeca = useRef<HTMLLIElement>(null);
  const [progresso, setProgresso] = useState(0);
  const [raio, setRaio] = useState({ x: 0, y: 0 });
  /** Lado do retrato, em px. Calculado do espaço — ver a nota da medição. */
  const [cartao, setCartao] = useState(160);
  const [semMovimento, setSemMovimento] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemMovimento(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  /* DOIS raios, um por eixo — a órbita é uma ELIPSE, não um círculo. Círculo aqui
     significa raio = o MENOR dos dois eixos, e o palco é muito mais largo que alto:
     o círculo ficava preso na altura e sobravam ~250px de vazio de cada lado. Foi o
     que o usuário apontou em 13/08 ("tem muito espaço").
     ---------------------------------------------------------------------------
     O TAMANHO DO RETRATO É CALCULADO, NÃO ESCOLHIDO
     ---------------------------------------------------------------------------
     Duas rodadas de "aumentar os cards" mostraram que valor fixo não serve: o que
     cabe depende da largura do palco, e um número que funciona em 1440 colide em
     1280 e em 1024 — medido, 10px e 46px de sobreposição entre a peça diagonal e a
     lateral.
     Então aqui a peça é DIMENSIONADA pelo espaço: testa candidatos de 176px para
     baixo e fica com o maior que passa no teste de colisão de todos os pares
     vizinhos. Duas caixas só se cruzam se AMBOS os eixos se cruzam, então o teste é
     `|Δx| ≥ largura || |Δy| ≥ altura`.
     A altura do rótulo entra medida do DOM (altura da peça menos a do retrato), e
     não estimada: ela depende de o nome quebrar em uma ou duas linhas, o que depende
     da fonte — daí a segunda medição depois de a Instrument Sans carregar. */
  useEffect(() => {
    const medir = () => {
      const el = palco.current;
      const peca = primeiraPeca.current;
      if (!el || !peca) return;
      const r = el.getBoundingClientRect();
      const cartaoAtual = peca.firstElementChild?.getBoundingClientRect().height ?? 0;
      const rotulo = Math.max(40, peca.getBoundingClientRect().height - cartaoAtual);

      const passo = (Math.PI * 2) / membros.length;
      const cabe = (largura: number) => {
        const altura = largura + rotulo;
        const rx = Math.max(0, r.width / 2 - largura / 2 - 8);
        const ry = Math.max(0, r.height / 2 - altura / 2 - 8);
        if (rx <= 0 || ry <= 0) return null;
        for (let i = 0; i < membros.length; i++) {
          const a = FASE + i * passo;
          const b = FASE + ((i + 1) % membros.length) * passo;
          const dx = Math.abs(Math.cos(a) - Math.cos(b)) * rx;
          const dy = Math.abs(Math.sin(a) - Math.sin(b)) * ry;
          /* Folga de 8px em cada eixo: com tolerância de 1px o cálculo
             "passava" e o render ainda mostrava 3 a 5px de sobreposição, por
             arredondamento de subpixel e pela borda de 2px do retrato. Medido nos
             quatro breakpoints antes e depois. */
          if (dx < largura + FOLGA && dy < altura + FOLGA) return null;
        }
        return { x: rx, y: ry };
      };

      for (let largura = 176; largura >= 88; largura -= 4) {
        const raios = cabe(largura);
        if (raios) {
          setCartao(largura);
          setRaio(raios);
          return;
        }
      }
      /* Nem 88px passa: palco muito apertado. Mantém o menor tamanho e deixa a
         elipse no que couber — melhor apertado que invisível. */
      setCartao(88);
      setRaio({
        x: Math.max(0, r.width / 2 - 52),
        y: Math.max(0, r.height / 2 - 52 - rotulo / 2),
      });
    };
    medir();
    const t = setTimeout(medir, 400);
    window.addEventListener("resize", medir);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", medir);
    };
  }, [membros.length]);

  useEffect(() => {
    if (semMovimento) {
      setProgresso(1);
      return;
    }
    let raf = 0;
    const aoRolar = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = trilho.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        /* Curso = o quanto o trilho pode rolar com o palco preso no topo. */
        const curso = Math.max(1, r.height - window.innerHeight);
        setProgresso(Math.max(0, Math.min(1, -r.top / curso)));
      });
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [semMovimento]);

  /* Curva de saída: o afastamento acelera no começo e assenta no fim, senão a
     abertura parece linear e mecânica. */
  const suave = 1 - (1 - progresso) ** 3;
  /* PISO de 32% do raio, e não zero como no template. Com zero, os oito retratos
     ficam exatamente um sobre o outro e a tela inteira — o palco é `sticky`, então
     é uma tela inteira — mostra UM retrato solto no meio do vazio até a rolagem
     começar. Medido no render e é o que mais chama atenção na versão fechada.
     Em 32% eles formam um aglomerado sobreposto, que lê como grupo apertado
     esperando para abrir, e o gesto de expansão continua inteiro. */
  const fator = 0.32 + 0.68 * suave;
  const distX = raio.x * fator;
  const distY = raio.y * fator;

  const anelMeioVisivel = progresso > 0.22;
  const anelExternoVisivel = progresso > 0.5;
  const centroVisivel = progresso > 0.45;
  const nomesVisiveis = progresso > 0.82;

  return (
    /* Trilho alto: é ele que dá o CURSO de rolagem da animação. 190vh deixa ~90vh
       de curso com o palco preso — o suficiente para a abertura ser percebida como
       gesto e não como salto, e curto o bastante para não virar uma seção de duas
       telas vazias. */
    <div ref={trilho} className="relative h-[190vh]">
      {/* `pt-24`: a pílula de navegação é FIXA e opaca, com a base em 85px. Sem o
          recuo, o palco centraliza no meio da janela e o retrato de meio-dia cai em
          ~68px — atrás da pílula. O recuo empurra o centro para baixo, e a medição
          do raio usa a caixa JÁ recuada (o ref está no filho), então o raio
          acompanha em vez de estourar. */}
      <div className="sticky top-0 flex h-screen items-center justify-center pb-4 pt-24">
        <div
          ref={palco}
          className="relative flex h-full w-full items-center justify-center"
        >
          {/* ---------- Os três anéis, um por cor ---------- */}
          {/* De fora: o fio claro do bloco (`--ink-border`, branco a 12%). É o mais
              discreto dos três de propósito — ele só fecha a composição. */}
          {/* Os anéis acompanham os DOIS raios, então são elipses — se ficassem
              circulares, a órbita passaria por fora deles nas laterais. */}
          <div
            aria-hidden="true"
            style={{ width: raio.x * 2, height: raio.y * 2 }}
            className={cn(
              "absolute rounded-[50%] border transition-all duration-700",
              anelExternoVisivel ? "border-ink-border" : "border-transparent",
            )}
          />
          {/* Do meio: dourado. É o ornamento da identidade, e sobre fundo escuro é
              onde ele pode aparecer — ver a nota dos dois accents no
              docs/referencia-layout.md. */}
          <div
            aria-hidden="true"
            style={{ width: raio.x * 2 * ANEL_MEIO, height: raio.y * 2 * ANEL_MEIO }}
            className={cn(
              "absolute rounded-[50%] border transition-all duration-700",
              anelMeioVisivel ? "border-gold/40" : "border-transparent",
            )}
          />
          {/* De dentro: degradê petróleo→dourado, com 1px de espessura. É o único
              que existe desde o começo: é o núcleo de onde os retratos saem. */}
          <div
            aria-hidden="true"
            style={{ width: raio.x * 2 * ANEL_INTERNO, height: raio.y * 2 * ANEL_INTERNO }}
            className="absolute rounded-[50%] bg-gradient-to-br from-accent via-gold to-accent p-px"
          >
            <div className="h-full w-full rounded-[50%] bg-ink" />
          </div>

          {/* ---------- Texto do centro ----------
              Subiu um degrau da escala em 13/08 ("deixe as escritas maiores"):
              `display-2` no rótulo e `text-base` na nota. Cabe porque a elipse
              interna cresceu junto — o núcleo tem ~590×330 em 1440. */}
          <div
            className={cn(
              "absolute z-20 max-w-[26rem] px-4 text-center transition-opacity duration-700",
              centroVisivel ? "opacity-100" : "opacity-0",
            )}
          >
            <p className="display-2 text-ink-foreground">{label}</p>
            <p className="mt-4 text-base leading-[1.6] text-ink-muted">{nota}</p>
          </div>

          {/* ---------- Os retratos em órbita ---------- */}
          <ul className="contents">
            {membros.map((m, i) => {
              const angulo = FASE + (i / membros.length) * Math.PI * 2;
              const x = Math.cos(angulo) * distX;
              const y = Math.sin(angulo) * distY;
              return (
                <li
                  key={m.nome}
                  ref={i === 0 ? primeiraPeca : undefined}
                  style={{
                    /* Centralização e deslocamento na MESMA declaração: são a
                       mesma propriedade, e separá-los faria uma apagar a outra.
                       O que fica centrado no ponto da órbita é a PEÇA INTEIRA
                       (cartão + rótulo), e é por isso que a folga do raio é a
                       metade dela. */
                    translate: `calc(-50% + ${x}px) calc(-50% + ${y}px)`,
                    width: cartao,
                    zIndex: 10,
                  }}
                  className="absolute left-1/2 top-1/2 flex flex-col items-center transition-[translate] duration-300 ease-out"
                >
                  <Retrato m={m} lado={cartao} />
                  {/* Nome e ESPECIALIDADE embaixo do cartão, aparecendo quando a
                      órbita termina de abrir — foi o pedido. Ficam no DOM sempre,
                      então leitor de tela lê a lista em qualquer estado.
                      O nome subiu para `display-3` e a linha de baixo para
                      `text-base` em 13/08, no mesmo pedido dos cartões maiores.

                      ⚠️ O CRO SAIU DA TELA no mesmo dia, a pedido do usuário —
                      "manter apenas a especialidade". O dado continua em
                      `m.cro`; ver a nota do tipo `BioMembro`, porque a
                      CFO-196/2019 exige número de inscrição na divulgação de
                      cirurgião-dentista. Voltar a exibir é uma linha aqui. */}
                  <div
                    className={cn(
                      "mt-3 text-center transition-opacity duration-500",
                      nomesVisiveis ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <p className="display-3 text-ink-foreground">{m.nome}</p>
                    <p className="mt-1 text-base leading-[1.35] text-ink-muted">
                      {m.especialidade}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Retrato do membro. Quadrado, e `object-[50%_22%]` é o mesmo
 * enquadramento da grade: mantém cabeça e ombros e corta só o fundo creme.
 */
function Retrato({ m, lado }: { m: BioMembro; lado: number }) {
  /* O LADO vem calculado do espaço disponível (ver a medição no componente pai),
     entre 88 e 176px. Era classe fixa de 96px e passou por 144 e 160 em duas rodadas
     de "aumentar os cards" — o que mostrou que o número certo não é escolhido, é
     derivado: o teto é `0,293·raioX`, o vão entre a peça diagonal e a lateral, e ele
     depende da largura do palco. Em 1440 dá 176px; em 1024, 128. */
  const comum =
    "shrink-0 overflow-hidden rounded-2xl border-2 border-ink-elevated shadow-[0_18px_40px_-14px_oklch(0_0_0/0.6)]";
  if (!m.retrato) {
    return (
      <div
        role="img"
        aria-label={m.retratoAlt}
        style={{ width: lado, height: lado }}
        className={cn(comum, "slot-grid-ink bg-ink-elevated")}
      />
    );
  }
  return (
    <img
      src={m.retrato}
      alt={m.retratoAlt}
      loading="lazy"
      width={lado}
      height={lado}
      style={{ width: lado, height: lado }}
      className={cn(comum, "object-cover object-[50%_22%]")}
    />
  );
}
