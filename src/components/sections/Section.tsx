import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  as: As = "section",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  as?: "section" | "footer" | "header" | "div";
}) {
  return (
    <As id={id} className={cn(className)} style={{ paddingBlock: "var(--section-py)" }}>
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">{children}</div>
    </As>
  );
}

/**
 * Cabeçalho de seção no padrão da referência: título grande em BOLD à esquerda
 * e, quando existe, a ação na MESMA linha à direita. Empilha no mobile.
 *
 * `tone="light"` para uso dentro de bloco escuro.
 */
export function SectionHeader({
  eyebrow,
  titulo,
  descricao,
  acao,
  tone = "ink",
  className,
}: {
  eyebrow?: string;
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
  tone?: "ink" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-14",
        className,
      )}
    >
      {/* Largura em rem, não em ch: `ch` resolveria contra a fonte de 16px deste
          wrapper e estrangularia o h2 de ~52px que vive dentro dele. */}
      <div className="max-w-[54rem]">
        {eyebrow ? (
          <p
            className={cn(
              "font-mono mb-4 text-[11px] uppercase tracking-[0.12em]",
              light ? "text-ink-muted" : "text-muted",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-balance font-bold leading-[1.04] tracking-[-0.035em] text-[clamp(1.875rem,4vw,3.25rem)]",
            light ? "text-ink-foreground" : "text-foreground",
          )}
        >
          {titulo}
        </h2>
        {descricao ? (
          <p
            className={cn(
              "mt-5 text-base leading-[1.65]",
              light ? "text-ink-muted" : "text-muted",
            )}
          >
            {descricao}
          </p>
        ) : null}
      </div>
      {acao ? <div className="shrink-0">{acao}</div> : null}
    </div>
  );
}
