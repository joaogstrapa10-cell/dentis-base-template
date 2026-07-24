import { Check, Minus } from "lucide-react";
import type { ComparativoContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

export function ComparativoSection({ data }: { data: ComparativoContent }) {
  return (
    <Section id="comparativo">
      <SectionHeader eyebrow={data.eyebrow} titulo={data.titulo} descricao={data.descricao} />

      <Reveal delay={100}>
        <div className="mt-14 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1.6fr_1fr_1fr] items-center border-b border-border bg-surface">
            <div className="px-4 py-4 text-xs uppercase tracking-[0.08em] text-muted-foreground md:px-6">
              {data.colunaCriterio}
            </div>
            <div className="border-l border-accent/50 bg-surface px-4 py-4 text-xs uppercase tracking-[0.08em] text-accent md:px-6">
              {data.colunaClinica}
            </div>
            <div className="border-l border-border px-4 py-4 text-xs uppercase tracking-[0.08em] text-muted-foreground md:px-6">
              {data.colunaConvencional}
            </div>
          </div>

          {data.linhas.map((linha) => (
            <div
              key={linha.criterio}
              className="grid grid-cols-[1.6fr_1fr_1fr] items-center border-b border-border last:border-b-0"
            >
              <div className="px-4 py-5 text-sm text-foreground md:px-6">{linha.criterio}</div>
              <div className="flex h-full items-center justify-center border-l border-accent/50 bg-surface px-4 py-5 md:px-6">
                {linha.clinica ? (
                  <Check className="h-5 w-5 text-accent" strokeWidth={2.25} />
                ) : (
                  <Minus className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex h-full items-center justify-center border-l border-border px-4 py-5 md:px-6">
                {linha.convencional ? (
                  <Check className="h-5 w-5 text-accent" strokeWidth={2.25} />
                ) : (
                  <Minus className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <p className="mt-6 text-xs text-muted-foreground">{data.rodape}</p>
    </Section>
  );
}
