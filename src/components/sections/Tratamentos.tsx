import { Check } from "lucide-react";
import type { TratamentosContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TratamentosSection({ data }: { data: TratamentosContent }) {
  return (
    <Section id="tratamentos">
      <SectionHeader eyebrow={data.eyebrow} titulo={data.titulo} descricao={data.descricao} />

      <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {data.cards.map((card, idx) => (
          <Reveal key={card.titulo} delay={idx * 70}>
            <article
              className={cn(
                "relative flex h-full flex-col rounded-2xl border bg-surface p-6 md:p-8",
                card.destaque ? "border-accent" : "border-border",
              )}
            >
              {card.badge ? (
                <span className="absolute -top-3 left-6 rounded-full border border-accent bg-background px-3 py-1 text-[10px] text-accent">
                  {card.badge}
                </span>
              ) : null}

              <h3 className="text-xl font-medium tracking-[-0.01em] text-foreground">
                {card.titulo}
              </h3>
              <p className="mt-3 text-sm leading-[1.6] text-muted-foreground">{card.descricao}</p>

              <p className="mt-6 text-xs text-accent">
                {card.valorLabel}
              </p>

              <ul className="mt-6 space-y-2.5">
                {card.inclui.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.25} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex-1" />

              <Button
                asChild
                className={cn(
                  "mt-2 h-11",
                  card.destaque
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "border border-border bg-transparent text-foreground hover:bg-surface-raised",
                )}
              >
                <a href={card.cta.href} target="_blank" rel="noreferrer">
                  {card.cta.label}
                </a>
              </Button>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
