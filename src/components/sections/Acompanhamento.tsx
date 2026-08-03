import type { AcompanhamentoContent, EtapaAcompanhamento } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Marcador de estado da etapa: um DISCO, sem ícone dentro.
 *
 * Eram três ícones diferentes (check, spinner girando, círculo) em oito
 * instâncias. Vocabulário de painel de build de software — e o spinner girando
 * ainda sugeria "processando agora", que numa etapa de tratamento é
 * simplesmente falso. O estado já está escrito ao lado, em `estadoLabel`; o
 * disco só marca a posição na régua.
 */
function EstadoMarca({ estado }: { estado: EtapaAcompanhamento["estado"] }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-2.5 w-2.5 shrink-0 rounded-full",
        estado === "concluido" && "bg-accent",
        estado === "em-andamento" && "bg-accent/35 ring-2 ring-accent",
        estado === "previsto" && "bg-border-strong",
      )}
    />
  );
}

/**
 * Estrutura: régua vertical de etapas, uma coluna.
 *
 * A versão anterior tinha DUAS colunas: a lista à esquerda e, à direita, uma
 * JANELA DE APLICATIVO FALSA — com os três pontinhos de macOS no topo —
 * repetindo as mesmas quatro etapas em cartões com pills de status. Removida em
 * 30/07 por três motivos somados, e o terceiro é o pior:
 *
 * 1. Era o elemento mais "empresa de software" do site. Mockup de interface numa
 *    clínica odontológica comunica a categoria errada.
 * 2. Era conteúdo DUPLICADO: as mesmas quatro etapas renderizadas duas vezes na
 *    mesma tela, o que sozinho respondia pela densidade de 45,9 elementos por
 *    tela medida nesta seção.
 * 3. Insinuava um produto que não existe. Não há painel de acompanhamento para o
 *    paciente acessar, e "Paciente · Caso clínico #0000" numa moldura de app lê
 *    como print de um sistema real.
 */
export function AcompanhamentoSection({ data }: { data: AcompanhamentoContent }) {
  return (
    <Section id="acompanhamento">
      <SectionHeader
        eyebrow={data.eyebrow}
        titulo={data.titulo}
        descricao={data.descricao}
      />

      <ol className="mt-14 border-t border-border">
        {data.etapas.map((etapa, i) => (
          <Reveal key={etapa.numero} delay={i * 80}>
            <li className="grid gap-x-6 gap-y-3 border-b border-border py-9 md:grid-cols-[4rem_minmax(0,18rem)_1fr] md:gap-x-12 md:py-11">
              <div className="flex items-center gap-3 md:block">
                <EstadoMarca estado={etapa.estado} />
                <span className="text-small tabular-nums text-muted md:ml-3">
                  {etapa.numero}
                </span>
              </div>

              <div>
                <h3 className="display-3 text-foreground">{etapa.titulo}</h3>
                <span
                  className={cn(
                    "mt-1 block text-small",
                    etapa.estado === "previsto" ? "text-muted" : "text-accent",
                  )}
                >
                  {etapa.estadoLabel}
                </span>
              </div>

              <p className="max-w-[54ch] text-base leading-[1.7] text-muted">
                {etapa.descricao}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
