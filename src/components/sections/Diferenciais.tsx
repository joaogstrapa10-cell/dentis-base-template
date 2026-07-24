import { Stethoscope, Layers, ClipboardCheck, ScanFace } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DiferenciaisContent, DiferencialItem } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

const ICONS: Record<DiferencialItem["icon"], LucideIcon> = {
  stethoscope: Stethoscope,
  layers: Layers,
  "clipboard-check": ClipboardCheck,
  "scan-face": ScanFace,
};

export function DiferenciaisSection({ data }: { data: DiferenciaisContent }) {
  return (
    <Section id="diferenciais">
      <SectionHeader eyebrow={data.eyebrow} titulo={data.titulo} descricao={data.descricao} />
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.itens.map((item, idx) => {
          const Icon = ICONS[item.icon];
          return (
            <Reveal key={item.titulo} delay={idx * 70}>
              <article className="h-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border/80 hover:bg-surface-raised">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-raised text-accent">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-lg font-medium tracking-[-0.01em] text-foreground">
                  {item.titulo}
                </h3>
                <p className="mt-3 text-sm leading-[1.6] text-muted-foreground">
                  {item.descricao}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
