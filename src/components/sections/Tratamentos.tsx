import { Check } from "lucide-react";
import type { TratamentosContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { PillButton, TextLink } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Estrutura: UM card largo dividido por fios verticais — não três cards soltos.
 *
 * Três caixas idênticas lado a lado era o quarto grid igual da página. Aqui os
 * eixos de tratamento vivem dentro de uma única superfície, separados por
 * hairline; a coluna em destaque se distingue por FUNDO, não por borda colorida
 * e badge flutuante. Menos enfeite, mais hierarquia.
 */
export function TratamentosSection({ data }: { data: TratamentosContent }) {
  return (
    <Section id="tratamentos">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <Reveal delay={80}>
        <div className="mt-16 overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="grid md:grid-cols-3">
            {data.cards.map((card, i) => (
              <div
                key={card.titulo}
                className={cn(
                  "flex flex-col p-7 md:p-9",
                  // fio entre colunas, sem borda externa duplicada
                  i > 0 && "border-t border-border md:border-l md:border-t-0",
                  card.destaque && "bg-surface-raised",
                )}
              >
                <div className="flex items-center gap-3">
                  <h3 className="display-3 text-foreground">{card.titulo}</h3>
                  {card.badge ? (
                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">
                      {card.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-[0.9375rem] leading-[1.65] text-muted">
                  {card.descricao}
                </p>

                <p className="mt-7 border-t border-border pt-5 text-sm text-foreground">
                  {card.valorLabel}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {card.inclui.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-foreground">
                      <Check
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-accent"
                        strokeWidth={3}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-9">
                  {card.destaque ? (
                    <PillButton label={card.cta.label} href={card.cta.href} external />
                  ) : (
                    <TextLink label={card.cta.label} href={card.cta.href} external />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
