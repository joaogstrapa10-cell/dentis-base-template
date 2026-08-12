import type { ChamadaFinalContent } from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { ArrowButton, PillButton } from "@/components/Primitives";

/**
 * Estrutura: FAIXA ESCURA com o convite à avaliação — texto à esquerda, pílula e
 * botão de seta à direita.
 *
 * Era o cartão do topo do rodapé, e saiu de lá por pedido do usuário em 12/08:
 * "pode sair do rodapé, ser uma seção anterior". Entra depois da Localização,
 * que é a última seção de conteúdo, então o convite fecha a leitura em vez de
 * ficar dentro do bloco de navegação e créditos.
 *
 * A moldura do cartão não veio junto, e é por consequência da mudança, não por
 * gosto: no rodapé ele era um cartão com borda e fundo `ink-elevated` DENTRO do
 * bloco escuro, porque precisava se destacar das colunas de navegação logo
 * abaixo. Virando seção, o bloco escuro já é a superfície do convite — manter a
 * borda seria caixa dentro de caixa, com 1px de diferença de tom entre as duas.
 *
 * As cores são as mesmas do rodapé, como pedido: bloco em `--ink`, arco dourado
 * de atmosfera, pílula clara e botão de seta.
 *
 * Duas chamadas para o MESMO link, e aqui isso é intencional, ao contrário do que
 * saiu de Tratamentos: a pílula carrega o rótulo e a seta é o alvo grande ao lado
 * dela — é um par, não duas opções concorrentes. Não acrescentar uma terceira.
 */
export function ChamadaFinalSection({ data }: { data: ChamadaFinalContent }) {
  return (
    <section id="chamada" className="px-3 md:px-4">
      <div className="relative isolate overflow-hidden rounded-3xl bg-ink">
        <div
          aria-hidden="true"
          className="ink-arc pointer-events-none absolute inset-0 opacity-25"
        />

        {/* Padding próprio, menor que o `--section-py` da página, pelo mesmo
            motivo da Bio: dentro de uma faixa a separação já é a borda do bloco,
            e o padding de ritmo deixaria uma tira de verde vazio em volta de duas
            linhas de texto. */}
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 py-12 md:px-10 md:py-16">
          <Reveal>
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-14">
              {/* Largura em rem, não em ch: `ch` resolve contra a fonte de 16px
                  deste wrapper e estrangularia o h2 de ~36px. */}
              <div className="max-w-[34rem]">
                <h2 className="display-2 text-ink-foreground">{data.titulo}</h2>
                <p className="mt-4 text-base leading-[1.65] text-ink-muted">
                  {data.descricao}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <PillButton
                  label={data.cta.label}
                  href={data.cta.href}
                  tone="light"
                  external
                />
                <ArrowButton
                  href={data.cta.href}
                  ariaLabel={data.cta.label}
                  external
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
