import type { HeroContent } from "@/content/types";
import { PillButton, TextLink } from "@/components/Primitives";
import { Reveal } from "@/components/Reveal";

/**
 * Layout do hero segue a referência: um CARTÃO ESCURO arredondado encaixado
 * dentro da página clara, com o wordmark gigante translúcido cortado pela borda
 * inferior. A diferença em relação à referência é o retrato do responsável
 * técnico na coluna da direita — numa clínica quem assina o tratamento é
 * argumento, e a referência é de agência, não tem rosto para mostrar.
 *
 * Por isso a headline, a subheadline e os CTAs ficam empilhados numa coluna só,
 * e não em duas como antes: com o retrato ocupando a direita, três colunas de
 * conteúdo apertariam a headline até quebrar em palavras órfãs.
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
        {/* RETRATO EM DESKTOP: sangra na borda direita do bloco e ocupa a altura
            inteira dele. Antes era um cartão arredondado dentro da grade, a 30%
            da largura, e ampliá-lo ali roubava largura da headline — a linha
            "complexidade, conduzida" quebrava. Sangrando, a foto ganha presença
            por ALTURA e por corte, sem disputar espaço com o texto: ela emerge
            do bloco em vez de estar apoiada nele.

            O degradê na borda esquerda é o que faz a fusão. Sem ele a foto tem
            uma aresta vertical dura no meio do verde, que denuncia a colagem. */}
        {data.retrato ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] select-none lg:block xl:w-[40%]"
          >
            <img
              src={data.retrato}
              alt=""
              width={2560}
              height={703}
              className="h-full w-full object-cover object-[62%_18%]"
            />
            {/* DUAS camadas, e as duas são necessárias.

                A rampa (`from-ink via-ink/45 to-transparent`, metade da faixa)
                dissolve a aresta vertical. Antes era uma rampa de dois pontos em
                40% da faixa, e ainda dava costura visível: a rampa linear chega
                a transparente cedo, e o lado esquerdo da foto é a janela
                DESFOCADA e CLARA do consultório, ou seja o ponto de maior
                contraste possível contra o verde escuro. O ponto médio a 45%
                estica a cauda e desloca a queda para onde a foto já está no
                ombro dele.
                O véu (`bg-ink/12`) resolve o resto, que não é geometria e sim
                temperatura: a foto é mais clara e mais fria que o bloco, e um
                filme do próprio verde por cima aproxima as duas sem lavar o
                rosto. */}
            <div className="absolute inset-0 bg-ink/12" />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-ink via-ink/45 to-transparent" />
          </div>
        ) : null}

        {/* Arco de luz na base — o accent aparece aqui como atmosfera, não como
            área.

            ⚠️ ELE VEM DEPOIS DO RETRATO, e a ordem é a correção de um defeito
            medido, não preferência. Enquanto o arco era a primeira camada, a
            faixa da foto o COBRIA: o brilho existia à esquerda e parava morto na
            borda da imagem, desenhando exatamente a aresta vertical que o
            degradê existe para dissolver. Medido por amostragem de luminância no
            render em 1440, na coluna x=864: 40 à esquerda contra 24 à direita a
            700px de altura — 16 pontos de salto num único pixel de distância.
            Com o arco por cima, a atmosfera atravessa a foto e o salto some.
            O texto continua acima dos dois, por `z-10`.

            A opacidade caiu de 45% para 28% na mesma rodada: dourado a 45% sobre
            verde-petróleo dá OLIVA, e antes isso morria no canto inferior, longe
            de tudo. Com a foto ocupando a direita, a mancha oliva passou a
            encostar nela e a leitura mudou de atmosfera para sujeira. */}
        <div
          aria-hidden="true"
          className="ink-arc pointer-events-none absolute inset-0 opacity-[0.28]"
        />

        {/* O padding de baixo encolheu junto com a saída do wordmark fantasma:
            os 11rem existiam para dar espaço à palavra gigante, e sem ela
            sobrava uma faixa vazia de quase 200px no pé do bloco. */}
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36">
          {/* `lg:pr-[44%]` reserva a faixa da foto. É porcentagem do container,
              não largura fixa, para a coluna de texto acompanhar a viewport —
              medido em 1440: 627px de texto contra 632px da versão anterior, ou
              seja a headline não perdeu espaço nenhum.

              A faixa é 42% em `lg` e 44% em `xl` por uma folga medida: em 1024 a
              linha mais longa da headline ("complexidade, conduzida") ocupa
              508px, e com 44% a coluna ficava em 529px — 21px de sobra, perto
              demais de quebrar se a fonte renderizar um fio mais larga em outro
              sistema. Com 42% a coluna vai a 548px. */}
          <div className={data.retrato ? "lg:pr-[42%] xl:pr-[44%]" : "grid gap-10 md:grid-cols-[1.35fr_1fr] md:gap-16"}>
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

            {/* RETRATO EM MOBILE E TABLET: cartão no fluxo, depois do texto.
                A versão sangrada só existe a partir de `lg` — em tela estreita
                não há largura para reservar uma faixa lateral, e a foto atrás do
                texto deixaria a headline ilegível.

                O fio dourado e a flutuação ficaram AQUI. Os dois dependem de a
                foto ter borda visível: numa imagem que sangra e ocupa a altura
                inteira do bloco, o fio não tem o que contornar, e a flutuação
                revelaria as arestas do corte subindo e descendo. */}
            {data.retrato ? (
              <Reveal delay={260}>
                <figure className="retrato-flutua mt-12 lg:hidden">
                  <img
                    src={data.retrato}
                    alt={data.retratoAlt}
                    width={2560}
                    height={703}
                    className="aspect-[4/3] w-full rounded-[1.6rem] object-cover object-[62%_18%] shadow-2xl ring-1 ring-gold/30 sm:aspect-[16/10]"
                  />
                </figure>
              </Reveal>
            ) : null}
          </div>
        </div>

      </div>
    </section>
  );
}
