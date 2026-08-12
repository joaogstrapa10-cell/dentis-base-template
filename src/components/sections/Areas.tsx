import type { AreaAtuacao, AreasContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { IconeEspecialidade } from "@/components/IconesEspecialidade";
import { cn } from "@/lib/utils";

/**
 * Estrutura: GRADE DE CÉLULAS 4×2, separadas por fio, com ícone, nome e
 * descrição. Adaptada de um componente do 21st.dev/Aceternity, trazido pelo
 * cliente em 12/08.
 *
 * O que veio do template e é o que o define: a moldura de fios em vez de
 * cartões, o realce de fundo em degradê que sobe na fileira de cima e desce na
 * de baixo (o gesto aponta para fora da grade nas duas), a barra vertical à
 * esquerda do nome que CRESCE e ganha cor no hover, e o nome deslizando um passo
 * para a direita junto.
 *
 * O que foi trocado, e não é só paleta:
 * - Todo `dark:` saiu. Este projeto não tem modo escuro por classe: as cores vêm
 *   de tokens semânticos, e bloco escuro usa a família `ink-*`.
 * - `text-lg`/`text-sm` do template são PROIBIDOS pela escala fechada de cinco
 *   degraus (48/36/22/16/13). Nome virou `display-3`, descrição `text-base`.
 * - O azul do realce virou `--accent`, o petróleo da Suzuki. Não virou dourado:
 *   pela regra de contraste da paleta, dourado (L 0.80) é ornamento e só existe
 *   sobre fundo escuro — numa página clara ele desaparece.
 * - `px-10` do template virou `px-6`. Em container de 1120px, quatro colunas dão
 *   280px por célula, e 40px de recuo de cada lado deixariam 200px de texto: os
 *   nomes de especialidade quebrariam em três linhas.
 * - Os oito ícones são desenhados no projeto, um por especialidade. Ver a nota
 *   em `IconesEspecialidade.tsx` — nenhuma biblioteca instalada tem ícone
 *   dental, e ícone genérico em especialidade clínica é enfeite no lugar de
 *   informação.
 *
 * ⚠️ Esta seção reintroduz DOIS padrões que saíram da página em 03/08: grade
 * uniforme e ícone por item. Foi pedido explícito do cliente, e há uma diferença
 * que sustenta a volta: a objeção de 03/08 era que as descrições só existiam no
 * HOVER, e aqui elas são permanentes — o hover só acende fundo e barra. O que
 * NÃO deve voltar junto, e não voltou: pill de tag, e cartão com fundo e sombra
 * próprios. Aqui não há cartão; há células delimitadas por fio, que é o mesmo
 * vocabulário de Tratamentos e Diferenciais.
 *
 * O numeral do índice anterior saiu: o ícone ocupa aquele lugar, e numeral mais
 * ícone na mesma célula são dois marcadores para o mesmo item.
 */
export function AreasSection({ data }: { data: AreasContent }) {
  return (
    <Section id="areas">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <ul className="relative z-10 mt-14 grid grid-cols-1 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
        {data.itens.map((area, i) => (
          <Especialidade key={area.titulo} area={area} index={i} total={data.itens.length} />
        ))}
      </ul>
    </Section>
  );
}

function Especialidade({
  area,
  index,
  total,
}: {
  area: AreaAtuacao;
  index: number;
  total: number;
}) {
  /* A lógica de bordas do template supõe exatamente 8 itens em 4 colunas
     ("index < 4" = fileira de cima). Aqui ela é derivada de `total`, porque o
     conteúdo é trocado por clínica: uma variante com 6 especialidades manteria
     a moldura correta, e com a regra fixa ficaria com fio sobrando no meio. */
  const colunas = 4;
  const primeiraFileira = index < total - colunas;
  const inicioDeFileira = index % colunas === 0;

  return (
    <li
      className={cn(
        "group/area relative flex flex-col py-9 lg:border-r lg:border-border",
        inicioDeFileira && "lg:border-l lg:border-border",
        primeiraFileira && "lg:border-b lg:border-border",
        // Em uma e duas colunas a moldura vertical não existe: o fio horizontal
        // entre itens é o que ordena a leitura empilhada.
        "border-b border-border lg:border-b-0",
        primeiraFileira && "border-border",
      )}
    >
      {/* Realce de hover. Aponta para FORA da grade: sobe na fileira de cima,
          desce na de baixo. `pointer-events-none` para não roubar o hover do
          próprio conteúdo. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full opacity-0 transition duration-200 group-hover/area:opacity-100",
          primeiraFileira
            ? "bg-gradient-to-t from-accent/[0.07] to-transparent"
            : "bg-gradient-to-b from-accent/[0.07] to-transparent",
        )}
      />

      <div className="relative z-10 mb-4 px-6 text-muted transition-colors duration-200 group-hover/area:text-accent">
        <IconeEspecialidade nome={area.icone} />
      </div>

      <h3 className="relative z-10 mb-2 px-6">
        {/* A barra cresce de 24px para 32px e troca de cinza para petróleo.
            `origin-center` mantém o crescimento simétrico em torno do meio, em
            vez de a barra descer. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 my-auto h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-border-strong transition-all duration-200 group-hover/area:h-8 group-hover/area:bg-accent"
        />
        <span className="display-3 inline-block text-foreground transition duration-200 group-hover/area:translate-x-2">
          {area.titulo}
        </span>
      </h3>

      <p className="relative z-10 px-6 text-base leading-[1.6] text-muted">
        {area.descricao}
      </p>
    </li>
  );
}
