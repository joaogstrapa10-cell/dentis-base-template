import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Primitivos de layout extraídos da referência visual.
 * Nenhum texto aqui — tudo vem por props, de src/content/clinica.ts.
 */

/* -------------------------------------------------------------- IconeWhatsApp */
/**
 * Glifo do WhatsApp, inline. O lucide-react não traz ícones de marca — foram
 * removidos da biblioteca —, e aqui a marca é informação e não enfeite: todos os
 * CTAs do site apontam para `WHATSAPP_HREF`, então o ícone diz para onde o botão
 * leva. Um balão de conversa genérico não diria.
 *
 * Desenho de preenchimento, não de traço: usa `fill="currentColor"` e herda a
 * cor de quem o contém.
 */
export function IconeWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.966 1.164-.198.199-.396.223-.693.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.446.52-.669.174-.223.232-.375.347-.573.116-.198.058-.372-.018-.52-.075-.149-.669-1.611-.916-2.207-.244-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/* ---------------------------------------------------------------- PillButton */
/**
 * Botão-assinatura da referência: pill escura com um tile de ícone colorido
 * à esquerda e o rótulo em branco. O tile é o único lugar onde o dourado
 * aparece em área cheia — é ele que faz o papel do amarelo do botão principal
 * do site antigo, sem pintar a pill inteira.
 *
 * O ícone é a marca do WhatsApp, não um calendário: os CTAs não abrem agenda,
 * abrem conversa. Trocado em 30/07 por correção do usuário.
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
        {/* Marca do WhatsApp: é para lá que todo CTAs do site aponta. */}
        <IconeWhatsApp className="h-4 w-4" />
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
