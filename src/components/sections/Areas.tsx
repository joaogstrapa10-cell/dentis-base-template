import type { AreasContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

/**
 * Estrutura: ÍNDICE INTERATIVO, não grid de cards.
 *
 * Oito cards iguais é o layout mais previsível possível — e era o terceiro grid
 * idêntico da página. Aqui as especialidades viram um índice de revista: o
 * título grande carrega a linha, e a descrição só aparece quando a linha é
 * apontada (hover) ou recebe foco de teclado. A revelação usa
 * `grid-template-rows: 0fr → 1fr`, que anima altura sem `max-height` chutado.
 *
 * No mobile não existe hover, então a descrição fica sempre visível.
 */
export function AreasSection({ data }: { data: AreasContent }) {
  return (
    <Section id="areas">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <ul className="mt-16 border-t border-border">
        {data.itens.map((area, i) => (
          <Reveal key={area.titulo} delay={Math.min(i, 5) * 55}>
            <li className="group border-b border-border">
              {/* tabIndex para a revelação também funcionar por teclado */}
              <div
                tabIndex={0}
                className="cursor-default outline-none transition-colors duration-500 focus-visible:bg-surface md:hover:bg-surface"
              >
                <div className="flex items-baseline gap-5 py-7 md:gap-10 md:py-8">
                  <span
                    aria-hidden="true"
                    className="font-mono w-8 shrink-0 text-[0.8125rem] tabular-nums text-muted transition-colors duration-500 group-focus-within:text-accent md:group-hover:text-accent"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="flex-1 font-semibold leading-[1.15] tracking-[-0.03em] text-[clamp(1.25rem,2.4vw,1.875rem)] text-foreground transition-transform duration-500 md:group-hover:translate-x-1.5">
                    {area.titulo}
                  </h3>

                  <ul className="hidden shrink-0 gap-2 lg:flex">
                    {area.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Descrição: sempre visível no mobile, revelada no desktop */}
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-rows-[0fr] md:group-focus-within:grid-rows-[1fr] md:group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-7 pl-13 text-[0.9375rem] leading-[1.7] text-muted md:pb-9 md:pl-[4.5rem]">
                      {area.descricao}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
