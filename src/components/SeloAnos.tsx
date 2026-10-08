import type { PortalSelo } from "@/content/types";

/**
 * SELO DE TEMPO DE EXERCÍCIO, desenhado aqui em SVG.
 *
 * Pedido de 07/10: "precisamos colocar esse selo na hero do site, é o de 30 anos de
 * experiencia, com a identidade da suzuki, ele é um print com marca d'agua e preciso
 * que faça".
 *
 * ⚠️ É VETOR E NÃO O PRINT, e os três motivos são de produto, não de preferência:
 * 1. O print tem MARCA D'ÁGUA de terceiro. Pôr a marca de outra empresa sobre uma
 *    afirmação da clínica é o oposto do que o selo existe para fazer.
 * 2. Print é raster. Aqui a peça renderiza de 104 a 132px e precisa ficar nítida em
 *    tela retina, onde isso vira 264px. Vetor é exato em qualquer tamanho e pesa ~2KB
 *    contra centenas de um PNG.
 * 3. A cor sai de `currentColor`, então o selo acompanha a paleta sozinho. Com o print
 *    ele ficaria preso nas cores do arquivo e sairia do tema na próxima troca, que é
 *    exatamente o defeito do `.slot-grid` em 30/07.
 *
 * ⚠️ O QUE O SELO **NÃO** DIZ, e isso é compliance e não enxugamento:
 * nada de "o melhor", "referência em Curitiba", "nº 1" nem laurel de premiação. Tempo
 * de exercício é dado profissional factual e é só isso que está aqui. Qualquer
 * superlativo entra na comparação com concorrente, que é o gesto que derrubou a seção
 * Comparativo em 03/08.
 *
 * ⚠️ E NÃO REPETE O WORDMARK. A tentação num selo é escrever "SUZUKI ODONTOLOGIA" no
 * arco de cima, mas ele fica logo ABAIXO da logo, que já traz as duas palavras. É o
 * mesmo defeito que apagou o lockup em 19/08, quando "odontologia" aparecia duas vezes
 * empilhada e o usuário reprovou na hora.
 *
 * Tipografia: Cinzel, a mesma que entrou em 05/10 para a linha que este selo
 * substitui. Capital romana, o registro do wordmark da própria arte do logo.
 */
export function SeloAnos({
  selo,
  className,
}: {
  selo: PortalSelo;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`${selo.numero} ${selo.linha1} ${selo.linha2}`}
      className={className}
      /* `currentColor` em tudo: quem define a cor é o elemento de fora, e o selo
         acompanha a paleta sem nenhum token cravado aqui. */
      fill="none"
    >
      {/* ANEL DUPLO. As duas opacidades diferentes é o que dá profundidade sem
          introduzir uma segunda cor: num campo escuro, dois fios brancos de mesmo peso
          leem como um traço grosso só. */}
      <circle cx="100" cy="100" r="96.5" stroke="currentColor" strokeWidth="1.25" opacity="0.5" />
      <circle cx="100" cy="100" r="87" stroke="currentColor" strokeWidth="0.75" opacity="0.26" />

      {/* Os dois pontos no eixo horizontal, entre os anéis. É o detalhe que faz a peça
          ler como SELO e não como "número dentro de um círculo". */}
      <circle cx="8.3" cy="100" r="2.1" fill="currentColor" opacity="0.5" />
      <circle cx="191.7" cy="100" r="2.1" fill="currentColor" opacity="0.5" />

      {/* O NÚMERO. `dominantBaseline` não é confiável entre navegadores em SVG, então a
          posição vertical sai do `y` medido, não de alinhamento automático. */}
      <text
        x="100"
        y="99"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: 78, fontWeight: 400 }}
      >
        {selo.numero}
      </text>

      {/* Filete separando o número do rótulo. Curto de propósito: encostar nos anéis
          fecharia o selo em duas metades. */}
      <line x1="66" y1="112" x2="134" y2="112" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />

      {/* ⚠️ `textTransform: uppercase` é REQUISITO e não estilo: a Cinzel é fonte de
          CAIXA ALTA, e minúscula nela renderiza como VERSALETE. Sem isto, "Anos de"
          sai com o A grande e o resto pequeno, o que lê como erro de digitação.

          RÓTULO EM DUAS LINHAS, e a quebra vem do CONTEÚDO (`linha1`/`linha2`), não de
          um `<tspan>` fixo: SVG não quebra texto sozinho, e partir por código no último
          espaço erraria em variante com rótulo de outro tamanho. */}
      <text
        x="100"
        y="136"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.92"
        style={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: 16, fontWeight: 400, letterSpacing: 2.6, textTransform: "uppercase" }}
      >
        {selo.linha1}
      </text>
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.92"
        style={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: 16, fontWeight: 400, letterSpacing: 2.6, textTransform: "uppercase" }}
      >
        {selo.linha2}
      </text>
    </svg>
  );
}
