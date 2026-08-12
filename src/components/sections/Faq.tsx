import { useId, useState } from "react";
import type { FaqContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { TextLink } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Estrutura: DUAS COLUNAS — foto da clínica à esquerda, perguntas à direita.
 * Adaptada de um componente trazido pelo cliente em 12/08.
 *
 * O que veio do template: a foto ao lado das perguntas, o accordion próprio (não
 * o do shadcn), o chevron girando 180° e a resposta abrindo por opacidade e
 * altura ao mesmo tempo, com curva longa.
 *
 * O que foi trocado, e não é só paleta:
 *
 * - **A fonte Poppins do template NÃO entrou**, e não é preferência: o
 *   `@import url()` de fonte remota dentro do CSS derruba o build deste projeto
 *   (o lightningcss tenta resolver a URL como arquivo local), e a tipografia da
 *   Suzuki é Instrument Sans. Fonte é identidade — trocá-la era o oposto do
 *   pedido.
 * - `text-3xl`/`text-base`/`text-sm` do template são proibidos pela escala
 *   fechada de cinco degraus. Título virou `display-2`, pergunta `text-base`,
 *   resposta `text-base`.
 * - `text-indigo-600`, `text-slate-500`, `border-slate-200` e o `#1D293D`
 *   cravado no chevron viraram `--accent`, `--muted`, `--border` e
 *   `currentColor`.
 * - O rótulo "FAQ's" acima do título não entrou: nenhuma seção desta página tem
 *   rótulo pequeno acima do título, e recolocar um só aqui quebraria o padrão.
 * - **O `<div onClick>` do template virou `<button>` com `aria-expanded` e
 *   `aria-controls`.** No original a pergunta não é alcançável por teclado nem
 *   anunciada como controle — quem navega por Tab não abre nenhuma resposta.
 *   O visual é idêntico; o que muda é que funciona sem mouse.
 *
 * A foto é o atendimento real da clínica, que ficou órfão quando a seção de
 * Acompanhamento foi removida nesta mesma rodada. Ela responde ao assunto da
 * seção: as perguntas são sobre como o tratamento acontece.
 *
 * A nota e o link ficam SOB a foto, não antes das perguntas. Uma lista de
 * perguntas frequentes precisa de saída para a pergunta que não é frequente, e
 * essa saída faz sentido depois de a pessoa olhar a lista — não antes.
 */
export function FaqSection({ data }: { data: FaqContent }) {
  /* Índice aberto, ou `null`. Um por vez, como era no accordion anterior: são
     sete perguntas e abrir várias transforma a coluna numa parede de texto. */
  const [aberta, setAberta] = useState<number | null>(null);
  const idBase = useId();

  return (
    <Section id="faq">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-32">
            {/* O TÍTULO vive na coluna da esquerda quando não há foto, e é o que
                dá conteúdo àquela coluna. Com a foto, ele ia para o topo da
                coluna das perguntas; sem ela, a coluna da esquerda ficaria com só
                a nota dentro e a altura das sete perguntas — o vazio que o
                usuário apontou na seção da Bio, agora aqui. */}
            {data.imagem ? (
              <img
                src={data.imagem}
                alt={data.imagemAlt}
                loading="lazy"
                width={1000}
                height={667}
                className="aspect-[4/5] w-full rounded-2xl border border-border object-cover object-[50%_30%] sm:aspect-[4/3] lg:aspect-[4/5]"
              />
            ) : (
              <h2 className="display-2 text-foreground">{data.titulo}</h2>
            )}

            <p className="mt-8 max-w-[34ch] text-base leading-[1.65] text-muted">
              {data.nota}
            </p>
            <div className="mt-4">
              <TextLink
                label={data.notaCta.label}
                href={data.notaCta.href}
                external
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {data.imagem ? (
            <h2 className="display-2 text-foreground">{data.titulo}</h2>
          ) : null}

          <div className={cn("border-t border-border", data.imagem ? "mt-10" : "")}>
            {data.itens.map((item, i) => {
              const estaAberta = aberta === i;
              const idResposta = `${idBase}-resposta-${i}`;

              return (
                <div key={item.pergunta} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setAberta(estaAberta ? null : i)}
                    aria-expanded={estaAberta}
                    aria-controls={idResposta}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "text-base font-medium transition-colors duration-200",
                        estaAberta ? "text-accent" : "text-foreground",
                      )}
                    >
                      {item.pergunta}
                    </span>

                    {/* Chevron desenhado inline, como no template. Gira 180° ao
                        abrir; `shrink-0` para não ser comprimido por pergunta
                        longa. */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 transition-transform duration-500 ease-in-out",
                        estaAberta ? "rotate-180 text-accent" : "text-muted",
                      )}
                    >
                      <path
                        d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* `max-height` + opacidade, como no template, e não
                      `grid-template-rows`: o teto de 24rem cobre com folga a
                      resposta mais longa (as quatro em `[CONFIRMAR: ...]` são as
                      maiores), e `max-height` anima igual em qualquer navegador.
                      `aria-hidden` acompanha o estado para o leitor de tela não
                      anunciar resposta fechada. */}
                  <div
                    id={idResposta}
                    aria-hidden={!estaAberta}
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-in-out",
                      estaAberta
                        ? "max-h-[24rem] translate-y-0 pb-6 opacity-100"
                        : "max-h-0 -translate-y-1 opacity-0",
                    )}
                  >
                    <p className="max-w-[62ch] text-base leading-[1.65] text-muted">
                      {item.resposta}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
