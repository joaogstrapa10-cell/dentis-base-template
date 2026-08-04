import type { AreasContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

/**
 * Estrutura: ÍNDICE EM DUAS COLUNAS, com a descrição de cada especialidade
 * visível. Numeral pequeno acima do nome, não ao lado.
 *
 * O caminho desta seção, porque ela já errou nas duas direções:
 * - Até 03/08 era um índice interativo: 19 pills de tag e as oito descrições
 *   escondidas atrás de hover. Removido porque texto que só existe quando o mouse
 *   passa em cima não é lido por quem rola a página, e pill é vocabulário de
 *   dashboard.
 * - Virou índice tipográfico puro: uma coluna, numeral e nome, nada mais. Ficou
 *   correto e árido — o cliente pediu "mais profissional".
 * - Agora: duas colunas, descrição de volta como texto normal.
 *
 * A descrição voltar sem hover é o ponto. Ela é copy real das especialidades, e
 * já estava no conteúdo (`AreaAtuacao.descricao`) sendo renderizada em lugar
 * nenhum. Não foi escrita agora.
 *
 * Duas colunas e não uma: são OITO itens. Em coluna única, oito nomes com
 * descrição viram uma parede de texto de duas telas. Em duas, a seção fecha em
 * pouco mais de uma tela e o olho compara os pares.
 *
 * Numeral ACIMA do nome, não ao lado: ao lado, ele empurra o nome para dentro e
 * a coluna perde a margem comum — com duas colunas, a quebra de alinhamento
 * apareceria em dobro.
 *
 * Sem imagem, e é decisão: o conteúdo aqui é um CATÁLOGO de oito, e imagem de
 * apoio ao lado de catálogo é decoração — sobra e não informa. As imagens do
 * método estão nas duas seções anteriores, e a de ambiente na esteira de
 * estrutura. Uma quarta imagem em três seções seguidas gastaria o recurso.
 */
export function AreasSection({ data }: { data: AreasContent }) {
  return (
    <Section id="areas">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      {/* `border-t` no `<ul>` e `border-b` em cada item: o fio de cima é um só, e
          cada linha fecha o seu. Em duas colunas isso dá uma grade de fios sem
          precisar de `divide`, que não acompanha `grid` com quebra de coluna. */}
      <ul className="mt-16 grid border-t border-border md:mt-20 md:grid-cols-2 md:gap-x-16 lg:gap-x-24">
        {data.itens.map((area, i) => (
          <Reveal key={area.titulo} delay={Math.min(i, 5) * 55} as="li">
            <div className="border-b border-border py-7 md:py-8">
              <span
                aria-hidden="true"
                className="text-small tabular-nums text-muted"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display-3 mt-2 text-foreground">{area.titulo}</h3>
              <p className="mt-3 max-w-[52ch] text-base text-muted">{area.descricao}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
