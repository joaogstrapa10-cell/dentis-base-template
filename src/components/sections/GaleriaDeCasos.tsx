import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CasoClinico, CasosContent } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Galeria de casos em PILHA ARRASTÁVEL: o caso do meio de frente e os outros
 * atrás, deslocados, girados e reduzidos. Arrasta para trocar. Adaptada do
 * componente que o cliente trouxe em 12/08.
 *
 * ---------------------------------------------------------------------------
 * POR QUE NÃO USA `motion/react`, como o template original
 * ---------------------------------------------------------------------------
 * A biblioteca não está no projeto, e o que ela resolve aqui é a mola do solta —
 * o resto é aritmética de deslocamento por cartão. Trocada por uma transição CSS
 * com curva de saída, que no snap é indistinguível a olho, e o projeto não ganha
 * dependência de animação para uma seção. Mesmo critério que decidiu o
 * comparador da Fase 4.
 *
 * ---------------------------------------------------------------------------
 * O QUE FOI ACRESCENTADO, E NÃO É OPCIONAL
 * ---------------------------------------------------------------------------
 * O template só funciona ARRASTANDO: os cartões têm `pointer-events-none`, a
 * superfície de arraste é uma `div` sem papel, e não existe teclado, foco nem
 * rótulo. Quem navega por teclado não troca de caso, e leitor de tela não sabe
 * que há uma lista ali. Num site de clínica isso exclui gente de verdade — é a
 * mesma correção que o accordion do FAQ precisou.
 *
 * Aqui: os botões anterior/próximo são reais e visíveis (servem também a quem
 * não descobre que dá para arrastar), a lista é uma `<ul>` de verdade com
 * `aria-current` no caso ativo, o contador é anunciado por `aria-live`, e as
 * setas do teclado funcionam com a região focada.
 *
 * ---------------------------------------------------------------------------
 * COMPLIANCE — CFO-196/2019
 * ---------------------------------------------------------------------------
 * ⚠️ Esta é a seção mais exposta da resolução, e o formato de galeria aumenta a
 * exposição em vez de reduzir. Duas travas ficam de pé, e não devem sair:
 *
 * 1. UM registro por caso. O tipo `CasoClinico` tem `imagem` no singular, então
 *    não há como montar antes-e-depois aqui. Não acrescentar campo de "antes".
 * 2. O texto do cartão é a SITUAÇÃO CLÍNICA DE PARTIDA — processo, não desfecho.
 *    Não trocar por promessa de resultado, e não é aqui que se descreve ganho
 *    estético.
 *
 * O aviso da resolução continua abaixo da galeria, e a documentação completa de
 * cada caso (conduta, duração, especialidades) fica na página /casos, em dossiê.
 * Galeria convida; a página é que documenta.
 *
 * Registro clínico de paciente exige autorização de uso de imagem por escrito.
 * Enquanto ela não vier, `imagem: null` renderiza o slot rotulado — vazio
 * deliberado é melhor que caixa cinza que lê como site quebrado.
 */

/** Passos de configuração por largura, como no template. */
function configuracao(largura: number) {
  if (largura < 640) {
    return { divisorDistancia: 120, divisorVelocidade: 500, sensibilidade: 180, x: 90, y: 20, giro: 8, reducao: 0.06 };
  }
  if (largura < 1024) {
    return { divisorDistancia: 160, divisorVelocidade: 650, sensibilidade: 220, x: 130, y: 30, giro: 10, reducao: 0.09 };
  }
  return { divisorDistancia: 200, divisorVelocidade: 800, sensibilidade: 250, x: 170, y: 40, giro: 12, reducao: 0.12 };
}

export function GaleriaDeCasos({ data }: { data: CasosContent }) {
  const total = data.itens.length;
  const [progresso, setProgresso] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const [config, setConfig] = useState(() => configuracao(1280));
  const arraste = useRef<{ x: number; t: number; vx: number } | null>(null);

  /* O progresso vive em DOIS lugares: no estado, que é o que renderiza, e numa
     ref, que é o que os manipuladores leem. A ref não é redundância — sem ela,
     todo manipulador lê o valor capturado no render em que foi criado, e dois
     cliques rápidos em "próximo" calculam o MESMO destino, porque o segundo
     ainda vê o progresso de antes do primeiro. O mesmo vale para o fim do
     arraste, que precisa do valor que o próprio arraste acabou de mover. */
  const vivo = useRef(0);
  const aplicar = useCallback((v: number) => {
    vivo.current = v;
    setProgresso(v);
  }, []);

  useEffect(() => {
    const medir = () => setConfig(configuracao(window.innerWidth));
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  /** Encaixa no caso mais próximo, somando um empurrão opcional. */
  const irPara = useCallback(
    (passos: number) => aplicar(Math.round(vivo.current) + passos),
    [aplicar],
  );

  /* Arraste por Pointer Events, que cobrem mouse, toque e caneta com um
     caminho só. `setPointerCapture` mantém o arraste vivo quando o ponteiro sai
     da superfície — sem isso, arrastar rápido para fora deixa a pilha parada no
     meio do caminho. */
  const aoPressionar = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    arraste.current = { x: e.clientX, t: performance.now(), vx: 0 };
    setArrastando(true);
  };

  const aoMover = (e: React.PointerEvent) => {
    const a = arraste.current;
    if (!a) return;
    /* O delta é medido ANTES de atualizar a posição guardada. Escrito ao
       contrário na primeira versão, `a.x` já valia o novo ponto quando o delta
       era calculado, e ele saía sempre zero: a pilha não se movia com o dedo. */
    const dx = e.clientX - a.x;
    const agora = performance.now();
    const dt = Math.max(1, agora - a.t);
    a.vx = (dx / dt) * 1000;
    a.x = e.clientX;
    a.t = agora;
    aplicar(vivo.current - dx / config.sensibilidade);
  };

  const aoSoltar = (e: React.PointerEvent) => {
    const a = arraste.current;
    arraste.current = null;
    setArrastando(false);
    if (!a) return;
    /* A DISTÂNCIA já está em `vivo`, porque a pilha acompanhou o dedo durante o
       arraste. Aqui entra só o empurrão por VELOCIDADE, e ele é limitado a 3
       casos para um arraste violento não atravessar a pilha inteira.
       A primeira versão somava distância e velocidade como no template original,
       mas ali a pilha NÃO se move durante o arraste — o template acumula tudo no
       fim. Somar as duas aqui contava a distância duas vezes, e o destino saía de
       um `progresso` obsoleto do closure: o arraste simplesmente não trocava de
       caso. */
    const empurrao = Math.max(
      -3,
      Math.min(3, Math.round(-a.vx / config.divisorVelocidade)),
    );
    irPara(empurrao);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const ativo = ((Math.round(progresso) % total) + total) % total;

  return (
    <div>
      {/* O arraste é ouvido pela PRÓPRIA região, não por uma camada por cima.
          O template tem uma superfície transparente em `z-50` para isso, e ela
          não funciona aqui: os cartões chegam a `z-index: 100`, então eles
          cobriam a superfície e nenhum `pointerdown` a alcançava — medido, zero
          eventos. No template a camada funciona porque lá os cartões são
          `pointer-events-none`, o que eu tirei ao transformá-los em itens de
          lista de verdade. Com o ouvinte na região e os cartões inertes ao
          ponteiro, o gesto chega sempre, e sobra um elemento a menos.

          `touch-pan-y` deixa a rolagem vertical da página passar — sem isso, no
          celular a pilha captura o dedo e a página trava. */}
      <div
        role="group"
        aria-roledescription="carrossel"
        aria-label={data.titulo}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); irPara(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); irPara(-1); }
        }}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        className={cn(
          "relative flex h-[22rem] touch-pan-y select-none items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-[28rem] lg:h-[32rem]",
          /* SANGRA até a borda da janela e RECORTA ali. As duas coisas resolvem o
             mesmo defeito: a caixa envolvente de um cartão GIRADO é maior que o
             cartão — 208px com 12° de giro medem 256px — e o cartão da ponta
             passava 9px da janela, criando rolagem horizontal na página em 390px.
             Medido, e é o tipo de defeito que não aparece olhando: a página só
             ganha 9px de arrasto lateral.
             Recortar é o comportamento certo para uma pilha de todo modo, e a
             sangria devolve à pilha os 40px de padding do container, que em tela
             estreita fazem diferença. */
          "-mx-5 overflow-hidden md:-mx-10",
          arrastando ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <ul className="contents">
          {data.itens.map((caso, i) => (
            <Carta
              key={caso.numero}
              caso={caso}
              index={i}
              total={total}
              progresso={progresso}
              config={config}
              arrastando={arrastando}
              ativo={i === ativo}
            />
          ))}
        </ul>
      </div>

      {/* Controles. Existem por acessibilidade e por descoberta: arraste é um
          gesto invisível, e num público que não é jovem por definição o botão é
          o caminho principal, não o alternativo. */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <Botao rotulo={data.anteriorLabel} onClick={() => irPara(-1)}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </Botao>

        <p aria-live="polite" className="text-small tabular-nums text-muted">
          {ativo + 1} / {total}
        </p>

        <Botao rotulo={data.proximoLabel} onClick={() => irPara(1)}>
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Botao>
      </div>
    </div>
  );
}

function Botao({
  rotulo,
  onClick,
  children,
}: {
  rotulo: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {children}
    </button>
  );
}

function Carta({
  caso,
  index,
  total,
  progresso,
  config,
  arrastando,
  ativo,
}: {
  caso: CasoClinico;
  index: number;
  total: number;
  progresso: number;
  config: ReturnType<typeof configuracao>;
  arrastando: boolean;
  ativo: boolean;
}) {
  /* Deslocamento circular: o caso mais distante pela frente reaparece por trás,
     então a pilha não tem começo nem fim visível. */
  let d = (index - progresso) % total;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;

  const abs = Math.abs(d);
  const quaseNoCentro = abs < 0.05;
  const opacidade = abs > total / 2 - 0.5 ? 0 : 1;

  return (
    <li
      aria-current={ativo ? "true" : undefined}
      style={{
        translate: `${d * config.x}px ${quaseNoCentro ? 0 : abs * config.y}px`,
        rotate: quaseNoCentro ? "0deg" : `${d * config.giro}deg`,
        scale: 1 - abs * config.reducao,
        opacity: opacidade,
        zIndex: Math.round(100 - abs * 10),
        transitionDuration: arrastando ? "0ms" : "560ms",
      }}
      // `pointer-events-none`: o cartão não intercepta o gesto, que é ouvido pela
      // região. Não há nada clicável dentro dele — ao acrescentar um link aqui,
      // será preciso devolver os eventos a ESTE elemento e mover o ouvinte de
      // arraste para uma camada com z-index acima de 100.
      className="carta-pilha pointer-events-none absolute h-64 w-52 overflow-hidden rounded-2xl bg-surface-raised shadow-[0_24px_60px_-18px_oklch(0_0_0/0.35)] sm:h-80 sm:w-56 lg:h-96 lg:w-64"
    >
      <Registro caso={caso} />

      {/* Escurecimento por distância: o cartão de frente fica limpo e os de trás
          recuam. É o que dá profundidade sem desfoque, que custa GPU. */}
      <div
        aria-hidden="true"
        style={{ opacity: Math.min(0.55, abs * 0.28) }}
        className="carta-pilha absolute inset-0 bg-ink"
      />

      {/* Degradê fixo, para o texto ter contraste sobre qualquer foto. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent"
      />

      {/* Rótulo do registro pendente, sozinho no topo. Ele desaparece quando a
          foto do caso chega, e é por isso que nada mais compete por este canto. */}
      {caso.imagem ? null : (
        <span className="absolute left-3 top-3 rounded-md border border-border bg-background/85 px-2 py-1 text-small text-muted backdrop-blur sm:left-5 sm:top-5">
          {caso.rotuloSlot}
        </span>
      )}

      <div
        style={{ opacity: quaseNoCentro ? 1 : Math.max(0, 1 - abs * 2) }}
        className="carta-pilha absolute inset-x-3 bottom-4 text-ink-foreground sm:inset-x-5 sm:bottom-6"
      >
        {/* A especialidade vive AQUI, acima do título, e não como etiqueta no
            canto de cima do cartão como no template. Motivo medido: no canto ela
            dividia a barra superior com o rótulo do registro pendente, e num
            cartão de 256px "Implantodontia e Cirurgia" não caber a ponto de ser
            truncada — e truncar nome de especialidade clínica informa menos que
            não mostrá-la. No bloco de texto ela tem a largura inteira do cartão.
            A pílula continua sendo a do template, só mudou de lugar.

            Escondida abaixo de `sm`: nos 208px do cartão mobile ela quebra em duas
            linhas e empurra o título, e o cartão pequeno já carrega o rótulo do
            registro. Mesmo critério que o template usa para a descrição. */}
        {caso.especialidades[0] ? (
          <span className="mb-2 hidden rounded-full bg-ink-foreground/95 px-2.5 py-0.5 text-small font-medium text-ink sm:inline-block">
            {caso.especialidades[0]}
          </span>
        ) : null}
        <p className="text-base font-medium leading-[1.25]">{caso.titulo}</p>
        {/* Situação de PARTIDA, não desfecho — ver a nota de compliance no topo
            do arquivo. Duas linhas no máximo: o cartão é chamada, a página /casos
            é onde o caso é documentado. */}
        {/* Escondida abaixo de `sm`, como no template original: em 208px de
            largura, duas linhas de 13px dão quatro palavras por linha e o texto
            colide com o rótulo do registro. No mobile o cartão carrega o título,
            e o resto está na página /casos. */}
        <p className="mt-1.5 hidden line-clamp-2 text-small leading-[1.45] text-ink-muted sm:block">
          {caso.situacao}
        </p>
      </div>
    </li>
  );
}

/**
 * Registro clínico, ou a textura do slot quando ele não existe. O RÓTULO do slot
 * não está aqui: ele vive na barra superior do cartão, junto da especialidade,
 * para os dois não se sobreporem.
 *
 * `draggable={false}` na imagem: sem isso o navegador inicia o arraste nativo de
 * imagem e o gesto da pilha morre no meio.
 */
function Registro({ caso }: { caso: CasoClinico }) {
  if (caso.imagem) {
    return (
      <img
        src={caso.imagem}
        alt={caso.imagemAlt}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={caso.imagemAlt}
      className="slot-grid absolute inset-0"
    />
  );
}
