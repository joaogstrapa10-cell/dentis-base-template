import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { AreaAtuacao } from "@/content/types";
import { IconeEspecialidade } from "@/components/IconesEspecialidade";
import { cn } from "@/lib/utils";

/**
 * ESPECIALIDADES em carrossel de duas metades: painel escuro com a lista das oito
 * à esquerda, pilha de fotos à direita. Veio de um template que o usuário mandou
 * em 19/08 ("coloque esse template na sessão de especialidades, com a identidade
 * da suzuki, as informações, e fotos que remetam a tal especialidade").
 *
 * ✅ ISSO TIRA A `GradeDeCelulas` DE UMA SEÇÃO. Ela servia TRÊS (Áreas,
 * Diferenciais, Tratamentos) e o §5.2 registrava que não podia servir uma quarta;
 * agora serve duas. Seis das treze seções sendo o mesmo molde foi exatamente o que
 * reprovou o layout como "cara de IA" em 25/07.
 *
 * ── O QUE ENTROU DO TEMPLATE E O QUE FICOU FORA ────────────────────────────────
 *
 * Entrou o GESTO: a lista vertical em que a ativa fica centrada, os cartões
 * empilhados com o vizinho espiando de lado, e a descrição sobre a foto.
 *
 * Ficaram fora, cada um por um motivo já pago neste projeto:
 *
 * · `motion/react` — o projeto NÃO tem dependência de animação, e é o mesmo
 *   argumento que barrou o GSAP em 19/08: essas bibliotecas escrevem a
 *   propriedade `transform` e o Tailwind v4 escreve `translate`/`scale`/`rotate`
 *   SEPARADAS, então misturar as duas famílias no mesmo elemento falha em
 *   silêncio. Aqui a interpolação é `transition` de CSS sobre `transform` inline
 *   — nenhum utilitário de transform nos mesmos elementos, de propósito.
 *
 * · `@hugeicons/*` — os oito ícones dentais já existem desenhados no projeto
 *   (`IconesEspecialidade.tsx`). Nenhuma biblioteca traz ícone dental, e ícone
 *   genérico em especialidade clínica é enfeite no lugar de informação. Instalar
 *   duas dependências para ter pizza, nuvem e celular numa clínica não se sustenta.
 *
 * · O azul `#62B2FE` do painel — azul-claro de consultório é clichê proibido no
 *   §4, e o mesmo tom já foi recusado em 19/08. O painel é o petróleo da Suzuki.
 *
 * · O rótulo "Live Session" em monoespaçada — mono nos metadados foi um dos quatro
 *   dispositivos de "ar de tecnologia" removidos em 03/08.
 *
 * · A pill "1 • Nome" sobre a foto — pill de tag está na lista do §5.2 do que não
 *   volta. O nome virou cabeçalho do cartão, que é o que ele é.
 *
 * · O `grayscale` nos cartões inativos — reprovado em 14/08 nos retratos do corpo
 *   clínico ("coloque no padrão que elas já estavam"). Aqui os vizinhos recuam por
 *   escala, posição e brilho — nunca tirando a cor.
 *
 * · `text-sm`, `text-lg`, `text-2xl`, `text-[11px]` — a escala fechou em cinco
 *   degraus em 03/08. Rótulo e descrição são `text-base`, o nome é `.display-3`.
 */

/** Altura de um slot da lista. É o passo do deslocamento vertical. */
const ITEM_H = 56;

/**
 * Quantos slots a janela mostra. SETE, e o número não é estético: com oito itens
 * a distância circular vai de -4 a 3, então exatamente UM item fica em |d|=4 —
 * e é nele que acontece o salto de baixo para cima do laço. Com a janela em 7 o
 * salto cai fora da área visível e os outros sete ficam na tela. Em 5 (o valor
 * que o template usa) três itens desapareceriam, e esconder três de oito
 * especialidades numa lista de navegação é perder informação, não economizar
 * espaço — a objeção de 03/08 contra o texto escondido no hover.
 */
const JANELA = 7;

/** Troca automática. 4,2s é o tempo de ler nome e descrição sem correr. */
const AUTO_MS = 4200;

/** Deslocamento lateral do cartão vizinho, em px NÃO escalados. Ver a nota da ordem
 *  das funções em `transform`, mais abaixo. */
const DESVIO_VIZINHO = 58;

/**
 * Distância circular de `i` até o ativo, no intervalo que mantém o laço curto:
 * o item que está a 7 passos para frente numa lista de 8 está a 1 para trás.
 */
function distanciaCircular(i: number, ativo: number, n: number) {
  let d = i - ativo;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

export function CarrosselEspecialidades({ itens }: { itens: AreaAtuacao[] }) {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [semMovimento, setSemMovimento] = useState(false);
  const idBase = useId();
  const botoes = useRef<Array<HTMLButtonElement | null>>([]);
  const n = itens.length;

  /* `prefers-reduced-motion` lido em efeito, não na renderização: no servidor não
     existe `matchMedia`, e o estado inicial `false` é o que o SSR emite. Quem pede
     menos movimento perde a troca automática e as transições — não perde conteúdo,
     porque a lista continua clicável e a descrição é texto permanente. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplica = () => setSemMovimento(mq.matches);
    aplica();
    mq.addEventListener("change", aplica);
    return () => mq.removeEventListener("change", aplica);
  }, []);

  useEffect(() => {
    if (pausado || semMovimento || n < 2) return;
    const t = window.setInterval(() => setAtivo((i) => (i + 1) % n), AUTO_MS);
    return () => window.clearInterval(t);
  }, [pausado, semMovimento, n]);

  /* Teclado. O template não tem nenhum: os itens dele são `<button>` mas a lista
     não é anunciada como grupo e as setas não andam entre eles. Aqui é o padrão de
     abas — setas nos dois eixos, Home e End —, o mesmo cuidado que o FAQ recebeu em
     12/08 quando o `<div onClick>` do template virou `<button>` com `aria-expanded`. */
  const aoTeclado = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      let alvo: number | null = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") alvo = (ativo + 1) % n;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") alvo = (ativo - 1 + n) % n;
      else if (e.key === "Home") alvo = 0;
      else if (e.key === "End") alvo = n - 1;
      if (alvo === null) return;
      e.preventDefault();
      setAtivo(alvo);
      botoes.current[alvo]?.focus();
    },
    [ativo, n],
  );

  const transicao = (ms: number, prop: string) =>
    semMovimento ? "none" : `${prop} ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  return (
    <div
      /* A pausa cobre mouse E foco: quem navega por teclado precisa que a lista
         pare de andar embaixo dele. `onFocusCapture` porque o foco cai nos
         botões, não neste contêiner. */
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
      className="relative isolate flex flex-col overflow-hidden rounded-3xl ring-1 ring-border md:rounded-[2rem] lg:flex-row"
    >
      {/* ── PAINEL ESQUERDO: a lista, sobre o petróleo ───────────────────────── */}
      <div className="relative bg-ink px-5 py-9 md:px-8 lg:w-[38%] lg:py-12">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Especialidades"
          onKeyDown={aoTeclado}
          className="relative"
          style={{ height: ITEM_H * JANELA }}
        >
          {itens.map((item, i) => {
            const d = distanciaCircular(i, ativo, n);
            const ativa = d === 0;
            /* Fora da janela o item fica invisível — e é nessa posição que o laço
               salta de uma ponta à outra. */
            const foraDaJanela = Math.abs(d) > (JANELA - 1) / 2;
            return (
              <div
                key={item.titulo}
                className="absolute left-0 flex items-center"
                style={{
                  height: ITEM_H,
                  top: `calc(50% - ${ITEM_H / 2}px)`,
                  transform: `translateY(${d * ITEM_H}px)`,
                  opacity: foraDaJanela ? 0 : ativa ? 1 : 0.72,
                  transition: semMovimento
                    ? "none"
                    : `${transicao(620, "transform")}, opacity 380ms ease`,
                }}
              >
                <button
                  ref={(el) => {
                    botoes.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${idBase}-aba-${i}`}
                  aria-controls={`${idBase}-painel`}
                  aria-selected={ativa}
                  /* Tabindex itinerante: a lista inteira é UMA parada de Tab, e as
                     setas andam dentro dela. */
                  tabIndex={ativa ? 0 : -1}
                  /* Item fora da janela é invisível: tirar do fluxo de clique evita
                     que o cursor pegue algo que não está na tela. */
                  aria-hidden={foraDaJanela || undefined}
                  onClick={() => setAtivo(i)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full border px-3.5 py-3 text-left transition-colors duration-300 md:gap-3 md:px-5",
                    foraDaJanela && "pointer-events-none",
                    ativa
                      ? "border-transparent bg-ink-foreground text-ink"
                      : "border-ink-border text-ink-muted hover:border-white/35 hover:text-ink-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0 transition-colors duration-300",
                      ativa ? "text-accent" : "text-ink-muted",
                    )}
                  >
                    <IconeEspecialidade nome={item.icone} />
                  </span>
                  {/* ⚠️ O TAMANHO VIVE AQUI, no rótulo, e não no botão — e a razão é
                      uma armadilha nova: no botão a classe passa pelo `cn()`, e o
                      tailwind-merge não conhece o token `text-small` do projeto. Ele
                      o classifica como cor de texto, o `text-ink`/`text-ink-muted`
                      que vem depois na mesma mesclagem o descarta, e o rótulo
                      renderiza a 16px sem erro nenhum. Medido: a classe simplesmente
                      não chegava ao DOM. Neste span não há classe de cor, então ela
                      sobrevive. (No `Footer.tsx` funciona porque lá vai em string
                      simples, sem `cn()`.)

                      E o degrau menor no celular NÃO é estética: "Implantodontia e
                      Cirurgia" mede 205px a 16px, e a coluna tem 240px numa janela de
                      320 — o rótulo era CORTADO. Nenhum teste padrão acusa isso: não
                      quebra em duas linhas, e o painel tem `overflow-hidden`, então
                      não gera rolagem. É a armadilha de 19/08 na assinatura da
                      abertura, e o único teste que pega é medir a LARGURA do elemento
                      contra a do contêiner. `text-small` é um dos degraus da escala,
                      não um tamanho novo. */}
                  <span className="whitespace-nowrap text-small md:text-base">
                    {item.titulo}
                  </span>
                </button>
              </div>
            );
          })}

          {/* Máscaras nas duas pontas, na cor do painel. É o que faz o item sair de
              cena em vez de ser cortado por uma aresta reta. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-ink via-ink/85 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink via-ink/85 to-transparent"
          />
        </div>
      </div>

      {/* ── PAINEL DIREITO: a pilha de fotos ─────────────────────────────────── */}
      <div /* O painel precisa EXISTIR na tela. Medido: `bg-surface-raised` (L 0.968)
            sobre `--background` (L 0.984) da 1,6% de diferenca — no render o lado
            direito lia como pagina vazia e o bloco parecia cortado ao meio. O
            petroleo a 5,5% da superficie visivel e amarra com o painel escuro ao
            lado, em vez de introduzir um cinza neutro que nao e da paleta. */
        className="relative flex flex-1 items-center justify-center bg-foreground/[0.055] px-4 py-8 md:px-8 md:py-10">
        <div
          role="tabpanel"
          id={`${idBase}-painel`}
          aria-labelledby={`${idBase}-aba-${ativo}`}
          /* 4:3 e não o 4:5 do template: as oito imagens do acervo são 1,5:1
             (uma é 1:1), e num retrato elas perderiam mais da metade da largura.
             É a armadilha de 12/08 e 13/08 — arquivo panorâmico em caixa vertical
             não se resolve com `object-position`. Em 4:3 o recorte é de 11% da
             largura nas 1,5:1 e de 25% da altura na quadrada. Conferido nas oito. */
          className="relative aspect-[4/3] w-full max-w-[34rem]"
        >
          {itens.map((item, i) => {
            const d = distanciaCircular(i, ativo, n);
            const ativa = d === 0;
            const vizinha = Math.abs(d) === 1;
            return (
              <div
                key={item.titulo}
                aria-hidden={!ativa}
                style={{
                  /* ⚠️ A ORDEM das funções decide o resultado: `translate3d` ANTES
                     de `scale` aplica a escala primeiro e o deslocamento depois, em
                     px NÃO escalados. Invertida, o desvio do vizinho viria
                     multiplicado por 0,88. Registrado em 19/08 na abertura. */
                  transform: `translate3d(${
                    ativa ? 0 : d < 0 ? -DESVIO_VIZINHO : DESVIO_VIZINHO
                  }px, 0, 0) scale(${ativa ? 1 : vizinha ? 0.91 : 0.78}) rotate(${
                    ativa ? 0 : d < 0 ? -3 : 3
                  }deg)`,
                  opacity: ativa ? 1 : vizinha ? 0.5 : 0,
                  zIndex: ativa ? 20 : vizinha ? 10 : 0,
                  transition: semMovimento
                    ? "none"
                    : `${transicao(700, "transform")}, opacity 500ms ease`,
                }}
                className={cn(
                  "absolute inset-0 overflow-hidden rounded-[1.5rem] md:rounded-[1.75rem]",
                  "shadow-[0_24px_60px_-30px_oklch(0.213_0.04_197_/_0.5)]",
                  !ativa && "pointer-events-none",
                )}
              >
                {item.imagem ? (
                  <img
                    src={item.imagem}
                    alt={item.imagemAlt}
                    /* A primeira é `eager` porque é a que está na tela quando a
                       seção aparece; as outras entram conforme o laço anda. */
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={cn(
                      "h-full w-full object-cover",
                      !semMovimento && "transition-[filter] duration-500",
                      /* Sem desfoque: sobre painel CLARO o borrao virava mancha cinza em vez
                         de profundidade — no template o painel era escuro. E sem
                         `grayscale`, que foi reprovado em 14/08. */
                      !ativa && "brightness-[0.82]",
                    )}
                  />
                ) : (
                  /* Sem arquivo, slot nomeado — mesmo padrão da Estrutura. É o
                     estado esperado nas variantes de Rogério e Décio. */
                  <div className="slot-grid flex h-full w-full items-end bg-surface p-4">
                    <span className="text-small text-muted">{item.titulo}</span>
                  </div>
                )}

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 pt-20 md:p-7 md:pt-24"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.16 0.03 197 / 0.94), oklch(0.16 0.03 197 / 0.5) 46%, transparent)",
                    opacity: ativa ? 1 : 0,
                    transition: semMovimento ? "none" : "opacity 400ms ease",
                  }}
                >
                  <h3 className="display-3 text-ink-foreground">{item.titulo}</h3>
                  <p className="mt-2 text-base leading-[1.5] text-ink-foreground/85">
                    {item.descricao}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
