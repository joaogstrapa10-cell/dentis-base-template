import { Star } from "lucide-react";
import type { DepoimentosContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { IconeGoogle } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/**
 * Estrutura: cartão de resumo do perfil à esquerda, UMA citação grande à direita.
 *
 * O carrossel contínuo foi removido em 30/07 — ver a nota em
 * `DepoimentosSection`. Com ele saíram `CartaoAvaliacao` e as classes
 * `rail-auto` / `rail-pausa` / `rail-mask`.
 *
 * Sobre a marca do Google: só é exibida onde a `fonte` é "google". Os
 * depoimentos herdados do site anterior têm `fonte: "site"` e aparecem sem ela —
 * atribuir a origem errada a um depoimento de paciente real não é detalhe de
 * layout.
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
  /** Tamanho da estrela. */
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

/**
 * UMA citação, grande, com retrato — não carrossel.
 *
 * A auditoria de 30/07 mediu 619 palavras e 54,6 elementos por tela nesta seção:
 * três depoimentos longos rodando em laço contínuo, cada um truncado em seis
 * linhas com "…". Truncar depoimento é o pior dos dois mundos — ocupa o espaço
 * de um texto inteiro e não entrega nenhum.
 *
 * Agora um só, inteiro, em corpo grande. Os outros continuam em `data.itens`
 * porque é de lá que as avaliações do Google vão entrar; a seção mostra o
 * primeiro. Quem quiser mais de um, aumenta o corte — não devolve o carrossel.
 */
export function DepoimentosSection({
  data,
  logo,
  logoAlt,
}: {
  data: DepoimentosContent;
  /** Marca na versão que contrasta com a superfície do cartão — ESCURA, porque
   *  esta seção fica no branco. Ela virou branca por uma rodada, quando o site
   *  todo era escuro. Ao trocar a paleta, conferir esta prop: logo monocromático
   *  na cor errada não quebra o build, simplesmente desaparece.
   *  `null` cai no nome em texto, senão a seção perde o cabeçalho. */
  logo: string | null;
  logoAlt: string;
}) {
  const { resumo } = data;
  const citacao = data.itens[0];

  return (
    <Section id="depoimentos">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,17rem)_1fr] lg:items-start lg:gap-20">
        {/* Resumo do perfil: marca, estrelas, nota. Nada mais — a contagem e o
            botão de avaliar saíram em 30/07. O logo é o cabeçalho da seção: o
            `alt` carrega o nome do negócio, então o h2 continua tendo texto
            para leitor de tela. */}
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

            {/* Atribuição da origem. A marca do Google fica aqui, junto da nota,
                porque é a nota que veio do Google — e não nos cartões do
                carrossel, que hoje são depoimentos do site antigo. O rótulo vem
                do conteúdo justamente para poder mudar de "Nota" para
                "Avaliações" quando as do Google entrarem. */}
            <p className="mt-4 flex items-center gap-2 text-small text-muted">
              <IconeGoogle className="h-4 w-4 shrink-0" />
              {resumo.fonteLabel}
            </p>
          </div>
        </Reveal>

        {/* A citação. Sem cartão, sem borda, sem sombra: o texto é a peça. */}
        {citacao ? (
          <Reveal delay={120}>
            <figure>
              <blockquote className="display-3 max-w-[46ch] text-balance font-normal leading-[1.45] text-foreground">
                {citacao.texto}
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4">
                {citacao.foto ? (
                  <img
                    src={citacao.foto}
                    alt={citacao.fotoAlt}
                    loading="lazy"
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-base font-semibold text-foreground">{citacao.autor}</p>
                  {/* A marca do Google só aparece se a citação VEIO do Google.
                      Hoje é depoimento do site antigo, então não aparece. */}
                  {citacao.fonte === "google" ? (
                    <p className="mt-0.5 flex items-center gap-2 text-small text-muted">
                      <IconeGoogle className="h-3.5 w-3.5 shrink-0" />
                      {citacao.quando}
                    </p>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
