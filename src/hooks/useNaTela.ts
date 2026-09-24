import { useEffect, useRef, useState } from "react";

/**
 * Diz, em JS, se o elemento está na janela.
 *
 * ⚠️ É o IRMÃO do `useParadaForaDaTela`, e a diferença importa: aquele marca uma
 * CLASSE para o CSS congelar animação declarativa (as esteiras em laço); este
 * devolve um BOOLEANO, porque quem precisa parar aqui é um `setInterval` em JS.
 *
 * Existe pelo mesmo motivo registrado em 15/09: no celular, trabalho por quadro
 * numa seção que já passou é bateria e engasgo na rolagem. E tem um efeito de
 * PRODUTO além do desempenho, que num carrossel é o principal: sem isto a pilha
 * anda sozinha enquanto a pessoa lê dez telas abaixo, e quando ela volta a seção
 * está numa posição aleatória, sem relação com o que deixou.
 *
 * `rootMargin` de 200px, igual ao irmão: volta a andar um pouco antes de entrar
 * na tela, senão o primeiro instante aparece parado.
 */
export function useNaTela<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  /* Começa VERDADEIRO de propósito: sem `IntersectionObserver` (ou antes do
     primeiro disparo dele) o certo é o carrossel funcionar, não ficar parado. */
  const [naTela, setNaTela] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(
      ([entrada]) => setNaTela(entrada.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return { ref, naTela };
}
