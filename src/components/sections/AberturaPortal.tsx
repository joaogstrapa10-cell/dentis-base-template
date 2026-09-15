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
 * ⚠️ Custo de rolagem: 1,3 tela até o hero estar em posição. Se incomodar, é
 * `TRILHO_MULT` aqui — mas o piso é o próprio palco, que tem uma tela de altura e
 * precisa sair de cena antes do hero entrar. Abaixo de ~0,3 o gesto passa antes de
 * ser lido.
 */

/**
 * ⚠️ O HERO SOBE POR CIMA DO PALCO, e é o que torna esta seção possível sem vão nem
 * recorte. Vale entender antes de mexer em qualquer número aqui.
 *
 * O palco é `sticky` e tem UMA TELA de altura. Num trilho comum ele grudaria, soltaria,
 * e então gastaria uma tela inteira de rolagem só para sair de cena — e é dessa saída
 * que vêm os DOIS defeitos já reportados: o grupo, centrado nele, subia junto e sumia
 * pelo topo restando verde vazio ("um espaço grande vazio", 15/09), e a tentativa de
 * conserto (centrar na faixa visível, que encolhe) fazia o grupo ENCOLHER junto —
 * "ele está literalmente diminuindo", reprovado no mesmo dia.
 *
 * A saída é estrutural: a seção tem `CURSO + PALCO` de altura e uma MARGEM INFERIOR
 * NEGATIVA de uma tela. O palco fica grudado o curso inteiro, e o hero — que continua
 * sendo o próximo elemento do fluxo — começa uma tela antes, subindo POR CIMA dele.
 * Consequências, e as três resolvem um pedido:
 *
 *   1. Nunca há tela vazia: quem vem depois do grupo é o hero, não o resto do palco.
 *   2. O grupo só CRESCE — o teto do zoom volta a sair do palco, que tem tamanho fixo.
 *   3. Quando o hero toma a tela (`p = 1`), não sobra nada do portal: o grupo já se
 *      apagou e o bloco escuro do hero cobre o palco inteiro.
 *
 * ⚠️ O hero e o palco são os dois `--ink`, então a borda que sobe é INVISÍVEL — o grupo
 * parece ser apagado de baixo para cima em vez de ser coberto por uma aresta. Isso
 * depende do `.ink-arc` não ter mais o brilho de topo (removido em 15/09): com ele, a
 * subida desenharia uma linha clara atravessando o grupo.
 */

/** Telas de ROLAGEM que o gesto dura — é nelas que o hero sobe por cima do palco. */
const CURSO_MULT = 1.3;

/** Altura do palco em telas. É `h-svh`: uma. A margem negativa tem de casar com isto. */
const PALCO_MULT = 1;

/**
 * Onde o grupo começa e termina de se apagar, em fração do curso.
 *
 * ⚠️ `APAGA_ATE` é o pedido de 15/09 ao pé da letra: "ao chegar já na seção da hero, ele
 * já tem que sumir, não tem que estar nada na tela". Em 0,85 o topo do hero está a 15%
 * do curso do alto da tela — ou seja ele já ocupa ~87% dela — e o grupo está em zero.
 * O que ainda se vê do grupo entre 0,6 e 0,85 é coberto de baixo para cima pelo próprio
 * hero, porque ele sobe por cima.
 *
 * ⚠️ E é isto que tira a SOMBRA do retrato de cima da manchete, também reportada em
 * 15/09: a sombra é do grupo, então ela se apaga com ele. Não é caso de tirar a sombra
 * da foto — ela foi pedida em 15/09 ("sem borda com sombra") e continua na peça.
 */
const APAGA_DE = 0.35;
const APAGA_ATE = 0.85;

/**
 * Quanto o grupo sobe ao longo do curso, em fração da altura do PALCO.
 *
 * O teto real é geométrico, e quem manda é o CELULAR: lá o grupo é alto (a linha vira
 * coluna) e sobra menos folga acima. A 0,20 o topo saía 16px da tela aos 80% do curso,
 * com o grupo ainda a 10% de opacidade — medido. A 0,16 ele fica dentro em todo o trecho
 * visível, e o primeiro pixel negativo cai onde a opacidade já é zero. Subir este número
 * recorta a marca pelo alto enquanto ela ainda se lê — o defeito do print de 15/09.
 */
const SOBE_MARCA = 0.16;

/**
 * Quanto o GRUPO (marca + retrato + assinatura) cresce ao longo do curso.
 *
 * Foi 0,7, subiu para 0,9 em 20/08 quando a escrita saiu — sozinha na tela, a marca
 * carregava o gesto inteiro e o crescimento menor ficava discreto — e **voltou para 0,7
 * em 09/09**, pelo mesmo raciocínio ao contrário: com o retrato do Dalton ao lado e a
 * assinatura embaixo, o grupo mede ~570×290px em 1440 contra ~416×183 da marca sozinha.
 * A 0,9 ele chegaria a ~1080×550, encostando nas bordas antes do fim do curso.
 */
const ZOOM = 0.7;

/**
 * Fração do palco que o grupo pode ocupar NO PICO do crescimento.
 *
 * ⚠️ É isto que tornou o tamanho das peças um parâmetro livre. Até 15/09 o tamanho no
 * CELULAR estava travado por um risco: o grupo cresce `1 + ZOOM` e, passando da largura
 * do palco enquanto ainda está OPACO, a marca era recortada no meio da leitura. A saída
 * era manter as peças pequenas — e foi exatamente isso que o usuário mandou desfazer
 * ("mude tudo para o celular também").
 *
 * Agora o zoom se limita sozinho: o laço mede o grupo e o palco e usa o MENOR entre
 * `ZOOM` e o crescimento que ainda cabe. Aumentar uma peça não quebra mais nada — só
 * consome crescimento, e o console não precisa ser consultado para saber quanto.
 *
 * 0,98 e não 1: um fio de folga para o arredondamento de subpixel não encostar a peça
 * na borda do recorte.
 */
const OCUPACAO_MAX = 0.98;

/**
 * O que a PÁGINA gasta de rolagem antes de o hero tomar a tela — e não a altura da
 * seção, que é uma tela maior por causa da sobreposição. É o limiar que o `Header` usa
 * para revelar a pílula, e o ponto em que a abertura acabou.
 */
export const PORTAL_VH = CURSO_MULT * 100;

const trava01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function AberturaPortal({ data }: { data: AberturaContent }) {
  const trilhoRef = useRef<HTMLElement | null>(null);
  const marcaRef = useRef<HTMLDivElement | null>(null);
  const palcoRef = useRef<HTMLDivElement | null>(null);
  /* Tamanhos de LAYOUT do grupo e do palco, em px, para o teto do zoom. Medidos por
     `ResizeObserver` e não no laço: `offsetWidth` força cálculo de layout, e ler isso a
     60fps é justamente o custo que este componente existe para não ter.
     ⚠️ `offsetWidth`/`offsetHeight` IGNORAM `transform`, que é o que os torna a medida
     certa aqui — o grupo está escalado quase o tempo todo. */
  const medidasRef = useRef({ gw: 0, gh: 0, pw: 0, ph: 0 });
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
    const grupo = marcaRef.current;
    const palco = palcoRef.current;
    if (!grupo || !palco) return;
    const medir = () => {
      medidasRef.current = {
        gw: grupo.offsetWidth,
        gh: grupo.offsetHeight,
        pw: palco.offsetWidth,
        ph: palco.offsetHeight,
      };
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(grupo);
    ro.observe(palco);
    /* A marca e o retrato são imagens: até decodificarem, o grupo mede menos do que vai
       medir. Sem isto o teto do zoom nasce generoso e só se corrige no primeiro resize. */
    window.addEventListener("load", medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", medir);
    };
  }, [semAnimacao]);

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
         segundo mede só o trecho em que o palco está GRUDADO, e usá-lo faz o
         crescimento terminar com o palco ainda ocupando a tela toda. Este `p` comanda
         só a ESCALA e a subida dentro da faixa; quem comanda o apagamento é a faixa
         visível — ver a nota de `BANDA_APAGADO`. */
      const caixa = trilho.getBoundingClientRect();
      const { gw, gh, pw, ph } = medidasRef.current;
      const alturaPalco = ph || window.innerHeight;

      /* O curso é a altura da seção MENOS o palco — ou seja o trecho em que ele está
         grudado, que aqui é o gesto inteiro. Com a margem negativa, `p = 1` é o pixel
         em que o hero termina de cobrir a tela. */
      const curso = caixa.height - alturaPalco;
      const p = curso > 0 ? trava01(-caixa.top / curso) : 0;

      /* TETO DO ZOOM, derivado do que cabe no PALCO — que tem tamanho fixo, então a
         escala só cresce. Ver a nota de `OCUPACAO_MAX`: é ele que tornou o tamanho das
         peças um parâmetro livre. ⚠️ Não amarrar este teto a nada que encolha durante a
         rolagem: foi assim que o grupo passou a diminuir, e foi reprovado. */
      const teto =
        gw > 0 && gh > 0
          ? Math.max(0, Math.min((pw * OCUPACAO_MAX) / gw, (ph * OCUPACAO_MAX) / gh) - 1)
          : ZOOM;
      const escala = 1 + p * Math.min(ZOOM, teto);
      const opacidade = 1 - trava01((p - APAGA_DE) / (APAGA_ATE - APAGA_DE));
      const desloca = -p * SOBE_MARCA * alturaPalco;

      /* ⚠️ `translate3d` ANTES de `scale`: a escala é aplicada primeiro e o
         deslocamento depois, em px NÃO escalados. Invertida, o deslocamento viria
         multiplicado pelo zoom e a marca sairia da tela cedo demais. Registrado em
         19/08 na abertura. */
      marca.style.transform = `translate3d(0, ${desloca.toFixed(1)}px, 0) scale(${escala.toFixed(4)})`;
      marca.style.opacity = opacidade.toFixed(3);
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [semAnimacao]);

  const marcaEl = data.marca ? (
    <img
      src={data.marca}
      alt={data.marcaAlt}
      /* MAIOR nas duas faixas desde 15/09, a pedido: "quero colocar a logo maior" e, na
         mensagem seguinte, "mude tudo para o celular também, precisa estar parâmetro".
         Desktop de `min(24vw,19rem)` para `min(30vw,24rem)` (304 → 384px em 1440) e
         celular de `min(62vw,15rem)` para `min(78vw,18rem)` (240 → 288px em 390).

         ⚠️ O celular só pôde crescer porque o ZOOM passou a ter teto calculado — ver a
         nota de `OCUPACAO_MAX`. Antes, a marca a 78vw seria recortada pelo palco no meio
         do percurso, enquanto ainda opaca. O preço é crescimento: no celular o grupo
         cresce ~33% em vez dos 70% do desktop, porque é a LARGURA da marca que fecha a
         conta ali. Para crescer mais, a marca teria de ser menor — é um ou outro.

         O teto em `rem` existe para ela não virar cartaz em monitor ultralargo. */
      className="w-[min(78vw,18rem)] md:w-[min(30vw,24rem)]"
    />
  ) : null;

  const retrato = data.retrato;
  const retratoEl = retrato ? (
    <img
      src={retrato.src}
      alt={retrato.alt}
      width={retrato.largura}
      height={retrato.altura}
      /* ⚠️ SEM `.retrato-fundido` E COM SOMBRA desde 15/09, a pedido: "a foto do Dalton
         sem borda com sombra, quero essa imagem maior".

         A máscara dissolvia as quatro bordas para o retângulo da foto não desenhar
         aresta sobre o bloco escuro — era a escolha certa enquanto a peça tinha de
         PERTENCER ao fundo. Pedindo sombra, ele pediu o contrário: que ela seja um
         objeto POUSADO sobre o fundo. As duas coisas se anulam (sombra de uma borda
         dissolvida não existe), então a máscara saiu inteira.

         ⚠️ Isso reintroduz "cartão com sombra própria", que está na lista do §5.2 do
         CLAUDE.md como forma removida em 03/08. Voltou por pedido explícito e numa peça
         só — não é licença para devolver sombra às outras seções.

         `rounded-xl` e não canto vivo: a foto é 500×482, quase quadrada, e canto reto
         sobre o bloco lê como print colado — o mesmo motivo que tirou o passe-partout
         branco da equipe em 13/08. Sem BORDA nenhuma, que é o que ele pediu.

         A proporção vem do ARQUIVO e não cravada aqui: é a lição de 12/08, quando uma
         proporção fixa recortou 78% de uma foto panorâmica, e de 13/08, quando o
         arquivo do hero mudou e a medida cravada passou a recortar. */
      className="h-auto w-[min(72vw,17rem)] rounded-xl object-contain shadow-[0_24px_64px_rgba(0,0,0,0.5)] md:w-[min(24vw,19rem)] md:rounded-2xl"
      style={{ aspectRatio: `${retrato.largura} / ${retrato.altura}` }}
    />
  ) : null;

  const assinatura = data.assinatura;
  const assinaturaEl = assinatura ? (
    assinatura.src ? (
      /* O TRAÇO REAL, quando existir. */
      <img
        src={assinatura.src}
        alt={`Assinatura de ${assinatura.nome}`}
        className="h-auto w-full max-w-[14rem] md:max-w-[16rem]"
      />
    ) : (
      /* ⚠️ ESTADO RESERVADO: o nome composto numa fonte manuscrita, porque o traço do
         Dr. Dalton ainda não existe em arquivo. O usuário aprovou isso como provisório
         em 19/08, sabendo que a referência que ele deu (Ayrton Senna) é caligrafia real
         digitalizada. O `title` diz o que a peça é, para quem inspeciona não confundir
         com a assinatura verdadeira. `aria-hidden` NÃO: o nome é conteúdo legível e o
         leitor de tela deve anunciá-lo. */
      <p
        className="assinatura-manuscrita text-ink-foreground"
        title="Composição tipográfica provisória — a assinatura digitalizada do responsável técnico substituirá esta peça."
      >
        {assinatura.nome}
      </p>
    )
  ) : null;

  /* ⚠️ A ASSINATURA FICA NA COLUNA DA FOTO, e não embaixo do grupo inteiro — pedido de
     15/09, "colocar a assinatura dele embaixo da foto". Não é o mesmo lugar: centrada
     sob o par, ela caía sob o VÃO entre a marca e o retrato, o que a lia como legenda
     das duas peças em vez de assinatura de quem está na foto.

     ⚠️ E a LINHA vira COLUNA abaixo de `md`, o que também não é preferência: a marca é
     2,27:1 e o retrato 1,04:1 — lado a lado numa tela de 390px cada um ficaria com
     ~170px, e a linha "odontologia" do logo (o menor traço da arte) deixa de se
     distinguir. */
  const composicao = (
    <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
      {marcaEl}
      <div className="flex flex-col items-center gap-3 md:gap-4">
        {retratoEl}
        {assinaturaEl}
      </div>
    </div>
  );

  /* ── SEM ANIMAÇÃO: a mesma tela, parada, sem trilho. O conteúdo é a marca, e ela não
        depende do movimento para ser lida. ── */
  if (semAnimacao) {
    return (
      <section id="portal" className="bg-ink px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-[64rem] flex-col items-center text-center">
          {composicao}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trilhoRef}
      id="portal"
      className="relative bg-ink"
      /* ⚠️ A MARGEM NEGATIVA TEM DE SER EXATAMENTE A ALTURA DO PALCO. É ela que faz o
         hero começar uma tela antes e subir por cima; menor, sobra palco vazio no fim
         (o vão de 15/09), maior, o hero morde o gesto antes da hora. A altura da seção
         é `curso + palco`, e o `sticky` continua soltando só no fim — o que é o certo,
         porque a essa altura ele já está inteiramente coberto. */
      style={{
        height: `${(CURSO_MULT + PALCO_MULT) * 100}svh`,
        marginBottom: `-${PALCO_MULT * 100}svh`,
      }}
    >
      {/* ⚠️ `overflow-hidden` AQUI, no próprio palco, e não em nenhum ancestral: a
          marca cresce até quase o dobro e sem recorte ela ALARGA a página — medido em
          997px de rolagem horizontal no desktop, quando havia também os pontos saindo
          para os lados. Pôr o recorte num ANCESTRAL do `sticky` mataria a grudagem
          (custou uma rodada na Bio em 13/08); no próprio elemento `sticky` é seguro,
          porque o contêiner de rolagem dele continua sendo a janela. */}
      <div
        ref={palcoRef}
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6 text-center"
      >
        <div ref={marcaRef} className="will-change-transform">
          {composicao}
        </div>
      </div>
    </section>
  );
}
