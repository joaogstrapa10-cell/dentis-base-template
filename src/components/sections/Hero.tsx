import type { HeroAssinatura, HeroContent, HeroImagem } from "@/content/types";
import { PillButton, TextLink } from "@/components/Primitives";
import { Reveal } from "@/components/Reveal";

/**
 * HERO: o retrato do responsável técnico à esquerda, o texto à direita, e a assinatura
 * dele embaixo do retrato.
 *
 * Pedido do usuário em 19/08: "vamos colocar o rosto do Dalton, ele é a principal cara
 * da Suzuki, seria essencial ter a foto dele ao lado da logo no hero e embaixo uma
 * assinatura manuscrita do nome completo dele, tipo do Ayrton Senna".
 *
 * ---------------------------------------------------------------------------
 * ⚠️ A CENTRALIZAÇÃO DO ESTILO APPLE SAIU, E FOI UMA TROCA CONSCIENTE
 * ---------------------------------------------------------------------------
 * De 18/08 a 19/08 este hero era tudo centralizado, no estilo apple.com, com a arcada
 * 3D grande no meio como produto. Duas mudanças dele desmontaram isso, nesta ordem: a
 * arcada saiu ("tire essa arcada da sessão hero", quando ela ainda existia como
 * abertura e o hero repetia a mesma peça parada), e então o retrato entrou "ao lado" do
 * texto — e "ao lado" é grade de duas colunas, que é o oposto de centralizar.
 *
 * ⚠️ A ARCADA 3D NÃO EXISTE MAIS EM NENHUMA SEÇÃO. Ela foi apagada do site no fim de
 * 19/08 ("tire a ideia dos dentes, a ideia da sessão do scroll com a logo tá boa") e
 * está no git, em `b4292fc`. Hoje a abertura é o `AberturaPortal` — a marca sozinha no
 * verde, crescendo na rolagem. Não reescrever a arcada de memória se ela voltar.
 *
 * O que a referência da Apple DEIXOU e continua valendo: texto curto e restrito, muito
 * respiro, duas ações lado a lado em vez de barra de botões, e o produto (agora a
 * pessoa) com presença de verdade em vez de miniatura.
 *
 * O que NÃO veio dela, e não vem: o fundo branco. O hero é o bloco escuro que sustenta
 * a alternância verde/branco que fechou a paleta em 30/07 (docs/referencia-layout.md
 * §9).
 *
 * ---------------------------------------------------------------------------
 * O QUE JÁ PASSOU POR AQUI, E ONDE ESTÁ
 * ---------------------------------------------------------------------------
 * ⚠️ A COLAGEM de três fotos (template de 13/08), os cartões, as formas flutuantes e a
 * fileira de NÚMEROS saíram em 18/08. `hero.colagem` e `hero.stats` CONTINUAM no
 * conteúdo e no tipo, mas o componente NÃO os desenha mais — se voltarem a ter itens,
 * o caminho é recuperar o bloco do git, não reescrevê-lo. Os três números vivem em
 * outras seções: a nota do Google nas avaliações, as 8 especialidades em Áreas, os 9 do
 * corpo clínico na Bio.
 *
 * ⚠️ E `hero.arcada` NÃO EXISTE MAIS no tipo: `hero.retrato` ocupou o lugar dele. Não é
 * só renomear — o campo apontava para um quadro do vídeo da arcada, que saiu do repo
 * junto com a animação. Nas variantes, `retrato` recebe a foto de cada sócio.
 *
 * ---------------------------------------------------------------------------
 * A LINHA DO RESPONSÁVEL TÉCNICO FICA, E AGORA TEM COMPANHIA
 * ---------------------------------------------------------------------------
 * Nome e número de inscrição na divulgação são exigência da Resolução CFO-196/2019, não
 * decoração de hero. Ela passou a viver embaixo da assinatura, e a repetição do nome
 * (uma vez no traço, uma vez na linha) é DELIBERADA: a assinatura é um sinal gráfico e
 * a linha é o registro legal — apagar a linha porque "o nome já está ali" tiraria o
 * número do CRO da tela.
 */

/** Retrato + assinatura + linha legal. É a coluna da esquerda no desktop. */
function ColunaRetrato({
  retrato,
  assinatura,
  responsavelLinha,
}: {
  retrato: HeroImagem;
  assinatura: HeroAssinatura | null;
  responsavelLinha: string;
}) {
  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <Reveal delay={380}>
        {/* SEM CARTÃO e SEM SOMBRA, com `.retrato-fundido`: o arquivo é uma FOTO
            retangular (parede verde da clínica atrás), não um recorte com alpha, então
            sem a máscara ele desenharia uma aresta reta no meio do bloco escuro. É a
            distinção registrada em 13/08 — `.figura-recortada` é para figura sem fundo,
            `.retrato-fundido` para foto retangular; trocar as duas apaga metade da peça.

            A proporção vem do ARQUIVO e não cravada aqui: é a lição de 12/08, quando
            uma proporção fixa recortou 78% de uma foto panorâmica, e de 13/08, quando
            o arquivo do hero mudou e a medida cravada passou a recortar. */}
        <img
          src={retrato.src}
          alt={retrato.alt}
          width={retrato.largura}
          height={retrato.altura}
          className="retrato-fundido h-auto w-full max-w-[20rem] object-contain lg:max-w-none"
          style={{ aspectRatio: `${retrato.largura} / ${retrato.altura}` }}
        />
      </Reveal>

      {assinatura ? (
        <Reveal delay={460}>
          <div className="mt-5 lg:mt-6">
            {assinatura.src ? (
              /* O TRAÇO REAL, quando existir. SVG monocromático claro, então ele
                 herda a cor por `currentColor` e escala sem serrilhar. */
              <img
                src={assinatura.src}
                alt={`Assinatura de ${assinatura.nome}`}
                className="h-auto w-full max-w-[16rem] lg:max-w-[18rem]"
              />
            ) : (
              /* ⚠️ ESTADO RESERVADO: o nome composto numa fonte manuscrita, porque o
                 traço do Dr. Dalton ainda não existe em arquivo. O usuário aprovou
                 isso como provisório em 19/08, sabendo que a referência que ele deu
                 (Ayrton Senna) é caligrafia real digitalizada.

                 O `title` diz o que a peça é, para quem inspeciona não confundir com
                 a assinatura verdadeira. `aria-hidden` NÃO: o nome é conteúdo legível e
                 o leitor de tela deve anunciá-lo. */
              <p
                className="assinatura-manuscrita text-ink-foreground"
                title="Composição tipográfica provisória — a assinatura digitalizada do responsável técnico substituirá esta peça."
              >
                {assinatura.nome}
              </p>
            )}
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={520}>
        {/* Exigência da CFO-196/2019: nome e número de inscrição. Ver a nota do
            cabeçalho sobre por que ela não sai mesmo com o nome na assinatura. */}
        <p className="mt-3 text-small text-ink-muted">{responsavelLinha}</p>
      </Reveal>
    </div>
  );
}

export function HeroSection({ data }: { data: HeroContent }) {
  const retrato = data.retrato;

  return (
    <section id="top">
      {/* Sangra até a borda da janela: sem padding externo e sem canto arredondado no
          topo. A moldura clara em volta do cartão escuro era a "borda branca" que o
          usuário reprovou em 30/07 — num bloco que abre a página ela lê como janela
          dentro da janela. O arredondamento sobrou só embaixo, onde o bloco termina. */}
      <div className="relative isolate overflow-hidden rounded-b-3xl bg-ink">
        {/* Arco de luz na base — o accent aparece aqui como atmosfera, não como área.
            A 28% e não 45%: dourado a 45% sobre verde-petróleo vira OLIVA, e a mancha
            lia como sujeira no pé do bloco. */}
        <div
          aria-hidden="true"
          className="ink-arc pointer-events-none absolute inset-0 opacity-[0.28]"
        />

        {/* ⚠️ A GRADE ABRE EM `lg` E NÃO EM `md`, e o motivo é a headline, não gosto.
            A linha mais longa ("complexidade, conduzida") mede ~644px com `.display-1`
            no teto de 48px. Abrindo em `md` (768px), a coluna de texto ficaria com
            ~380px e a headline quebraria em cinco linhas em vez de três. Abaixo de
            `lg` a composição empilha e volta a ser centrada, que é o que cabe.

            A coluna do retrato tem largura em `rem` e não em fração — requisito
            registrado em 13/08: em fração ela rouba largura da headline conforme a
            janela encolhe, e foi assim que a foto vazou o container em 12/08. */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-5 pb-14 pt-24 md:px-10 md:pb-20 md:pt-28 lg:grid-cols-[18rem_1fr] lg:gap-14 xl:grid-cols-[20rem_1fr] xl:gap-16">
          {/* ⚠️ O RETRATO VEM DEPOIS NO DOM e sobe para a primeira coluna por
              `lg:order-first`. Isso não é truque de layout: no celular a pilha começa
              pela HEADLINE, porque um retrato de 320px acima dela empurraria o assunto
              da página para fora da dobra. No desktop a ordem visual é retrato →
              texto, que é o "ao lado" que ele pediu. */}
          <div className="text-center lg:text-left">
            <h1 className="display-1 mx-auto max-w-[20ch] text-ink-foreground lg:mx-0">
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
              {/* `44rem` e não `ch`: `ch` resolve contra a fonte do elemento onde
                  está, e já estrangulou bloco neste projeto quatro vezes. */}
              <p className="mx-auto mt-6 max-w-[44rem] text-base leading-[1.6] text-ink-muted lg:mx-0">
                {data.subheadline}
              </p>
            </Reveal>

            <Reveal delay={300}>
              {/* Duas ações lado a lado, como o par "Learn more / Buy" da referência.
                  A primária continua pílula em vez de link de texto: é o CTA de
                  WhatsApp da clínica, e conversão já era decisão tomada. */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
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
          </div>

          {retrato ? (
            <div className="lg:order-first">
              <ColunaRetrato
                retrato={retrato}
                assinatura={data.assinatura}
                responsavelLinha={data.responsavelLinha}
              />
            </div>
          ) : (
            /* Sem retrato (o caso das variantes que não tiverem foto), a linha legal
               não pode desaparecer com a coluna — ela é exigência, não acessório. */
            <Reveal delay={460}>
              <p className="text-center text-small text-ink-muted lg:order-first lg:text-left">
                {data.responsavelLinha}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
