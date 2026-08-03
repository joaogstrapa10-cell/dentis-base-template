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
        {/* Arco de luz na base — o accent aparece aqui como atmosfera, não como área */}
        <div
          aria-hidden="true"
          className="ink-arc pointer-events-none absolute inset-0 opacity-45"
        />

        {/* O padding de baixo encolheu junto com a saída do wordmark fantasma:
            os 11rem existiam para dar espaço à palavra gigante, e sem ela
            sobrava uma faixa vazia de quase 200px no pé do bloco. */}
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36">
          <div
            className={
              data.retrato
                ? "grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,27rem)] lg:gap-14"
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

            {/* Retrato. O fio dourado é o que impede a foto de ler como
                screenshot colado sobre o petróleo — sem ele a borda do
                retângulo simplesmente some no fundo escuro. Fio, e não moldura
                cheia: em área o dourado sobre o verde fica turvo. */}
            {data.retrato ? (
              <Reveal delay={260}>
                <figure className="retrato-flutua">
                  <img
                    src={data.retrato}
                    alt={data.retratoAlt}
                    width={500}
                    height={482}
                    className="aspect-[5/6] w-full rounded-[1.6rem] object-cover object-top shadow-2xl ring-1 ring-gold/30"
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
