import type { AcompanhamentoContent, EtapaAcompanhamento } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Estrutura: LINHA DO TEMPO HORIZONTAL. As quatro etapas lado a lado sobre um
 * fio contínuo, com o marcador de cada uma pousado nele. Empilha em vertical no
 * mobile, com o fio virando eixo à esquerda.
 *
 * Por que horizontal: o conteúdo é uma SEQUÊNCIA, e sequência tem direção.
 * Empilhada em quatro linhas, ela lia como uma lista de atributos — indistinta
 * da seção de Diferenciais, que fica a uma rolagem daqui e tinha exatamente a
 * mesma anatomia (`<ol>`, fio horizontal entre linhas, três colunas). Agora as
 * duas seções não se parecem: lá são quatro colunas separadas por fio vertical
 * (atributos simultâneos), aqui é um fio que atravessa e ordena (etapas em
 * sucessão).
 *
 * O fio é um elemento à parte, posicionado no centro vertical dos marcadores, e
 * não a borda dos itens. Foi a única forma de ele ser CONTÍNUO entre as quatro
 * colunas: `divide-x` desenha traço entre células, não uma linha que atravessa.
 *
 * ⚠️ O `estado` de cada etapa é ILUSTRATIVO de um caso genérico — não é o estado
 * do visitante. A versão de 24/07 tinha aqui uma janela de aplicativo falsa, com
 * os três pontinhos de macOS e as etapas em cartões com pills de status, e ela
 * insinuava um painel de acompanhamento que a clínica não tem. Removida em 30/07.
 * Não reintroduzir nada que sugira sistema, login ou progresso pessoal: o
 * marcador é um disco de 10px sobre um fio, e para nisso.
 *
 * A imagem fecha a seção como FRISO — largura cheia do container e altura baixa
 * (proporção 21/6, ≈340px em desktop). O enquadramento é deliberadamente outro
 * que o de Diferenciais, onde a imagem é um retângulo pequeno ao lado do texto:
 * as duas seções são vizinhas e usar o mesmo enquadramento faria a página
 * repetir o gesto.
 */

/** Marcador de estado: um disco sobre o fio. Sem ícone dentro — ver a nota do
 *  painel falso acima. O estado também está escrito ao lado, em `estadoLabel`,
 *  então a cor não é o único portador da informação. */
function Marcador({ estado }: { estado: EtapaAcompanhamento["estado"] }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        // `ring-background` recorta o fio atrás do disco, então ele pousa sobre a
        // linha em vez de ser atravessado por ela.
        "block h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-background",
        estado === "concluido" && "bg-accent",
        estado === "em-andamento" && "bg-accent/30 ring-accent",
        estado === "previsto" && "bg-border-strong",
      )}
    />
  );
}

export function AcompanhamentoSection({ data }: { data: AcompanhamentoContent }) {
  return (
    <Section id="acompanhamento">
      <SectionHeader
        eyebrow={data.eyebrow}
        titulo={data.titulo}
        descricao={data.descricao}
      />

      <div className="relative mt-16 md:mt-20">
        {/* O fio. Vertical no mobile, à esquerda da coluna dos marcadores;
            horizontal a partir de `lg`, na altura do centro dos discos. */}
        <span
          aria-hidden="true"
          className="absolute left-[0.3125rem] top-2 h-[calc(100%-1rem)] w-px bg-border lg:left-0 lg:top-[0.3125rem] lg:h-px lg:w-full"
        />

        <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-10">
          {data.etapas.map((etapa, i) => (
            <Reveal key={etapa.numero} delay={i * 90} as="li">
              <div className="flex gap-5 lg:block">
                <Marcador estado={etapa.estado} />

                <div className="min-w-0 lg:mt-7 lg:pr-6">
                  <span className="text-small tabular-nums text-muted">
                    {etapa.numero}
                  </span>
                  <h3 className="display-3 mt-1 text-foreground">{etapa.titulo}</h3>
                  <span
                    className={cn(
                      "mt-2 block text-small",
                      etapa.estado === "previsto" ? "text-muted" : "text-accent",
                    )}
                  >
                    {etapa.estadoLabel}
                  </span>
                  <p className="mt-4 text-base text-muted">{etapa.descricao}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      {data.imagem ? (
        <Reveal delay={220}>
          <img
            src={data.imagem}
            alt={data.imagemAlt}
            loading="lazy"
            width={1000}
            height={667}
            // `object-[50%_28%]`: recorte puxado para cima. Centralizado, a faixa
            // de 21/6 cortava o rosto da paciente na borda de baixo — feio, e
            // desnecessário quando o assunto da foto é o trabalho em curso.
            // Subindo, entram o equipamento, o monitor e a profissional.
            className="mt-16 aspect-[16/9] w-full rounded-2xl object-cover object-[50%_28%] md:mt-20 md:aspect-[21/6]"
          />
        </Reveal>
      ) : null}
    </Section>
  );
}
