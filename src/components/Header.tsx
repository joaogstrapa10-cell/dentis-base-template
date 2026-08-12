import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { HeaderContent, NavLink } from "@/content/types";
import { PillButton } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho em duas peças fixas independentes, ambas acompanhando o scroll:
 *
 * 1. A MARCA, no alto à esquerda, fora da navegação e maior que ela.
 * 2. A PÍLULA de navegação, centralizada no desktop e à direita no mobile.
 *    À direita no mobile porque, centralizada e com a marca fixa à esquerda,
 *    as duas se sobreporiam em tela estreita.
 *
 * A pílula é adaptada de um componente do 21st.dev. Mantidas as ideias que a
 * definem: backdrop-blur com borda hairline, a forma morfando de `rounded-full`
 * para `rounded-2xl` quando o menu mobile abre (voltando a arredondar só 300ms
 * depois de fechar, senão a borda pula antes de o colapso terminar), e o rótulo
 * de navegação que desliza revelando uma cópia mais clara de si.
 *
 * Cores fixas do original trocadas por tokens, e todo texto vem de clinica.ts.
 */

/**
 * Rótulo que desliza para cima revelando uma segunda cópia, mais clara.
 *
 * Alturas explícitas e deslocamento absoluto, de propósito. A versão anterior
 * usava `-translate-y-1/2` sem fixar a altura do empilhamento: dentro de um
 * container `inline-flex`, o `align-items: stretch` esticava o empilhamento para
 * a altura da janela (20px) em vez de deixá-lo assumir os 40px do conteúdo.
 * Resultado: 50% valia 10px e o rótulo parava no meio do caminho, com metade de
 * cada cópia visível. Com `h-10` no empilhamento e `-translate-y-5`, o
 * deslocamento é sempre exatamente uma linha.
 */
function AnimatedNavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group inline-flex h-5 shrink-0 items-start overflow-hidden text-base"
    >
      <span
        className={cn(
          "flex h-10 flex-col",
          "transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover:-translate-y-5",
          "motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
        )}
      >
        <span className="flex h-5 shrink-0 items-center whitespace-nowrap leading-5 text-ink-muted">
          {children}
        </span>
        <span className="flex h-5 shrink-0 items-center whitespace-nowrap leading-5 text-ink-foreground">
          {children}
        </span>
      </span>
    </a>
  );
}

export function Header({
  data,
  logo,
  logoAlt,
}: {
  data: HeaderContent;
  /** Logo branco. `null` cai no wordmark em texto. */
  logo?: string | null;
  logoAlt?: string;
}) {
  const [open, setOpen] = useState(false);
  const [redondo, setRedondo] = useState(true);
  const [opacidadeMarca, setOpacidadeMarca] = useState(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* A marca se apaga ao longo dos primeiros 180px de scroll.
     Começa em 1 no servidor: sem isso a marca piscaria de invisível para
     visível na hidratação. Leitura dentro de requestAnimationFrame porque
     `scrollY` num listener de scroll força layout a cada evento. */
  useEffect(() => {
    let raf = 0;
    const aoRolar = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setOpacidadeMarca(Math.max(0, Math.min(1, 1 - window.scrollY / 180)));
      });
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (open) {
      setRedondo(false);
    } else {
      timer.current = setTimeout(() => setRedondo(true), 300);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open]);

  return (
    <>
      {/* Marca: `absolute` e se apagando ao rolar.

          Ela ficou `fixed` por uma rodada e foi um erro visível: parada no topo
          enquanto a página sobe, a marca semitransparente passava POR CIMA da
          headline do hero. Aos 135px de scroll o fantasma cinza do logo ficava
          escrito sobre "Odontologia de alta complexidade" — foi isso que o
          usuário viu como "efeito de sombra". Verificado por recorte da mesma
          região da tela em seis posições de scroll.

          Com `absolute` a marca viaja junto com o conteúdo, então não há como
          sobrepor texto: ela sai de cena pelo topo e o fade só dissolve o que já
          está saindo. Continua "livre" no sentido pedido — vive no nível da
          página, fora da pílula e fora do cartão do hero.

          O fade tem função além do efeito: o logo é monocromático BRANCO, e
          garantir que ele desapareça impede que sobre visível sobre as seções
          claras.

          `opacity` vem do scroll, sem `transition`: a transição brigaria com o
          valor já contínuo e daria atraso na resposta. `pointer-events` cai
          junto, senão sobra um link invisível capturando clique no topo. */}
      <a
        href="#top"
        aria-label={data.wordmark}
        // `top` calculado para o CENTRO da marca cair no centro da pílula, não
        // escolhido a olho: a pílula em `top-4`/`md:top-8` fecha 58px/66px de
        // altura, com centro em 45px/65px; a marca tem 56px/80px, o que dá
        // `top-4` e `top-6`. Sobra 1px de resíduo — os 2px a mais da pílula são
        // a borda hairline, e corrigir isso custaria um `top-[25px]` para
        // ganhar meio pixel. Mudar a altura da marca ou o padding da pílula
        // exige refazer esta conta.
        //
        // A marca encolhe para 56px na faixa `lg` (1024–1279) e o `top` desce
        // para 36px para o centro continuar em 65px. Isso não é gosto: a pílula
        // é centralizada na janela e a navegação só existe a partir de `lg`, e
        // com a marca a 80px o par COLIDIA — medido em 1024, a pílula começava
        // em 230px e a marca terminava em 238px, com o "SUZUKI" coberto.
        //
        // Foi para 64px quando a navegação tinha quatro itens, e para 56px
        // quando "Home" entrou em 12/08: cada item novo alarga a pílula pelos
        // dois lados, e um item de 74px come 37px da folga esquerda. Volta aos
        // 80px em `xl`, onde sobram 80px de folga.
        className="fixed left-6 top-4 z-50 md:left-14 md:top-6 lg:top-9 xl:top-6"
        style={{
          opacity: opacidadeMarca,
          pointerEvents: opacidadeMarca < 0.05 ? "none" : undefined,
        }}
        aria-hidden={opacidadeMarca < 0.05 || undefined}
        tabIndex={opacidadeMarca < 0.05 ? -1 : undefined}
      >
        {logo ? (
          <img
            src={logo}
            alt={logoAlt ?? data.wordmark}
            // Sombra suave: é o que faz a marca ler como peça solta sobre o
            // bloco, e não como algo impresso nele.
            className="h-14 w-auto drop-shadow-[0_2px_14px_oklch(0_0_0/0.45)] md:h-20 lg:h-14 xl:h-20"
          />
        ) : (
          <span className="text-base font-semibold tracking-[-0.01em] text-ink-foreground">
            {data.wordmark}
          </span>
        )}
      </a>

      {/* Pílula de navegação */}
      <header
        className={cn(
          // Centralizada de verdade (`left-1/2`). Estava deslocada 8% à direita
          // para se afastar do logo; o usuário viu isso como "para a direita
          // demais" em 30/07. Com o logo descido, o encosto não acontece mais.
          "fixed right-4 top-4 z-50 md:left-1/2 md:right-auto md:top-8 md:-translate-x-1/2",
          "flex max-w-[calc(100%-7rem)] flex-col items-center md:max-w-none",
          // Quase opaca, e isso é requisito de contraste, não gosto. A pílula é
          // `fixed`: ela atravessa as seções claras, e a 75% de opacidade o
          // fundo claro subia por baixo dela. Medido por amostragem do pixel do
          // render ao lado do próprio rótulo, em três posições de scroll:
          // sobre o hero escuro 7,54:1 nas duas opacidades, mas sobre seção
          // clara 3,52:1 a 75% (reprova, o rótulo tem 14px) contra 6,58:1 a
          // 95%. O `backdrop-blur` continua, pela borda de vidro.
          "border border-ink-border bg-ink/95 px-5 py-3 backdrop-blur-md",
          redondo ? "rounded-full" : "rounded-2xl",
        )}
      >
        {/* Os vãos apertam na faixa `lg` e voltam em `xl`, pela mesma colisão
            descrita na marca: como a pílula é centralizada, cada pixel que ela
            perde de largura devolve meio pixel de folga em CADA lado, e nos
            rótulos de uma linha só o aperto não se percebe. */}
        <div className="flex w-full items-center justify-end gap-x-8 md:justify-between lg:gap-x-6 xl:gap-x-10">
          <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
            {data.nav.map((item: NavLink) => (
              <AnimatedNavLink key={item.href + item.label} href={item.href}>
                {item.label}
              </AnimatedNavLink>
            ))}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <PillButton
              label={data.cta.label}
              href={data.cta.href}
              tone="light"
              external
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? data.ariaFecharMenu : data.ariaAbrirMenu}
            aria-expanded={open}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "flex w-full flex-col overflow-hidden transition-all duration-300 ease-in-out lg:hidden",
            open
              ? "max-h-[32rem] pt-5 opacity-100"
              : "pointer-events-none max-h-0 pt-0 opacity-0",
          )}
        >
          <nav className="flex w-full flex-col gap-1">
            {data.nav.map((item: NavLink) => (
              <a
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="whitespace-nowrap rounded-lg px-2 py-2.5 text-base text-ink-muted transition-colors hover:bg-ink-elevated hover:text-ink-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 w-full">
            <PillButton
              label={data.cta.label}
              href={data.cta.href}
              tone="light"
              external
              className="w-full justify-center"
            />
          </div>
        </div>
      </header>
    </>
  );
}
