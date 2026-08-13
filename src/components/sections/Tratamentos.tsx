import { Blocks, Gem, Stethoscope } from "lucide-react";
import type { TratamentoIcone, TratamentosContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { GradeDeCelulas } from "@/components/sections/GradeDeCelulas";

/**
 * Estrutura: GRADE DE CÉLULAS de três colunas, a mesma de Áreas e Diferenciais —
 * pedido do cliente em 12/08, "para ficar tudo condizente". O componente vive em
 * `GradeDeCelulas.tsx`.
 *
 * ⚠️ Esta é a TERCEIRA seção da página com esta anatomia, e o risco é real: seis
 * das treze seções serem o mesmo molde foi a causa do layout ser reprovado como
 * "cara de IA" em 25/07. O que mantém esta distinta são as TRÊS colunas em vez de
 * quatro — a linha de fecho, que era a outra diferença, saiu em 13/08 a pedido do
 * cliente. Com uma diferença só de pé, NÃO usar esta grade numa quarta seção.
 *
 * O que veio antes, e por que não volta: até 12/08 esta seção foi uma TABELA DE
 * PREÇOS de software, com três colunas iguais, a do meio destacada, selo "Mais
 * procurado", uma linha de valor por coluna e um botão por coluna — num bloco cujo
 * texto de abertura diz que a clínica NÃO trabalha com tabela fechada. Depois virou
 * ficha técnica em faixas horizontais. As três travas que sobreviveram às duas
 * mudanças, e que a grade preserva:
 *
 * 1. NENHUM valor por coluna. Em 13/08 o cliente removeu também a nota de valor do
 *    fecho, então a seção não exibe valor em lugar nenhum — a explicação de como o
 *    orçamento funciona vive no parágrafo de abertura, que é o certo: ela é a
 *    política da clínica, não o preço de um item.
 * 2. NENHUMA chamada de agendamento aqui. Eram três, uma por coluna, todas para o
 *    mesmo link de WhatsApp; viraram uma no fecho e essa saiu em 13/08. A conversão
 *    da página está no header fixo, no hero e na seção "Comece pela avaliação",
 *    logo antes do rodapé.
 * 3. Nenhum eixo é destacado sobre os outros, e não existe selo de demanda:
 *    "mais procurado" é pressão aplicada a decisão de saúde.
 *
 * Os ícones são do lucide, e nenhum deles se repete nas outras seções — ícone que
 * significa duas coisas em dois lugares da mesma página informa menos que nenhum.
 * `Gem` em estética porque o eixo é cerâmica e faceta, não "brilho": dente
 * brilhando é o clichê que a §4 do CLAUDE.md proíbe.
 */

const ICONES: Record<TratamentoIcone, React.ReactElement> = {
  avaliacao: <Stethoscope size={28} strokeWidth={1.5} aria-hidden="true" />,
  reabilitacao: <Blocks size={28} strokeWidth={1.5} aria-hidden="true" />,
  estetica: <Gem size={28} strokeWidth={1.5} aria-hidden="true" />,
};

export function TratamentosSection({ data }: { data: TratamentosContent }) {
  return (
    <Section id="tratamentos">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <div className="mt-14 md:mt-16">
        <GradeDeCelulas
          colunas={3}
          itens={data.eixos.map((eixo) => ({
            chave: eixo.titulo,
            titulo: eixo.titulo,
            descricao: eixo.descricao,
            icone: ICONES[eixo.icone],
            /* O que o eixo envolve, empilhado dentro da célula. Em faixa
               horizontal isto era uma linha corrida separada por ponto médio;
               numa coluna de ~350px a linha corrida quebraria em qualquer
               arranjo, e o ponto acabaria no início de linha lendo como
               marcador. Empilhado, cada item é uma linha e não há separador
               órfão. */
            extra: (
              <ul className="grid gap-1.5 border-t border-border pt-4 text-small text-foreground">
                {eixo.inclui.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          }))}
        />
      </div>

    </Section>
  );
}
