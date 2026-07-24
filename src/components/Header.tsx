import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeaderContent } from "@/content/types";
import { cn } from "@/lib/utils";

export function Header({ data }: { data: HeaderContent }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border/60 backdrop-blur-xl transition-colors",
        scrolled ? "bg-background/80" : "bg-background/40",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="text-sm font-medium tracking-[-0.01em] text-foreground">
          {data.wordmark}
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {data.nav.map((item) => (
            <a
              key={item.href + item.label}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <a href={data.cta.href} target="_blank" rel="noreferrer">
              {data.cta.label}
            </a>
          </Button>
          <button
            type="button"
            aria-label={open ? data.ariaFecharMenu : data.ariaAbrirMenu}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-6 py-4 md:px-10">
            {data.nav.map((item) => (
              <a
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <a
              href={data.cta.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground"
            >
              {data.cta.label}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
