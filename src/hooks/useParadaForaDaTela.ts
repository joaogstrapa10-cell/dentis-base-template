import { useEffect, useRef } from "react";

/**
 * Marca o elemento com `fora-de-vista` enquanto ele não está na janela, para o CSS
 * poder PARAR o que estiver animando dentro dele.
 *
 * ⚠️ Existe por causa do celular. As três esteiras do site rodam em laço infinito e
 * cada uma carrega uma faixa larga de imagens com `mask-image` por cima — mesmo fora
 * da tela, o compositor mantém essas camadas vivas e trabalhando a cada quadro. Num
 * desktop isso não aparece; num telefone é bateria e engasgo na rolagem, que foi o que
 * o usuário reportou em 15/09 ("no celular o scroll está travando muito").
 *
 * `rootMargin` de 200px: volta a andar um pouco ANTES de entrar na tela, senão a
 * primeira fração de segundo da esteira aparece parada.
 *
 * Complementa, e não substitui, o `body.pausado` do `__root.tsx` — aquele cobre a aba
 * escondida, este cobre a seção fora de vista na aba ativa.
 */
export function useParadaForaDaTela<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(
      ([entrada]) => el.classList.toggle("fora-de-vista", !entrada.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return ref;
}
