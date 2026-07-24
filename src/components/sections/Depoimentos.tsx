import type { DepoimentosContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

export function DepoimentosSection({ data }: { data: DepoimentosContent }) {
  return (
    <Section id="depoimentos">
      <SectionHeader eyebrow={data.eyebrow} titulo={data.titulo} />
      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.itens.map((item, idx) => {
          const inicial = item.autor.trim().charAt(0);
          return (
            <Reveal key={item.autor} delay={idx * 70}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 md:p-8">
                <blockquote className="flex-1 text-[15px] leading-[1.65] text-foreground/90">
                  “{item.texto}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-raised text-sm font-medium text-foreground"
                  >
                    {inicial}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.autor}</span>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
