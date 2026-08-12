import type { HeroContent } from "@/content/types";
import { PillButton, TextLink } from "@/components/Primitives";
import { Reveal } from "@/components/Reveal";

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
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36">
          <div
            className={
              data.retrato
                ? "grid gap-12 lg:grid-cols-[1fr_18rem] lg:items-center lg:gap-16 xl:grid-cols-[1fr_22rem]"
                : "grid gap-10 md:grid-cols-[1.35fr_1fr] md:gap-16"
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

            {/* UMA figura para todos os tamanhos. Antes eram duas — uma faixa
                sangrada em `lg` e um cartão no mobile — e manter duas versões da
                mesma foto era o que permitia o recorte extremo passar sem ser
                notado no desenvolvimento, porque em tela estreita ele não
                aparecia.

                `aspect-square` com arquivo 500×482: o recorte lateral é de 3,6%,
                ou seja invisível. `object-center` porque o assunto ESTÁ no centro
                do arquivo — deslocar o enquadramento aqui é que o descentralizava.

                No mobile a foto vem depois do texto e limita em 20rem, centrada:
                em largura cheia ela viraria o elemento dominante da abertura. */}
            {data.retrato ? (
              <Reveal delay={260}>
                <figure className="retrato-flutua mx-auto w-full max-w-[20rem] lg:mx-0 lg:max-w-none">
                  <img
                    src={data.retrato}
                    alt={data.retratoAlt}
                    width={500}
                    height={482}
                    className="aspect-square w-full rounded-[1.6rem] object-cover object-center shadow-2xl ring-1 ring-gold/30"
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
