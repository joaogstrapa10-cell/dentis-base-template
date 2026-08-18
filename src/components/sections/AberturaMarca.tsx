import { useEffect, useRef, useState } from "react";

/**
 * AberturaMarca: a primeira tela da home. A marca da Suzuki ao centro, no bloco escuro,
 * e nada mais. Ao rolar ela encolhe e sai, e o HERO entra embaixo.
 *
 * ⚠️ ESTA SEÇÃO SUBSTITUIU A ABERTURA EM VÍDEO, apagada em 18/08 a pedido do usuário
 * ("desisti de fazer isso, manter o hero no início do site, mas talvez manter a ideia da
 * sessão inicial com a logo da Suzuki ao meio e ao scrollar aparecer o hero").
 *
 * O que morreu com ela, e o histórico está no git — não reconstruir de memória:
 *   · o trilho de 210vh com palco `sticky`;
 *   · a escrubagem do vídeo pelo `currentTime` comandada pela rolagem;
 *   · a viagem da arcada até o slot do hero, com destino medido em runtime;
 *   · a troca por crossfade do vídeo para a imagem final;
 *   · o destravamento do iOS por `play()`/`pause()` no primeiro toque.
 * Os arquivos de vídeo continuam em `public/imagens/arcada/` e o conteúdo continua em
 * `clinica.arcada`, então voltar atrás é `git revert`, não refazer.
 *
 * ⚠️ E a arcada NÃO desapareceu do site: ela é a figura do HERO, ao lado do texto, e
 * ficou 40% maior justamente porque o vídeo saiu — era ele que obrigava a imagem a ser o
 * quadro 16:9 inteiro, com ~15% de vazio em cada lado, para a descida aterrissar sobre
 * ela sem salto. Ver a nota em `clinica.hero.arcada`.
 *
 * Custo de rolagem: UMA tela, contra 2,1 da versão em vídeo.
 */

/**
 * Altura da abertura, em vh. O Header importa: é ele que precisa saber quando ela acaba
 * para revelar a navegação. Um número, num lugar só.
 *
 * 100vh é deliberado: a abertura é uma tela e o hero começa na seguinte. Mais que isso
 * vira espera; menos, e a marca não tem um momento sozinha.
 */
export const ABERTURA_VH = 100;

export function AberturaMarca({
  logo,
  logoAlt,
  wordmark,
}: {
  /** Marca CLARA. É a mesma do header — não é asset novo. `null` cai no wordmark. */
  logo?: string | null;
  logoAlt?: string;
  /** Texto de reserva quando não há arquivo de logo. */
  wordmark?: string;
}) {
  const secaoRef = useRef<HTMLElement | null>(null);
  const marcaRef = useRef<HTMLDivElement | null>(null);
  const [semAnimacao, setSemAnimacao] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemAnimacao(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  useEffect(() => {
    if (semAnimacao) return;
    let raf = 0;
    /* Escreve `style` direto por ref, sem passar por estado do React: o progresso muda
       a cada quadro de rolagem, e `setState` aí dentro forçaria um re-render por quadro.
       Foi a lição da versão em vídeo. */
    const quadro = () => {
      raf = requestAnimationFrame(quadro);
      const sec = secaoRef.current;
      const marca = marcaRef.current;
      if (!sec || !marca) return;
      const r = sec.getBoundingClientRect();
      /* Fora da tela não custa nada. */
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const curso = r.height || 1;
      const p = Math.min(1, Math.max(0, -r.top / curso));
      /* Encolhe e desaparece nos primeiros 70% da tela: aos 70% já saiu, então o hero
         entra num campo limpo em vez de disputar a atenção com a marca sumindo. */
      const f = Math.min(1, p / 0.7);
      marca.style.opacity = String(1 - f);
      marca.style.transform = `scale(${1 - 0.28 * f})`;
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [semAnimacao]);

  const marca = logo ? (
    <img
      src={logo}
      alt={logoAlt ?? ""}
      /* Grande de verdade, que era o pedido de 17/08: metade da largura da janela no
         desktop, quase toda no celular. Teto em `rem` para não virar cartaz em monitor
         ultralargo. */
      className="w-[min(50vw,34rem)] max-w-[86vw]"
    />
  ) : (
    <span className="display-1 text-ink-foreground">{wordmark}</span>
  );

  /* Sem animação: a marca fica parada, e a seção encurta para não custar uma tela de
     rolagem a quem desligou movimento. */
  if (semAnimacao) {
    return (
      <section
        id="abertura"
        className="relative flex items-center justify-center bg-ink px-8 py-24"
      >
        {marca}
      </section>
    );
  }

  return (
    <section
      ref={secaoRef}
      id="abertura"
      className="relative bg-ink"
      style={{ height: `${ABERTURA_VH}svh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-8">
        <div ref={marcaRef} style={{ willChange: "transform, opacity" }}>
          {marca}
        </div>
      </div>
    </section>
  );
}
