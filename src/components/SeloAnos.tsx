import type { PortalSelo } from "@/content/types";
import {
  SELO_FIO,
  SELO_TRACO_30,
  SELO_TRACO_ANOS,
  SELO_TRACO_ROTULO,
  SELO_VAO,
  SELO_VIEWBOX,
} from "./seloAnosTracado";

/**
 * O "30 ANOS DE EXPERIÊNCIA" da tela de entrada, em LETTERING FINO (09/10).
 *
 * ⚠️ É A TERCEIRA FORMA DA PEÇA, e as duas anteriores estão no git. Em 07/10 era um
 * selo CIRCULAR (reprovado: "nao gostei", em `667bd9c`). Em 08/10 virou lettering com
 * um "30" monolinear desenhado à mão e "anos"/"de experiência" em script, a partir de
 * uma referência do Pinterest. Em 09/10 ele reprovou o PESO e a LETRA daquele "30" ("tá
 * muito grosso, 30, por exemplo, não é daquela fonte") e pediu que a peça fosse uma
 * MARCA, não uma legenda ("precisa ter uma logo ali"). Quatro selos foram desenhados e
 * renderizados na tela real, e ele escolheu este. **Não voltar ao círculo nem ao "30"
 * grosso sem pedido dele.**
 *
 * As três peças, e de onde vem cada uma:
 *   · "30" em Cormorant Garamond com algarismos alinhados, num peso 120 EXTRAPOLADO dos
 *     mestres 300 e 400 da própria fonte (P = P300 + (P300 − P400) × 1,8). A haste tem
 *     4,3% da altura do selo, contra 7,5% do "30" anterior. Abaixo do peso 50 o fio do
 *     pé do zero quebra, por isso parou em 120;
 *   · "anos" em Qwitcher Grypen 700, a MESMA fonte da assinatura do Dr. Dalton na
 *     coluna ao lado, encaixado no pé direito do zero;
 *   · "DE EXPERIÊNCIA" em Ubuntu 300, a face do "odontologia" da logo, justificado à
 *     largura do fio que fecha o bloco.
 *
 * ⚠️ TUDO É CONTORNO (path), não `<text>`, e por isso não depende de fonte nenhuma
 * carregar: Cormorant e Ubuntu nem são servidas pelo site. A contrapartida é que o
 * texto desenhado é FIXO — `selo.numero/palavra/complemento` só alimentam o
 * `aria-label`. Numa variante com outro número (Rogério, Décio), os contornos têm de
 * ser regerados a partir do mestre em `docs/marca/selo-30-anos-lettering-fino-claro.svg`.
 *
 * ⚠️ O "anos" CRUZA o pé do zero, e o que impede a fusão das duas peças (o defeito de
 * 08/10, "o anos esta zoado, esta atras do 30") é um VÃO aberto NO ALGARISMO por
 * máscara: retângulo branco + o próprio "anos" em preto com traço de `SELO_VAO`. Nunca
 * halo no script — numa cursiva os glifos se sobrepõem, e o halo de um come o vizinho.
 * O `#fff`/`#000` da máscara é luminância, não pinta nada; toda tinta é `currentColor`.
 *
 * ⚠️ `overflow="visible"` na raiz é REQUISITO enquanto a paleta A estiver em teste: ela
 * põe `border-radius: .5rem` em todo `[role="img"]`, e com o overflow padrão os cantos
 * cortavam o "D" e o "A" do rótulo (visto no render).
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
      viewBox={SELO_VIEWBOX}
      role="img"
      aria-label={`${selo.numero} ${selo.palavra} ${selo.complemento}`}
      className={className}
      fill="none"
      overflow="visible"
    >
      <defs>
        {/* `maskUnits` em espaço do usuário e cobrindo o viewBox inteiro: em
            `objectBoundingBox` a máscara mediria a caixa do "30" e cortaria a ponta do
            algarismo que passa dela. */}
        <mask id="selo-anos-vao" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="300">
          <rect x="0" y="0" width="300" height="300" fill="#fff" />
          <path
            d={SELO_TRACO_ANOS}
            fill="#000"
            stroke="#000"
            strokeWidth={SELO_VAO}
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <g mask="url(#selo-anos-vao)">
        <path d={SELO_TRACO_30} fill="currentColor" />
      </g>
      <path d={SELO_TRACO_ANOS} fill="currentColor" />
      <path d={SELO_TRACO_ROTULO} fill="currentColor" />
      <rect
        x={SELO_FIO.x}
        y={SELO_FIO.y}
        width={SELO_FIO.largura}
        height={SELO_FIO.altura}
        fill="currentColor"
      />
    </svg>
  );
}
