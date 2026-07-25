import type { BioContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

function RetratoPlaceholder({ label, ratio = "aspect-[4/5]" }: { label: string; ratio?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`${ratio} slot-grid flex items-end overflow-hidden rounded-2xl border border-border bg-surface p-3`}
    >
      <span className="font-mono rounded-md border border-border bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-muted-foreground backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export function BioSection({ data }: { data: BioContent }) {
  return (
    <Section id="responsavel">
      <SectionHeader eyebrow={data.eyebrow} titulo={data.nome} />
      <p className="mt-4 text-xs text-accent">{data.credencial}</p>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
        <Reveal>
          <RetratoPlaceholder label={data.retratoAlt} />
        </Reveal>
        <Reveal delay={120}>
          <p className="max-w-[62ch] text-base leading-[1.65] text-foreground/90">{data.corpo}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {data.titulacao.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-20">
        <Reveal>
          <p className="text-xs text-muted-foreground">
            {data.corpoClinicoLabel}
          </p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.corpoClinicoMembros.map((m, idx) => (
            <Reveal key={idx} delay={idx * 70}>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <RetratoPlaceholder label={m.retratoAlt} ratio="aspect-[4/5]" />
                <p className="mt-4 text-sm text-muted-foreground">{m.nomePlaceholder}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
