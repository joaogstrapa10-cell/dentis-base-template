import { useCallback, useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import type { DepoimentosContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { cn } from "@/lib/utils";

/**
 * Estrutura: RAIL HORIZONTAL com cards escuros e paginação por bolinhas.
 *
 * Não é grid. Os cards são escuros sobre a página clara — a inversão local cria
 * um ponto de contraste no meio da leitura, em vez de mais uma fileira de
 * caixas brancas iguais.
 *
 * O rail é scroll nativo com scroll-snap: funciona com arrasto, roda do mouse,
 * teclado e toque, sem biblioteca de carrossel.
 */
export function DepoimentosSection({ data }: { data: DepoimentosContent }) {
  const railRef = useRef<HTMLUListElement | null>(null);
  const [ativo, setAtivo] = useState(0);

  const onScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const primeiro = el.firstElementChild as HTMLElement | null;
    if (!primeiro) return;
    const passo = primeiro.offsetWidth + 16;
    setAtivo(Math.round(el.scrollLeft / passo));
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const irPara = (i: number) => {
    const el = railRef.current;
    const alvo = el?.children[i] as HTMLElement | undefined;
    if (!el || !alvo) return;
    el.scrollTo({ left: alvo.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <Section id="depoimentos">
      <SectionHeader titulo={data.titulo} />

      <ul
        ref={railRef}
        className="rail mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {data.itens.map((item) => (
          <li
            key={item.autor}
            className="w-[86%] shrink-0 snap-start sm:w-[58%] lg:w-[38%]"
          >
            {/* Sem justify-between: os depoimentos têm tamanhos muito diferentes,
                e distribuir o espaço jogaria o texto curto para o meio do card.
                A citação segue o ícone; só a assinatura é empurrada para baixo. */}
            <figure className="ink-grid flex h-full flex-col rounded-2xl bg-ink p-7 md:p-9">
              <Quote
                aria-hidden="true"
                className="h-5 w-5 text-ink-muted"
                strokeWidth={1.75}
              />
              <blockquote className="mt-7 text-[0.9375rem] leading-[1.7] text-ink-foreground md:text-base">
                {item.texto}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3.5 border-t border-ink-border pt-5">
                {item.foto ? (
                  <img
                    src={item.foto}
                    alt={item.fotoAlt}
                    loading="lazy"
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink-border bg-ink-elevated text-sm font-medium text-ink-muted"
                  >
                    {item.autor.trim().charAt(0)}
                  </span>
                )}
                <span className="text-sm text-ink-muted">{item.autor}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-2">
        {data.itens.map((item, i) => (
          <button
            key={item.autor}
            type="button"
            onClick={() => irPara(i)}
            aria-label={item.autor}
            aria-current={i === ativo}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === ativo ? "w-7 bg-foreground" : "w-1.5 bg-border-strong hover:bg-muted",
            )}
          />
        ))}
      </div>
    </Section>
  );
}
