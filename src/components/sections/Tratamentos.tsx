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
                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-small font-medium text-accent-foreground">
                      {card.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-base leading-[1.65] text-muted">
                  {card.descricao}
                </p>

                <p className="mt-7 border-t border-border pt-5 text-base text-foreground">
                  {card.valorLabel}
                </p>

                {/* Lista sem ícone. Eram 14 checks só nesta seção, e check por
                    item é vocabulário de tabela de planos de software: numa
                    clínica ele não acrescenta informação nenhuma ao texto.
                    A separação por fio dá a mesma leitura, sem enfeite. */}
                <ul className="mt-6 flex-1 divide-y divide-border border-t border-border">
                  {card.inclui.map((item) => (
                    <li key={item} className="py-3 text-base text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-9">
                  {card.destaque ? (
                    // Padrão (`ink`): pílula verde sobre o cartão branco. Ficou
                    // `light` por uma rodada, quando os cartões eram escuros.
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
