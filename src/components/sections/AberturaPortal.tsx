import { useEffect, useRef, useState } from "react";
import type { AberturaContent } from "@/content/types";

/**
 * TELA DE ENTRADA: fundo no verde padrão e a marca da Suzuki, sozinha, no centro. Ao
 * rolar, ela CRESCE e SOBE, como se a página passasse por dentro dela, e o hero
 * aparece atrás.
 *
 * Pedida pelo usuário em 19/08 ("uma tela no verde padrão, com o logo em cima (...)
 * ao rolar, esses elementos sejam afastados, você dá zoom neles (...) como se fosse
 * uma tela de carregamento entre aspas").
 *
 * ⚠️ A ESCRITA SAIU EM 20/08, a pedido: "tirar a escrita da sessão do scroll, deixar
 * somente a logo". Eram três pontos com um fio dourado — corpo clínico de
 * especialistas, casos de alta complexidade, planejamento antes de execução — e a copy
 * deles NÃO se perdeu: ela era a de `diferenciais.itens`, encurtada, e continua
 * inteira na seção "Experiência aplicada caso a caso". O tipo `PortalPonto` e o campo
 * `pontos` saíram do conteúdo em vez de virarem opcionais, pela regra do projeto:
 * campo morto é convite a reintroduzir o padrão. Estão no git, em `9a77fdf`.
 *
 * ⚠️ Isso deixa esta tela com a MESMA FORMA do `AberturaMarca.tsx` que existiu em
 * 18/08 e foi apagado. A diferença é o gesto: lá a marca só se apagava nos primeiros
 * pixels, aqui ela cresce e atravessa a tela ao longo do curso. Se o pedido voltar a
 * ser "só a logo parada", o componente de 18/08 é o ponto de partida.
 *
 * ⚠️ O AFASTAMENTO COM ZOOM É A COREOGRAFIA DO TEMPLATE DO FERRARI, que ele mandou
 * REMOVER da arcada na manhã de 19/08 ("é para ela manter do mesmo tamanho que
 * inicia, sem o efeito de aproximação"). Voltou aqui por pedido explícito e numa peça
 * diferente: lá disputava com um vídeo que precisa ser lido quadro a quadro, aqui ela
 * É o conteúdo. Se aparecer pedido para tirar de novo, é este componente.
 *
 * ⚠️ Custo de rolagem: 1,4 tela até o hero estar em posição. Se incomodar, é
 * `TRILHO_MULT` aqui — mas o piso é o próprio palco, que tem uma tela de altura e
 * precisa sair de cena antes do hero entrar. Abaixo de ~0,3 o gesto passa antes de
 * ser lido.
 */

/** Quantas telas de ROLAGEM a seção tem além da tela parada. */
const TRILHO_MULT = 0.4;

/**
 * ⚠️ ONDE A MARCA ACABA DE SE APAGAR, em fração do curso TOTAL da seção — e "total"
 * aqui inclui a SAÍDA do palco, não só o trecho em que ele está grudado.
 *
 * Esse detalhe era o defeito reportado em 19/08: "ao terminar o scroll inicial (...)
 * ainda demora um pouco para ele aparecer, tem um baita espaço". A conta antiga dividia
 * pelo trecho grudado (`altura - innerHeight`), então a opacidade chegava a ZERO com o
 * palco ainda ocupando a tela inteira — e sobrava UMA TELA CHEIA de verde vazio rolando
 * antes do hero. Medido: no fim do curso a marca estava em opacidade 0 e o topo do hero
 * a 900px de distância.
 *
 * Dividindo pela altura INTEIRA, o apagamento termina junto com a seção: a marca
 * continua na tela enquanto o palco desliza para cima e o hero sobe por baixo. Em
 * nenhum momento a tela fica vazia.
 */
const APAGA_DE = 0.72;
const APAGA_ATE = 1;

/**
 * Deslocamento máximo da marca, em fração da altura da tela.
 *
 * Modesto de propósito: boa parte do curso é a SAÍDA do palco, e nela a rolagem da
 * página já carrega a marca para cima de graça. Somar deslocamento demais em cima
 * disso a joga fora do quadro cedo, o que recria a tela vazia por outro caminho.
 */
const SOBE_MARCA = 0.26;

/**
 * Quanto a marca cresce ao longo do curso.
 *
 * Subiu de 0,7 para 0,9 quando a escrita saiu, em 20/08: sozinha na tela, ela carrega
 * o gesto inteiro, e o crescimento que bastava dividindo a atenção com três blocos de
 * texto ficava discreto demais.
 */
const ZOOM = 0.9;

export const PORTAL_VH = (TRILHO_MULT + 1) * 100;

const trava01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function AberturaPortal({ data }: { data: AberturaContent }) {
  const trilhoRef = useRef<HTMLElement | null>(null);
  const marcaRef = useRef<HTMLDivElement | null>(null);
  const [semAnimacao, setSemAnimacao] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplica = () => setSemAnimacao(mq.matches);
    aplica();
    mq.addEventListener("change", aplica);
    return () => mq.removeEventListener("change", aplica);
  }, []);

  useEffect(() => {
    if (semAnimacao) return;
    let raf = 0;
    const quadro = () => {
      raf = requestAnimationFrame(quadro);
      const trilho = trilhoRef.current;
      const marca = marcaRef.current;
      if (!trilho || !marca) return;

      /* O progresso sai da fração que o TRILHO desta seção já rolou por dentro de si,
         nunca de `window.scrollY`. É o mecanismo provado quatro vezes neste projeto
         (órbita, arcada em quadros, arcada em vídeo, marca) — e aqui daria certo por
         acidente, porque esta É a primeira seção; usar `scrollY` deixaria uma bomba
         para o dia em que algo entrar antes dela.

         ⚠️ Divide pela altura INTEIRA da seção, não por `altura - innerHeight`. O
         segundo mede só o trecho em que o palco está GRUDADO, e usá-lo faz a animação
         terminar com o palco ainda ocupando a tela toda — sobrando uma tela cheia de
         verde vazio antes do hero. Ver a nota de `APAGA_ATE`. */
      const caixa = trilho.getBoundingClientRect();
      const p = caixa.height > 0 ? trava01(-caixa.top / caixa.height) : 0;

      const escala = 1 + p * ZOOM;
      const opacidade =
        p <= APAGA_DE ? 1 : 1 - trava01((p - APAGA_DE) / (APAGA_ATE - APAGA_DE));

      /* ⚠️ `translate3d` ANTES de `scale`: a escala é aplicada primeiro e o
         deslocamento depois, em px NÃO escalados. Invertida, o deslocamento viria
         multiplicado pelo zoom e a marca sairia da tela cedo demais. Registrado em
         19/08 na abertura. */
      marca.style.transform = `translate3d(0, ${(-p * SOBE_MARCA * window.innerHeight).toFixed(1)}px, 0) scale(${escala.toFixed(4)})`;
      marca.style.opacity = opacidade.toFixed(3);
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [semAnimacao]);

  const marcaEl = data.marca ? (
    <img
      src={data.marca}
      alt={data.marcaAlt}
      /* Maior desde 20/08, quando a escrita saiu: sozinha no centro de uma tela cheia,
         a marca precisa de presença que ela não precisava tendo três blocos de texto
         embaixo. O teto em `rem` existe para ela não virar cartaz em monitor
         ultralargo. */
      className="w-[min(72vw,19rem)] md:w-[min(34vw,26rem)]"
    />
  ) : null;

  /* ── SEM ANIMAÇÃO: a mesma tela, parada, sem trilho. O conteúdo é a marca, e ela não
        depende do movimento para ser lida. ── */
  if (semAnimacao) {
    return (
      <section id="portal" className="bg-ink px-6 py-28 md:py-36">
        <div className="mx-auto flex max-w-[64rem] flex-col items-center text-center">
          {marcaEl}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trilhoRef}
      id="portal"
      className="relative bg-ink"
      style={{ height: `${PORTAL_VH}svh` }}
    >
      {/* ⚠️ `overflow-hidden` AQUI, no próprio palco, e não em nenhum ancestral: a
          marca cresce até quase o dobro e sem recorte ela ALARGA a página — medido em
          997px de rolagem horizontal no desktop, quando havia também os pontos saindo
          para os lados. Pôr o recorte num ANCESTRAL do `sticky` mataria a grudagem
          (custou uma rodada na Bio em 13/08); no próprio elemento `sticky` é seguro,
          porque o contêiner de rolagem dele continua sendo a janela. */}
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6 text-center">
        <div ref={marcaRef} className="will-change-transform">
          {marcaEl}
        </div>
      </div>
    </section>
  );
}
