import type { SelosContent } from "@/content/types";
import { Reveal } from "@/components/Reveal";

export function SelosSection({ data }: { data: SelosContent }) {
  // duplicamos a lista para um loop contínuo de -50%
  const loop = [...data.itens, ...data.itens];

  return (
    <section aria-label={data.label} className="border-y border-border bg-surface/40 py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            {data.label}
          </p>
        </Reveal>
        <div className="marquee-mask marquee-pause mt-8 overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-12">
            {loop.map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="whitespace-nowrap text-sm text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
