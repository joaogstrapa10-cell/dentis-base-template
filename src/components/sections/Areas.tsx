import type { AreasContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { GradeDeCelulas } from "@/components/sections/GradeDeCelulas";
import { IconeEspecialidade } from "@/components/IconesEspecialidade";

/**
 * Estrutura: GRADE DE CÉLULAS 4×2, a mesma de Diferenciais. O componente vive em
 * `GradeDeCelulas.tsx`, com a explicação do que veio do template e do que foi
 * trocado.
 *
 * O caminho desta seção, porque ela já errou nas duas direções:
 * - Até 03/08 era um índice interativo, com pills de tag e as oito descrições
 *   escondidas atrás de hover. Removido porque texto que só existe quando o mouse
 *   passa em cima não é lido por quem rola a página.
 * - Virou índice tipográfico puro: numeral e nome, nada mais. Correto e árido.
 * - Agora é a grade do template, com as descrições PERMANENTES — o que resolve a
 *   objeção de 03/08 em vez de reintroduzi-la.
 *
 * O numeral do índice saiu: o ícone ocupa aquele lugar, e numeral mais ícone na
 * mesma célula são dois marcadores para o mesmo item.
 *
 * Os ícones são os oito desenhados no projeto, um por especialidade — ver a nota
 * em `IconesEspecialidade.tsx`. Nenhuma biblioteca instalada tem ícone dental, e
 * ícone genérico em especialidade clínica é enfeite no lugar de informação.
 */
export function AreasSection({ data }: { data: AreasContent }) {
  return (
    <Section id="areas">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <div className="mt-14 md:mt-16">
        <GradeDeCelulas
          itens={data.itens.map((area) => ({
            chave: area.titulo,
            titulo: area.titulo,
            descricao: area.descricao,
            icone: <IconeEspecialidade nome={area.icone} />,
          }))}
        />
      </div>
    </Section>
  );
}
