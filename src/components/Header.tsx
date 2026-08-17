import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { HeaderContent, NavLink } from "@/content/types";
import { PillButton } from "@/components/Primitives";
import { ARCADA_INTRO_ATE, ARCADA_TRILHO_VH } from "@/components/sections/ArcadaHero";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho em duas peças fixas independentes, ambas acompanhando o scroll:
 *
 * 1. A MARCA, no alto à esquerda, fora da navegação e maior que ela.
 * 2. A PÍLULA de navegação, centralizada no desktop e à direita no mobile.
 *    À direita no mobile porque, centralizada e com a marca fixa à esquerda,
 *    as duas se sobreporiam em tela estreita.
 *
 * A pílula é adaptada de um componente do 21st.dev. Mantidas as ideias que a
 * definem: backdrop-blur com borda hairline, a forma morfando de `rounded-full`
 * para `rounded-2xl` quando o menu mobile abre (voltando a arredondar só 300ms
 * depois de fechar, senão a borda pula antes de o colapso terminar), e o rótulo
 * de navegação que desliza revelando uma cópia mais clara de si.
 *
 * Cores fixas do original trocadas por tokens, e todo texto vem de clinica.ts.
 */

/**
 * Rótulo que desliza para cima revelando uma segunda cópia, mais clara.
 *
 * Alturas explícitas e deslocamento absoluto, de propósito. A versão anterior
 * usava `-translate-y-1/2` sem fixar a altura do empilhamento: dentro de um
 * container `inline-flex`, o `align-items: stretch` esticava o empilhamento para
 * a altura da janela (20px) em vez de deixá-lo assumir os 40px do conteúdo.
 * Resultado: 50% valia 10px e o rótulo parava no meio do caminho, com metade de
 * cada cópia visível. Com `h-10` no empilhamento e `-translate-y-5`, o
 * deslocamento é sempre exatamente uma linha.
 */
function AnimatedNavLink({
  href,
  children,
  foraDoTab,
}: {
  href: string;
  children: string;
  /* `inert` no contêiner não funcionou — React não serializa o atributo booleano
     vazio, e a medição confirmou (`hasAttribute("inert")` false). Então cada link
     sai do Tab por conta: pílula opaca a 0 que ainda recebe foco manda quem navega
     por teclado para destinos que ele não vê. */
  foraDoTab?: boolean;
}) {
  return (
    <a
      href={href}
      tabIndex={foraDoTab ? -1 : undefined}
      className="group inline-flex h-5 shrink-0 items-start overflow-hidden text-base"
    >
      <span
        className={cn(
          "flex h-10 flex-col",
          "transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover:-translate-y-5",
          "motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
        )}
      >
        <span className="flex h-5 shrink-0 items-center whitespace-nowrap leading-5 text-ink-muted">
          {children}
        </span>
        <span className="flex h-5 shrink-0 items-center whitespace-nowrap leading-5 text-ink-foreground">
          {children}
        </span>
      </span>
    </a>
  );
}

export function Header({
  data,
  logo,
  logoAlt,
  esperarArcada = false,
}: {
  data: HeaderContent;
  /** Logo branco. `null` cai no wordmark em texto. */
  logo?: string | null;
  logoAlt?: string;
  /**
   * `true` só na home, onde a página abre pela arcada. A pílula de navegação fica
   * ESCONDIDA até a animação terminar de abrir — pedido do usuário em 17/08: "a
   * aba de navegação ali só vai aparecer após a gente terminar de rolar e aparecer
   * todo o vídeo completo".
   *
   * A MARCA não: ele disse que "a Suzuki pode deixar o logo". Então ela fica de pé
   * durante toda a abertura e só então volta a se apagar.
   *
   * As outras rotas (`/casos`, `/estrutura`) não passam a prop e seguem com a
   * navegação de saída — lá não existe arcada, e esconder o menu numa página
   * interna deixaria o visitante sem como voltar.
   */
  esperarArcada?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [redondo, setRedondo] = useState(true);
  /* Nasce ESCONDIDA quando há arcada na frente: a abertura tem a marca grande no
     centro, e as duas juntas leem como defeito de render. Medido: no primeiro quadro
     do desktop a do canto vinha com opacidade 1 antes de a primeira medição rodar.
     Como `esperarArcada` é conhecido na renderização, o SSR já manda escondida. */
  const [opacidadeMarca, setOpacidadeMarca] = useState(esperarArcada ? 0 : 1);
  /* Nasce escondida quando há arcada na frente, e é isso que evita o PISCA-PISCA:
     começando revelada, a pílula aparecia por ~600ms no carregamento e só então se
     escondia — medido em 0,62 de opacidade no primeiro quadro. Como `esperarArcada`
     é conhecido na renderização, o SSR já manda o HTML com ela escondida.

     O caso sem JS está coberto pelo <noscript> lá embaixo: sem script não há
     animação nem rolagem para revelar nada, então a pílula tem de voltar a
     aparecer — senão a home fica sem navegação para quem chega assim. */
  const [navRevelada, setNavRevelada] = useState(!esperarArcada);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* A marca se apaga ao longo dos primeiros 180px de scroll.
     Começa em 1 no servidor: sem isso a marca piscaria de invisível para
     visível na hidratação. Leitura dentro de requestAnimationFrame porque
     `scrollY` num listener de scroll força layout a cada evento. */
  useEffect(() => {
    let raf = 0;
    const aoRolar = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        /* Sem arcada na frente, a marca se apaga nos primeiros 180px, como sempre.
           COM arcada, o zero se desloca para o fim dela: a abertura tem ~200vh de
           curso, e apagar a marca aos 180px a faria desaparecer nos primeiros 9%
           da animação — justamente o que o usuário pediu para não acontecer. Ela
           fica inteira durante a abertura e começa a sair quando o hero de colagem
           entra, que é a mesma relação de antes. */
        const curso = esperarArcada
          ? ((ARCADA_TRILHO_VH - 100) / 100) * window.innerHeight
          : 0;
        const passou = window.scrollY - curso;
        /* ⚠️ Enquanto a MARCA GRANDE do centro da arcada está na tela, esta do canto
           fica ESCONDIDA — a mesma logo em dois tamanhos ao mesmo tempo lê como
           defeito de render. Ela entra quando a grande termina de sair, o que dá a
           impressão de a marca ter ido para o seu lugar definitivo, e só começa a se
           apagar depois do fim da arcada. */
        const introFim = curso * ARCADA_INTRO_ATE;
        setOpacidadeMarca(
          esperarArcada && window.scrollY < introFim
            ? 0
            : Math.max(0, Math.min(1, 1 - passou / 180)),
        );
        /* A navegação entra quando a arcada termina. Uma vez revelada, NÃO volta a
           esconder ao subir a página: menu que pisca ao rolar para cima lê como
           defeito, e quem já viu o site inteiro não deveria perder o menu por
           voltar ao topo. */
        if (esperarArcada && passou >= 0) setNavRevelada(true);
      });
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [esperarArcada]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (open) {
      setRedondo(false);
    } else {
      timer.current = setTimeout(() => setRedondo(true), 300);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open]);

  return (
    <>
      {/* Marca: `absolute` e se apagando ao rolar.

          Ela ficou `fixed` por uma rodada e foi um erro visível: parada no topo
          enquanto a página sobe, a marca semitransparente passava POR CIMA da
          headline do hero. Aos 135px de scroll o fantasma cinza do logo ficava
          escrito sobre "Odontologia de alta complexidade" — foi isso que o
          usuário viu como "efeito de sombra". Verificado por recorte da mesma
          região da tela em seis posições de scroll.

          Com `absolute` a marca viaja junto com o conteúdo, então não há como
          sobrepor texto: ela sai de cena pelo topo e o fade só dissolve o que já
          está saindo. Continua "livre" no sentido pedido — vive no nível da
          página, fora da pílula e fora do cartão do hero.

          O fade tem função além do efeito: o logo é monocromático BRANCO, e
          garantir que ele desapareça impede que sobre visível sobre as seções
          claras.

          `opacity` vem do scroll, sem `transition`: a transição brigaria com o
          valor já contínuo e daria atraso na resposta. `pointer-events` cai
          junto, senão sobra um link invisível capturando clique no topo. */}
      <a
        href="#arcada"
        aria-label={data.wordmark}
        // `top` calculado para o CENTRO da marca cair no centro da pílula, não
        // escolhido a olho: a pílula em `top-4`/`md:top-8` fecha 58px/66px de
        // altura, com centro em 45px/65px; a marca tem 56px/80px, o que dá
        // `top-4` e `top-6`. Sobra 1px de resíduo — os 2px a mais da pílula são
        // a borda hairline, e corrigir isso custaria um `top-[25px]` para
        // ganhar meio pixel. Mudar a altura da marca ou o padding da pílula
        // exige refazer esta conta.
        //
        // A marca encolhe para 56px na faixa `lg` (1024–1279) e o `top` desce
        // para 36px para o centro continuar em 65px. Isso não é gosto: a pílula
        // é centralizada na janela e a navegação só existe a partir de `lg`, e
        // com a marca a 80px o par COLIDIA — medido em 1024, a pílula começava
        // em 230px e a marca terminava em 238px, com o "SUZUKI" coberto.
        //
        // Foi para 64px quando a navegação tinha quatro itens, e para 56px
        // quando "Home" entrou em 12/08: cada item novo alarga a pílula pelos
        // dois lados, e um item de 74px come 37px da folga esquerda. Volta aos
        // 80px em `xl`, onde sobram 80px de folga.
        className="fixed left-6 top-4 z-50 md:left-14 md:top-6 lg:top-9 xl:top-6"
        style={{
          opacity: opacidadeMarca,
          pointerEvents: opacidadeMarca < 0.05 ? "none" : undefined,
        }}
        aria-hidden={opacidadeMarca < 0.05 || undefined}
        tabIndex={opacidadeMarca < 0.05 ? -1 : undefined}
      >
        {logo ? (
          <img
            src={logo}
            alt={logoAlt ?? data.wordmark}
            // Sombra suave: é o que faz a marca ler como peça solta sobre o
            // bloco, e não como algo impresso nele.
            className="h-14 w-auto drop-shadow-[0_2px_14px_oklch(0_0_0/0.45)] md:h-20 lg:h-14 xl:h-20"
          />
        ) : (
          <span className="text-base font-semibold tracking-[-0.01em] text-ink-foreground">
            {data.wordmark}
          </span>
        )}
      </a>

      {/* Pílula de navegação */}
      <header
        className={cn(
          // Centralizada de verdade (`left-1/2`). Estava deslocada 8% à direita
          // para se afastar do logo; o usuário viu isso como "para a direita
          // demais" em 30/07. Com o logo descido, o encosto não acontece mais.
          "fixed right-4 top-4 z-50 md:left-1/2 md:right-auto md:top-8 md:-translate-x-1/2",
          "flex max-w-[calc(100%-7rem)] flex-col items-center md:max-w-none",
          // Quase opaca, e isso é requisito de contraste, não gosto. A pílula é
          // `fixed`: ela atravessa as seções claras, e a 75% de opacidade o
          // fundo claro subia por baixo dela. Medido por amostragem do pixel do
          // render ao lado do próprio rótulo, em três posições de scroll:
          // sobre o hero escuro 7,54:1 nas duas opacidades, mas sobre seção
          // clara 3,52:1 a 75% (reprova, o rótulo tem 14px) contra 6,58:1 a
          // 95%. O `backdrop-blur` continua, pela borda de vidro.
          "border border-ink-border bg-ink/95 px-5 py-3 backdrop-blur-md",
          redondo ? "rounded-full" : "rounded-2xl",
          /* Entrada da pílula quando a arcada termina. Sobe 8px junto com o fade
             para ler como algo que chega, e não como algo que estava ali apagado.
             `duration-500` porque a abertura da arcada é lenta: entrada rápida
             depois dela pareceria um sobressalto. */
          "transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none",
          navRevelada ? "opacity-100" : "-translate-y-2 opacity-0",
        )}
        /* Fora da árvore de acessibilidade e fora do Tab enquanto invisível: menu
           opaco a 0 que ainda recebe foco manda quem navega por teclado para links
           que ele não vê. */
        aria-hidden={!navRevelada || undefined}
        style={!navRevelada ? { pointerEvents: "none" } : undefined}
      >
        {/* Os vãos apertam na faixa `lg` e voltam em `xl`, pela mesma colisão
            descrita na marca: como a pílula é centralizada, cada pixel que ela
            perde de largura devolve meio pixel de folga em CADA lado, e nos
            rótulos de uma linha só o aperto não se percebe. */}
        <div className="flex w-full items-center justify-end gap-x-8 md:justify-between lg:gap-x-6 xl:gap-x-10">
          <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
            {data.nav.map((item: NavLink) => (
              <AnimatedNavLink
                key={item.href + item.label}
                href={item.href}
                foraDoTab={!navRevelada}
              >
                {item.label}
              </AnimatedNavLink>
            ))}
          </nav>

          {/* `hidden` de verdade enquanto a pílula está invisível: `PillButton` é um
              <a>, e um link opaco a 0 continua no Tab. Não dá para resolver com
              tabIndex aqui sem furar a API do primitivo. */}
          <div className={cn("shrink-0", navRevelada ? "hidden lg:block" : "hidden")}>
            <PillButton
              label={data.cta.label}
              href={data.cta.href}
              tone="light"
              external
            />
          </div>

          <button
            type="button"
            tabIndex={navRevelada ? undefined : -1}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? data.ariaFecharMenu : data.ariaAbrirMenu}
            aria-expanded={open}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "flex w-full flex-col overflow-hidden transition-all duration-300 ease-in-out lg:hidden",
            open
              ? "max-h-[32rem] pt-5 opacity-100"
              : "pointer-events-none max-h-0 pt-0 opacity-0",
          )}
        >
          <nav className="flex w-full flex-col gap-1">
            {data.nav.map((item: NavLink) => (
              <a
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="whitespace-nowrap rounded-lg px-2 py-2.5 text-base text-ink-muted transition-colors hover:bg-ink-elevated hover:text-ink-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 w-full">
            <PillButton
              label={data.cta.label}
              href={data.cta.href}
              tone="light"
              external
              className="w-full justify-center"
            />
          </div>
        </div>
        {/* Sem JavaScript não existe rolagem que revele nada — e a pílula nasce
            escondida na home para não piscar. Este bloco devolve a navegação nesse
            caso: sem ele, quem chega sem script fica sem menu na home. */}
        {esperarArcada ? (
          <noscript>
            <style>{`header[aria-hidden="true"]{opacity:1!important;translate:none!important;pointer-events:auto!important}`}</style>
          </noscript>
        ) : null}
      </header>
    </>
  );
}
