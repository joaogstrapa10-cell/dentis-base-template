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
 * ⚠️ SEM KNOCKOUT no cruzamento, e isso foi MEDIDO, não escolhido. A saída clássica de
 * lettering para o script cruzar o zero é um halo na cor do fundo (`paint-order:
 * stroke`), e aqui ela destrói a peça: a haste da Qwitcher tem ~6 unidades de espessura
 * neste viewBox, então um halo de 4 come 2 de cada lado e a palavra some. Renderizado a
 * 0, 3, 4 e 5: só o ZERO preserva o "anos". O "a" encosta na borda do zero e se funde,
 * que é exatamente o que a referência faz.
 *
 * ⚠️ A geometria é MEDIDA: o conteúdo ocupa x 33,5..407,6 e y -0,5..257, e o viewBox é
 * essa caixa com 4 unidades de folga. `getBBox` NÃO inclui a espessura do traço, então
 * a metade dele (10,5) entra na conta à mão — sem isso o "30" sai cortado nas bordas.
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
      viewBox="30 -4 382 266"
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

      {/* "anos" cruzando o zero. O x=250 é o ponto em que o "a" encosta na borda
          direita do zero sem engolir o "n": medido contra 224, 242, 258 e 262. */}
      <text
        x="250"
        y="150"
        fill="currentColor"
        style={{ fontFamily: '"Qwitcher Grypen", cursive', fontWeight: 700, fontSize: 132 }}
      >
        {selo.palavra}
      </text>

      {/* "de experiência", centrado no eixo do lockup inteiro (220,5, e não no 236 do
          zero): o "30 anos" é assimétrico, então centrar pelo zero jogaria a linha
          visivelmente para a direita. */}
      <text
        x="220.5"
        y="238"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: '"Qwitcher Grypen", cursive', fontWeight: 700, fontSize: 64 }}
      >
        {selo.complemento}
      </text>
    </svg>
  );
}
