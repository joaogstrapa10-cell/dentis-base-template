import { useEffect, useRef, useState } from "react";
import type { ArcadaContent, ArcadaEtapa } from "@/content/types";

/**
 * ArcadaHero: abertura da página. Uma arcada se formando conforme a rolagem
 * avança — gengiva com os leitos, implantes, coroas — dentro de uma mídia que
 * começa pequena e em retrato e termina larga, quase ocupando a janela. Quando
 * ela acaba de abrir, o site começa embaixo.
 *
 * É o template `scroll-expansion-hero` que o usuário mandou (duas vezes, em
 * 17/08). Sem título, sem legenda, sem régua de etapas: ele foi explícito —
 * "não quero que tenha essa seção de explicação", "não é para mostrar os
 * elementos". A peça é só a animação.
 *
 * O QUE VEIO DO TEMPLATE
 * - a mídia crescendo com a rolagem, de caixa pequena a quase a janela inteira;
 * - a mudança de PROPORÇÃO junto com o tamanho (lá 300×400 → 1550×800). É o que
 *   dá a sensação de abrir: começa em retrato, mostrando o miolo da arcada, e ao
 *   alargar revela a arcada inteira de molar a molar;
 * - o véu escuro sobre a mídia, clareando conforme ela expande;
 * - o conteúdo do site aparecendo depois que ela termina de abrir.
 *
 * ⚠️ O QUE NÃO VEIO, E É A ÚNICA DIVERGÊNCIA
 * O template comanda o progresso sequestrando a rolagem: `wheel` e `touchmove`
 * com `preventDefault`, mais um handler de `scroll` que chama `window.scrollTo(0,0)`
 * enquanto a mídia não terminou. Três coisas quebram nesta página, e nenhuma é
 * detalhe:
 * - a pílula de navegação é FIXA e tem âncoras. Clicar em "Áreas" antes de a
 *   animação acabar cairia no `scrollTo(0,0)` e voltaria para o topo — navegação
 *   morta justamente no primeiro contato;
 * - teclado não dispara `wheel`. Espaço, Page Down e as setas rolariam a página
 *   enquanto o progresso ficaria em 0, e o `scrollTo(0,0)` empurraria de volta:
 *   o site fica inalcançável para quem não usa roda de mouse;
 * - arrastar a barra de rolagem, idem.
 *
 * No lugar: TRILHO com palco `sticky`, e o progresso é a fração que o trilho já
 * rolou por dentro de si, lida em `requestAnimationFrame`. O visual é o mesmo. A
 * única diferença perceptível é que a barra de rolagem anda durante a abertura —
 * o que, a rigor, é mais honesto: diz que a página tem fim.
 *
 * ⚠️ `sticky` exige que NENHUM ancestral tenha `overflow` diferente de `visible`,
 * senão o ancestral vira o contêiner de rolagem e o palco não gruda. Foi o que
 * obrigou o bloco da Bio a perder o `overflow-hidden` em 13/08. Aqui a seção e o
 * trilho ficam sem overflow de propósito.
 *
 * Fundo: o template usa uma `bgImageSrc` que desbota. Aqui não entra imagem de
 * fundo nenhuma — os cinco quadros já são renderizados sobre verde-petróleo
 * (hex 013435, que é o nosso `--ink`), então o chão da seção é o próprio token e
 * a mídia se dissolve nele sem costura. Uma imagem a mais seria peso por nada.
 *
 * São QUADROS e não vídeo: ver a nota do tipo `ArcadaEtapa`. Em resumo, "os dentes
 * surgindo um após o outro, começando de um lado" é ordem — e ordem em array é
 * exata, enquanto modelo de vídeo acende vários dentes juntos e fora de sequência.
 */

/** Um quadro, ou o slot nomeado enquanto o arquivo não existe. */
function Quadro({
  etapa,
  slotRotulo,
  prioridade,
}: {
  etapa: ArcadaEtapa;
  slotRotulo: string;
  prioridade: boolean;
}) {
  if (!etapa.src) {
    return (
      <div
        role="img"
        aria-label={etapa.alt}
        className="slot-grid-ink flex h-full w-full items-end bg-ink-elevated p-4 md:p-6"
      >
        <span className="rounded-md border border-ink-border bg-ink/80 px-2 py-1 text-small text-ink-muted backdrop-blur">
          {slotRotulo} {etapa.rotulo}
        </span>
      </div>
    );
  }
  return (
    <img
      src={etapa.src}
      alt={etapa.alt}
      /* O primeiro quadro abre a PÁGINA, então nem lazy nem preguiça: é a
         primeira coisa que o visitante vê. Os outros quatro só existem depois de
         a rolagem avançar. */
      loading={prioridade ? "eager" : "lazy"}
      fetchPriority={prioridade ? "high" : undefined}
      className="h-full w-full object-cover"
    />
  );
}

export function ArcadaHero({ data }: { data: ArcadaContent }) {
  const trilhoRef = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  const [semAnimacao, setSemAnimacao] = useState(false);
  /* Tela estreita. O template chama de `isMobileState` e usa para os mesmos fins:
     os números de partida da caixa. Ver a nota em `inicioL`. */
  const [compacto, setCompacto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemAnimacao(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  useEffect(() => {
    const ver = () => setCompacto(window.innerWidth < 768);
    ver();
    window.addEventListener("resize", ver);
    return () => window.removeEventListener("resize", ver);
  }, []);

  useEffect(() => {
    if (semAnimacao) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const trilho = trilhoRef.current;
      if (!trilho) return;
      const r = trilho.getBoundingClientRect();
      const curso = r.height - window.innerHeight;
      if (curso <= 0) {
        setP(0);
        return;
      }
      const bruto = -r.top / curso;
      setP(bruto < 0 ? 0 : bruto > 1 ? 1 : bruto);
    };
    const agendar = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [semAnimacao]);

  const total = data.etapas.length;

  /* A ABERTURA termina cedo, em 28% do trilho. Os 72% restantes passam os cinco
     quadros com a mídia já grande — que é o que interessa, porque é onde a arcada
     se forma. Se a expansão durasse todo o trilho, a gengiva e os implantes
     aconteceriam num quadro pequeno. */
  const abertura = Math.min(1, p / 0.28);
  const suave = 1 - (1 - abertura) * (1 - abertura);

  /* A SEQUÊNCIA começa em 18%, ou seja um pouco antes de a abertura terminar, e
     vai até o fim. O `min` é obrigatório: em p=1, `floor(1 * 5)` daria 5, um
     índice além do array. */
  const seq = Math.min(1, Math.max(0, (p - 0.18) / 0.82));
  const ativa = Math.min(total - 1, Math.floor(seq * total));

  /* LARGURA e ALTURA interpoladas em separado, e não uma proporção com teto de
     altura. A primeira versão usava `aspectRatio` mais `maxHeight: 88svh`, e em
     1440×900 o teto vencia: a caixa saía 893×792, quase quadrada, e o estado em
     RETRATO — que é o que faz a abertura ler como abertura — nunca aparecia.
     Medido: 1,13:1 no início, contra os 0,8 pedidos.

     Com os dois eixos explícitos, a caixa vai de retrato a paisagem e termina
     sangrando a janela inteira, que é o gesto do template (lá 300×400 → 1550×800).
     O `object-cover` recorta no caminho, e aqui o recorte é INTENCIONAL, ao
     contrário do resto do site: em retrato aparece o miolo da arcada e, ao alargar,
     ela se revela de molar a molar.

     Números separados para tela estreita porque fração de viewport não se traduz:
     34vw são 490px em 1440 e 133px em 390 — um cartão, e uma tira.

     ⚠️ A ALTURA sai da PROPORÇÃO, e o estado final é 16:9 de propósito — não a
     janela inteira. Interpolar os dois eixos até 100% dava 390×844 no celular, uma
     caixa 0,46:1 para um quadro 16:9: `object-cover` mostraria ~26% da largura, ou
     seja um talho vertical no meio da arcada. É exatamente a armadilha de 12/08,
     quando um arquivo 3,6:1 foi posto numa faixa 0,83:1 e o usuário reprovou
     ("cortada, muito para a direita"). Terminando em 16:9, o recorte no estado
     final — o que a pessoa fica olhando — é ZERO nas duas larguras.

     Altura em `vw` e não em `svh`: assim ela deriva da mesma unidade da largura e a
     proporção fecha sozinha, sem depender de saber a altura da janela em px. */
  const inicioL = compacto ? 66 : 34;
  const propInicio = compacto ? 0.85 : 0.82;
  const propFim = 16 / 9;
  const largura = inicioL + (100 - inicioL) * suave;
  const proporcao = propInicio + (propFim - propInicio) * suave;
  const altura = largura / proporcao;
  const raio = 24 * (1 - suave);
  /* Véu clareando, como no template (lá 0.7 → 0.4). Aqui é mais fraco porque os
     quadros já são escuros: sobre verde-petróleo, 50% viraria um borrão. */
  const veu = 0.42 - 0.34 * suave;

  /* ── Sem animação: um quadro só, o último, em tamanho cheio. A abertura é
     decoração; o estado final é a informação. Nada de trilho, nada de sticky. ── */
  if (semAnimacao) {
    const ultima = data.etapas[total - 1];
    return (
      <section id="arcada" className="relative bg-ink">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="aspect-video w-full">
            <Quadro etapa={ultima} slotRotulo={data.slotRotulo} prioridade />
          </div>
        </div>
        <p className="mx-auto max-w-[52rem] px-5 pb-8 pt-5 text-small leading-[1.55] text-ink-muted md:px-10">
          {data.aviso}
        </p>
      </section>
    );
  }

  return (
    /* Sangra até a borda da janela, sem goteira e sem canto arredondado: é a
       abertura da página, e o hero de colagem que vem embaixo também sangra. As
       duas faixas escuras encostam de propósito e leem como uma abertura só. */
    <section id="arcada" className="relative bg-ink">
      {/* Trilho de 300vh, ou seja 200vh de curso: ~56vh para a abertura e ~29vh
          por quadro depois dela. Menos que isso e a etapa passa antes de o olho
          registrar o que mudou. */}
      <div ref={trilhoRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          {/* Caixa da mídia. Largura em % da janela e altura derivada da
              proporção, que é o que faz a caixa mudar de retrato para paisagem. */}
          <div
            className="relative"
            style={{
              width: `${largura}vw`,
              height: `${altura}vw`,
              /* Guarda para janela baixa e larga (1440×700, por exemplo), onde
                 56vw de altura passariam da tela. Clampar ali volta a recortar,
                 e nesse caso recortar é o comportamento certo. */
              maxHeight: "92svh",
              borderRadius: `${raio}px`,
              overflow: "hidden",
              boxShadow: "0 0 60px oklch(0 0 0 / 0.35)",
            }}
          >
            {data.etapas.map((e, i) => (
              <div
                key={e.rotulo}
                aria-hidden={i !== ativa || undefined}
                /* Os cinco empilhados e trocados por opacidade. Trocar o `src` de
                   um único <img> pisca na primeira vez que cada quadro entra,
                   porque o arquivo novo só decodifica quando é pedido.
                   A escala mínima no quadro que sai dá o empurrão que faz a troca
                   ler como algo se formando, e não como slide trocando. */
                className="absolute inset-0 transition-[opacity,scale] duration-700 ease-out"
                style={{
                  opacity: i === ativa ? 1 : 0,
                  scale: i === ativa ? "1" : "1.03",
                }}
              >
                <Quadro
                  etapa={e}
                  slotRotulo={data.slotRotulo}
                  prioridade={i === 0}
                />
              </div>
            ))}
            {/* Véu do template, clareando com a abertura. `pointer-events-none`
                para não roubar clique de nada que venha a existir por cima. */}
            <div
              className="pointer-events-none absolute inset-0 bg-ink"
              style={{ opacity: veu }}
            />
          </div>

          {/* Fio de progresso rente à base da janela. Não é explicação — é o
              antídoto para a suspeita que o template de fato merece: faixa que
              não rola junto lê como página travada. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-ink-border">
            <div className="h-px bg-gold" style={{ width: `${p * 100}%` }} />
          </div>

          {/* ⚠️ Aviso da CFO-196/2019. Discreto, e permanente de propósito: a peça
              abre a página mostrando uma arcada ficar perfeita, e sem esta linha
              ela pode ser lida como caso real e como promessa de resultado. É a
              única palavra na seção, e some junto com o véu para não competir com
              a mídia enquanto ela abre. Não remover sem falar com o jurídico da
              clínica. */}
          <p
            className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto max-w-[46rem] px-5 text-center text-small leading-[1.45] text-ink-muted/70 transition-opacity duration-500 md:px-10"
            style={{ opacity: suave < 0.9 ? 0 : 1 }}
          >
            {data.aviso}
          </p>
        </div>
      </div>
    </section>
  );
}
