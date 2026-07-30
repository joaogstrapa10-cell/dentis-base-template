import type { ReactNode } from "react";
import type { CasoClinico, CasosContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { TextLink } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Galeria de casos, em PILHA DE DOSSIÊS — não em grade de cards.
 *
 * Duas razões, e as duas importam:
 *
 * 1. Estrutural. Seis das treze seções já foram a mesma coisa (cabeçalho +
 *    fileira de cards iguais), e foi isso que deu o "cara de IA" reprovado em
 *    25/07. Aqui cada caso é uma faixa horizontal de largura cheia, separada por
 *    fio, com o registro clínico alternando de lado. O ritmo vem da alternância,
 *    não da repetição.
 *
 * 2. Compliance. A CFO-196/2019 restringe divulgação de antes e depois em
 *    publicidade odontológica. O formato de dossiê — situação de partida,
 *    conduta, especialidades, duração, um único registro — documenta PROCESSO.
 *    Uma grade de miniaturas convida a virar vitrine de resultado, que é
 *    exatamente o que a resolução restringe. O tipo `CasoClinico` reforça isso:
 *    tem `imagem` no singular, então não há como montar par comparativo aqui.
 *
 * O aviso do fim da seção é obrigatório, não decorativo. Não remover.
 */

/** Registro clínico, ou o slot rotulado quando ele não existe. Mesmo padrão da
 *  seção de estrutura: slot vazio precisa parecer deliberado, não quebrado. */
function Registro({ caso }: { caso: CasoClinico }) {
  if (caso.imagem) {
    return (
      <img
        src={caso.imagem}
        alt={caso.imagemAlt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={caso.imagemAlt}
      className="slot-grid flex h-full w-full items-end bg-surface p-3"
    >
      <span className="font-mono rounded-md border border-border bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-muted backdrop-blur">
        {caso.rotuloSlot}
      </span>
    </div>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.09em] text-muted">
        {rotulo}
      </dt>
      <dd className="mt-1.5 text-[0.9375rem] leading-[1.65] text-foreground">{children}</dd>
    </div>
  );
}

/**
 * Pilha de casos. A MESMA peça serve a home (recortada por `limite`) e a
 * página /casos (inteira) — a alternativa era duplicar o layout em dois
 * arquivos e ver os dois divergirem na primeira correção.
 */
export function PilhaDeCasos({
  data,
  limite,
}: {
  data: CasosContent;
  /** Quantos casos mostrar. Omitido, mostra todos. */
  limite?: number;
}) {
  const itens = limite ? data.itens.slice(0, limite) : data.itens;
  return (
    <div className="border-t border-border">
      {itens.map((caso, i) => (
          <Reveal key={caso.numero} delay={i * 90}>
            <article className="grid gap-8 border-b border-border py-10 md:grid-cols-2 md:gap-12 md:py-14 lg:gap-16">
              {/* `md:order-2` nos ímpares: o registro troca de lado a cada caso.
                  Só a partir de `md` — empilhado, alternar a ordem deixaria a
                  imagem antes do título em metade dos casos, o que embaralha a
                  leitura em vez de dar ritmo. */}
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border border-border",
                  i % 2 === 1 && "md:order-2",
                )}
              >
                <div className="aspect-[4/3]">
                  <Registro caso={caso} />
                </div>
              </div>

              <div className={cn("flex flex-col", i % 2 === 1 && "md:order-1")}>
                <span className="font-mono text-[0.8125rem] tabular-nums text-accent">
                  {caso.numero}
                </span>
                <h3 className="mt-3 text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
                  {caso.titulo}
                </h3>

                <dl className="mt-7 grid gap-5">
                  <Campo rotulo={data.situacaoLabel}>{caso.situacao}</Campo>
                  <Campo rotulo={data.condutaLabel}>{caso.conduta}</Campo>
                  <Campo rotulo={data.duracaoLabel}>{caso.duracao}</Campo>
                  <Campo rotulo={data.especialidadesLabel}>
                    <ul className="flex flex-wrap gap-2">
                      {caso.especialidades.map((especialidade) => (
                        <li
                          key={especialidade}
                          className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                        >
                          {especialidade}
                        </li>
                      ))}
                    </ul>
                  </Campo>
                </dl>
              </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Aviso de compliance. Componente próprio porque aparece em DOIS lugares — o
 * teaser da home e a página /casos — e as duas cópias têm de dizer a mesma
 * coisa. É exigência da CFO-196/2019, não rodapé de cortesia: não remover de
 * nenhum dos dois.
 */
export function AvisoCasos({ texto }: { texto: string }) {
  return (
    <p className="mt-8 max-w-[80ch] text-[0.8125rem] leading-[1.6] text-muted">{texto}</p>
  );
}

/**
 * Seção da home: é CHAMADA, não a galeria completa. Mostra `limiteNaHome` casos
 * e manda para /casos. Assim a home não cresce junto com o acervo de casos da
 * clínica.
 */
export function CasosSection({ data }: { data: CasosContent }) {
  const temMais = data.itens.length > data.limiteNaHome;
  return (
    <Section id="casos">
      <SectionHeader
        eyebrow={data.eyebrow}
        titulo={data.titulo}
        descricao={data.descricao}
        // A ação entra na linha do título, que é o padrão do SectionHeader.
        // Só aparece quando há caso além dos que a home mostra: um "ver todos"
        // que leva à mesma lista já visível é ruído.
        acao={
          temMais ? (
            <TextLink label={data.verTodos.label} href={data.verTodos.href} />
          ) : undefined
        }
      />

      <div className="mt-14">
        <PilhaDeCasos data={data} limite={data.limiteNaHome} />
      </div>

      <AvisoCasos texto={data.aviso} />
    </Section>
  );
}
