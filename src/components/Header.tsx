import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { HeaderContent, NavLink } from "@/content/types";
import { PillButton } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho em duas peças fixas independentes, ambas acompanhando o scroll:
 *
 * 1. A MARCA, no canto superior esquerdo, fora da navegação.
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
      className="group inline-flex h-5 shrink-0 items-start overflow-hidden text-sm"
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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      {/* Marca: peça própria, fixa no canto superior esquerdo */}
      <a
        href="#top"
        aria-label={data.wordmark}
        className="fixed left-4 top-4 z-50 md:left-8 md:top-6"
      >
        {logo ? (
          <img
            src={logo}
            alt={logoAlt ?? data.wordmark}
            className="h-11 w-auto md:h-14"
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
          "fixed right-4 top-4 z-50 md:left-1/2 md:right-auto md:top-6 md:-translate-x-1/2",
          "flex max-w-[calc(100%-7rem)] flex-col items-center md:max-w-none",
          "border border-ink-border bg-ink/75 px-5 py-3 backdrop-blur-md",
          redondo ? "rounded-full" : "rounded-2xl",
        )}
      >
        <div className="flex w-full items-center justify-end gap-x-8 md:justify-between md:gap-x-10">
          <nav className="hidden items-center gap-8 lg:flex">
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
                className="whitespace-nowrap rounded-lg px-2 py-2.5 text-sm text-ink-muted transition-colors hover:bg-ink-elevated hover:text-ink-foreground"
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
