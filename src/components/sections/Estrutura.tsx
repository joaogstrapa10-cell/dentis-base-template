import type { EstruturaContent, EstruturaSlot } from "@/content/types";
import { SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { PillButton } from "@/components/Primitives";

/**
 * Estrutura: ESTEIRA de fotos passando em laço, mais um botão para a página com
 * todas elas paradas e identificadas.
 *
 * O histórico desta seção importa para não voltar atrás:
 *
 * - Até 30/07 era um comparador arrastável + grade de 12 miniaturas. A auditoria
 *   mediu que 28 das 32 fotos do site apareciam abaixo de 15% da largura da tela:
 *   as fotos do consultório são boas e estavam sendo usadas como prova em
 *   miniatura em vez de argumento em tamanho cheio.
 * - Em 03/08 virou três fotos estáticas de largura total.
 * - E então esteira, a pedido do usuário: "o carrossel é mais para deixar
 *   estético e deixar passando as imagens".
 *
 * O par esteira + página é o que faz isso funcionar. O movimento é decoração; a
 * página `/estrutura` é o acesso de verdade, "caso a pessoa queira ver todas as
 * fotos de uma vez sem precisar ficar esperando". Sem a página, uma esteira
 * esconde conteúdo atrás de tempo de espera — que é exatamente a crítica que
 * derrubou o carrossel dos depoimentos.
 *
 * Por isso: se a esteira sair, a página FICA. Se a página sair, a esteira sai
 * junto.
 *
 * Acessibilidade: a faixa pausa no hover e no foco de teclado, e para de vez sob
 * `prefers-reduced-motion` (WCAG 2.2.2). A lista duplicada é marcada
 * `aria-hidden` para o leitor de tela não anunciar cada ambiente duas vezes.
 */

function Foto({ slot }: { slot: EstruturaSlot }) {
  if (!slot.src) {
    return (
      <div
        role="img"
        aria-label={slot.alt}
        className="slot-grid flex h-full w-full items-end bg-surface p-4"
      >
        <span className="rounded-md border border-border bg-background/80 px-2 py-1 text-small text-muted backdrop-blur">
          {slot.rotulo}
        </span>
      </div>
    );
  }
  return (
    <img
      src={slot.src}
      alt={slot.alt}
      loading="lazy"
      className="h-full w-full object-cover"
    />
  );
}

export function EstruturaSection({ data }: { data: EstruturaContent }) {
  // Renderizada duas vezes: a faixa desliza 50% e a emenda cai sobre uma cópia
  // idêntica, então o laço não tem costura visível.
  const faixa = [...data.imagens, ...data.imagens];

  return (
    <section id="estrutura" style={{ paddingBlock: "var(--section-py)" }}>
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
        <SectionHeader
          eyebrow={data.eyebrow}
          titulo={data.titulo}
          descricao={data.descricao}
        />
      </div>

      <div className="esteira-pausa esteira-mask mt-14 overflow-hidden md:mt-20">
        <ul className="esteira flex gap-3 md:gap-4">
          {faixa.map((slot, i) => {
            const duplicado = i >= data.imagens.length;
            return (
              <li
                key={`${slot.src ?? slot.rotulo}-${i}`}
                aria-hidden={duplicado || undefined}
                className="h-[15rem] w-[22rem] shrink-0 overflow-hidden rounded-2xl md:h-[24rem] md:w-[36rem]"
              >
                <Foto slot={slot} />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Botão centralizado. `justify-center` no flex, e não `mx-auto` no botão:
          `PillButton` é um `<a>` inline-flex, e margem automática não centraliza
          elemento inline. */}
      <div className="mx-auto mt-12 flex w-full max-w-[1200px] justify-center px-5 md:px-10">
        <Reveal>
          {/* `icone="seta"`: leva a uma página interna. Com o padrão, o botão
              sairia com a marca do WhatsApp e prometeria uma conversa. */}
          <PillButton
            label={data.verTodas.label}
            href={data.verTodas.href}
            icone="seta"
          />
        </Reveal>
      </div>
    </section>
  );
}
