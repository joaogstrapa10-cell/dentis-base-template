import type { AreasContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { CarrosselDeCartoes } from "@/components/sections/CarrosselDeCartoes";
import { IconeEspecialidade } from "@/components/IconesEspecialidade";

/**
 * Estrutura: CARROSSEL DE DUAS METADES — painel escuro com a lista das oito à
 * esquerda, pilha de fotos à direita. O componente vive em
 * `CarrosselEspecialidades.tsx`, com a lista completa do que veio do template do
 * usuário e do que ficou fora.
 *
 * O caminho desta seção, porque ela já errou em três direções e a quarta é esta:
 * - Até 03/08 era um índice interativo, com pills de tag e as oito descrições
 *   escondidas atrás de hover. Removido porque texto que só existe quando o mouse
 *   passa em cima não é lido por quem rola a página.
 * - Virou índice tipográfico puro: numeral e nome, nada mais. Correto e árido.
 * - Em 12/08 virou a grade de células do Aceternity, com as descrições
 *   PERMANENTES — o que resolvia a objeção de 03/08 em vez de reintroduzi-la.
 * - Em 19/08 virou este carrossel, por template do usuário. As descrições
 *   continuam permanentes (agora sobre a foto do item ativo), e a seção passou a
 *   ter FOTO, que é o que ela nunca teve.
 *
 * ⚠️ Em 19/08 o usuário pediu ESTE MESMO carrossel também em Diferenciais e em
 * Tratamentos, e mandou seguir depois de ouvir a objeção — ver a nota no topo de
 * `CarrosselDeCartoes.tsx`. Com isso a `GradeDeCelulas` ficou sem uso e foi
 * apagada; ela está no git, em `bc92186`.
 */
export function AreasSection({ data }: { data: AreasContent }) {
  return (
    <Section id="areas">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <div className="mt-12 md:mt-14">
        <CarrosselDeCartoes
          rotuloLista="Especialidades"
          itens={data.itens.map((area) => ({
            chave: area.titulo,
            titulo: area.titulo,
            descricao: area.descricao,
            icone: <IconeEspecialidade nome={area.icone} />,
            imagem: area.imagem,
            imagemAlt: area.imagemAlt,
          }))}
        />
      </div>
    </Section>
  );
}
