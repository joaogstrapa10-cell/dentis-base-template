import type { DiferenciaisContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

/**
 * Estrutura: LISTA EDITORIAL NUMERADA, sem card.
 *
 * Deliberadamente NÃO é um grid de cards. Seis seções deste site usavam esse
 * mesmo molde — cabeçalho, parágrafo, fileira de caixas iguais — e repetir um
 * layout em toda seção é o que faz uma página parecer gerada por máquina.
 * Aqui o peso vem do numeral e do fio entre linhas: cada item é uma faixa de
 * largura cheia, não uma caixa. Ícone removido de propósito; a numeração já
 * organiza a leitura.
 */
export function DiferenciaisSection({ data }: { data: DiferenciaisContent }) {
  return (
    <Section id="diferenciais">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <ol className="mt-16 border-t border-border">
        {data.itens.map((item, i) => (
          <Reveal key={item.titulo} delay={i * 70}>
            <li className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-5 gap-y-3 border-b border-border py-9 transition-colors duration-500 hover:bg-surface/70 md:grid-cols-[4rem_minmax(0,20rem)_1fr] md:gap-x-12 md:py-11">
              <span
                aria-hidden="true"
                className="text-small tabular-nums text-muted transition-colors duration-500 group-hover:text-accent"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="display-3 col-start-2 text-foreground">{item.titulo}</h3>

              <p className="col-start-2 max-w-[54ch] text-base leading-[1.7] text-muted md:col-start-3">
                {item.descricao}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
