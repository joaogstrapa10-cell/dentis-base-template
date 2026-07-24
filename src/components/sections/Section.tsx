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
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">{children}</div>
    </As>
  );
}

export function SectionHeader({
  eyebrow,
  titulo,
  descricao,
  className,
}: {
  eyebrow: string;
  titulo: string;
  descricao?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-[680px]", className)}>
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">{eyebrow}</p>
      <h2 className="mt-4 font-medium leading-[1.05] tracking-[-0.02em] text-[clamp(2rem,4vw,3.25rem)] text-foreground">
        {titulo}
      </h2>
      {descricao ? (
        <p className="mt-6 text-base md:text-[1.0625rem] leading-[1.6] text-muted-foreground">
          {descricao}
        </p>
      ) : null}
    </div>
  );
}
