import { useCallback, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import type { EstruturaContent, EstruturaSlot } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const STEP = 5;

function SlotImage({
  slot,
  className,
  loading,
  showRotulo = true,
}: {
  slot: EstruturaSlot;
  className?: string;
  loading?: "lazy" | "eager";
  /** No comparador os rótulos A/B já identificam cada lado — o rótulo do slot
   *  ficaria empilhado no mesmo canto nas duas camadas. */
  showRotulo?: boolean;
}) {
  if (slot.src) {
    return (
      <img
        src={slot.src}
        alt={slot.alt}
        loading={loading ?? "lazy"}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={slot.alt}
      className={cn(
        // Slot vazio precisa parecer deliberado, não quebrado: textura de grid +
        // rótulo ancorado embaixo à esquerda, fora da rota do handle central.
        "slot-grid flex h-full w-full items-end bg-surface p-3",
        className,
      )}
    >
      {showRotulo ? (
        <span className="rounded-md border border-border bg-background/80 px-2 py-1 text-small uppercase tracking-[0.08em] text-muted-foreground backdrop-blur">
          {slot.rotulo}
        </span>
      ) : null}
    </div>
  );
}

export function EstruturaSection({ data }: { data: EstruturaContent }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  };
  const stopDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((v) => Math.max(0, v - STEP));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((v) => Math.min(100, v + STEP));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  const ladoA = data.imagens[0];
  const ladoB = data.imagens[1];

  return (
    <Section id="estrutura">
      <SectionHeader
        eyebrow={data.eyebrow}
        titulo={data.titulo}
        descricao={data.descricao}
      />

      <Reveal delay={100}>
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          className="relative mt-14 aspect-[16/9] w-full select-none overflow-hidden rounded-2xl border border-border bg-surface touch-none md:aspect-[21/9]"
        >
          {/* Base layer: lado B (fundo) */}
          <div className="absolute inset-0">
            <SlotImage slot={ladoB} loading="lazy" showRotulo={false} />
            <span className="absolute right-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-small text-foreground backdrop-blur">
              {data.comparadorLadoBLabel}
            </span>
          </div>

          {/* Top layer: lado A, cortado até `pos` */}
          <div
            className="absolute inset-0 motion-reduce:transition-none"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <SlotImage slot={ladoA} loading="lazy" showRotulo={false} />
            <span className="absolute left-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-small text-foreground backdrop-blur">
              {data.comparadorLadoALabel}
            </span>
          </div>

          {/* Divisor / handle */}
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-accent"
            style={{ left: `${pos}%` }}
            aria-hidden="true"
          />
          <div
            role="slider"
            tabIndex={0}
            aria-label={data.ariaLabelComparador}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={onKeyDown}
            className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border border-accent bg-background p-2 text-accent shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ left: `${pos}%` }}
          >
            <GripVertical className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </div>
      </Reveal>

      {/* Grid de miniaturas */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {data.imagens.map((slot, idx) => (
          <Reveal key={idx} delay={(idx % 6) * 60}>
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface">
              <SlotImage slot={slot} loading="lazy" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
