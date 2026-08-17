import { useEffect, useRef, useState } from "react";
import type { ArcadaContent, ArcadaEtapa } from "@/content/types";

/**
 * Arcada: sequência de quadros comandada pela ROLAGEM, com a mídia crescendo
 * conforme avança. Do template que o usuário mandou em 17/08
 * (`scroll-expansion-hero`) entrou o gesto — mídia que se expande e título que se
 * abre em duas metades — e NÃO entrou a mecânica, que é destrutiva aqui.
 *
 * ⚠️ POR QUE A MECÂNICA DO TEMPLATE NÃO PODE ENTRAR. Ele registra `wheel` e
 * `touchmove` com `preventDefault` e chama `window.scrollTo(0, 0)` a cada evento
 * de scroll, ou seja CONGELA a página até a mídia terminar de expandir. No
 * template isso funciona porque o componente É a página inteira. Aqui ele seria
 * uma seção entre doze: travaria o topo da home, e morreriam as âncoras do menu,
 * as três esteiras e todo o resto abaixo. É parente do defeito da órbita de 13/08
 * (progresso lido de `window.scrollY` numa seção que não é a primeira), mas pior
 * — aquela animava errado, esta bloqueia a navegação.
 *
 * O que entrou no lugar, e é o mesmo mecanismo que a órbita provou: o progresso
 * vem da fração que o TRILHO DESTA SEÇÃO já rolou por dentro de si, lida em
 * `requestAnimationFrame`. Nada de `preventDefault`, nada de `scrollTo`. A página
 * rola normalmente; a seção só observa.
 *
 * ⚠️ E o palco é `sticky`, então NENHUM ancestral pode ter `overflow` diferente de
 * `visible` — ancestral com overflow vira o contêiner de rolagem do sticky e, como
 * ele não rola, o palco não gruda. Foi por isso que o bloco da Bio perdeu o
 * `overflow-hidden` em 13/08. Aqui: o trilho e a faixa escura ficam SEM overflow,
 * e é por isso que a faixa é arredondada sem clipar — nada precisa ser cortado,
 * porque a mídia é centralizada e sempre menor que a faixa.
 *
 * Por que quadros e não vídeo: ver a nota do tipo `ArcadaEtapa`. Em resumo, a
 * ordem "um dente após o outro" passa a ser o índice de um array em vez de um
 * pedido que o modelo de vídeo erra.
 *
 * Acessibilidade:
 * - sob `prefers-reduced-motion` a seção não anima nada. O trilho perde a altura
 *   extra, o palco deixa de ser `sticky` e as cinco etapas viram uma LISTA, cada
 *   quadro com a sua legenda. Animação comandada por rolagem é exatamente o caso
 *   que a WCAG 2.3.3 pede para poder desligar — e desligar aqui não pode custar
 *   conteúdo, porque a sequência É o conteúdo;
 * - a régua de etapas usa `aria-current` na etapa ativa, então quem navega por
 *   leitor de tela sabe onde a sequência está;
 * - os quadros inativos ficam `aria-hidden`: são o mesmo assunto em cinco estados,
 *   e anunciar os cinco alt de uma vez não descreve nada.
 */

/** Um quadro, ou o slot nomeado enquanto o arquivo não existe. */
function Quadro({
  etapa,
  slotRotulo,
  prioridade,
}: {
  etapa: ArcadaEtapa;
  slotRotulo: string;
  prioridade: boolean;
}) {
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
  return (
    <img
      src={etapa.src}
      alt={etapa.alt}
      /* O primeiro quadro é o que aparece em repouso, então ele não pode ser
         lazy: chegaria depois da seção já estar na tela. Os outros quatro são
         lazy porque só existem depois de a rolagem avançar. */
      loading={prioridade ? "eager" : "lazy"}
      className="h-full w-full object-cover"
    />
  );
}

/** Régua das etapas. Fora do palco animado, para o texto não tremer. */
function Regua({
  etapas,
  ativa,
  aoEscolher,
}: {
  etapas: ArcadaEtapa[];
  ativa: number;
  aoEscolher?: (i: number) => void;
}) {
  return (
    <ol className="flex flex-col gap-0">
      {etapas.map((e, i) => {
        const atual = i === ativa;
        return (
          <li key={e.rotulo}>
            <button
              type="button"
              /* Clicável de propósito: numa sequência comandada por rolagem, quem
                 quer rever a etapa 2 não deveria ter que caçar a altura certa da
                 página. O clique rola até a fração correspondente do trilho. */
              onClick={aoEscolher ? () => aoEscolher(i) : undefined}
              aria-current={atual ? "step" : undefined}
              className="group flex w-full items-baseline gap-4 border-t border-ink-border py-4 text-left transition-colors last:border-b hover:bg-ink-elevated/60"
            >
              <span
                className={
                  atual
                    ? "w-6 shrink-0 text-small text-gold"
                    : "w-6 shrink-0 text-small text-ink-muted"
                }
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span
                  className={
                    atual
                      ? "block display-3 text-ink-foreground"
                      : "block display-3 text-ink-muted"
                  }
                >
                  {e.rotulo}
                </span>
                {/* A descrição só aparece na etapa ativa. Não é texto escondido no
                    hover — o defeito que derrubou as Áreas em 03/08 — porque a
                    etapa ativa é decidida pela rolagem, então o texto se revela
                    para quem rola, sem depender de ponteiro. */}
                {atual ? (
                  <span className="mt-2 block text-base leading-[1.6] text-ink-muted">
                    {e.descricao}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function ArcadaSection({ data }: { data: ArcadaContent }) {
  const trilhoRef = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  const [semAnimacao, setSemAnimacao] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemAnimacao(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  useEffect(() => {
    if (semAnimacao) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const trilho = trilhoRef.current;
      if (!trilho) return;
      const r = trilho.getBoundingClientRect();
      /* Curso = quanto o trilho tem de altura ALÉM da janela. É esse excedente
         que a rolagem consome enquanto o palco está grudado, e é por isso que o
         progresso não pode vir de `window.scrollY`: esta seção é a oitava da
         página, e `scrollY` já vale alguns milhares de pixels quando ela
         aparece — a sequência nasceria terminada. */
      const curso = r.height - window.innerHeight;
      if (curso <= 0) {
        setP(0);
        return;
      }
      const bruto = -r.top / curso;
      setP(bruto < 0 ? 0 : bruto > 1 ? 1 : bruto);
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

  const total = data.etapas.length;
  /* Índice da etapa. `p` chega a 1 exatamente no fim do trilho, e `floor(1 * 5)`
     daria 5 — um a mais que existe. O `min` é o que segura isso. */
  const ativa = Math.min(total - 1, Math.floor(p * total));

  /* A expansão termina antes da sequência: a mídia chega ao tamanho cheio em 40%
     do trilho e os 60% restantes passam as etapas já em tamanho grande. Ao
     contrário do template, que estica a caixa de 300×400 para 1550×800 e portanto
     DEFORMA a proporção, aqui só a largura cresce e o quadro fica travado em
     16:9 — que é a proporção nativa dos arquivos, então o recorte é zero. */
  const abertura = Math.min(1, p / 0.4);
  const suave = 1 - (1 - abertura) * (1 - abertura);
  const escala = 0.58 + 0.42 * suave;

  /* As duas metades do título se afastam e somem, cedendo a cena para a mídia.
     No template o deslocamento é em `vw` (150vw!) e o texto atravessa a tela; em
     `rem` ele se abre sem virar acrobacia. */
  const desloca = suave * 3.5;
  const opacidadeTitulo = Math.max(0, 1 - p / 0.32);

  const palavras = data.titulo.split(" ");
  const primeira = palavras[0] ?? "";
  const resto = palavras.slice(1).join(" ");

  function irPara(i: number) {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    const curso = trilho.offsetHeight - window.innerHeight;
    if (curso <= 0) {
      trilho.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    /* Meio da faixa da etapa, e não o começo: cair na fronteira exata deixa a
       régua oscilando entre duas etapas com um pixel de rolagem. */
    const alvo = ((i + 0.5) / total) * curso;
    window.scrollTo({
      top: trilho.offsetTop + alvo,
      behavior: "smooth",
    });
  }

  /* ── Sem animação: as cinco etapas viram lista, cada quadro com sua legenda.
     Desligar o movimento não pode custar a sequência, porque a sequência é o
     conteúdo. ── */
  if (semAnimacao) {
    return (
      <section id="arcada" className="scroll-mt-12 px-3 md:px-4">
        <div className="rounded-3xl bg-ink py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
            <h2 className="display-2 text-ink-foreground">{data.titulo}</h2>
            <p className="mt-5 max-w-[44rem] text-base leading-[1.65] text-ink-muted">
              {data.descricao}
            </p>
            <ol className="mt-12 flex flex-col gap-12">
              {data.etapas.map((e, i) => (
                <li key={e.rotulo}>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl border border-ink-border bg-ink-elevated">
                    <Quadro
                      etapa={e}
                      slotRotulo={data.slotRotulo}
                      prioridade={i === 0}
                    />
                  </div>
                  <p className="mt-5 flex items-baseline gap-4">
                    <span className="text-small text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block display-3 text-ink-foreground">
                        {e.rotulo}
                      </span>
                      <span className="mt-2 block text-base leading-[1.6] text-ink-muted">
                        {e.descricao}
                      </span>
                    </span>
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-12 max-w-[52rem] text-small leading-[1.55] text-ink-muted">
              {data.aviso}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    /* Faixa escura sangrada, no vocabulário da Bio e da Chamada final: goteira
       lateral, canto de 24px, e SEM `overflow-hidden` — ver o aviso do topo, é o
       que permite o `sticky` funcionar. */
    <section id="arcada" className="scroll-mt-12 px-3 md:px-4">
      <div className="rounded-3xl bg-ink">
        {/*
          Trilho: 260vh, ou seja 160vh de curso para cinco etapas — ~32vh de
          rolagem por etapa, que é pouco mais de um terço de tela cada. Menos que
          isso e a etapa passa antes de ser lida; mais e a seção domina a página.
          Custo medido em telas está no CLAUDE.md.
        */}
        <div ref={trilhoRef} className="relative h-[260vh]">
          <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
            <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
              {/* Título: duas metades que se afastam e somem. `pointer-events-none`
                  porque depois de invisível ele continua ocupando a caixa e
                  interceptaria o clique na régua. */}
              <div
                aria-hidden={p > 0.32 || undefined}
                className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-5 text-center md:px-10"
                style={{ opacity: opacidadeTitulo }}
              >
                <span
                  className="block display-2 text-ink-foreground"
                  style={{ translate: `-${desloca}rem 0` }}
                >
                  {primeira}
                </span>
                {resto ? (
                  <span
                    className="block display-2 text-ink-foreground"
                    style={{ translate: `${desloca}rem 0` }}
                  >
                    {resto}
                  </span>
                ) : null}
              </div>

              <div className="grid items-center gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
                {/* Palco da mídia. A largura cresce; a proporção não muda. */}
                <div className="relative mx-auto w-full" style={{ maxWidth: `${escala * 100}%` }}>
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-ink-border bg-ink-elevated">
                    {data.etapas.map((e, i) => (
                      <div
                        key={e.rotulo}
                        aria-hidden={i !== ativa || undefined}
                        /* Todos os quadros empilhados e trocados por opacidade:
                           trocar o `src` de um único <img> pisca no primeiro
                           acesso de cada etapa, porque o arquivo novo só decodifica
                           depois de pedido. Empilhado, a troca é instantânea. */
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: i === ativa ? 1 : 0 }}
                      >
                        <Quadro
                          etapa={e}
                          slotRotulo={data.slotRotulo}
                          prioridade={i === 0}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Barra de progresso do trilho. Diz que a seção tem fim — sem
                      ela, uma faixa que não rola junto lê como página travada, que
                      é a suspeita que o template de fato merecia. */}
                  <div
                    className="mt-4 h-px w-full bg-ink-border"
                    role="presentation"
                  >
                    <div
                      className="h-px bg-gold transition-[width] duration-200"
                      style={{ width: `${p * 100}%` }}
                    />
                  </div>
                </div>

                {/* Régua: só entra quando o título já saiu, para as duas coisas não
                    disputarem a mesma faixa da tela. */}
                <div
                  className="transition-opacity duration-500"
                  style={{ opacity: p > 0.28 ? 1 : 0 }}
                  aria-hidden={p <= 0.28 || undefined}
                >
                  <Regua
                    etapas={data.etapas}
                    ativa={ativa}
                    aoEscolher={irPara}
                  />
                  <p className="mt-6 text-small leading-[1.55] text-ink-muted">
                    {data.aviso}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
