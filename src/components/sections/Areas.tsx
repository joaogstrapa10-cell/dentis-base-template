import type { AreasContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

/**
 * Estrutura: ÍNDICE TIPOGRÁFICO. Só o nome da especialidade, grande, um por
 * linha, separado por fio.
 *
 * Esta era a seção mais densa do site depois dos cortes de 30/07: 50 elementos
 * por tela, 44 blocos de texto e 19 pills. Três coisas saíram, e cada uma tinha
 * um motivo próprio:
 *
 * 1. As 19 PILLS de tag. Pill é dispositivo de filtro de catálogo e de
 *    dashboard. Além do vocabulário errado, as tags repetiam palavras do próprio
 *    título ao lado ("Função", "Multidisciplinar" ao lado de "Reabilitação
 *    Oral") — ruído, não informação.
 * 2. As 8 DESCRIÇÕES reveladas por hover. Texto que só existe se o mouse passar
 *    em cima não é lido por quem rola a página, mas ocupa o DOM, o peso e a
 *    atenção. Se a descrição importa, ela vive na página da especialidade; se não
 *    importa, não vive.
 * 3. A MECÂNICA de revelação. Era uma das cinco interações diferentes competindo
 *    na página.
 *
 * O que sobrou é o que a seção precisa dizer: quais especialidades existem
 * aqui. O nome grande faz isso sozinho.
 */
export function AreasSection({ data }: { data: AreasContent }) {
  return (
    <Section id="areas">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <ul className="mt-16 border-t border-border">
        {data.itens.map((area, i) => (
          <Reveal key={area.titulo} delay={Math.min(i, 5) * 55}>
            <li className="flex items-baseline gap-6 border-b border-border py-6 md:gap-12 md:py-7">
              <span
                aria-hidden="true"
                className="w-8 shrink-0 text-small tabular-nums text-muted"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display-3 flex-1 text-foreground">{area.titulo}</h3>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
