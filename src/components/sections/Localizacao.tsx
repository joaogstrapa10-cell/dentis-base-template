import type { ReactNode } from "react";
import type { ContatoContent, LocalizacaoContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { telHref, whatsappHref } from "@/lib/contato";

/**
 * Estrutura: os dados práticos numa FILEIRA acima, e o mapa como FAIXA LARGA
 * ocupando toda a largura do container abaixo.
 *
 * O que havia antes: um cartão branco de 2/5 com quatro linhas de dados e o
 * mapa em 3/5 ao lado. Três defeitos somados:
 *
 * 1. O mapa é a informação útil da seção e estava em pouco mais da metade da
 *    largura, enquanto o cartão de dados sobrava ~120px de espaço morto embaixo
 *    — texto curto dentro de caixa esticada pela altura do vizinho.
 * 2. Os quatro rótulos eram MAIÚSCULA com tracking largo, que é exatamente o
 *    vocabulário de rótulo pequeno removido de todas as outras seções da página.
 * 3. "Telefone" e "WhatsApp" eram duas linhas com o MESMO número embaixo das
 *    duas, desde que o celular da clínica passou a ser os dois. Lia como erro de
 *    conteúdo. Agora as duas linhas viram uma quando os números coincidem, e
 *    voltam a ser duas sozinhas quando não coincidirem — ver
 *    `LocalizacaoContent.telefoneWhatsappLabel`.
 *
 * O cartão branco saiu inteiro. Dado de contato não precisa de superfície
 * própria: ele é curto, é lido de uma vez, e a caixa em volta só o afastava do
 * mapa a que pertence.
 */

function Dado({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div>
      {/* Caixa alta e tracking removidos. O rótulo se distingue por COR e
          TAMANHO (13px em `--muted`), que é como todo metadado da página se
          distingue desde a repaginação. */}
      <dt className="text-small text-muted">{rotulo}</dt>
      <dd className="mt-2 text-base leading-[1.65] text-foreground">{children}</dd>
    </div>
  );
}

export function LocalizacaoSection({
  data,
  contato,
}: {
  data: LocalizacaoContent;
  contato: ContatoContent;
}) {
  const mesmoNumero = contato.telefone === contato.whatsapp;

  return (
    <Section id="localizacao">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <Reveal delay={80}>
        <dl className="mt-12 grid gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <Dado rotulo={data.enderecoLabel}>
            {contato.endereco}
            <br />
            {contato.cidadeUf} · {contato.cep}
          </Dado>

          <Dado rotulo={data.horarioLabel}>{contato.horario}</Dado>

          {mesmoNumero ? (
            <Dado rotulo={data.telefoneWhatsappLabel}>
              {/* Um número, dois usos, um link: `tel:` é o que serve para
                  ligar, e o WhatsApp tem chamada própria em toda a página. */}
              <a
                href={telHref(contato.telefone)}
                className="transition-colors hover:text-accent"
              >
                {contato.telefone}
              </a>
            </Dado>
          ) : (
            <>
              <Dado rotulo={data.telefoneLabel}>
                <a
                  href={telHref(contato.telefone)}
                  className="transition-colors hover:text-accent"
                >
                  {contato.telefone}
                </a>
              </Dado>
              <Dado rotulo={data.whatsappLabel}>
                <a
                  href={whatsappHref(contato.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {contato.whatsapp}
                </a>
              </Dado>
            </>
          )}
        </dl>
      </Reveal>

      {/* O mapa em faixa larga. Proporção baixa e larga em desktop pelo mesmo
          motivo do friso de Acompanhamento: largura cheia sem custar uma tela de
          altura. Em mobile ele volta a ser quase quadrado, senão a faixa fica
          fina demais para se reconhecer uma rua. */}
      <Reveal delay={160}>
        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface">
          <iframe
            src={contato.mapaEmbedSrc}
            title={contato.mapaTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="map-tint block aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/8]"
            style={{ border: 0 }}
          />
        </div>
      </Reveal>
    </Section>
  );
}
