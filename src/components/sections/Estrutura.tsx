import type { EstruturaContent, EstruturaSlot } from "@/content/types";
import { SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";

/**
 * Estrutura: TRÊS FOTOS GRANDES, uma por bloco, sangrando até a borda da janela.
 *
 * Antes daqui havia um comparador arrastável (com divisor navegável por teclado)
 * mais uma grade de 12 miniaturas. A auditoria de 30/07 mostrou por que isso era
 * o maior desperdício da página: **28 das 32 fotos do site apareciam abaixo de
 * 15% da largura da tela**, e 8 de 13 seções não tinham foto nenhuma. As fotos do
 * consultório são boas — madeira mel, granito preto polido, luz natural — e
 * estavam sendo usadas como prova em miniatura em vez de argumento em tamanho
 * cheio.
 *
 * Trocado por três fotos de largura total, sem legenda visível, sem moldura, sem
 * mecânica de interação. A informação está na imagem; o texto alternativo carrega
 * a descrição para quem não a vê.
 *
 * Por que só três: uma por ideia — o ambiente de recepção, o consultório com
 * equipamento digital, e a área externa. Os outros nove arquivos continuam em
 * `public/imagens/estrutura/`, com o inventário em
 * `public/imagens/originais/MANIFESTO.md`, prontos se uma página de estrutura
 * for criada.
 *
 * NÃO reintroduzir grade de miniaturas aqui, nem o comparador.
 */

/** Foto de largura total, ou o slot rotulado quando ela não existe. */
function Foto({ slot, prioridade }: { slot: EstruturaSlot; prioridade?: boolean }) {
  if (!slot.src) {
    return (
      <div
        role="img"
        aria-label={slot.alt}
        className="slot-grid flex aspect-[16/10] w-full items-end bg-surface p-5 md:aspect-[21/9]"
      >
        <span className="rounded-md border border-border bg-background/80 px-2 py-1 text-small uppercase tracking-[0.08em] text-muted backdrop-blur">
          {slot.rotulo}
        </span>
      </div>
    );
  }
  return (
    <img
      src={slot.src}
      alt={slot.alt}
      loading={prioridade ? "eager" : "lazy"}
      className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
    />
  );
}

export function EstruturaSection({ data }: { data: EstruturaContent }) {
  return (
    <section id="estrutura" style={{ paddingBlock: "var(--section-py)" }}>
      {/* O cabeçalho respeita o container; as fotos, não. */}
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
        <SectionHeader
          eyebrow={data.eyebrow}
          titulo={data.titulo}
          descricao={data.descricao}
        />
      </div>

      <div className="mt-14 space-y-3 md:mt-20 md:space-y-4">
        {data.imagens.map((slot, i) => (
          <Reveal key={slot.rotulo}>
            <Foto slot={slot} prioridade={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
