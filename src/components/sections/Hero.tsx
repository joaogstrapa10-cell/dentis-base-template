import type { HeroContent } from "@/content/types";
import { PillButton, TextLink } from "@/components/Primitives";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Estrutura: bloco escuro sangrando na largura da janela, texto à esquerda e o
 * RETRATO CONTIDO à direita, alinhado ao centro vertical do texto.
 *
 * ⚠️ O retrato JÁ SANGROU na borda direita do bloco, ocupando a altura inteira,
 * e foi reprovado pelo usuário em 12/08: "muito pra direita, não centralizada,
 * cortada". A causa era geométrica, não de posicionamento — o arquivo amplo é
 * 2560×703 (3,6:1) e a faixa era 576×693 (0,83:1), então `object-cover`
 * mostrava 22% da largura do arquivo. Nenhum ajuste de `object-position`
 * resolve isso: qualquer recorte de 22% de uma foto panorâmica é um talho.
 * Não voltar a encaixar arquivo panorâmico em faixa vertical.
 *
 * Agora o retrato usa o arquivo original, quase quadrado, num cartão de
 * proporção quase igual à dele — ou seja, sem recorte perceptível. O fio dourado
 * e a flutuação voltaram junto: os dois dependem de a foto ter borda visível, e
 * numa imagem sangrada não havia o que contornar.
 *
 * A coluna do retrato tem largura em `rem`, não em fração, e cresce um degrau em
 * `xl`. Em fração, o retrato roubaria largura da headline conforme a janela
 * encolhe, e a linha "complexidade, conduzida" quebra — foi o que motivou a
 * faixa sangrada. Com largura fixa, a headline fica com 592px em 1024 para 508px
 * de linha mais longa.
 *
 * O header não vive aqui: é uma pílula flutuante no nível da página. O
 * padding-top generoso existe para o conteúdo não passar por baixo dela.
 */
export function HeroSection({ data }: { data: HeroContent }) {
  return (
    <section id="top">
      {/* Sangra até a borda da janela: sem padding externo e sem canto
          arredondado no topo. A moldura clara em volta do cartão escuro era a
          "borda branca" que o usuário reprovou em 30/07 — num bloco que abre a
          página ela lê como janela dentro da janela. O arredondamento sobrou só
          embaixo, que é onde o bloco de fato termina. */}
      <div className="relative isolate overflow-hidden rounded-b-3xl bg-ink">
        {/* Arco de luz na base — o accent aparece aqui como atmosfera, não como
            área. A 28% e não 45%: dourado a 45% sobre verde-petróleo vira OLIVA,
            e a mancha lia como sujeira no pé do bloco. */}
        <div
          aria-hidden="true"
          className="ink-arc pointer-events-none absolute inset-0 opacity-[0.28]"
        />

        {/* O padding de baixo encolheu junto com a saída do wordmark fantasma:
            os 11rem existiam para dar espaço à palavra gigante, e sem ela
            sobrava uma faixa vazia de quase 200px no pé do bloco. */}
        {/* O `pr` grande em `lg`+ é o que RESERVA a faixa do retrato, que a partir
            dali é `absolute` e sai deste container. Os dois valores são derivados,
            não escolhidos: com o retrato ocupando 42vw encostado na borda direita
            da janela, o texto tem de terminar em `100vw - 42vw`. Resolvendo para
            o padding deste container, dá 42vw enquanto a janela é menor que o
            `max-w` (o container acompanha a janela) e `600px - 8vw` depois disso
            (o container congela em 1200px e só a janela cresce). Medido: sobram
            675px de texto em 1440 e 554px em 1024, contra 644px e 508px da linha
            mais longa da headline. */}
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36 lg:pr-[42vw] xl:pr-[calc(37.5rem-8vw)]">
          <div
            className={
              data.retrato ? "" : "grid gap-10 md:grid-cols-[1.35fr_1fr] md:gap-16"
            }
          >
            <div>
              <h1 className="display-1 text-ink-foreground">
                {data.headline.map((linha, i) => (
                  <span key={i} className="line-mask">
                    <span
                      className="line-rise"
                      style={{ animationDelay: `${120 + i * 110}ms` }}
                    >
                      {linha}
                    </span>
                  </span>
                ))}
              </h1>

              <Reveal delay={220}>
                <p className="mt-7 max-w-[52ch] text-base leading-[1.65] text-ink-muted">
                  {data.subheadline}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <PillButton
                    label={data.ctaPrimario.label}
                    href={data.ctaPrimario.href}
                    tone="light"
                    external
                  />
                  <TextLink
                    label={data.ctaSecundario.label}
                    href={data.ctaSecundario.href}
                    tone="light"
                  />
                </div>
              </Reveal>
              <Reveal delay={380}>
                <p className="mt-8 text-small text-ink-muted">
                  {data.responsavelLinha}
                </p>
              </Reveal>
            </div>

            {/* UMA figura para todos os tamanhos, e o que muda entre eles é só o
                POSICIONAMENTO: no fluxo abaixo de `lg`, `absolute` a partir dali.
                Continua sendo um elemento e um recorte só — foram duas versões
                por uma rodada, e foi isso que deixou um recorte extremo passar sem
                ser notado, porque em tela estreita ele não aparecia.

                Em `lg`+ ela é ancorada ao CONTAINER (que é `relative`), e o
                `right` negativo é o que a leva até a borda da janela:
                `max(0px, 50vw - 600px)` é a distância da borda direita do
                container até a da janela — zero enquanto o container acompanha a
                janela, e metade do excedente depois que ele congela em 1200px.
                O valor resolve contra a caixa de PADDING do container, não a de
                conteúdo: errei isso na primeira conta e a foto passava 40px da
                janela.

                A largura é `min(42vw, 38rem)`. O teto não é estético: sem ele, em
                janela larga a foto passaria da ALTURA do bloco e o
                `overflow-hidden` a cortaria — e recorte é o defeito que esta
                rodada toda existe para eliminar. Em 38rem sobram 28px de vão em
                cima e embaixo em 1920, que é o espaço de que a flutuação precisa.

                A margem de cima do mobile é `max-lg:mt-12`, não `mt-12` com
                `lg:mt-0`: `margin-top: 0` vence `margin-block: auto` na cascata do
                Tailwind, então o `lg:mt-0` prendia a figura no TOPO do container
                em vez de centralizá-la, e a flutuação a levava para fora do bloco.
                Medido com `prefers-reduced-motion` ligado para separar layout de
                animação: 0px de vão em cima e 25px embaixo, quando deveriam ser
                12,5px nos dois.

                A proporção é a NATIVA do arquivo, e desde 13/08 vem do CONTEÚDO
                (`retratoLargura`/`retratoAltura`) em vez de cravada aqui — assim o
                `object-cover` não tem o que cortar, seja qual for a foto que cada
                clínica fornecer. Estava em 500×482 fixo, que serviu enquanto o
                arquivo era o retrato do Dalton e passaria a recortar no dia em que
                fosse outro. É a mesma classe de defeito de 12/08, quando o arquivo
                mudou e a caixa não.

                NÃO É MAIS UM CARTÃO. Canto arredondado, fio dourado e sombra de
                caixa saíram em 12/08, a pedido: "não quero ela em um
                quadrado/elemento". No lugar deles, `.retrato-fundido` dissolve as
                bordas da foto até transparente, então ela pertence ao bloco em
                vez de estar apoiada nele. A explicação da máscara está no
                `styles.css`, junto da regra.

                A sombra de caixa não poderia ficar junto com a máscara nem se
                quisesse: `box-shadow` acompanha a CAIXA do elemento, não a
                máscara, então ela desenharia exatamente o retângulo que a máscara
                existe para apagar. O que dá profundidade agora é a mancha escura
                atrás, logo abaixo — essa sim segue uma forma sem aresta.

                O `figure` não tem fundo, borda nem raio: qualquer um dos três
                reintroduz o "elemento". */}
            {data.retrato ? (
              /* ⚠️ SEM `Reveal` em volta, e não é esquecimento. O `Reveal` aplica
                 `translate`, e qualquer valor de `translate` diferente de `none`
                 cria BLOCO DE CONTENÇÃO para descendentes absolutos — mesmo
                 `translate: 0 0`. Com a figura dentro dele, o `absolute` se
                 ancorava no wrapper do Reveal em vez do container: medido, a foto
                 parava em x=995 numa janela de 1440 (o wrapper tem a largura do
                 CONTEÚDO, 675px) e o `inset-y-0` a centralizava na altura de uma
                 caixa de altura zero, jogando-a 552px abaixo do topo do bloco e
                 fora do bloco por baixo. A foto já tem animação própria
                 (`retrato-flutua`) e abre acima da dobra, então a entrada revelada
                 não faz falta aqui. */
              <>
                <figure className="retrato-flutua relative mx-auto w-full max-w-[26rem] max-lg:mt-12 lg:absolute lg:inset-y-0 lg:my-auto lg:h-fit lg:max-w-none lg:right-[calc(-1*max(0px,50vw_-_600px))] lg:w-[min(42vw,38rem)]">
                  {/* Mancha escura atrás da figura, no lugar da sombra de caixa.
                      Radial e maior que a foto, então não tem borda para
                      denunciar — dá o assentamento sem desenhar contorno.

                      `z-0` na mancha e `z-10` na imagem, não `-z-10` na mancha:
                      índice negativo dentro de um `relative` sem contexto próprio
                      manda a camada para trás do FUNDO do bloco escuro, e ela
                      desaparece. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-6 z-0 bg-[radial-gradient(58%_52%_at_50%_60%,oklch(0_0_0/0.5),transparent_74%)] blur-xl"
                  />
                  <img
                    src={data.retrato}
                    alt={data.retratoAlt}
                    width={data.retratoLargura}
                    height={data.retratoAltura}
                    style={{
                      aspectRatio: `${data.retratoLargura} / ${data.retratoAltura}`,
                    }}
                    className={cn(
                      "relative z-10 w-full object-cover object-center",
                      /* Duas máscaras, e a escolha vem do conteúdo. Ver a nota em
                         `retratoSemFundo`, no types.ts: figura recortada e foto
                         retangular precisam de bordas opostas, e trocar as duas
                         de lugar apaga gente ou deixa um retângulo à vista. */
                      data.retratoSemFundo ? "figura-recortada" : "retrato-fundido",
                    )}
                  />
                </figure>
              </>
            ) : null}
          </div>
        </div>

      </div>
    </section>
  );
}
