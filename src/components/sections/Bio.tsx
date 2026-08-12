import type { BioContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

/**
 * Estrutura: FAIXA ESCURA de largura cheia. Em cima, retrato grande do
 * responsável à esquerda e texto corrido à direita. Embaixo, o corpo clínico
 * como GRADE DE RETRATOS, sem cartão nenhum.
 *
 * É o contraponto de ritmo da página: depois de uma sequência de seções claras,
 * uma faixa escura funciona como respiro e reancora a atenção. Não usa o
 * cabeçalho padrão das outras seções — aqui o nome do responsável É o título.
 *
 * O corpo clínico era OITO CARTÕES iguais, cada um com borda, fundo próprio e um
 * retrato circular de 48px ao lado do nome. Dois defeitos, e os dois estão
 * nomeados no diagnóstico de densidade:
 *
 * - Grade de cartões uniforme é exatamente o molde que fez o layout ser reprovado
 *   como "cara de IA" três vezes, e a única seção que ainda o usava era esta.
 * - Retrato de 48px não é retrato, é ícone. Das 32 fotos da página, 28 apareciam
 *   abaixo de 15% da largura da tela — e as oito daqui eram as menores de todas.
 *
 * Os nove retratos (os oito do corpo clínico mais o do responsável) são fotos de
 * estúdio do mesmo ensaio: mesmo fundo creme, mesmo uniforme, mesma proporção
 * 3:4. Isso é o que faz a grade funcionar sobre o bloco escuro — nove campos
 * claros de tom idêntico leem como série, não como remendo.
 *
 * A grade recorta em QUADRADO, e é uma escolha de ritmo, não de gosto: em 3:4,
 * a proporção nativa, as duas fileiras levavam a seção a 2,13 telas, contra as
 * ~1,15 de média das outras — a única fora do compasso da página. O quadrado
 * devolve ~180px sem tirar retrato nenhum da grade, e o corte só perde fundo
 * creme: o enquadramento (`object-[50%_22%]`) mantém cabeça e ombros, que é o
 * conteúdo de um retrato de equipe. O retrato do responsável fica em 3:4, sem
 * recorte, porque ali a foto é o argumento e não um item de série.
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
      {/* Maiúscula e tracking removidos: era o último resto do vocabulário de
          rótulo pequeno que saiu de todas as outras seções. */}
      <span className="rounded-md border border-ink-border bg-ink/80 px-2 py-1 text-small text-ink-muted backdrop-blur">
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
                {/* `aspect-[3/4]`, a proporção nativa do arquivo. Estava em 4/5,
                    que recortava a foto de estúdio sem necessidade. */}
                <Retrato
                  src={data.retrato}
                  alt={data.retratoAlt}
                  className="aspect-[3/4] w-full"
                />
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

            {/* Corpo clínico. O fio acima substitui as bordas dos cartões que
                saíram: sem ele as duas metades do bloco encostam sem transição. */}
            <div className="mt-20 border-t border-ink-border pt-12">
              <p className="text-base text-ink-muted">{data.corpoClinicoLabel}</p>

              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {data.corpoClinicoMembros.map((m, i) => (
                  <Reveal key={m.nome} delay={i * 60} as="li">
                    <Retrato
                      src={m.retrato}
                      alt={m.retratoAlt}
                      className="aspect-square w-full object-[50%_22%]"
                    />
                    {/* Nome e credencial ABAIXO do retrato, não ao lado: em
                        coluna estreita, nome ao lado da foto obriga a truncar —
                        e nome de profissional truncado com reticências num site
                        de clínica é falha de conteúdo, não de layout. */}
                    <p className="mt-4 text-base font-medium text-ink-foreground">
                      {m.nome}
                    </p>
                    <p className="mt-1 text-small leading-[1.4] text-ink-muted">
                      {m.credencial}
                    </p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
