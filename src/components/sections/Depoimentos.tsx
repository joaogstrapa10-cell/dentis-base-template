import { Star } from "lucide-react";
import type { Depoimento, DepoimentosContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { IconeGoogle } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Estrutura: cartão de resumo do perfil à esquerda, ESTEIRA de avaliações
 * passando à direita. Mesma mecânica da esteira de fotos, a pedido do usuário —
 * e sem botão para outra página, também por pedido: aqui a esteira É o conteúdo.
 *
 * Esta seção já foi e voltou, e o histórico importa para não repetir o erro:
 * - Até 30/07 era um carrossel que truncava cada depoimento em SEIS LINHAS com
 *   "…". Removido porque truncar depoimento é o pior dos dois mundos: ocupa o
 *   espaço de um texto inteiro e não entrega nenhum.
 * - Em 03/08 virou uma citação única em corpo grande.
 * - E agora esteira outra vez. Duas diferenças impedem repetir o erro: **nada é
 *   truncado** (os cartões esticam até a altura do mais alto via
 *   `items-stretch`, então o texto sai inteiro e a faixa fica alinhada), e a
 *   faixa **pausa no hover e no foco**, então quem quer ler consegue parar.
 *
 * ⚠️ PROCEDÊNCIA — a parte mais importante deste arquivo.
 *
 * A esteira mostra o que estiver em `data.itens`. Hoje são TRÊS depoimentos do
 * SITE ANTERIOR, com `fonte: "site"`. As avaliações do Google **não foram
 * obtidas**: 0 de 12, e os quatro caminhos tentados estão registrados em
 * `public/imagens/originais/AVALIACOES-GOOGLE.json`. Do Google veio só a NOTA.
 *
 * Por isso a marca do Google aparece em exatamente dois lugares:
 *   1. no cartão de resumo, ao lado da nota — o único dado que veio de lá;
 *   2. no cartão individual, e SÓ quando `item.fonte === "google"`.
 *
 * Marcar um depoimento do site como se fosse do Google atribui a um paciente
 * real uma avaliação que ele não escreveu, num canal que ele não usou. Não
 * fazer — nem para completar cinco cartões.
 */

/** Nota do Google chega como texto pt-BR ("5,0", "4,8"). Devolve 0 se não for
 *  número — nota inválida não deve pintar estrela nenhuma. */
function paraNota(valor: string): number {
  const n = Number(valor.replace(",", "."));
  return Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : 0;
}

/**
 * Preenchimento fracionário. A fileira dourada é uma cópia recortada na
 * proporção exata da nota: 4,8 tem de mostrar quatro estrelas e um resto, não
 * cinco cheias. O arredondamento para cima seria propaganda, não layout.
 */
function Estrelas({
  nota,
  label,
  tamanho = "h-4 w-4",
}: {
  nota: number;
  label: string;
  tamanho?: string;
}) {
  const preenchido = `${(Math.max(0, Math.min(5, nota)) / 5) * 100}%`;
  return (
    <div className="relative inline-flex" role="img" aria-label={label}>
      <div aria-hidden="true" className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={cn(tamanho, "fill-border text-border")} strokeWidth={0} />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex items-center gap-1 overflow-hidden"
        style={{ width: preenchido }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(tamanho, "shrink-0 fill-warning text-warning")}
            strokeWidth={0}
          />
        ))}
      </div>
    </div>
  );
}

function CartaoAvaliacao({
  item,
  duplicado,
}: {
  item: Depoimento;
  /** A segunda metade da faixa é cópia visual do laço: some para leitores de tela. */
  duplicado?: boolean;
}) {
  const doGoogle = item.fonte === "google";
  return (
    <li aria-hidden={duplicado || undefined} className="w-[21rem] shrink-0 sm:w-[25rem]">
      {/* `h-full` aqui + `items-stretch` na faixa: todos os cartões assumem a
          altura do mais alto, e é isso que permite não truncar texto nenhum. */}
      <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
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
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-raised text-base font-semibold text-muted"
              >
                {item.autor.trim().charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{item.autor}</p>
              {item.quando ? <p className="text-small text-muted">{item.quando}</p> : null}
            </div>
          </div>

          {/* Trava contra atribuição falsa — ver a nota no topo do arquivo. */}
          {doGoogle ? <IconeGoogle className="mt-0.5 h-4 w-4 shrink-0" /> : null}
        </div>

        {doGoogle ? (
          <div className="mt-4">
            <Estrelas nota={item.nota} label={`${item.nota} de 5`} />
          </div>
        ) : null}

        <blockquote className="mt-4 text-base text-foreground">{item.texto}</blockquote>
      </figure>
    </li>
  );
}

export function DepoimentosSection({
  data,
  logo,
  logoAlt,
}: {
  data: DepoimentosContent;
  /** Marca na versão que contrasta com a superfície — ESCURA, porque esta seção
   *  fica no branco. Ao trocar a paleta, conferir esta prop: logo monocromático
   *  na cor errada não quebra o build, simplesmente desaparece.
   *  `null` cai no nome em texto, senão a seção perde o cabeçalho. */
  logo: string | null;
  logoAlt: string;
}) {
  const { resumo } = data;
  // Renderizada duas vezes: a faixa desliza 50% e a emenda cai sobre uma cópia
  // idêntica, então o laço não tem costura visível.
  const faixa = [...data.itens, ...data.itens];

  return (
    <Section id="depoimentos">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:items-center lg:gap-14">
        <Reveal>
          <div>
            <h2>
              {logo ? (
                <img
                  src={logo}
                  alt={logoAlt}
                  width={686}
                  height={302}
                  className="h-20 w-auto"
                />
              ) : (
                <span className="display-3 text-foreground">{resumo.nomeNegocio}</span>
              )}
            </h2>
            <div className="mt-6 flex items-baseline gap-3">
              <Estrelas
                nota={paraNota(resumo.nota)}
                label={`${resumo.nota} de 5`}
                tamanho="h-5 w-5"
              />
              <span className="display-3 font-semibold tabular-nums text-foreground">
                {resumo.nota}
              </span>
            </div>
            <p className="mt-4 flex items-center gap-2 text-small text-muted">
              <IconeGoogle className="h-4 w-4 shrink-0" />
              {resumo.fonteLabel}
            </p>
          </div>
        </Reveal>

        {/* Esteira. O `-mx` cancela o padding do container para a faixa sangrar
            até a borda no mobile, onde o container é estreito. */}
        <div className="esteira-pausa esteira-mask -mx-5 overflow-hidden md:-mx-10 lg:mx-0">
          <ul className="esteira flex items-stretch gap-4 px-5 md:px-10 lg:px-0">
            {faixa.map((item, i) => (
              <CartaoAvaliacao
                key={`${item.autor}-${i}`}
                item={item}
                duplicado={i >= data.itens.length}
              />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
