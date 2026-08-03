import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

export function FaqSection({ data }: { data: FaqContent }) {
  return (
    <Section id="faq">
      <SectionHeader eyebrow={data.eyebrow} titulo={data.titulo} />
      <Reveal delay={100}>
        <Accordion type="single" collapsible className="mt-12 w-full border-t border-border">
          {data.itens.map((item, idx) => (
            <AccordionItem
              key={item.pergunta}
              value={`item-${idx}`}
              className="border-b border-border"
            >
              <AccordionTrigger className="py-6 text-left text-base font-medium text-foreground hover:no-underline">
                {item.pergunta}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-[1.65] text-muted-foreground">
                {item.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}
