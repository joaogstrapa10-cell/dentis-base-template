import { useId, useState } from "react";
import type { FaqContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { TextLink } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Estrutura: COLUNA ÚNICA — título em cima, perguntas embaixo, tudo alinhado à
 * mesma margem esquerda.
 *
 * O caminho desta seção, porque as duas alternativas já foram testadas e
 * reprovadas:
 *
 * 1. Largura cheia com o chevron empurrado para a direita por `justify-between`.
 *    O defeito era a distância: 1120px de régua para uma pergunta de ~300px, com
 *    a affordance a mais de 1000px do rótulo a que pertence.
 * 2. Duas colunas, título à esquerda e perguntas à direita. Resolvia a distância,
 *    mas o cliente reprovou o vazio da coluna esquerda em 12/08 — e ele tinha
 *    razão: com sete perguntas à direita, a coluna do título ficava com ~400px de
 *    nada embaixo dela.
 *
 * O que faz a coluna única funcionar agora é o CHEVRON JUNTO DA PERGUNTA, e não
 * no fim da linha. Sem `justify-between` a régua pode ocupar a largura inteira sem
 * separar o gesto do texto: o fio continua atravessando a seção, e o controle fica
 * onde a pergunta acaba.
 *
 * A nota e o link ficam DEPOIS das perguntas. Uma saída para a dúvida que a lista
 * não cobre só faz sentido depois de a pessoa olhar a lista.
 *
 * ⚠️ O accordion continua sendo o próprio, não o do shadcn, e a pergunta continua
 * sendo `<button>` com `aria-expanded`/`aria-controls`. No template que o cliente
 * trouxe ela é uma `div` com `onClick`: não é alcançável por teclado nem anunciada
 * como controle. Visual idêntico, funciona sem mouse.
 */
export function FaqSection({ data }: { data: FaqContent }) {
  /* Uma aberta por vez: são sete respostas, e abrir todas transforma a seção
     numa parede de texto. */
  const [aberta, setAberta] = useState<number | null>(null);
  const idBase = useId();

  return (
    <Section id="faq">
      <Reveal>
        <h2 className="display-2 text-foreground">{data.titulo}</h2>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-10 border-t border-border md:mt-12">
          {data.itens.map((item, i) => {
            const estaAberta = aberta === i;
            const idResposta = `${idBase}-resposta-${i}`;

            return (
              <div key={item.pergunta} className="border-b border-border">
                {/* `w-full` no botão para a área clicável ser a linha inteira —
                    alvo grande é o que faz a lista funcionar no toque. O
                    conteúdo, porém, fica agrupado à ESQUERDA: é o chevron ao
                    lado da pergunta que permite a régua de largura cheia. */}
                <button
                  type="button"
                  onClick={() => setAberta(estaAberta ? null : i)}
                  aria-expanded={estaAberta}
                  aria-controls={idResposta}
                  className="flex w-full items-center gap-3 py-5 text-left"
                >
                  <span
                    className={cn(
                      "display-3 transition-colors duration-200",
                      estaAberta ? "text-accent" : "text-foreground",
                    )}
                  >
                    {item.pergunta}
                  </span>

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

                {/* `max-height` + opacidade: o teto de 24rem cobre com folga a
                    resposta mais longa, e `max-height` anima igual em qualquer
                    navegador. `aria-hidden` acompanha o estado para o leitor de
                    tela não anunciar resposta fechada. */}
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
                  {/* A RESPOSTA tem medida limitada, e a régua não. Texto corrido
                      a 1120px de largura passa de 140 caracteres por linha e o
                      olho perde o começo da linha seguinte; o fio de largura cheia
                      é que dá a estrutura da seção. */}
                  <p className="max-w-[74ch] text-base leading-[1.65] text-muted">
                    {item.resposta}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
          <p className="text-base text-muted">{data.nota}</p>
          <TextLink label={data.notaCta.label} href={data.notaCta.href} external />
        </div>
      </Reveal>
    </Section>
  );
}
