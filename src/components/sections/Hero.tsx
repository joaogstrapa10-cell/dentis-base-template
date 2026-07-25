import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import type { HeroContent } from "@/content/types";

export function HeroSection({ data }: { data: HeroContent }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-40"
    >
      {/* Réguas verticais alinhadas ao grid. Substituem o par grid-pontilhado +
          glow radial, que juntos são o clichê visual de página gerada por IA. */}
      <div
        className="pointer-events-none absolute inset-0 rules-x rules-fade"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">{data.eyebrow}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 max-w-[20ch] font-medium leading-[1.02] tracking-[-0.035em] text-[clamp(2.25rem,6.4vw,5rem)] text-balance text-foreground">
            {data.headline}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-[62ch] text-base md:text-lg leading-[1.6] text-muted-foreground">
            {data.subheadline}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 bg-accent px-6 text-accent-foreground hover:bg-accent/90"
            >
              <a href={data.ctaPrimario.href} target="_blank" rel="noreferrer">
                {data.ctaPrimario.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-border-strong bg-transparent px-6 text-foreground hover:bg-surface hover:text-foreground"
            >
              <a href={data.ctaSecundario.href}>{data.ctaSecundario.label}</a>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <p className="mt-8 text-xs text-muted-foreground">{data.responsavelLinha}</p>
        </Reveal>
      </div>
    </section>
  );
}
