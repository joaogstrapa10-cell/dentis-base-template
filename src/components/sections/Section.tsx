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
    /* `scroll-mt-12`: a pílula de navegação é FIXA e opaca, e sem esta margem o
       clique numa âncora do menu para a seção com o topo em y=0 — a base da
       pílula fica em 85px e o título de 36px começa em 72px, ou seja a pílula
       corta o título pela metade. Medido em 13/08 com screenshot, depois de a
       ordem das seções mudar: era defeito antigo, e todo item do menu caía nele.
       48px de margem descem o título para ~120px, folga de ~35px da pílula.
       Vale para as seções construídas com este wrapper; as três que têm marcação
       própria (Estrutura, Bio, Chamada final) repetem a classe. */
    <As
      id={id}
      className={cn("scroll-mt-12", className)}
      style={{ paddingBlock: "var(--section-py)" }}
    >
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
        {/* Sem eyebrow. Na referência nenhum cabeçalho de seção tem rótulo
            pequeno acima — mono maiúscula com tracking largo em toda seção era
            invenção nossa, e é justamente o clichê de página gerada por IA.
            O campo segue no conteúdo para as variantes que quiserem usar. */}
        <h2
          className={cn(
            "display-2",
            light ? "text-ink-foreground" : "text-foreground",
          )}
        >
          {titulo}
        </h2>
        {descricao ? (
          /* ⚠️ `display-3-leve` e NÃO `text-base`: o usuário pediu em 18/09 que
             "todos os textos abaixo dos títulos" aumentassem, "estão muito
             pequenos". 22px é o DEGRAU VIZINHO da escala fechada de cinco — não
             entra tamanho novo na página. E resolve junto o "precisa ter um
             espaçamento entre elas": a classe traz line-height 1.45, ou seja
             31,9px de entrelinha contra os 26,4px de antes.
             A hierarquia contra o `.display-2` do título continua de pé pelo
             PESO (700 contra 400), que é o que a segura no celular, onde o
             título cai para 28px pelo clamp.
             ⚠️ Não trocar por `text-base` com utilitário de tamanho: os degraus
             `.display-*` são declarados FORA de `@layer` e vencem os utilitários
             do Tailwind em silêncio — daí existir a variante `-leve`. */
          <p
            className={cn(
              "display-3-leve mt-5",
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
