import { useEffect, useRef, useState } from "react";
import type { AberturaContent } from "@/content/types";

/**
 * TELA DE ENTRADA: fundo no verde padrão, a marca em cima e três pontos embaixo. Ao
 * rolar, os elementos se AFASTAM e CRESCEM, como se a página passasse por dentro
 * deles, e o site começa atrás.
 *
 * Pedida pelo usuário em 19/08: "quando abra o site, apareça uma tela no verde
 * padrão, com o logo em cima e, embaixo, algum detalhe (...) quando vai fazer a
 * rolagem do mouse, esses elementos da primeira página sejam afastados: você dá zoom
 * neles, eles aparecem e faz a introdução para o hero. O resto da página depois
 * disso, como se fosse uma tela de carregamento entre aspas."
 *
 * ⚠️ O AFASTAMENTO COM ZOOM É A COREOGRAFIA DO TEMPLATE DO FERRARI, que ele mandou
 * REMOVER da arcada na mesma manhã ("é para ela manter do mesmo tamanho que inicia,
 * sem o efeito de aproximação"). Voltou aqui por pedido explícito, e numa peça
 * diferente: lá ela disputava com um vídeo que precisava ser lido quadro a quadro,
 * aqui ela É o conteúdo. Não é reintrodução por descuido — se aparecer pedido para
 * tirar de novo, é este componente, não a arcada.
 *
 * ── ORDEM NA PÁGINA ────────────────────────────────────────────────────────────
 * Esta tela vem ANTES da arcada, por escolha dele entre três opções. A marca aparece
 * duas vezes seguidas, então, e isso é deliberado: aqui ela CRESCE e atravessa a
 * tela, e na arcada está em repouso no tamanho normal. O que o §9 registra como
 * defeito é a mesma marca em DOIS TAMANHOS AO MESMO TEMPO, não em sequência.
 *
 * ⚠️ Custo de rolagem: 1,4 tela até o hero estar em posição. Se incomodar, é
 * `TRILHO_MULT` aqui — mas o piso é o próprio palco, que tem uma tela de altura e
 * precisa sair de cena antes do hero entrar. Abaixo de ~0,3 o gesto passa antes de
 * ser lido.
 */

/** Quantas telas de ROLAGEM a seção tem além da tela parada. */
const TRILHO_MULT = 0.4;

/**
 * ⚠️ ONDE OS ELEMENTOS ACABAM DE SE APAGAR, em fração do curso TOTAL da seção — e
 * "total" aqui inclui a SAÍDA do palco, não só o trecho em que ele está grudado.
 *
 * Esse detalhe era o defeito reportado em 19/08: "ao terminar o scroll inicial (...)
 * ainda demora um pouco para ele aparecer, tem um baita espaço". A conta antiga dividia
 * pelo trecho grudado (`altura - innerHeight`), então a opacidade chegava a ZERO com o
 * palco ainda ocupando a tela inteira — e sobrava UMA TELA CHEIA de verde vazio rolando
 * antes do hero. Medido: no fim do curso a marca estava em opacidade 0 e o topo do hero
 * a 900px de distância.
 *
 * Dividindo pela altura INTEIRA, o apagamento termina junto com a seção: as peças
 * continuam na tela enquanto o palco desliza para cima e o hero sobe por baixo. Em
 * nenhum momento a tela fica vazia.
 */
const APAGA_DE = 0.72;
const APAGA_ATE = 1;

/**
 * Deslocamento máximo, em fração da altura da tela. A marca sobe, os pontos descem.
 *
 * Menores do que eram (0,42 e 0,38) porque agora boa parte do curso é a SAÍDA do
 * palco, e nela a rolagem da página já carrega tudo para cima de graça. Somar o
 * deslocamento antigo em cima disso jogava as peças fora do quadro cedo demais, o que
 * recriava a tela vazia por outro caminho.
 */
const SOBE_MARCA = 0.22;
const DESCE_PONTOS = 0.2;

/** Afastamento lateral do ponto da ponta, em fração da largura da tela. O do meio não
 *  anda — é ele que dá a sensação de a página passar por dentro do grupo. */
const ABRE_LADOS = 0.26;

/** Quanto tudo cresce ao longo do curso. */
const ZOOM = 0.7;

export const PORTAL_VH = (TRILHO_MULT + 1) * 100;

const trava01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function AberturaPortal({ data }: { data: AberturaContent }) {
  const trilhoRef = useRef<HTMLElement | null>(null);
  const marcaRef = useRef<HTMLDivElement | null>(null);
  const pontosRef = useRef<HTMLDivElement | null>(null);
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
      const pontos = pontosRef.current;
      if (!trilho || !marca || !pontos) return;

      /* O progresso sai da fração que o TRILHO desta seção já rolou por dentro de si,
         nunca de `window.scrollY`. É o mecanismo provado quatro vezes neste projeto
         (órbita, arcada em quadros, arcada em vídeo, marca) — e aqui daria certo por
         acidente, porque esta É a primeira seção; usar `scrollY` deixaria uma bomba
         para o dia em que algo entrar antes dela. */
      /* ⚠️ Divide pela altura INTEIRA da seção, não por `altura - innerHeight`. O
         segundo mede só o trecho em que o palco está GRUDADO, e usá-lo faz a animação
         terminar com o palco ainda ocupando a tela toda — sobrando uma tela cheia de
         verde vazio antes do hero. Ver a nota de `APAGA_ATE`. */
      const caixa = trilho.getBoundingClientRect();
      const p = caixa.height > 0 ? trava01(-caixa.top / caixa.height) : 0;

      const escala = 1 + p * ZOOM;
      const opacidade =
        p <= APAGA_DE
          ? 1
          : 1 - trava01((p - APAGA_DE) / (APAGA_ATE - APAGA_DE));

      /* ⚠️ `translate3d` ANTES de `scale`: a escala é aplicada primeiro e o
         deslocamento depois, em px NÃO escalados. Invertida, o afastamento viria
         multiplicado pelo zoom e as peças sairiam da tela cedo demais. Registrado em
         19/08 na abertura. */
      marca.style.transform = `translate3d(0, ${(-p * SOBE_MARCA * window.innerHeight).toFixed(1)}px, 0) scale(${escala.toFixed(4)})`;
      marca.style.opacity = opacidade.toFixed(3);
      pontos.style.transform = `translate3d(0, ${(p * DESCE_PONTOS * window.innerHeight).toFixed(1)}px, 0) scale(${escala.toFixed(4)})`;
      pontos.style.opacity = opacidade.toFixed(3);

      /* Abertura lateral: o ponto do meio fica, os das pontas saem para os lados. */
      const filhos = pontos.children;
      for (let i = 0; i < filhos.length; i++) {
        const lado = i - (filhos.length - 1) / 2;
        (filhos[i] as HTMLElement).style.transform = `translate3d(${(lado * p * ABRE_LADOS * window.innerWidth).toFixed(1)}px, 0, 0)`;
      }
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [semAnimacao]);

  const marcaEl = data.marca ? (
    <img
      src={data.marca}
      alt={data.marcaAlt}
      /* Maior que a da arcada de propósito: aqui ela é a primeira coisa do site e não
         divide a tela com nada; lá ela divide com o quadro do vídeo. */
      className="w-[min(66vw,17rem)] md:w-[min(30vw,23rem)]"
    />
  ) : null;

  const pontosEl = data.pontos.map((ponto) => (
    <div key={ponto.titulo} className="flex-1 basis-0 px-2 md:px-4">
      {/* O "detalhe visual" do pedido: um fio dourado curto sobre cada ponto. Fio e
          não pill, ícone ou numeral — os três estão na lista do que não volta, e o
          ícone já é o vocabulário dos carrosséis. */}
      <span aria-hidden className="mb-4 block h-px w-10 bg-gold md:mb-5 md:w-14" />
      <h2 className="display-3 text-ink-foreground">{ponto.titulo}</h2>
      <p className="mt-2 text-small leading-[1.5] text-ink-muted md:text-base">
        {ponto.texto}
      </p>
    </div>
  ));

  /* ── SEM ANIMAÇÃO: a mesma tela, parada, sem trilho. O conteúdo é a marca e os três
        pontos, e nenhum dos dois depende do movimento para ser lido. ── */
  if (semAnimacao) {
    return (
      <section id="portal" className="bg-ink px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-14 text-center">
          {marcaEl}
          <div className="flex w-full flex-col gap-10 md:flex-row md:gap-6">{pontosEl}</div>
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
      {/* ⚠️ `overflow-hidden` AQUI, no próprio palco, e não em nenhum ancestral: o
          afastamento manda as peças para fora da tela e sem recorte elas ALARGAM a
          página — medido em 997px de rolagem horizontal no desktop antes disso. Pôr o
          recorte num ANCESTRAL do `sticky` mataria a grudagem (custou uma rodada na
          Bio em 13/08); no próprio elemento `sticky` é seguro, porque o contêiner de
          rolagem dele continua sendo a janela. */}
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-12 overflow-hidden px-6 text-center md:gap-16">
        <div ref={marcaRef} className="will-change-transform">
          {marcaEl}
        </div>
        <div
          ref={pontosRef}
          className="flex w-full max-w-[62rem] flex-col gap-10 will-change-transform md:flex-row md:gap-4 md:text-left"
        >
          {pontosEl}
        </div>
      </div>
    </section>
  );
}
