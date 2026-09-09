import type { HeroContent } from "@/content/types";
import { PillButton, TextLink } from "@/components/Primitives";
import { Reveal } from "@/components/Reveal";

/**
 * HERO: bloco escuro sangrando na largura da janela, tudo CENTRALIZADO — headline, uma
 * frase, duas ações e a linha do responsável técnico. Sem imagem nenhuma.
 *
 * A composição centralizada é a de 18/08, pedida como "quero um hero estilo da
 * apple.com, do site americano", e voltou em 09/09 quando a última figura saiu daqui.
 * O que a referência define e continua valendo: texto curto e restrito, muito respiro,
 * e duas ações lado a lado em vez de barra de botões.
 *
 * O que NÃO veio dela, e não vem: o fundo branco. O hero é o bloco escuro que sustenta
 * a alternância verde/branco que fechou a paleta em 30/07 (docs/referencia-layout.md
 * §9). Trocar por claro não é adaptar a referência, é refazer a decisão de paleta.
 *
 * ---------------------------------------------------------------------------
 * ⚠️ ESTA SEÇÃO NÃO TEM MAIS SLOT DE IMAGEM, e foram TRÊS saídas em três dias
 * ---------------------------------------------------------------------------
 * 1. A COLAGEM de três fotos (template de 13/08), com os cartões, as formas flutuantes
 *    e a fileira de NÚMEROS, saiu em 18/08 na recomposição centralizada.
 * 2. A ARCADA 3D saiu em 19/08 — "tire essa arcada da sessão hero" —, porque a abertura
 *    já mostrava a arcada girando e o hero repetia a mesma peça parada. A animação foi
 *    apagada do site inteiro no fim daquele dia e está em `b4292fc`.
 * 3. O RETRATO DO DALTON e a ASSINATURA entraram em 19/08 e MUDARAM DE SEÇÃO em 09/09:
 *    o usuário mandou a foto para a tela de entrada, ao lado da logo, com o print dela
 *    anexado. Vivem em `clinica.abertura` e são desenhados pelo `AberturaPortal`.
 *
 * ⚠️ O padrão dos três é o mesmo, e vale para o próximo pedido de figura aqui: **a
 * mesma peça em duas telas seguidas lê como a página se repetindo.** Antes de pôr
 * imagem no hero, conferir o que a tela de entrada já mostra.
 *
 * `hero.colagem` e `hero.stats` CONTINUAM no conteúdo e no tipo, mas o componente NÃO
 * os desenha — se voltarem a ter itens, o caminho é recuperar o bloco do git, não
 * reescrevê-lo. Os três números vivem em outras seções: a nota do Google nas avaliações,
 * as 8 especialidades em Áreas, os 9 do corpo clínico na Bio.
 *
 * ---------------------------------------------------------------------------
 * A LINHA DO RESPONSÁVEL TÉCNICO FICA
 * ---------------------------------------------------------------------------
 * A Apple não põe nada parecido num hero, e ela fica de todo jeito: nome e número de
 * inscrição na divulgação são exigência da Resolução CFO-196/2019, não decoração.
 *
 * ⚠️ E ela é a razão de esta linha não ter saído junto com a assinatura para a tela de
 * entrada. A assinatura leva só o NOME; a exigência é nome **e** inscrição juntos, e é
 * esta linha que carrega o CRO. Se ela sair daqui, tem de aparecer em outro lugar da
 * divulgação — hoje o CRO do responsável está aqui, no título da Bio e no bloco legal
 * do rodapé.
 */

export function HeroSection({ data }: { data: HeroContent }) {
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

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 pb-14 pt-24 text-center md:px-10 md:pb-20 md:pt-28">
          <h1 className="display-1 mx-auto max-w-[20ch] text-ink-foreground">
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
            {/* `44rem` e não `ch`: `ch` resolve contra a fonte do elemento onde está, e
                já estrangulou bloco neste projeto quatro vezes. */}
            <p className="mx-auto mt-6 max-w-[44rem] text-base leading-[1.6] text-ink-muted">
              {data.subheadline}
            </p>
          </Reveal>

          <Reveal delay={300}>
            {/* Duas ações lado a lado, como o par "Learn more / Buy" da referência. A
                primária continua pílula em vez de link de texto: é o CTA de WhatsApp da
                clínica, e conversão já era decisão tomada. */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
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
            {/* Exigência da CFO-196/2019. Ver a nota do cabeçalho sobre por que ela não
                acompanhou a assinatura para a tela de entrada. */}
            <p className="mt-10 text-small text-ink-muted">
              {data.responsavelLinha}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
