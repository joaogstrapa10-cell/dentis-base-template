import type { ReactNode } from "react";
import type { ContatoContent, LocalizacaoContent } from "@/content/types";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { TextLink } from "@/components/Primitives";
import { MapaLocalizacao } from "@/components/sections/MapaLocalizacao";
import { mapaHref, telHref, whatsappHref } from "@/lib/contato";

/**
 * Estrutura: título, os dados de ir até lá na coluna da esquerda, e o MAPA como
 * cartão à direita.
 *
 * O mapa mudou de natureza em 12/08: era um iframe do Google em faixa larga, e
 * passou a ser o cartão de tiles do template que o cliente trouxe — com marcador,
 * coordenadas e inclinação ao passar o mouse. Ver `MapaLocalizacao.tsx`, incluindo
 * a nota de que a atribuição do OpenStreetMap/CARTO é exigência de licença.
 *
 * Por que duas colunas e não a faixa larga de antes: a inclinação 3D é gesto de
 * CARTÃO. Numa faixa de 1120px ela inclina a seção inteira e lê como a página
 * tombando, não como um objeto na mesa. Num cartão de ~700px o efeito é o do
 * template. E o endereço ao lado, em vez de acima, é o que o cliente pediu — "o
 * título 'Onde ficamos', o endereço embaixo".
 *
 * O link "Ver rota" existe porque o mapa em tiles é uma IMAGEM: sem ele, quem
 * quer chegar não tem onde clicar. Um mapa que não leva a lugar nenhum é
 * decoração — e o href é derivado do endereço exibido, pela mesma regra do
 * telefone.
 */

function Dado({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div>
      {/* Caixa alta e tracking removidos: o rótulo se distingue por COR e
          TAMANHO, como todo metadado da página desde a repaginação. */}
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
      <Reveal>
        <h2 className="display-2 text-foreground">{data.titulo}</h2>
      </Reveal>

      <div className="mt-10 grid gap-10 md:mt-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
        <Reveal delay={80}>
          <dl className="grid gap-8">
            <Dado rotulo={data.enderecoLabel}>
              {contato.endereco}
              <br />
              {contato.cidadeUf} · {contato.cep}
            </Dado>

            <Dado rotulo={data.horarioLabel}>{contato.horario}</Dado>

            {/* Uma linha quando os dois números coincidem, duas quando não. Com o
                celular servindo de telefone e de WhatsApp, dois rótulos com o
                mesmo número embaixo leem como erro de conteúdo. Os rótulos
                separados ficam no tipo para as variantes com números distintos. */}
            {mesmoNumero ? (
              <Dado rotulo={data.telefoneWhatsappLabel}>
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

            <div>
              <TextLink
                label={data.rotaLabel}
                href={mapaHref(contato.endereco, contato.cidadeUf)}
                external
              />
            </div>
          </dl>
        </Reveal>

        <Reveal delay={160}>
          <MapaLocalizacao contato={contato} />
        </Reveal>
      </div>
    </Section>
  );
}
