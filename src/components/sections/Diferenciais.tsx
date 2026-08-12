import type { DiferenciaisContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Estrutura: ABERTURA EM DUAS COLUNAS (afirmação + imagem do método) e, abaixo,
 * os quatro diferenciais numa FILEIRA separada por fios VERTICAIS.
 *
 * O que havia antes e por que mudou: era um `<ol>` vertical de quatro linhas
 * separadas por fio horizontal, com numeral, título e descrição em três colunas.
 * Correto e ilegível de tão neutro — o cliente resumiu como "layout muito
 * simples". Pior: a seção de Acompanhamento tinha EXATAMENTE a mesma anatomia
 * (`<ol>`, fio horizontal, três colunas), e as duas ficam a uma rolagem de
 * distância. Repetição de molde entre seções vizinhas é o defeito que fez o
 * cliente reprovar o layout como "cara de IA" três vezes.
 *
 * A troca do eixo do fio, de horizontal para vertical, é o que faz a leitura
 * mudar: a fileira lê como um conjunto simultâneo de quatro atributos, e não
 * como uma lista que se percorre de cima para baixo.
 *
 * O numeral saiu. Numa fileira de quatro colunas separadas por fio, a numeração
 * não organiza nada que a coluna já não organize — era ornamento.
 *
 * A imagem é PEQUENA de propósito (≈17rem, sob 20% da largura em desktop): o
 * pedido foi "não quero imagem grande, deixar sutil". Ela mostra instrumento, não
 * ambiente — as fotos de ambiente têm a seção de estrutura, e repetir o assunto
 * aqui gastaria a única imagem desta seção com informação que já foi dada.
 */
export function DiferenciaisSection({ data }: { data: DiferenciaisContent }) {
  return (
    <Section id="diferenciais">
      {/* A grade de duas colunas só existe QUANDO existe imagem. Sem ela, o
          `lg:grid-cols-[1fr_17rem]` deixaria uma coluna de 17rem vazia e o texto
          de abertura ficaria comprimido a ~70% da largura sem motivo visível —
          espaço reservado para algo que não está lá. */}
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

      {/* Fileira de quatro. `divide-y` no mobile e `divide-x` a partir de `md`:
          o fio acompanha o eixo em que os itens se sucedem. */}
      <ul className="mt-16 divide-y divide-border border-y border-border md:mt-20 md:grid md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {data.itens.map((item, i) => (
          <Reveal key={item.titulo} delay={i * 70} as="li">
            {/* Recuo por ÍNDICE, não por `first:`/`last:`. As pseudo-classes não
                servem aqui: o `Reveal` embrulha o conteúdo, então este `<div>` é
                sempre filho único e `:first-child` casaria em todos — foi o bug
                que fez o texto da 3ª e da 4ª coluna encostar no fio.
                Gutter só entre colunas; as bordas externas ficam rentes ao
                container, alinhadas com o título da seção. */}
            <div
              className={cn(
                "h-full py-8 lg:py-9",
                i > 0 && "lg:pl-8",
                i < data.itens.length - 1 && "lg:pr-8",
              )}
            >
              <h3 className="display-3 text-foreground">{item.titulo}</h3>
              <p className="mt-3 text-base text-muted">{item.descricao}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
