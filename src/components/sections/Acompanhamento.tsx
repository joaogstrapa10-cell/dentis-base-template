import { Check, Loader2, Circle } from "lucide-react";
import type { AcompanhamentoContent, EtapaAcompanhamento } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

function EstadoIcon({ estado }: { estado: EtapaAcompanhamento["estado"] }) {
  if (estado === "concluido")
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    );
  if (estado === "em-andamento")
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-accent text-accent">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      </span>
    );
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground">
      <Circle className="h-2.5 w-2.5" />
    </span>
  );
}

export function AcompanhamentoSection({ data }: { data: AcompanhamentoContent }) {
  return (
    <Section id="acompanhamento">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <Reveal>
          <SectionHeader
            eyebrow={data.eyebrow}
            titulo={data.titulo}
            descricao={data.descricao}
          />
          <ol className="mt-10 space-y-6">
            {data.etapas.map((etapa) => (
              <li key={etapa.numero} className="flex gap-4">
                <div className="pt-0.5">
                  <EstadoIcon estado={etapa.estado} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                      {etapa.numero}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-xs uppercase tracking-[0.08em]",
                        etapa.estado === "concluido" && "text-accent",
                        etapa.estado === "em-andamento" && "text-accent",
                        etapa.estado === "previsto" && "text-muted-foreground",
                      )}
                    >
                      {etapa.estadoLabel}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-medium text-foreground">{etapa.titulo}</h3>
                  <p className="mt-2 max-w-[52ch] text-sm leading-[1.6] text-muted-foreground">
                    {etapa.descricao}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] md:p-6">
            {/* Faux window chrome */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-surface-raised" />
                <span className="h-2.5 w-2.5 rounded-full bg-surface-raised" />
                <span className="h-2.5 w-2.5 rounded-full bg-surface-raised" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                {data.painelSubtitulo}
              </span>
            </div>
            <div className="pt-5">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                {data.painelTitulo}
              </p>

              <ol className="mt-5 space-y-3">
                {data.etapas.map((etapa, i) => (
                  <li
                    key={etapa.numero}
                    className={cn(
                      "flex items-center justify-between rounded-lg border border-border bg-surface-raised px-4 py-3",
                      etapa.estado === "em-andamento" && "border-accent/60",
                    )}
                    style={{
                      opacity: 1,
                      transitionDelay: `${i * 60}ms`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <EstadoIcon estado={etapa.estado} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{etapa.titulo}</p>
                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                          {etapa.numero}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "font-mono rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em]",
                        etapa.estado === "concluido" &&
                          "border-accent/40 bg-accent/10 text-accent",
                        etapa.estado === "em-andamento" &&
                          "border-accent/60 bg-accent/15 text-accent",
                        etapa.estado === "previsto" &&
                          "border-border text-muted-foreground",
                      )}
                    >
                      {etapa.estadoLabel}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
