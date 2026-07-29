import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { HeaderContent, NavLink } from "@/content/types";
import { PillButton } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Header flutuante em pílula, adaptado de um componente do 21st.dev.
 *
 * O que foi mantido da ideia original:
 * - pílula fixa e centralizada, com backdrop-blur e borda hairline;
 * - a forma morfa de `rounded-full` para `rounded-2xl` quando o menu mobile
 *   abre, e só volta a arredondar 300ms depois de fechar — senão a borda
 *   "pula" antes do colapso terminar;
 * - link de navegação que desliza para revelar uma cópia mais clara de si.
 *
 * O que foi adaptado:
 * - cores fixas (`#333`, `#1f1f1f57`, `text-gray-300`) trocadas pelos tokens do
 *   projeto, para a replicação por sócio continuar sendo troca de token;
 * - o par LogIn/Signup virou o CTA único da clínica;
 * - todo texto vem de `clinica.ts`, incluindo os rótulos de acessibilidade.
 */

/** Link cujo rótulo desliza para cima revelando uma segunda cópia, mais clara. */
function AnimatedNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative inline-flex h-5 shrink-0 overflow-hidden text-sm"
    >
      {/* O empilhamento tem exatamente o dobro da altura do container, então
          -50% desloca uma linha inteira. Ancorado no topo, não centralizado:
          centralizar mostraria metade de cada cópia. */}
      <span className="flex flex-col transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <span className="flex h-5 items-center whitespace-nowrap leading-5 text-ink-muted">
          {children}
        </span>
        <span className="flex h-5 items-center whitespace-nowrap leading-5 text-ink-foreground">
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

  const marca = logo ? (
    <img src={logo} alt={logoAlt ?? data.wordmark} className="h-9 w-auto md:h-10" />
  ) : (
    <span className="text-sm font-semibold tracking-[-0.01em] text-ink-foreground">
      {data.wordmark}
    </span>
  );

  return (
    <header
      className={cn(
        "fixed left-1/2 top-4 z-50 -translate-x-1/2 md:top-6",
        "flex w-[calc(100%-1.5rem)] flex-col items-center md:w-auto",
        "border border-ink-border bg-ink/75 px-5 py-3 backdrop-blur-md",
        redondo ? "rounded-full" : "rounded-2xl",
      )}
    >
      <div className="flex w-full items-center justify-between gap-x-6 md:gap-x-10">
        <a href="#top" className="shrink-0" aria-label={data.wordmark}>
          {marca}
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
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
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Colapso do menu mobile. `max-h` grande o bastante para qualquer
          quantidade de itens, com opacidade acompanhando. */}
      <div
        className={cn(
          "flex w-full flex-col overflow-hidden transition-all duration-300 ease-in-out lg:hidden",
          open ? "max-h-[32rem] pt-5 opacity-100" : "pointer-events-none max-h-0 pt-0 opacity-0",
        )}
      >
        <nav className="flex w-full flex-col gap-1">
          {data.nav.map((item: NavLink) => (
            <a
              key={item.href + item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm text-ink-muted transition-colors hover:bg-ink-elevated hover:text-ink-foreground"
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
  );
}
