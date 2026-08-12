import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { TextLink } from "@/components/Primitives";

/**
 * Estrutura: DUAS COLUNAS — título à esquerda, acompanhando a rolagem, e as
 * perguntas à direita. É o arranjo da referência, e resolve dois defeitos que a
 * versão de largura cheia tinha:
 *
 * 1. A régua de cada pergunta media 1120px para uma pergunta de ~300px, e o
 *    chevron ficava a mais de 1000px do rótulo a que pertence. Affordance
 *    separada do texto por um vão vazio do tamanho da tela não é affordance.
 *    Na coluna estreita os dois ficam vizinhos.
 * 2. Sete réguas idênticas de ponta a ponta empilhadas eram a repetição mais
 *    literal da página — e nenhuma resposta aparecia, então a seção gastava uma
 *    tela inteira mostrando sete linhas de texto.
 *
 * O título fica `sticky` a partir de `lg`: enquanto as perguntas passam, ele
 * segura o assunto no campo de visão. É o gesto da referência, e é o motivo de
 * esta seção NÃO usar o `SectionHeader` — ele empilha título e conteúdo, e aqui
 * os dois são lado a lado.
 *
 * As perguntas continuam em accordion, uma aberta por vez. O padrão se sustenta
 * aqui: são sete respostas de ~30 palavras, e abrir todas jogaria 210 palavras de
 * texto secundário na página inteira só para nunca serem lidas em sequência.
 * Diferente do caso das Áreas, onde o texto escondido era revelado por HOVER —
 * ali não havia como saber que existia, aqui a pergunta é o próprio convite.
 */
export function FaqSection({ data }: { data: FaqContent }) {
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-16">
        <div>
          {/* `top-32` deixa o título abaixo da pílula de navegação, que é fixa e
              tem ~66px de altura no topo da janela. */}
          <div className="lg:sticky lg:top-32">
            <h2 className="display-2 text-foreground">{data.titulo}</h2>

            {/* A nota existe por duas razões, e a segunda é a que importa: a
                coluna do título ficava com ~400px de vazio ao lado da lista, e
                uma lista de perguntas frequentes precisa de saída para a
                pergunta que não é frequente. Link de texto, não pílula — a
                página já carrega a chamada de agendamento no header fixo, no
                hero, em Tratamentos e no rodapé. */}
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
        </div>

        <Reveal delay={100}>
          <Accordion type="single" collapsible className="w-full border-t border-border">
            {data.itens.map((item, idx) => (
              <AccordionItem
                key={item.pergunta}
                value={`item-${idx}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium text-foreground hover:no-underline">
                  {item.pergunta}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-[1.65] text-muted">
                  {item.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
