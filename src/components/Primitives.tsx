import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Primitivos de layout extraídos da referência visual.
 * Nenhum texto aqui — tudo vem por props, de src/content/clinica.ts.
 */

/* ---------------------------------------------------------------- PillButton */
/**
 * Botão-assinatura da referência: pill escura com um tile de ícone colorido
 * à esquerda e o rótulo em branco. O tile é o único lugar onde o dourado
 * aparece em área cheia — é ele que faz o papel do amarelo do botão principal
 * do site antigo, sem pintar a pill inteira.
 *
 * `tone="ink"`  → sobre fundo claro (padrão)
 * `tone="light"`→ sobre bloco escuro
 */
export function PillButton({
  label,
  href,
  tone = "ink",
  external,
  className,
}: {
  label: string;
  href: string;
  tone?: "ink" | "light";
  external?: boolean;
  className?: string;
}) {
  const isInk = tone === "ink";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl p-1.5 pr-4 text-sm font-semibold",
        "transition-colors duration-300",
        isInk
          ? "bg-ink text-ink-foreground hover:bg-ink-elevated"
          : "bg-surface text-foreground hover:bg-surface-raised",
        className,
      )}
    >
      <span
        className={cn(
          "tile-spin grid h-7 w-7 shrink-0 place-items-center rounded-lg",
          "bg-gold text-gold-foreground",
        )}
        aria-hidden="true"
      >
        <Grid2x2 className="h-3.5 w-3.5" strokeWidth={2.4} />
      </span>
      {label}
    </a>
  );
}

/* --------------------------------------------------------------- ArrowButton */
/** Botão circular só com seta, usado no card de CTA do footer. */
export function ArrowButton({
  href,
  ariaLabel,
  external,
}: {
  href: string;
  ariaLabel: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface text-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground"
    >
      <ArrowRight className="nudge h-5 w-5" strokeWidth={2} />
    </a>
  );
}

/* ------------------------------------------------------------------ TextLink */
export function TextLink({
  label,
  href,
  tone = "ink",
  external,
}: {
  label: string;
  href: string;
  tone?: "ink" | "light";
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group inline-flex items-center gap-1 text-sm font-medium underline decoration-1 underline-offset-4 transition-colors",
        tone === "ink"
          ? "text-foreground decoration-border-strong hover:decoration-foreground"
          : "text-ink-foreground decoration-ink-border hover:decoration-ink-foreground",
      )}
    >
      {label}
      <ArrowUpRight className="nudge h-3.5 w-3.5" strokeWidth={2} />
    </a>
  );
}

/* `GhostWord` — a palavra gigante translúcida cortada pela borda — foi REMOVIDA
   em 30/07 por decisão do usuário, junto com o CSS `.ghost-word` e o campo
   `brand.ghostWord`. Não recriar sem pedido: ver a nota em src/styles.css. */

/* --------------------------------------------------------------- SectionHead */
/**
 * Cabeçalho de seção da referência: título grande à esquerda e ação na MESMA
 * linha à direita. Empilha no mobile.
 */
export function SectionHead({
  titulo,
  eyebrow,
  descricao,
  acao,
  tone = "ink",
  className,
}: {
  titulo: string;
  eyebrow?: string;
  descricao?: string;
  acao?: ReactNode;
  tone?: "ink" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12",
        className,
      )}
    >
      {/* Largura em rem, não em ch — ver nota em Section.tsx */}
      <div className="max-w-[54rem]">
        {eyebrow ? (
          <p
            className={cn(
              "mb-4 text-[11px]",
              light ? "text-ink-muted" : "text-muted",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "display-2",
            light ? "text-ink-foreground" : "text-foreground",
          )}
        >
          {titulo}
        </h2>
        {descricao ? (
          <p
            className={cn(
              "mt-5 text-base leading-[1.6]",
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

/* -------------------------------------------------------------------- Card */
/** Card branco da referência: raio grande, sombra suave, hover que sobe. */
export function Card({
  children,
  className,
  tone = "light",
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  /** `light` = card branco sobre a página; `ink` = card escuro */
  tone?: "light" | "ink";
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border",
        tone === "ink"
          ? "border-ink-border bg-ink text-ink-foreground"
          : "border-border bg-surface",
        interactive && "lift",
        className,
      )}
    >
      {children}
    </div>
  );
}
