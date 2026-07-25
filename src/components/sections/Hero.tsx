import type { ReactNode } from "react";
import type { HeroContent } from "@/content/types";
import { PillButton, TextLink, GhostWord } from "@/components/Primitives";
import { Reveal } from "@/components/Reveal";

/**
 * Layout do hero segue a referência: um CARTÃO ESCURO arredondado encaixado
 * dentro da página clara, com o header dentro dele, headline à esquerda e
 * subheadline + CTA numa segunda coluna à direita. O wordmark gigante
 * translúcido é cortado pela borda inferior do cartão.
 */
export function HeroSection({
  data,
  ghostWord,
  header,
}: {
  data: HeroContent;
  ghostWord: string;
  header?: ReactNode;
}) {
  return (
    <section id="top" className="px-3 pt-3 md:px-4 md:pt-4">
      <div className="relative isolate overflow-hidden rounded-3xl bg-ink ink-grid">
        {/* Arco de luz na base — o accent aparece aqui como atmosfera, não como área */}
        <div
          aria-hidden="true"
          className="ink-arc pointer-events-none absolute inset-0 opacity-45"
        />

        {header ? <div className="relative z-20">{header}</div> : null}

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-40 pt-14 md:px-10 md:pb-56 md:pt-20">
          <Reveal>
            <p className="font-mono inline-flex items-center rounded-full border border-ink-border bg-ink-elevated/70 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-ink-muted backdrop-blur">
              {data.eyebrow}
            </p>
          </Reveal>

          <div className="mt-9 grid gap-10 md:mt-12 md:grid-cols-[1.35fr_1fr] md:gap-16">
            <h1 className="font-bold leading-[1.02] tracking-[-0.035em] text-[clamp(1.875rem,4.1vw,3.25rem)] text-ink-foreground">
              {data.headline.map((linha, i) => (
                <span key={i} className="line-mask">
                  <span
                    className="line-rise"
                    style={{ animationDelay: `${120 + i * 110}ms` }}
                  >
                    {linha}
                  </span>
                </span>
              ))}
            </h1>

            <div className="md:pt-3">
              <Reveal delay={220}>
                <p className="max-w-[46ch] text-base leading-[1.65] text-ink-muted md:text-[1.0625rem]">
                  {data.subheadline}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <PillButton
                    label={data.ctaPrimario.label}
                    href={data.ctaPrimario.href}
                    tone="light"
                    external
                  />
                  <TextLink
                    label={data.ctaSecundario.label}
                    href={data.ctaSecundario.href}
                    tone="light"
                  />
                </div>
              </Reveal>
              <Reveal delay={380}>
                <p className="font-mono mt-8 text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                  {data.responsavelLinha}
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        <GhostWord className="bottom-0 left-0 translate-y-[26%] px-5 md:px-10">
          {ghostWord}
        </GhostWord>
      </div>
    </section>
  );
}
