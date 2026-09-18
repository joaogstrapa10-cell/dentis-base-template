import type { ReactNode } from "react";
import type { CasoClinico, CasosContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { GaleriaDeCasos } from "@/components/sections/GaleriaDeCasos";
import { cn } from "@/lib/utils";

/**
 * Dossiê de casos, em PILHA — a peça da página /casos.
 *
 * A HOME não usa mais isto: desde 12/08 ela abre a galeria em pilha arrastável
 * (`GaleriaDeCasos`), e este dossiê ficou sendo a documentação completa, que é
 * onde ela pertence. Cartão de carrossel não caberia situação, conduta, duração e
 * especialidades sem virar parede de texto sobre foto.
 *
 * Formato: PILHA DE DOSSIÊS — não grade de cards.
 *
 * Duas razões, e as duas importam:
 *
 * 1. Estrutural. Seis das treze seções já foram a mesma coisa (cabeçalho +
 *    fileira de cards iguais), e foi isso que deu o "cara de IA" reprovado em
 *    25/07. Aqui cada caso é uma faixa horizontal de largura cheia, separada por
 *    fio, com o registro clínico alternando de lado. O ritmo vem da alternância,
 *    não da repetição.
 *
 * 2. Compliance. A CFO-196/2019 restringe divulgação de antes e depois em
 *    publicidade odontológica. O formato de dossiê — situação de partida,
 *    conduta, especialidades, duração, um único registro — documenta PROCESSO.
 *    Uma grade de miniaturas convida a virar vitrine de resultado, que é
 *    exatamente o que a resolução restringe. O tipo `CasoClinico` reforça isso:
 *    tem `imagem` no singular, então não há como montar par comparativo aqui.
 *
 * O aviso do fim da seção é obrigatório, não decorativo. Não remover DAQUI — ele
 * saiu da seção da home em 18/09 a pedido do usuário, e /casos passou a ser o
 * único lugar onde ele aparece.
 */

/** A imagem do caso, ou o slot rotulado quando ela não existe. Mesmo padrão da
 *  seção de estrutura: slot vazio precisa parecer deliberado, não quebrado.
 *
 *  ⚠️ Desde 13/08 as cinco imagens ILUSTRAM a especialidade do caso e não são
 *  registro clínico do paciente descrito — ver a nota em `GaleriaDeCasos.tsx` e
 *  `public/imagens/casos/LEIA-ME.txt`. Aqui o recorte é 4:3, ao contrário do
 *  cartão da galeria, que é retrato: as duas proporções mostram a mesma imagem
 *  em cortes diferentes, e é por isso que só serve arquivo de assunto centralizado. */
function Registro({ caso }: { caso: CasoClinico }) {
  if (caso.imagem) {
    return (
      <img
        src={caso.imagem}
        alt={caso.imagemAlt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={caso.imagemAlt}
      className="slot-grid flex h-full w-full items-end bg-surface p-3"
    >
      <span className="rounded-md border border-border bg-background/95 px-2 py-1 text-small uppercase tracking-[0.08em] text-muted lg:backdrop-blur">
        {caso.rotuloSlot}
      </span>
    </div>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-small uppercase tracking-[0.09em] text-muted">
        {rotulo}
      </dt>
      <dd className="mt-1.5 text-base leading-[1.65] text-foreground">{children}</dd>
    </div>
  );
}

/**
 * Pilha de casos. A MESMA peça serve a home (recortada por `limite`) e a
 * página /casos (inteira) — a alternativa era duplicar o layout em dois
 * arquivos e ver os dois divergirem na primeira correção.
 */
export function PilhaDeCasos({
  data,
  limite,
}: {
  data: CasosContent;
  /** Quantos casos mostrar. Omitido, mostra todos. */
  limite?: number;
}) {
  const itens = limite ? data.itens.slice(0, limite) : data.itens;
  return (
    <div className="border-t border-border">
      {itens.map((caso, i) => (
          <Reveal key={caso.numero} delay={i * 90}>
            <article className="grid gap-8 border-b border-border py-10 md:grid-cols-2 md:gap-12 md:py-14 lg:gap-16">
              {/* `md:order-2` nos ímpares: o registro troca de lado a cada caso.
                  Só a partir de `md` — empilhado, alternar a ordem deixaria a
                  imagem antes do título em metade dos casos, o que embaralha a
                  leitura em vez de dar ritmo. */}
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border border-border",
                  i % 2 === 1 && "md:order-2",
                )}
              >
                <div className="aspect-[4/3]">
                  <Registro caso={caso} />
                </div>
              </div>

              <div className={cn("flex flex-col", i % 2 === 1 && "md:order-1")}>
                <span className="text-small tabular-nums text-accent">
                  {caso.numero}
                </span>
                <h3 className="mt-3 display-3 font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
                  {caso.titulo}
                </h3>

                <dl className="mt-7 grid gap-5">
                  <Campo rotulo={data.situacaoLabel}>{caso.situacao}</Campo>
                  <Campo rotulo={data.condutaLabel}>{caso.conduta}</Campo>
                  <Campo rotulo={data.duracaoLabel}>{caso.duracao}</Campo>
                  <Campo rotulo={data.especialidadesLabel}>
                    <ul className="flex flex-wrap gap-2">
                      {caso.especialidades.map((especialidade) => (
                        <li
                          key={especialidade}
                          className="rounded-full border border-border px-2.5 py-1 text-small text-muted"
                        >
                          {especialidade}
                        </li>
                      ))}
                    </ul>
                  </Campo>
                </dl>
              </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Aviso de compliance. Nasceu componente porque aparecia em DOIS lugares — o
 * teaser da home e a página /casos — e as duas cópias tinham de dizer a mesma
 * coisa. Desde 18/09 só a página /casos o usa: o usuário pediu a remoção do
 * parágrafo da home, com print. Continua componente porque devolvê-lo à home é
 * uma linha, e porque as duas cópias não podem divergir se ele voltar.
 * É exigência da CFO-196/2019, não rodapé de cortesia: não remover de /casos.
 */
export function AvisoCasos({ texto }: { texto: string }) {
  return (
    <p className="mt-8 max-w-[80ch] text-small leading-[1.6] text-muted">{texto}</p>
  );
}

/**
 * Seção da home: GALERIA em pilha arrastável, e não o dossiê. A divisão é
 * deliberada — a galeria convida, a página /casos é que documenta.
 *
 * Era a `PilhaDeCasos` recortada em dois casos, com um "ver todos" ao lado do
 * título. Virou carrossel em 12/08, a pedido do cliente e com o template que ele
 * trouxe.
 *
 * O recorte continua, agora em CINCO e por outra razão. Ele não protege mais o
 * layout — carrossel tem altura fixa e caberia a lista inteira — e sim faz
 * curadoria: o cliente pediu "os cinco principais" na home e todos na página.
 *
 * "Ver todos os casos" saiu do `acao` do cabeçalho e foi para DENTRO da galeria,
 * entre a pilha e as setas, a pedido do usuário em 18/09.
 *
 * ⚠️ O AVISO DA CFO-196/2019 SAIU DESTA SEÇÃO em 18/09, a pedido explícito do
 * usuário ("isso aqui tira", com print do parágrafo). Ele CONTINUA na página
 * /casos, que é onde os casos são documentados por inteiro — e o texto segue em
 * `clinica.casos.aviso`, então devolvê-lo aqui é uma linha:
 * `<AvisoCasos texto={data.aviso} />` abaixo da galeria.
 * A ressalva foi dita a ele e fica registrada: a home mostra cinco imagens que
 * ILUSTRAM especialidades e não são registro clínico do paciente descrito, e era
 * a última frase deste aviso que dizia isso ao visitante. Confirmar com o
 * jurídico da clínica antes de publicar.
 */
export function CasosSection({ data }: { data: CasosContent }) {
  return (
    <Section id="casos">
      <SectionHeader
        eyebrow={data.eyebrow}
        titulo={data.titulo}
        descricao={data.descricao}
      />

      <div className="mt-10 md:mt-12">
        <GaleriaDeCasos
          data={data}
          limite={data.limiteNaHome}
          verTodos={data.verTodos}
        />
      </div>
    </Section>
  );
}
