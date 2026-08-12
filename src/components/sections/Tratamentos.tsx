import type { TratamentosContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { PillButton } from "@/components/Primitives";

/**
 * Estrutura: TRÊS FAIXAS HORIZONTAIS de largura cheia — nome do eixo à
 * esquerda, o que ele envolve à direita — e uma linha de fecho com a nota de
 * valor e uma única chamada.
 *
 * O que havia antes era uma TABELA DE PREÇOS de software, e não por descuido de
 * estilo: a anatomia era inteira. Três colunas de mesma largura, a do meio com
 * fundo diferente, selo "Mais procurado" flutuando ao lado do título, uma linha
 * de valor por coluna, lista de itens separada por fio dentro de cada uma, e um
 * botão por coluna. Isso num bloco cujo texto de abertura diz que a clínica NÃO
 * trabalha com tabela fechada — a seção contradizia a própria copy.
 *
 * Três coisas saíram por serem defeito, não estilo:
 *
 * 1. "Valor sob avaliação" aparecia TRÊS vezes, uma por coluna, dizendo o que o
 *    parágrafo de abertura já diz. Agora aparece uma vez, no fecho.
 * 2. Os três botões apontavam para o MESMO link de WhatsApp. Três chamadas com
 *    destino idêntico não são escolha, são a mesma chamada repetida — e sobre um
 *    header fixo que já carrega "Agendar" em toda a página. Ficou uma.
 * 3. O selo "Mais procurado" é pressão de demanda aplicada a decisão de saúde.
 *    Numa clínica isso não é prova social, é indução — e o destaque de fundo na
 *    coluna do meio existia só para sustentar o selo.
 *
 * Por que faixa horizontal, e não outra coisa: a página já tem quatro anatomias
 * em uso e nenhuma é esta. Diferenciais são colunas separadas por fio VERTICAL
 * (atributos simultâneos), Acompanhamento é um fio horizontal que ATRAVESSA
 * (etapas em sucessão), Áreas é índice de duas colunas com numeral, Estrutura e
 * Depoimentos são esteiras. Nome à esquerda e conteúdo à direita, em faixas
 * empilhadas, lê como FICHA TÉCNICA: é consulta, não comparação. E é o oposto
 * de tabela de preço justamente por não deixar comparar coluna com coluna.
 *
 * A lista de `inclui` virou linha corrida separada por ponto médio, em 13px.
 * Eram 14 itens em três listas com fio entre cada um; a mesma informação em três
 * linhas de texto tira 11 fios e 14 blocos da tela sem perder uma palavra.
 */
export function TratamentosSection({ data }: { data: TratamentosContent }) {
  return (
    <Section id="tratamentos">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <div className="mt-14 divide-y divide-border border-y border-border md:mt-16">
        {data.eixos.map((eixo, i) => (
          <Reveal key={eixo.titulo} delay={i * 80}>
            {/* A coluna do nome tem largura FIXA em `md` (não fração), para os
                três nomes começarem e a descrição de todos alinhar no mesmo eixo
                vertical. Com fração, o nome mais longo definiria a coluna e o
                alinhamento mudaria a cada clínica que trocar o conteúdo. */}
            <div className="grid gap-4 py-8 md:grid-cols-[15rem_1fr] md:gap-10 md:py-10 lg:grid-cols-[20rem_1fr]">
              <h3 className="display-3 text-foreground">{eixo.titulo}</h3>

              <div className="min-w-0">
                <p className="max-w-[56ch] text-base leading-[1.65] text-muted">
                  {eixo.descricao}
                </p>

                {/* Ponto médio como separador, em `<span>` marcado
                    `aria-hidden`: é pontuação visual, e leitor de tela já
                    anuncia a quebra entre os itens da lista.

                    Duas decisões, as duas por defeito visto no render mobile:

                    O separador vem DEPOIS do item, não antes. Antes, ao quebrar
                    linha o item levava o próprio ponto consigo e a linha nova
                    começava com "· Prótese sobre implante" — que lê como
                    marcador de lista, e não como separador. Ponto no fim da
                    linha lê como continuação, que é o que ele é.

                    E a lista empilha abaixo de `sm`, com o ponto escondido: em
                    390px de largura uma linha corrida de quatro itens quebra em
                    qualquer arranjo, e item por linha sem ponto nenhum é mais
                    limpo que ponto órfão em borda de linha. */}
                <ul className="mt-4 flex flex-col gap-y-1.5 text-small text-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2.5">
                  {eixo.inclui.map((item, j) => (
                    <li key={item} className="flex items-center gap-x-2.5">
                      {item}
                      {j < eixo.inclui.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="hidden text-border-strong sm:inline"
                        >
                          ·
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Fecho: a resposta ao "quanto custa" e a chamada, no mesmo eixo
          horizontal. Fora das faixas de propósito — dentro delas, valor volta a
          ler como preço de item. */}
      <Reveal delay={240}>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-base text-foreground">{data.notaValor}</p>
          <PillButton label={data.cta.label} href={data.cta.href} external />
        </div>
      </Reveal>
    </Section>
  );
}
