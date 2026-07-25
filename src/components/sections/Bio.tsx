import type { BioContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { GhostWord } from "@/components/Primitives";

/**
 * Estrutura: FAIXA ESCURA de largura cheia, retrato grande à esquerda e texto
 * corrido à direita.
 *
 * É o contraponto de ritmo da página: depois de uma sequência de seções claras,
 * uma faixa escura funciona como respiro e reancora a atenção. Não usa o
 * cabeçalho padrão das outras seções — aqui o nome do responsável É o título.
 */
function RetratoPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`slot-grid-ink flex items-end overflow-hidden rounded-2xl border border-ink-border bg-ink-elevated p-3 ${className ?? ""}`}
    >
      <span className="font-mono rounded-md border border-ink-border bg-ink/80 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-ink-muted backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export function BioSection({
  data,
  ghostWord,
}: {
  data: BioContent;
  ghostWord: string;
}) {
  return (
    <div className="px-3 md:px-4">
      <div className="ink-grid relative isolate overflow-hidden rounded-3xl bg-ink">
        <Section id="responsavel" as="div">
          <div className="relative z-10">
            <Reveal>
              <h2 className="display-2 text-ink-foreground">{data.nome}</h2>
              <p className="mt-4 text-sm text-ink-muted">{data.credencial}</p>
            </Reveal>

            <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
              <Reveal>
                <RetratoPlaceholder label={data.retratoAlt} className="aspect-[4/5]" />
              </Reveal>

              <Reveal delay={120}>
                <p className="max-w-[64ch] text-[1.0625rem] leading-[1.75] text-ink-foreground/90">
                  {data.corpo}
                </p>

                <ul className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {data.titulacao.map((t) => (
                    <li
                      key={t}
                      className="border-t border-ink-border pt-3 text-sm text-ink-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Corpo clínico: fileira compacta, não cards grandes */}
            <div className="mt-20">
              <p className="text-sm text-ink-muted">{data.corpoClinicoLabel}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {data.corpoClinicoMembros.map((m, i) => (
                  <Reveal key={i} delay={i * 70}>
                    <div className="flex items-center gap-4 rounded-2xl border border-ink-border bg-ink-elevated/60 p-4">
                      <RetratoPlaceholder
                        label={m.retratoAlt}
                        className="h-16 w-14 shrink-0 p-1.5"
                      />
                      <p className="text-[0.8125rem] leading-[1.5] text-ink-muted">
                        {m.nomePlaceholder}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <GhostWord className="bottom-0 right-0 translate-y-[28%] px-5 md:px-10">
          {ghostWord}
        </GhostWord>
      </div>
    </div>
  );
}
