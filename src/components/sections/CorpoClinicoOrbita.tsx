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
 *   Ficou fio de petróleo na de fora, dourado na do meio e degradê
 *   petróleo→dourado na de dentro.
 * - O raio e o tamanho dos cartões são MEDIDOS do palco, não cravados em 300px.
 *   Com valor fixo, em janela baixa os retratos saíam da área visível — e o palco
 *   é `sticky`, então "sair" ali significa ficar escondido para sempre.
 * - `transform: translate(...)` do template virou a propriedade `translate`. No
 *   Tailwind v4 é ela que os utilitários usam, e misturar as duas faz uma
 *   sobrescrever a outra em silêncio. Aqui a centralização (`-50%`) e o
 *   deslocamento radial vivem na MESMA declaração, por isso não há conflito.
 *
 * ---------------------------------------------------------------------------
 * SÓ EM TELA LARGA, E NÃO É PREGUIÇA
 * ---------------------------------------------------------------------------
 * A órbita precisa de `2·raio + cartão + rótulo` de largura. Com o rótulo em 144px
 * e o cartão em 96px, sobram 350px úteis num celular de 390px — o raio cairia para
 * ~55px e os retratos ficariam empilhados uns sobre os outros. Abaixo de `lg` a
 * seção usa a GRADE de sempre, que está no `Bio.tsx`. Duas formas para o mesmo
 * conteúdo, escolhidas pelo espaço disponível.
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
  const [progresso, setProgresso] = useState(0);
  const [raio, setRaio] = useState(0);
  const [semMovimento, setSemMovimento] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemMovimento(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  /* Raio a partir do palco medido. As folgas são o meio-cartão mais o espaço do
     rótulo — sem elas o retrato de baixo encosta na borda e o nome é cortado. */
  useEffect(() => {
    const medir = () => {
      const el = palco.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const porLargura = r.width / 2 - 56 - 76;
      const porAltura = r.height / 2 - 56 - 64;
      setRaio(Math.max(0, Math.min(porLargura, porAltura)));
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

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
  const distancia = raio * (0.32 + 0.68 * suave);

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
      <div className="sticky top-0 flex h-screen max-h-[52rem] items-center justify-center pb-6 pt-24">
        <div
          ref={palco}
          className="relative flex h-full w-full items-center justify-center"
        >
          {/* ---------- Os três anéis, um por cor ---------- */}
          {/* De fora: o fio claro do bloco (`--ink-border`, branco a 12%). É o mais
              discreto dos três de propósito — ele só fecha a composição. */}
          <div
            aria-hidden="true"
            style={{ width: raio * 2, height: raio * 2 }}
            className={cn(
              "absolute rounded-full border transition-all duration-700",
              anelExternoVisivel ? "border-ink-border" : "border-transparent",
            )}
          />
          {/* Do meio: dourado. É o ornamento da identidade, e sobre fundo escuro é
              onde ele pode aparecer — ver a nota dos dois accents no
              docs/referencia-layout.md. */}
          <div
            aria-hidden="true"
            style={{ width: raio * 2 * ANEL_MEIO, height: raio * 2 * ANEL_MEIO }}
            className={cn(
              "absolute rounded-full border transition-all duration-700",
              anelMeioVisivel ? "border-gold/40" : "border-transparent",
            )}
          />
          {/* De dentro: degradê petróleo→dourado, com 1px de espessura. É o único
              que existe desde o começo: é o núcleo de onde os retratos saem. */}
          <div
            aria-hidden="true"
            style={{ width: raio * 2 * ANEL_INTERNO, height: raio * 2 * ANEL_INTERNO }}
            className="absolute rounded-full bg-gradient-to-br from-accent via-gold to-accent p-px"
          >
            <div className="h-full w-full rounded-full bg-ink" />
          </div>

          {/* ---------- Texto do centro ---------- */}
          <div
            className={cn(
              "absolute z-20 max-w-[18rem] px-4 text-center transition-opacity duration-700",
              centroVisivel ? "opacity-100" : "opacity-0",
            )}
          >
            <p className="display-3 text-ink-foreground">{label}</p>
            <p className="mt-3 text-small leading-[1.5] text-ink-muted">{nota}</p>
          </div>

          {/* ---------- Os retratos em órbita ---------- */}
          <ul className="contents">
            {membros.map((m, i) => {
              /* Começa em -90° (meio-dia) e gira no sentido do relógio, então a
                 ordem visual bate com a ordem da lista lida em voz alta. */
              const angulo = (i / membros.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angulo) * distancia;
              const y = Math.sin(angulo) * distancia;
              return (
                <li
                  key={m.nome}
                  style={{
                    /* Centralização e deslocamento na MESMA declaração: são a
                       mesma propriedade, e separá-los faria uma apagar a outra. */
                    translate: `calc(-50% + ${x}px) calc(-50% + ${y}px)`,
                    zIndex: 10,
                  }}
                  className="absolute left-1/2 top-1/2 flex w-36 flex-col items-center transition-[translate] duration-300 ease-out"
                >
                  <Retrato m={m} />
                  {/* Nome e credencial embaixo do cartão, aparecendo quando a
                      órbita termina de abrir — foi o pedido. Ficam no DOM sempre,
                      então leitor de tela lê a lista em qualquer estado. */}
                  <div
                    className={cn(
                      "mt-3 text-center transition-opacity duration-500",
                      nomesVisiveis ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <p className="text-base font-medium leading-[1.25] text-ink-foreground">
                      {m.nome}
                    </p>
                    <p className="mt-1 text-small leading-[1.35] text-ink-muted">
                      {m.credencial}
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
 * Retrato do membro. Quadrado e pequeno aqui — nesta seção o retrato é o objeto
 * que se move, e o nome embaixo é que identifica. `object-[50%_22%]` é o mesmo
 * enquadramento da grade: mantém cabeça e ombros e corta só o fundo creme.
 */
function Retrato({ m }: { m: BioMembro }) {
  const comum =
    "h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-ink-elevated shadow-[0_18px_40px_-14px_oklch(0_0_0/0.6)] 2xl:h-28 2xl:w-28";
  if (!m.retrato) {
    return (
      <div
        role="img"
        aria-label={m.retratoAlt}
        className={cn(comum, "slot-grid-ink bg-ink-elevated")}
      />
    );
  }
  return (
    <img
      src={m.retrato}
      alt={m.retratoAlt}
      loading="lazy"
      className={cn(comum, "object-cover object-[50%_22%]")}
    />
  );
}
