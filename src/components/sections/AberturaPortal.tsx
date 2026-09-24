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
 * ⚠️ CUSTO DE ROLAGEM: UMA TELA, e isso é requisito — não sobra nada de trilho.
 * A seção tem exatamente a altura da janela e o palco NÃO é mais `sticky`. Ver a nota
 * de `PARALAXE` logo abaixo: a grudagem era a origem do vão que ele reprovou quatro
 * vezes, porque um palco grudado de uma tela gasta OUTRA tela inteira só para sair de
 * cena, e nessa saída o que se vê é fundo vazio.
 */

/**
 * ⚠️ LEIA ISTO ANTES DE MEXER: o `sticky` SAIU em 15/09, e ele era a causa do defeito
 * que o usuário reportou QUATRO vezes no mesmo dia — "sobra um espaço enorme vazio".
 *
 * A conta que explica tudo: um palco grudado com UMA TELA de altura precisa de OUTRA
 * tela inteira de rolagem só para sair de cena. O grupo mora no meio dele, então sai
 * pelo topo na primeira metade dessa saída — e a segunda metade é fundo vazio rolando
 * antes de o hero chegar. Não existe ajuste de opacidade, zoom ou deslocamento que
 * resolva isso: é geometria, e cada tentativa (centrar na faixa, apagar pela folga,
 * pôr o hero por cima) tratou o sintoma.
 *
 * Agora a seção tem UMA tela e ponto. O palco rola com a página, como qualquer seção,
 * e o hero entra logo em seguida. O que sobrou de gesto é o que cabe numa tela:
 *
 *   • PARALAXE — o grupo sobe MAIS DEVAGAR que a página. É isto que mata o vão: sem
 *     paralaxe, a distância entre o pé do grupo e o topo do hero fica congelada em
 *     `(tela − altura do grupo) / 2` o percurso inteiro; com paralaxe ela ENCOLHE, e o
 *     grupo acompanha o hero que sobe em vez de fugir dele.
 *   • um zoom de leve, e só ("sem nada exagerado").
 *
 * ⚠️ Tudo que já foi REPROVADO aqui, para não voltar por engano: teto de escala
 * amarrado a faixa que encolhe ("ele está literalmente diminuindo"); hero subindo por
 * cima com margem negativa ("parecendo que os elementos entram em algum lugar", e
 * cobria 385px do topo de Casos, porque `sticky` pinta acima de conteúdo em fluxo);
 * e grupo centrado no palco grudado ("um baita espaço antes do hero").
 */

/**
 * Quanto o grupo sobe em relação à página, de 0 a 1.
 *
 * 0 = anda junto com a rolagem (e aí a distância até o hero fica CONGELADA o percurso
 * inteiro — era esse o vão). 1 = fica parado no lugar.
 *
 * **0,5 é o ótimo geométrico, não um gosto:** o grupo começa com a mesma folga acima e
 * abaixo, e a 0,5 as duas fecham ao mesmo tempo — ele termina preenchendo exatamente a
 * faixa entre o topo da tela e o topo do hero, em vez de encostar num lado e deixar
 * sobra no outro. Medido em 1440 e 390.
 */
const PARALAXE = 0.5;

/**
 * Onde o grupo começa e termina de se apagar, em fração da altura da tela rolada.
 *
 * ⚠️ `APAGA_ATE = 0,78` É O NÚMERO QUE MATA O VÃO, e a conta é direta: a opacidade
 * chega a zero quando o topo do hero está a `(1 − 0,78) = 22%` do alto da tela. Ou
 * seja, quando a peça some, o hero JÁ OCUPA 78% da tela — não há mais o "espaço enorme
 * vazio" que ele reprovou quatro vezes em 15/09.
 *
 * O preço, e é consciente: no trecho final o grupo já cruzou a borda da seção e é
 * recortado por ela, com opacidade abaixo de ~0,3. Sobre fundo escuro isso não se lê
 * como corte, se lê como a peça se dissolvendo — e é o que permite a faixa continuar
 * PREENCHIDA até o fim. Apagar antes devolve o vão: o vazio que sobra é exatamente a
 * altura do grupo, porque é ele que estava ocupando aquele espaço.
 */
const APAGA_DE = 0.25;
const APAGA_ATE = 0.78;

/**
 * Quanto o GRUPO (marca + retrato + assinatura) cresce ao longo do curso.
 *
 * Foi 0,7 e caiu para **0,2 em 15/09**, com o pedido "sem nada exagerado". A 0,7 o
 * crescimento era o gesto principal da tela; a 0,2 ele é um avanço de leve, e quem
 * carrega a saída é o apagamento. ⚠️ O teto continua sendo calculado (`OCUPACAO_MAX`)
 * e sai do PALCO, que tem tamanho fixo — então a escala só cresce. Não amarrar este
 * teto a nada que encolha durante a rolagem: foi assim que o grupo passou a DIMINUIR
 * no fim do curso, reprovado no mesmo dia ("ele está literalmente diminuindo").
 */
const ZOOM = 0.2;

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

/** A seção tem UMA tela: é também o que a página gasta antes do hero. */
export const PORTAL_VH = 100;

const trava01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function AberturaPortal({ data }: { data: AberturaContent }) {
  const pistaRef = useRef<HTMLDivElement | null>(null);
  const trilhoRef = useRef<HTMLElement | null>(null);
  const marcaRef = useRef<HTMLDivElement | null>(null);
  const palcoRef = useRef<HTMLDivElement | null>(null);
  /* Tamanhos de LAYOUT do grupo e do palco, em px, para o teto do zoom. Medidos por
     `ResizeObserver` e não no laço: `offsetWidth` força cálculo de layout, e ler isso a
     60fps é justamente o custo que este componente existe para não ter.
     ⚠️ `offsetWidth`/`offsetHeight` IGNORAM `transform`, que é o que os torna a medida
     certa aqui — o grupo está escalado quase o tempo todo. */
  const medidasRef = useRef({ gw: 0, gh: 0, pw: 0, ph: 0 });
  /* Último par já aplicado ao DOM. Escrever estilo idêntico não é de graça: invalida
     o elemento e o compositor refaz o trabalho. Ver a nota dentro do laço. */
  const escritoRef = useRef({ transform: "", opacidade: "" });
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

      const caixa = trilho.getBoundingClientRect();
      const { gw, gh, pw, ph } = medidasRef.current;

      /* ⚠️ FORA DE VISTA, NÃO FAZ NADA. Sem esta saída o laço media e escrevia estilo
         a cada quadro da página INTEIRA — dez telas de rolagem pagando por uma seção
         que já passou. No desktop não aparecia; no celular o usuário reportou "o
         scroll está travando muito" em 15/09. A conta é direta: um `getBoundingClientRect`
         por quadro é uma leitura de layout, e escrever `transform`/`opacity` num
         elemento com sombra grande obriga o compositor a trabalhar de novo.

         O `escrito` guarda o último par aplicado: quando a seção volta à vista e nada
         mudou, nem o estilo é tocado. */
      if (caixa.bottom <= 0) return;

      /* Quanto da seção já passou pelo topo da janela, de 0 a 1. Sai do retângulo da
         PRÓPRIA seção e não de `window.scrollY` — é o mecanismo provado cinco vezes
         neste projeto, e o que deixa a peça correta no dia em que algo entrar antes
         dela na página. */
      const p = caixa.height > 0 ? trava01(-caixa.top / caixa.height) : 0;

      /* TETO DO ZOOM, derivado do que cabe no palco — que tem tamanho fixo, então a
         escala só cresce. Ver a nota de `OCUPACAO_MAX`: é ele que tornou o tamanho das
         peças um parâmetro livre. ⚠️ Não amarrar a nada que encolha na rolagem. */
      const teto =
        gw > 0 && gh > 0
          ? Math.max(0, Math.min((pw * OCUPACAO_MAX) / gw, (ph * OCUPACAO_MAX) / gh) - 1)
          : ZOOM;
      const escala = 1 + p * Math.min(ZOOM, teto);
      const opacidade = 1 - trava01((p - APAGA_DE) / (APAGA_ATE - APAGA_DE));

      /* PARALAXE: a página já levou o grupo `p * altura` para cima; devolver uma parte
         disso o faz subir mais devagar que o hero, e é o que fecha a distância entre os
         dois. Ver a nota da constante. */
      const desloca = (1 - PARALAXE) * p * caixa.height;

      /* ⚠️ `translate3d` ANTES de `scale`: a escala é aplicada primeiro e o
         deslocamento depois, em px NÃO escalados. Invertida, o deslocamento viria
         multiplicado pelo zoom e a marca sairia da tela cedo demais. Registrado em
         19/08 na abertura. */
      const transform = `translate3d(0, ${desloca.toFixed(1)}px, 0) scale(${escala.toFixed(4)})`;
      const opacidadeTexto = opacidade.toFixed(3);
      if (transform !== escritoRef.current.transform) {
        marca.style.transform = transform;
        escritoRef.current.transform = transform;
      }
      if (opacidadeTexto !== escritoRef.current.opacidade) {
        marca.style.opacity = opacidadeTexto;
        /* A pista se apaga MAIS RÁPIDO que a marca (o cubo de uma fração menor que 1
           cai antes): ela existe para quem ainda não rolou, e nos primeiros pixels já
           cumpriu o papel. Continuar visível durante o gesto seria pedir de novo algo
           que a pessoa está fazendo. */
        if (pistaRef.current) {
          pistaRef.current.style.opacity = (opacidade ** 3).toFixed(3);
        }
        escritoRef.current.opacidade = opacidadeTexto;
      }
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
        title="Composição tipográfica provisória. A assinatura digitalizada do responsável técnico substituirá esta peça."
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
  /* ⚠️ `gap-14` no CELULAR contra `gap-12` de `md` para cima, e a diferença é
     deliberada — pedido de 15/09: "a logo está muito perto da imagem do Dalton,
     colocar ela um pouco mais pra cima". Empilhado, o vão é o que separa a marca do
     retrato, e como o grupo é centrado aumentá-lo SOBE a marca e desce a foto meio vão
     cada. Em linha, de `md` para cima, esse mesmo vão é HORIZONTAL e não teria efeito
     nenhum sobre a altura. */
  const composicao = (
    <div className="flex flex-col items-center gap-14 md:flex-row md:gap-12">
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
      /* `isolate` e NÃO `relative`: a seção não precisa ser posicionada para nada, e
         elemento posicionado pinta ACIMA de todo conteúdo em fluxo do mesmo contexto —
         foi assim que, na versão com `sticky` e margem negativa, o palco cobriu 385px
         do topo de Casos em 15/09. Hoje não há filho posicionado aqui, mas a trava
         fica: é de graça e o defeito custou uma rodada. */
      className="isolate bg-ink"
      style={{ height: `${PORTAL_VH}svh` }}
    >
      {/* ⚠️ `overflow-hidden` AQUI: o grupo cresce e, no fim do percurso, passa da
          borda de cima — sem recorte ele ALARGA a página (medido em 997px de rolagem
          horizontal na versão com os pontos) e, por baixo, apareceria por cima do
          hero. Recortando aqui, ele some dentro da própria seção.

          ⚠️ SEM `sticky`, e isso é o coração desta versão: ver a nota do topo do
          arquivo. Palco grudado de uma tela gasta outra tela só para sair, e é nessa
          saída que sobrava o vão. */}
      <div
        ref={palcoRef}
        className="relative flex h-svh items-center justify-center overflow-hidden px-6 text-center"
      >
        <div ref={marcaRef} className="will-change-transform">
          {composicao}
        </div>

        {/* VÉU no pé do palco: no fim do percurso o grupo cruza a borda da seção, e é
            isso que mantém a faixa preenchida até o hero tomar a tela. Sem o véu o
            `overflow-hidden` corta em linha reta e parte a assinatura ao meio.

            ⚠️ Era uma `mask-image` e virou DEGRADÊ em 15/09, por desempenho: máscara
            num elemento de tela inteira com imagem dentro obriga o navegador a compor
            a camada de novo a cada quadro, e no celular o usuário reportou "o scroll
            está travando muito". O degradê é uma caixa pintada — o resultado é o mesmo
            porque o que está atrás é exatamente `--ink`, e o hero começa nessa borda.

            96px fixos e não porcentagem: em porcentagem a dissolução comeria metade do
            retrato numa tela baixa. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink"
        />

        {/* PISTA DE ROLAGEM. Pedido de 24/09: "nem todo mundo vai saber que é animação
            em scroll, é importante ter, e ao scrollar essa informação some".

            ⚠️ Ela se apaga pela MESMA variável que apaga a marca — o laço escreve a
            opacidade nos dois no mesmo quadro. Um segundo cálculo aqui seria um número
            a desalinhar no dia em que o ritmo da abertura mudasse, que é o defeito do
            `0,7` chutado da arcada em 19/08.

            Fica ACIMA do véu na ordem do DOM para não ser dissolvida por ele, e abaixo
            do grupo em importância: `text-small` e opacidade parcial, porque é uma
            pista e não um elemento da composição. */}
        <div
          ref={pistaRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-ink-muted"
        >
          <span className="text-small tracking-[0.14em] uppercase">{data.rotuloRolagem}</span>
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
      </div>
    </section>
  );
}
