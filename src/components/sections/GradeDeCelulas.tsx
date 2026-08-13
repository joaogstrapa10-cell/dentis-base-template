import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Grade de células separadas por fio, com ícone, nome e descrição — adaptada do
 * componente do 21st.dev/Aceternity que o cliente trouxe em 12/08.
 *
 * Vive num arquivo próprio porque é usada por DUAS seções, Áreas e Diferenciais,
 * a pedido do cliente. Duplicar a marcação nas duas garantiria divergência na
 * primeira correção: a lógica de bordas, o degradê de hover e a barra que cresce
 * são interdependentes, e um ajuste em uma cópia não apareceria na outra.
 *
 * O que define o componente, e veio do template:
 * - Moldura de FIOS em vez de cartões: nenhuma célula tem fundo, sombra ou raio
 *   próprios. É o mesmo vocabulário de hairline de Tratamentos e do FAQ.
 * - Realce de fundo em degradê que aponta para FORA da grade — sobe na fileira de
 *   cima, desce na de baixo.
 * - Barra vertical à esquerda do nome, que cresce de 24px para 32px e troca de
 *   cinza para petróleo no hover, com o nome deslizando um passo junto.
 *
 * O que foi trocado em relação ao original: todo `dark:` saiu (este projeto não
 * tem modo escuro por classe, as cores vêm de tokens), `text-lg`/`text-sm`
 * viraram `display-3`/`text-base` pela escala fechada de cinco degraus, o azul do
 * realce virou `--accent` (dourado não serve sobre fundo claro — em L 0.80 ele
 * desaparece), e o recuo interno caiu de `px-10` para `px-6`: em coluna de 280px,
 * 40px de cada lado quebram nome longo em três linhas.
 *
 * ⚠️ A grade é uniforme e tem ícone por item, dois padrões removidos da página em
 * 03/08. A volta foi pedido explícito do cliente, e o que a sustenta é que aqui as
 * descrições são PERMANENTES — a objeção de então era texto que só existia no
 * hover. Não devolver pill de tag nem cartão com fundo próprio.
 */

export type CelulaGrade = {
  /** Chave estável para a lista. Use o título, ou um id do conteúdo. */
  chave: string;
  titulo: string;
  descricao: string;
  /** Ícone já renderizado. Quem chama escolhe o conjunto — as especialidades usam
   *  os ícones dentais desenhados no projeto, diferenciais e tratamentos usam
   *  lucide. */
  icone: ReactNode;
  /** Conteúdo opcional abaixo da descrição. Existe para Tratamentos, onde cada
   *  eixo lista o que envolve; as outras duas seções não passam nada. */
  extra?: ReactNode;
};

export function GradeDeCelulas({
  itens,
  colunas = 4,
}: {
  itens: CelulaGrade[];
  /**
   * Quantas colunas em `lg`. Existe porque Tratamentos tem TRÊS eixos: numa grade
   * de quatro, a moldura pararia a três quartos do container e sobraria uma coluna
   * vazia à direita. Com três, o fio fecha na borda.
   */
  colunas?: 3 | 4;
}) {
  return (
    <ul
      className={cn(
        "relative z-10 grid grid-cols-1 md:grid-cols-2",
        colunas === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
      )}
    >
      {itens.map((item, i) => (
        <Celula
          key={item.chave}
          item={item}
          index={i}
          total={itens.length}
          colunas={colunas}
        />
      ))}
    </ul>
  );
}

function Celula({
  item,
  index,
  total,
  colunas,
}: {
  item: CelulaGrade;
  index: number;
  total: number;
  colunas: 3 | 4;
}) {
  /* A lógica de bordas do template supõe exatamente 8 itens em 4 colunas
     ("index < 4" = fileira de cima). Aqui ela é DERIVADA de `total`, e é isso que
     permite o mesmo componente servir Áreas (8 itens, duas fileiras) e
     Diferenciais (4 itens, uma fileira só) sem fio sobrando no meio — e servir as
     variantes das outras clínicas, que podem ter outra contagem. */
  const primeiraFileira = index < total - colunas;
  const inicioDeFileira = index % colunas === 0;

  return (
    <li
      className={cn(
        "group/celula relative flex flex-col py-9 lg:border-r lg:border-border",
        inicioDeFileira && "lg:border-l lg:border-border",
        // O fio de baixo é o que separa FILEIRAS, e a última fileira não tem
        // fileira depois — em cada arranjo de colunas ela é outra. Daí uma
        // remoção por degrau, em vez de um `lg:border-b-0` geral: essa versão
        // geral estava aqui e apagava também o fio ENTRE as duas fileiras de
        // Áreas, porque vinha depois na cascata e o twMerge dá a vitória ao
        // último. Medido: as quatro células de cima ficavam sem borda inferior.
        // No mobile ela também deixava um fio solto no pé da seção, na última
        // célula, sem nada embaixo dele.
        "border-b border-border",
        index === total - 1 && "max-md:border-b-0",
        index >= total - 2 && "md:border-b-0",
        index >= total - colunas && "lg:border-b-0",
      )}
    >
      {/* Realce de hover. `pointer-events-none` para não roubar o hover do próprio
          conteúdo. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full opacity-0 transition duration-200 group-hover/celula:opacity-100",
          primeiraFileira
            ? "bg-gradient-to-t from-accent/[0.07] to-transparent"
            : "bg-gradient-to-b from-accent/[0.07] to-transparent",
        )}
      />

      <div className="relative z-10 mb-4 px-6 text-muted transition-colors duration-200 group-hover/celula:text-accent">
        {item.icone}
      </div>

      <h3 className="relative z-10 mb-2 px-6">
        {/* `origin-center` mantém o crescimento da barra simétrico em torno do
            meio, em vez de ela descer. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 my-auto h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-border-strong transition-all duration-200 group-hover/celula:h-8 group-hover/celula:bg-accent"
        />
        <span className="display-3 inline-block text-foreground transition duration-200 group-hover/celula:translate-x-2">
          {item.titulo}
        </span>
      </h3>

      <p className="relative z-10 px-6 text-base leading-[1.6] text-muted">
        {item.descricao}
      </p>

      {item.extra ? (
        <div className="relative z-10 mt-5 px-6">{item.extra}</div>
      ) : null}
    </li>
  );
}
