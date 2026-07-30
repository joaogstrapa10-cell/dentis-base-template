import { Star } from "lucide-react";
import type { Depoimento, DepoimentosContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { PillButton } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Estrutura: cartão de resumo do perfil à esquerda e carrossel de avaliações
 * rolando continuamente à direita, no formato de widget de avaliações.
 *
 * A rolagem é CSS puro: a lista é renderizada duas vezes e a faixa desliza
 * exatamente 50%, então o retorno cai sobre uma cópia idêntica e não existe
 * emenda visível. Pausa no hover e no foco de teclado, e é desligada sob
 * `prefers-reduced-motion`.
 *
 * Sobre a marca do Google: ela só é exibida no cartão cuja `fonte` é "google".
 * Os depoimentos herdados do site anterior têm `fonte: "site"` e aparecem sem
 * ela — atribuir a origem errada a um depoimento de paciente real não é
 * detalhe de layout.
 */

function Estrelas({ nota, label }: { nota: number; label: string }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            i < nota ? "fill-warning text-warning" : "fill-border text-border",
          )}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

function CartaoAvaliacao({
  item,
  duplicado,
}: {
  item: Depoimento;
  /** A segunda metade da faixa é cópia visual do laço: some para leitores de tela. */
  duplicado?: boolean;
}) {
  const doGoogle = item.fonte === "google";
  return (
    <li className="w-[19rem] shrink-0 self-start sm:w-[23rem]" aria-hidden={duplicado || undefined}>
      <figure className="flex flex-col rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {item.foto ? (
              <img
                src={item.foto}
                alt={item.fotoAlt}
                loading="lazy"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-raised text-sm font-semibold text-muted"
              >
                {item.autor.trim().charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{item.autor}</p>
              {item.quando ? (
                <p className="text-xs text-muted">{item.quando}</p>
              ) : null}
            </div>
          </div>

          {doGoogle ? (
            <span className="shrink-0 text-xs font-semibold text-muted">Google</span>
          ) : null}
        </div>

        {doGoogle ? (
          <div className="mt-4">
            <Estrelas nota={item.nota} label={`${item.nota} de 5`} />
          </div>
        ) : null}

        {/* Truncado para os cards ficarem comparáveis entre si. Os depoimentos
            herdados do site são muito mais longos que uma avaliação típica, e
            sem limite um card fica três vezes mais alto que o vizinho. */}
        <blockquote className="mt-4 line-clamp-6 text-[0.9375rem] leading-[1.65] text-foreground">
          {item.texto}
        </blockquote>
      </figure>
    </li>
  );
}

export function DepoimentosSection({ data }: { data: DepoimentosContent }) {
  const { resumo } = data;
  // Lista duplicada para a emenda do laço cair sobre conteúdo idêntico.
  const faixa = [...data.itens, ...data.itens];

  return (
    <Section id="depoimentos">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,17rem)_1fr] lg:items-center lg:gap-14">
        {/* Resumo do perfil */}
        <Reveal>
          <div>
            <h2 className="display-3 text-foreground">{resumo.nomeNegocio}</h2>
            <div className="mt-4 flex items-center gap-2.5">
              <Estrelas nota={5} label={`${resumo.nota} de 5`} />
              <span className="text-sm font-semibold text-foreground">{resumo.nota}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{resumo.totalLabel}</p>
            <div className="mt-6">
              <PillButton label={resumo.cta.label} href={resumo.cta.href} external />
            </div>
          </div>
        </Reveal>

        {/* Carrossel */}
        <div className="rail-pausa rail-mask relative -mx-5 overflow-hidden md:-mx-10 lg:mx-0">
          <ul className="rail-auto flex items-start gap-4 px-5 md:px-10 lg:px-0">
            {faixa.map((item, i) => (
              <CartaoAvaliacao
                key={`${item.autor}-${i}`}
                item={item}
                duplicado={i >= data.itens.length}
              />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
