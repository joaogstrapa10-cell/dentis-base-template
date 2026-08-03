import type { BioContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

/**
 * Estrutura: FAIXA ESCURA de largura cheia, retrato grande à esquerda e texto
 * corrido à direita.
 *
 * É o contraponto de ritmo da página: depois de uma sequência de seções claras,
 * uma faixa escura funciona como respiro e reancora a atenção. Não usa o
 * cabeçalho padrão das outras seções — aqui o nome do responsável É o título.
 */
/** Retrato real quando `src` existe; slot rotulado enquanto não existe. */
function Retrato({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`overflow-hidden rounded-2xl border border-ink-border object-cover ${className ?? ""}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`slot-grid-ink flex items-end overflow-hidden rounded-2xl border border-ink-border bg-ink-elevated p-3 ${className ?? ""}`}
    >
      <span className="rounded-md border border-ink-border bg-ink/80 px-2 py-1 text-small uppercase tracking-[0.08em] text-ink-muted backdrop-blur">
        {alt}
      </span>
    </div>
  );
}

export function BioSection({ data }: { data: BioContent }) {
  return (
    <div className="px-3 md:px-4">
      <div className="relative isolate overflow-hidden rounded-3xl bg-ink">
        <Section id="responsavel" as="div">
          <div className="relative z-10">
            <Reveal>
              <h2 className="display-2 text-ink-foreground">{data.nome}</h2>
              <p className="mt-4 text-base text-ink-muted">{data.credencial}</p>
            </Reveal>

            <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
              <Reveal>
                <Retrato src={data.retrato} alt={data.retratoAlt} className="aspect-[4/5] w-full" />
              </Reveal>

              <Reveal delay={120}>
                <p className="max-w-[64ch] text-base leading-[1.75] text-ink-foreground/90">
                  {data.corpo}
                </p>

                <ul className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {data.titulacao.map((t) => (
                    <li
                      key={t}
                      className="border-t border-ink-border pt-3 text-base text-ink-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Corpo clínico: fileira compacta, não cards grandes */}
            <div className="mt-20">
              <p className="text-base text-ink-muted">{data.corpoClinicoLabel}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {data.corpoClinicoMembros.map((m, i) => (
                  <Reveal key={i} delay={i * 70}>
                    <div className="flex items-center gap-4 rounded-2xl border border-ink-border bg-ink-elevated/60 p-4">
                      <Retrato
                        src={m.retrato}
                        alt={m.retratoAlt}
                        className="h-16 w-14 shrink-0 p-1.5"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-ink-foreground">
                          {m.nome}
                        </p>
                        <p className="mt-1 text-small leading-[1.4] text-ink-muted">
                          {m.credencial}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}
