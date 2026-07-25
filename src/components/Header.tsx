import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { HeaderContent } from "@/content/types";
import { PillButton } from "@/components/Primitives";

/**
 * O header vive DENTRO do cartão escuro do hero (não é fixo), como na
 * referência: wordmark à esquerda, navegação centralizada, CTA à direita.
 * Por isso todos os tokens aqui são da família `ink-*`.
 */
export function Header({ data }: { data: HeaderContent }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-ink-border">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between gap-6 px-5 md:px-10">
        <a
          href="#top"
          className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink-foreground"
        >
          {data.wordmark}
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {data.nav.map((item) => (
            <a
              key={item.href + item.label}
              href={item.href}
              className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <PillButton
              label={data.cta.label}
              href={data.cta.href}
              tone="light"
              external
            />
          </div>
          <button
            type="button"
            aria-label={open ? data.ariaFecharMenu : data.ariaAbrirMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-border text-ink-foreground transition-colors duration-300 hover:bg-ink-elevated lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-ink-border lg:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-5 py-4 md:px-10">
            {data.nav.map((item) => (
              <a
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-ink-muted transition-colors hover:bg-ink-elevated hover:text-ink-foreground"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 sm:hidden">
              <PillButton
                label={data.cta.label}
                href={data.cta.href}
                tone="light"
                external
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
