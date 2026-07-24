import type { AreasContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

export function AreasSection({ data }: { data: AreasContent }) {
  return (
    <Section id="areas">
      <SectionHeader eyebrow={data.eyebrow} titulo={data.titulo} descricao={data.descricao} />
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.itens.map((area, idx) => (
          <Reveal key={area.titulo} delay={(idx % 6) * 60}>
            <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border/80 hover:bg-surface-raised">
              <h3 className="text-lg font-medium tracking-[-0.01em] text-foreground">
                {area.titulo}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-[1.6] text-muted-foreground">
                {area.descricao}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {area.tags.map((tag) => (
                  <li
                    key={tag}
                    className="font-mono rounded-full border border-border bg-surface-raised px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
