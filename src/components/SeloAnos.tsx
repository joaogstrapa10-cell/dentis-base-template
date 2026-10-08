import type { PortalSelo } from "@/content/types";

/**
 * O "30 ANOS DE EXPERIÊNCIA" da tela de entrada, em LETTERING desenhado aqui.
 *
 * ⚠️ ESTA É A SEGUNDA FORMA DA PEÇA, e a primeira foi reprovada. Em 07/10 ela era um
 * SELO CIRCULAR (anel duplo, "30" em Cinzel no meio, rótulo em caixa alta embaixo) e o
 * usuário respondeu "nao gostei", mandando uma referência: um lockup de lettering com o
 * "30" em traço monolinear vazado e a palavra "anos" em script cruzando o zero. Está no git,
 * em `667bd9c`. **Não voltar ao círculo sem pedido dele.**
 *
 * Da referência entrou o GESTO e não os elementos: ele pediu "somente o 30 anos, sem o
 * resto das informacoes e elementos do png", então ficaram de fora o bloco de texto, o
 * "YOUR LOGO HERE" e os arcos decorativos. "De experiência" foi pedido na mensagem
 * seguinte, "com a mesma fonte de anos".
 *
 * ⚠️ O "30" É PATH DESENHADO À MÃO, não fonte com contorno, e a diferença decide o
 * resultado: aplicar `stroke` numa fonte contorna a SILHUETA da letra e sai com fio
 * duplo. A referência é MONOLINEAR, ou seja um traço só de espessura constante, que é
 * o que um `path` sem preenchimento com `stroke-linecap: round` dá.
 *
 * ⚠️ O SCRIPT É A QWITCHER GRYPEN, a mesma da assinatura do Dr. Dalton na coluna ao
 * lado, e isso é requisito de composição: duas cursivas diferentes na mesma tela leem
 * como erro. Com a mesma família, o "anos" e a assinatura rimam e a tela fica com UMA
 * voz manuscrita.
 *
 * ⚠️ O "anos" NÃO CRUZA O ZERO, e isso é conserto de um defeito que ele reportou: na
 * primeira versão a palavra começava em x=250, ou seja DENTRO do anel, e como as duas
 * peças têm a mesma cor ela se fundia com o traço — "o anos esta zoado, esta atras do
 * 30". A referência cruza porque tem KNOCKOUT (halo na cor do fundo), e aqui o halo foi
 * MEDIDO e destrói a peça: a haste da Qwitcher tem ~6 unidades de espessura neste
 * viewBox, então um halo de 4 come 2 de cada lado e a palavra some (renderizado a 0, 3,
 * 4, 5, 9 e 13 — só o ZERO preserva o "anos"). Sem knockout possível, a saída é a
 * distância: x=326 é a borda externa do zero (236 + 78 + 10,5 = 324,5), ou seja o "a"
 * encosta sem nenhuma sobreposição de traço. O gesto de lockup se mantém pela ALTURA —
 * a linha de base do "anos" está em 150 contra o centro do zero em 89, então a palavra
 * fica encaixada embaixo e à direita, e não enfileirada ao lado.
 *
 * ⚠️ A geometria é MEDIDA, e os números vêm todos de `getBBox` no navegador: o "30"
 * ocupa x 33,5..324,5 e y -0,5..178,5; o "anos" a 132px mede 156,5 de largura, 106
 * acima e 40 abaixo da base; o "de experiência" a 96px mede 340,7 de largura, 77 acima
 * e 29 abaixo. `getBBox` NÃO inclui a espessura do traço, então a metade dele (10,5)
 * entra na conta à mão — sem isso o "30" sai cortado nas bordas.
 */

/** O "3" monolinear. Bojos grandes e lado esquerdo reto, que é a forma da referência:
 *  um "3" clássico tem o lado esquerdo aberto e ficou longe no primeiro render. */
const TRACO_TRES =
  "M 44 40 C 44 18 70 10 100 10 C 136 10 152 30 152 54 C 152 76 134 88 108 88 " +
  "C 138 88 158 102 158 128 C 158 154 134 168 100 168 C 66 168 44 156 44 136";

export function SeloAnos({
  selo,
  className,
}: {
  selo: PortalSelo;
  className?: string;
}) {
  return (
    <svg
      viewBox="29.5 -4.5 457 308.5"
      role="img"
      aria-label={`${selo.numero} ${selo.palavra} ${selo.complemento}`}
      className={className}
      fill="none"
    >
      <path
        d={TRACO_TRES}
        stroke="currentColor"
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="236" cy="89" rx="78" ry="79" stroke="currentColor" strokeWidth="21" />

      {/* "anos" encaixado embaixo e à direita do zero, encostando na borda externa dele
          (324,5) e sem cruzar o traço. Medido contra 250 (a versão reprovada, dentro do
          anel), 296 e 310: nas três a palavra se funde com o fio em alguma altura. */}
      <text
        x="326"
        y="150"
        fill="currentColor"
        style={{ fontFamily: '"Qwitcher Grypen", cursive', fontWeight: 700, fontSize: 132 }}
      >
        {selo.palavra}
      </text>

      {/* "de experiência", centrado no eixo do lockup inteiro (258, meio de 33,5..482,5, e
          não no 236 do zero): o "30 anos" é assimétrico, então centrar pelo zero jogaria
          a linha visivelmente para a esquerda.

          96px e não 64: a pedido ("aumentar o 'de experiencia' e deixar visivel muito
          bem"). A base em 271 é o pé do "anos" (190) mais 4 de vão mais os 77 que o "d"
          e o circunflexo sobem — o vão é pequeno de propósito, porque a massa da palavra
          é a altura de x e fica bem mais abaixo do topo da caixa. Renderizado com vão
          20, 4 e -8: a 20 as duas linhas se soltam uma da outra, a -8 o "d" encosta no
          pé do zero. */}
      <text
        x="258"
        y="271"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: '"Qwitcher Grypen", cursive', fontWeight: 700, fontSize: 96 }}
      >
        {selo.complemento}
      </text>
    </svg>
  );
}
