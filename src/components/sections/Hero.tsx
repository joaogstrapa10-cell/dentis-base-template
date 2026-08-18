import type { HeroContent } from "@/content/types";
import { PillButton, TextLink } from "@/components/Primitives";
import { Reveal } from "@/components/Reveal";

/**
 * HERO no estilo apple.com, pedido em 18/08: "quero um hero estilo da apple.com, do
 * site americano". Bloco escuro sangrando na largura da janela, TUDO CENTRALIZADO —
 * headline, uma frase, duas ações — e a ARCADA 3D grande no meio, como o produto.
 *
 * ---------------------------------------------------------------------------
 * O QUE A REFERÊNCIA DEFINIU, E O QUE NÃO
 * ---------------------------------------------------------------------------
 * Veio dela a COMPOSIÇÃO: centralização, o produto como protagonista e grande, texto
 * curto e restrito, muito respiro em volta, e duas ações lado a lado no lugar de uma
 * barra de botões.
 *
 * NÃO veio o fundo branco. O hero é o bloco escuro que abre a página, e é ele que
 * sustenta a alternância verde/branco que fechou a paleta em 30/07 (ver
 * docs/referencia-layout.md §9). Além disso a luz de contorno ciano da arcada foi
 * renderizada para fundo escuro. Trocar por claro não é adaptar a referência, é
 * refazer a decisão de paleta.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTA SEÇÃO PERDEU, E ONDE FOI PARAR
 * ---------------------------------------------------------------------------
 * ⚠️ A GRADE DE DUAS COLUNAS saiu inteira — texto à esquerda, figura à direita era o
 * oposto da composição pedida. Com ela saíram a COLAGEM de três fotos (do template de
 * 13/08), os cartões, as formas flutuantes e a fileira de NÚMEROS.
 *
 * Nada disso se perdeu de informação: `hero.colagem` e `hero.stats` continuam no
 * conteúdo e no tipo, e o código da colagem está no histórico do git. Os três números
 * também vivem em outras seções — a nota do Google nas avaliações, as 8 especialidades
 * em Áreas, os 9 do corpo clínico na Bio. Devolver é reexibir, não recoletar.
 *
 * ⚠️ Se `hero.colagem` voltar a ter itens, ELA NÃO RENDERIZA MAIS. O componente só
 * desenha `hero.arcada`. Para as variantes de Rogério e Décio que quiserem fotos, o
 * caminho é recuperar o bloco da colagem do git, não escrevê-lo de novo.
 *
 * ---------------------------------------------------------------------------
 * A LINHA DO RESPONSÁVEL TÉCNICO FICA
 * ---------------------------------------------------------------------------
 * A Apple não põe nada parecido no hero, e ela fica de todo jeito: nome e número de
 * inscrição na divulgação são exigência da Resolução CFO-196/2019, não decoração.
 */


export function HeroSection({ data }: { data: HeroContent }) {
  /* A ARCADA é a única figura desta seção desde 18/08 — ver a nota do cabeçalho sobre
     o que a recomposição no estilo apple.com levou embora. */
  const arcada = data.arcada;

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

        {/* ── COMPOSIÇÃO NO ESTILO APPLE.COM, pedida em 18/08 ──────────────────
            "quero um hero estilo da apple.com, do site americano".

            O que caracteriza aquele hero, e é o que foi aplicado aqui: TUDO
            CENTRALIZADO, o produto como protagonista e grande no meio da tela,
            tipografia curta e restrita, e muito respiro em volta. A grade de duas
            colunas (texto à esquerda, figura à direita) saiu junto — era o oposto
            dessa composição.

            ⚠️ O QUE FOI DELIBERADAMENTE OMITIDO, porque a Apple não põe no hero:
            a fileira de números (5,0 / 8 / 9) e o eyebrow. Nenhuma informação se
            perde — a nota vive na seção de avaliações, as 8 especialidades em Áreas
            e os 9 do corpo clínico na Bio. Os campos CONTINUAM no conteúdo
            (`hero.stats`, `hero.eyebrow`), então devolver é reexibir, não recoletar.

            ⚠️ O FUNDO CONTINUA O BLOCO ESCURO da identidade, não o branco da Apple.
            A referência é de COMPOSIÇÃO; virar a página para branco aqui trocaria a
            identidade medida da Suzuki (ver docs/referencia-layout.md §9) por outra,
            e a luz de contorno ciano da arcada foi renderizada para fundo escuro.

            ⚠️ A linha do responsável técnico FICA. Ela é exigência da CFO-196/2019
            (nome e número de inscrição na divulgação), não decoração de hero. */}
        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 pb-12 pt-24 text-center md:px-10 md:pb-16 md:pt-28">
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
            {/* Uma frase curta e centrada, no lugar do parágrafo de três linhas
                alinhado à esquerda. `44rem` e não `ch`: `ch` resolve contra a fonte
                do elemento onde está, e já estrangulou bloco neste projeto. */}
            <p className="mx-auto mt-6 max-w-[44rem] text-base leading-[1.6] text-ink-muted">
              {data.subheadline}
            </p>
          </Reveal>

          <Reveal delay={300}>
            {/* Duas ações lado a lado e centradas, como o par "Learn more / Buy".
                A primária continua pílula em vez de link de texto: é o CTA de
                WhatsApp da clínica, e conversão já era decisão tomada. */}
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

          {/* ---------------- O PRODUTO ---------------- */}
          {arcada ? (
            /* A ARCADA, centralizada e GRANDE — é a peça que a composição existe
               para mostrar. Sem cartão, sem sombra, sem canto e sem máscara: o
               arquivo tem alpha de verdade e a silhueta é a própria arcada.

               ⚠️ NÃO devolver `.video-fundido` aqui: ela mascararia a borda da
               gengiva. Ver a nota do arquivo em clinica.hero.arcada.

               A proporção vem do arquivo (`largura`/`altura`), não cravada: é a
               lição de 12/08, quando uma proporção fixa recortou 78% de uma foto
               panorâmica. */
            <Reveal delay={380}>
              <img
                src={arcada.src}
                alt={arcada.alt}
                width={arcada.largura}
                height={arcada.altura}
                className="mx-auto mt-10 h-auto w-full max-w-[min(92vw,60rem)] object-contain md:mt-12"
                style={{
                  aspectRatio: `${arcada.largura} / ${arcada.altura}`,
                  /* ⚠️ TETO DE ALTURA, e não é enfeite: com a arcada só limitada pela
                     LARGURA ela ficava 960×667 em 1440 e a dobra da tela cortava os
                     dentes no meio — a primeira impressão virava uma gengiva gigante
                     sem contexto. A referência da Apple cabe o produto na dobra. Com
                     teto em `svh` a peça encolhe pela altura e a proporção se mantém.
                     Não trocar por altura fixa em px: em janela baixa volta o corte. */
                  maxHeight: "52svh",
                }}
              />
            </Reveal>
          ) : null}

          <Reveal delay={460}>
            <p className="mt-10 text-small text-ink-muted">
              {data.responsavelLinha}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
