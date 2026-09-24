/**
 * PISTA DE ROLAGEM: rótulo curto e uma seta que desce e sobe.
 *
 * ⚠️ É UM COMPONENTE, e não markup repetido, por pedido de 24/09: "o sinal da
 *    scroll também precisa ser o mesmo". Duas cópias do mesmo gesto divergem na
 *    primeira correção — e neste projeto isso já aconteceu com o aviso da galeria,
 *    que virou componente pela mesma razão.
 *
 * Quem posiciona é quem usa: a tela de entrada a ancora no pé do palco, a chamada
 * em rolagem a ancora no pé da tela. A opacidade também é de quem usa, porque as
 * duas seções a apagam com a própria curva de rolagem.
 */
export function PistaDeRolagem({
  rotulo,
  innerRef,
  className,
  style,
}: {
  rotulo: string;
  innerRef?: React.Ref<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div ref={innerRef} aria-hidden="true" className={className} style={style}>
      <span className="text-small uppercase tracking-[0.14em]">{rotulo}</span>
      <svg
        viewBox="0 0 24 24"
        className="seta-rolagem h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M6 13l6 6 6-6" />
      </svg>
    </div>
  );
}
