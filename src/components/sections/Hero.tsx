import { GraduationCap, LayoutGrid, Star } from "lucide-react";
import type { HeroContent, HeroImagem, HeroStatIcone } from "@/content/types";
import { PillButton, TextLink } from "@/components/Primitives";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Estrutura: bloco escuro sangrando na largura da janela, DUAS COLUNAS — texto e
 * fileira de números à esquerda, COLAGEM de três fotos à direita.
 *
 * ---------------------------------------------------------------------------
 * DE ONDE VEM ESTA ANATOMIA
 * ---------------------------------------------------------------------------
 * Do template que o usuário trouxe em 13/08. O que veio dele, e é o que define a
 * seção: duas colunas, os números ao pé do texto com ícone em disco, e três fotos
 * sobrepostas em cartões arredondados com sombra — a maior ao centro no topo, a
 * média à direita no terço de cima, a menor embaixo à esquerda. As formas
 * pequenas que flutuam atrás também são dele.
 *
 * Antes disso o hero tinha UMA foto, `absolute`, sangrando até a borda da janela.
 * Ela saiu junto com a máquina que a sustentava: o `lg:pr-[42vw]` do container e o
 * `right` negativo calculado sobre `50vw - 600px`. Com a colagem dentro de uma
 * coluna, a grade resolve o mesmo problema sem nada disso.
 *
 * ---------------------------------------------------------------------------
 * O QUE FOI TROCADO DO TEMPLATE
 * ---------------------------------------------------------------------------
 * - `framer-motion` não está no projeto, e não entra por uma seção. As três
 *   variantes dele (stagger do container, subida dos itens, escala das imagens)
 *   viram `Reveal` com atraso crescente, que é o mecanismo que o resto da página
 *   já usa. A flutuação vira `.retrato-flutua`, keyframe que já existia.
 * - O template é uma seção CLARA (`bg-background`). Aqui o hero é o bloco escuro
 *   que abre a página — é ele que sustenta a alternância verde/branco que fechou
 *   a paleta em 30/07. Trocar por claro não é adaptar o template, é refazer a
 *   decisão de paleta.
 * - `bg-muted` do template NÃO serve: neste projeto `--color-muted` é a cor do
 *   TEXTO secundário (o `@theme` mapeia `--color-muted` para `--muted`), então
 *   `bg-muted` pintaria o passe-partout com a cor de texto. Os cartões usam
 *   `bg-surface`.
 * - As formas decorativas eram azul-claro, roxo e verde pastel, com variante
 *   `dark:`. O projeto não tem modo escuro por classe, e azul-claro de
 *   consultório é um dos clichês proibidos na §4 do CLAUDE.md. Viraram dourado e
 *   petróleo em opacidade baixa — atmosfera, não confete.
 * - `text-4xl sm:text-6xl`, `text-lg`, `text-xl` e `text-sm` do template saem
 *   pela escala fechada de cinco degraus: `.display-1`, `text-base`, `.display-3`
 *   e `text-small`.
 * - Os botões do template são `<Button onClick>`. Aqui a chamada é um LINK para o
 *   WhatsApp — clique que não navega em CTA de clínica é botão morto —, então
 *   ficam `PillButton` e `TextLink`, que carregam o glifo do WhatsApp e o
 *   sublinhado da identidade.
 *
 * ---------------------------------------------------------------------------
 * LARGURA DA COLUNA DA COLAGEM: 26rem, E É REQUISITO
 * ---------------------------------------------------------------------------
 * A coluna da direita tem largura em `rem`, não em fração. Em fração ela rouba
 * largura da headline conforme a janela encolhe, e a linha "complexidade,
 * conduzida" QUEBRA — foi esse defeito que, em 12/08, levou a foto a sangrar para
 * fora do container. Com `min(38vw, 26rem)` sobram 672px de texto em 1440 e 523px
 * em 1024, contra 644px e 508px da linha mais longa. Medido, e a medição é por
 * contagem de RETÂNGULOS de cada linha (`getClientRects`), não por comparar
 * larguras: os spans esticam até o container e a comparação sempre "passa".
 */

const ICONES: Record<HeroStatIcone, React.ReactElement> = {
  nota: <Star size={18} strokeWidth={1.75} aria-hidden="true" />,
  especialidades: <LayoutGrid size={18} strokeWidth={1.75} aria-hidden="true" />,
  corpoClinico: <GraduationCap size={18} strokeWidth={1.75} aria-hidden="true" />,
};

/**
 * Um cartão da colagem.
 *
 * `semFundo` decide DUAS coisas, e as duas por conteúdo, não por gosto:
 *
 * 1. O acabamento. A figura recortada ganha passe-partout claro — ela não tem
 *    fundo próprio, e o recorte foi feito sobre branco de estúdio, então o claro é
 *    o fundo natural dela. Foto de ambiente preenche o cartão inteiro: moldura
 *    interna ali só encolheria a foto.
 * 2. A PROPORÇÃO, e é a parte que evita recorte errado. O cartão da figura
 *    recortada recebe a proporção nativa do arquivo, então `object-cover` não tem
 *    o que cortar: GENTE não se corta, e no recorte da equipe as pessoas das duas
 *    pontas já estão na borda. Os cartões de ambiente ficam quadrados, como no
 *    template, e aí o corte é de ~33% da largura — em foto de sala isso é
 *    enquadramento, não perda de assunto.
 */
function CartaColagem({
  imagem,
  className,
  atraso,
}: {
  imagem: HeroImagem;
  /** Só LARGURA quando a imagem é recortada (a altura sai da proporção), largura
   *  e altura quando é foto de ambiente. */
  className?: string;
  atraso: number;
}) {
  return (
    <Reveal
      delay={atraso}
      className={cn(
        "absolute overflow-hidden rounded-2xl shadow-[0_28px_70px_-22px_oklch(0_0_0/0.55)]",
        imagem.semFundo ? "bg-surface p-2" : "bg-ink-elevated",
        className,
      )}
      style={
        imagem.semFundo
          ? { aspectRatio: `${imagem.largura} / ${imagem.altura}` }
          : undefined
      }
    >
      <img
        src={imagem.src}
        alt={imagem.alt}
        width={imagem.largura}
        height={imagem.altura}
        className={cn(
          "h-full w-full rounded-xl object-cover",
          imagem.foco === "esquerda"
            ? "object-left"
            : imagem.foco === "direita"
              ? "object-right"
              : "object-center",
        )}
      />
    </Reveal>
  );
}

/**
 * Forma que flutua atrás da colagem. Dourado e petróleo em opacidade baixa, no
 * lugar do azul-claro, roxo e verde pastel do template — azul-claro de consultório
 * é um dos clichês proibidos na §4 do CLAUDE.md, e os três juntos punham uma
 * quarta paleta na página.
 *
 * `hidden sm:block`: em 390px os cartões já estão em 208, 144 e 128px, e três
 * formas soltas em volta deles competem com as fotos em vez de ambientá-las.
 */
function FormaFlutuante({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("retrato-flutua pointer-events-none absolute hidden sm:block", className)}
    />
  );
}

export function HeroSection({ data }: { data: HeroContent }) {
  const temColagem = data.colagem.length > 0;

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

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-20 pt-28 md:px-10 md:pb-24 md:pt-32">
          <div
            className={cn(
              "grid items-center gap-14",
              /* Largura fixa na coluna da colagem, não fração — ver a nota no
                 topo do arquivo. */
              temColagem && "lg:grid-cols-[1fr_min(38vw,26rem)] lg:gap-10",
            )}
          >
            {/* ---------------- Coluna do texto ---------------- */}
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

              {/* Fileira de números do template. Separada por um fio, e não por
                  cartões: cartão com fundo próprio é o padrão que a repaginação
                  de 03/08 tirou da página inteira. */}
              {data.stats.length > 0 ? (
                <Reveal delay={380}>
                  <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-ink-border pt-8">
                    {data.stats.map((stat) => (
                      <div key={stat.rotulo} className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-elevated text-gold">
                          {ICONES[stat.icone]}
                        </span>
                        <div>
                          <dd className="display-3 text-ink-foreground">{stat.valor}</dd>
                          <dt className="text-small text-ink-muted">{stat.rotulo}</dt>
                        </div>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ) : null}

              <Reveal delay={460}>
                <p className="mt-8 text-small text-ink-muted">
                  {data.responsavelLinha}
                </p>
              </Reveal>
            </div>

            {/* ---------------- Coluna da colagem ---------------- */}
            {temColagem ? (
              /* Altura fixa porque os cartões são `absolute` e não empurram nada:
                 sem ela a coluna colapsa e a colagem sai por cima do texto.
                 Os tamanhos são os do template reduzidos um degrau — os 256px do
                 cartão maior foram desenhados para uma coluna de ~600px, e nesta,
                 de 416px, três cartões daquele tamanho viram uma pilha sem
                 respiro. */
              /* AUMENTAR A COLAGEM foi pedido duas vezes em 13/08, e o espaço
                 nunca pôde vir da largura do TEXTO. A conta que fecha isso:
                 a `.display-1` tem teto de 3rem, então a linha mais longa da
                 headline mede ~644px de 1280px para cima, e a trilha do texto na
                 grade é `1120 - 40 (gap) - 416 (colagem)` = 664px. Sobram 20px.
                 Ou seja a TRILHA da colagem está no limite e não pode crescer.

                 Todo o crescimento vem da MARGEM DO BLOCO: o container para em
                 1200px, o bloco sangra até a janela, e entre um e outro há 40px de
                 padding mais metade do excedente da janela. A margem direita
                 negativa leva a colagem para dentro dessa faixa sem tocar na
                 coluna do texto.

                 Uma expressão em vez de uma escada de breakpoints:
                 `min(12rem, max(0px, 50vw - 600px) + 2rem)`
                 — `max(0px, 50vw - 600px)` é a folga de um lado (0 até 1200px de
                   janela, metade do excedente depois);
                 — `+ 2rem` são 32px dos 40px de padding, deixando 8px de ar para o
                   cartão não encostar na janela;
                 — o teto de 12rem existe porque sem ele, em 1920, a colagem iria a
                   808px e ficaria maior que a coluna de texto.
                 Resultado medido: 421px de colagem em 1024, 488 em 1280, 568 em
                 1440 e 608 de 1600 para cima. */
              /* Sem `w-full`, e é isso que faz a margem negativa funcionar: item
                 de grade com largura AUTO estica para a trilha MENOS as margens,
                 então margem negativa o alarga. Com `width: 100%` a largura fica
                 presa na trilha e a margem negativa não alarga nada — só desloca
                 o que vem depois. */
              <div className="relative h-[24rem] sm:h-[28rem] lg:mr-[calc(-1*min(12rem,max(0px,50vw_-_600px)+2rem))] lg:h-[27rem] xl:h-[30rem] 2xl:h-[33rem]">
                <FormaFlutuante className="left-[18%] top-2 h-16 w-16 rounded-full bg-gold/15" />
                <FormaFlutuante className="bottom-6 right-[22%] h-12 w-12 rounded-xl bg-accent/25 [animation-delay:1.4s]" />
                <FormaFlutuante className="bottom-[26%] left-1 h-6 w-6 rounded-full bg-gold/25 [animation-delay:2.6s]" />

                {/* Só largura: a altura vem da proporção do arquivo. */}
                {data.colagem[0] ? (
                  <CartaColagem
                    imagem={data.colagem[0]}
                    atraso={120}
                    className="left-1/2 top-0 w-64 -translate-x-1/2 sm:w-72 lg:w-[20rem] xl:w-[22.5rem] 2xl:w-[24rem]"
                  />
                ) : null}
                {/* `top-[42%]` e não `top-1/3` como no template: a um terço, este
                    cartão cobria 77px da altura do cartão da equipe, entrando no
                    corpo das pessoas da ponta direita. A 42% a sobreposição cai
                    para ~40px, que é o encaixe do template sem comer gente. */}
                {data.colagem[1] ? (
                  <CartaColagem
                    imagem={data.colagem[1]}
                    atraso={260}
                    className="right-0 top-[42%] h-44 w-44 sm:h-52 sm:w-52 lg:h-60 lg:w-60 xl:h-[17rem] xl:w-[17rem] 2xl:h-72 2xl:w-72"
                  />
                ) : null}
                {data.colagem[2] ? (
                  <CartaColagem
                    imagem={data.colagem[2]}
                    atraso={400}
                    className="bottom-0 left-0 h-40 w-40 sm:h-48 sm:w-48 lg:h-52 lg:w-52 xl:h-56 xl:w-56 2xl:h-64 2xl:w-64"
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
