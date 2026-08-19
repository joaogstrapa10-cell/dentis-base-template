import { ClipboardList, Layers, ScanFace, Users } from "lucide-react";
import type { DiferencialIcone, DiferenciaisContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { CarrosselDeCartoes } from "@/components/sections/CarrosselDeCartoes";
import { Reveal } from "@/components/Reveal";

/**
 * Estrutura: GRADE DE CÉLULAS, a mesma de Áreas — pedido do cliente em 12/08,
 * "o mesmo template que utilizamos para a seção de especialidades". O componente
 * vive em `CarrosselDeCartoes.tsx`, compartilhado pelas três seções para não haver
 * duas cópias divergindo na primeira correção.
 *
 * O que havia antes: os quatro diferenciais numa fileira separada por fios
 * VERTICAIS, sem ícone. Correto e neutro. A grade acrescenta o realce de hover, a
 * barra que cresce ao lado do nome e o ícone — e, sendo quatro itens em quatro
 * colunas, a moldura fecha numa fileira só, sem fio sobrando no meio (a lógica de
 * bordas é derivada da contagem, não fixa em 8 itens).
 *
 * Os ícones vêm do `lucide-react`, e não dos ícones dentais desenhados no
 * projeto. A separação é deliberada: diferencial não é especialidade, e usar o
 * ícone de implante aqui diria "implantodontia" onde o texto diz "corpo clínico
 * de especialistas". Vão a 28px com traço 1.5 para casar com o conjunto dental —
 * o padrão do lucide é traço 2, que ao lado dos outros lê mais pesado.
 *
 * `ScanFace` em Harmonização Facial, e não `Smile`: sorriso genérico é justamente
 * o clichê que a §4 do CLAUDE.md proíbe. O ícone de leitura facial diz análise de
 * proporção, que é o que a copy da seção descreve.
 *
 * A abertura mantém a imagem opcional. Com `imagem: null` — o caso hoje — a grade
 * de duas colunas nem existe, senão sobra uma coluna de 17rem vazia comprimindo o
 * texto de abertura a 70% da largura sem motivo visível.
 */

const ICONES: Record<DiferencialIcone, React.ReactElement> = {
  corpo: <Users size={28} strokeWidth={1.5} aria-hidden="true" />,
  complexidade: <Layers size={28} strokeWidth={1.5} aria-hidden="true" />,
  planejamento: <ClipboardList size={28} strokeWidth={1.5} aria-hidden="true" />,
  face: <ScanFace size={28} strokeWidth={1.5} aria-hidden="true" />,
};

export function DiferenciaisSection({ data }: { data: DiferenciaisContent }) {
  return (
    <Section id="diferenciais">
      {data.imagem ? (
        /* `items-end` alinha a base da imagem com a última linha do parágrafo, em
           vez de centralizar duas caixas de alturas diferentes. */
        <div className="grid gap-10 lg:grid-cols-[1fr_17rem] lg:items-end lg:gap-16">
          <SectionHeader titulo={data.titulo} descricao={data.descricao} />

          <Reveal delay={140}>
            {/* No mobile a imagem vem depois do texto e ocupa no máximo 17rem,
                centralizada — em tela estreita, largura cheia a transformaria no
                elemento dominante da seção, que é o oposto do pedido. */}
            <img
              src={data.imagem}
              alt={data.imagemAlt}
              loading="lazy"
              width={595}
              height={321}
              className="mx-auto w-full max-w-[17rem] rounded-2xl border border-border bg-surface lg:mx-0"
            />
          </Reveal>
        </div>
      ) : (
        <SectionHeader titulo={data.titulo} descricao={data.descricao} />
      )}

      <div className="mt-12 md:mt-14">
        <CarrosselDeCartoes
          rotuloLista="Diferenciais da clínica"
          itens={data.itens.map((item) => ({
            chave: item.titulo,
            titulo: item.titulo,
            descricao: item.descricao,
            icone: ICONES[item.icone],
            imagem: item.imagem,
            imagemAlt: item.imagemAlt,
          }))}
        />
      </div>
    </Section>
  );
}
