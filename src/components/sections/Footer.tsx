import { Facebook, Instagram } from "lucide-react";
import type {
  BrandContent,
  ContatoContent,
  FooterContent,
  NavLink,
  SocialLink,
} from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { ArrowButton, GhostWord, PillButton } from "@/components/Primitives";
import { telHref, whatsappHref } from "@/lib/contato";

function SocialIcon({ name, className }: { name: SocialLink["icon"]; className?: string }) {
  if (name === "facebook") return <Facebook className={className} strokeWidth={1.75} />;
  return <Instagram className={className} strokeWidth={1.75} />;
}

function Coluna({ titulo, links }: { titulo: string; links: NavLink[] }) {
  return (
    <div>
      <p className="text-[0.8125rem] text-ink-muted">{titulo}</p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label + link.href}>
            <a
              href={link.href}
              className="text-sm text-ink-foreground transition-colors duration-300 hover:text-ink-muted"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Estrutura: FAIXA ESCURA fechando a página, no formato da referência —
 * card de CTA no topo com botão circular de seta, wordmark gigante translúcido
 * cortado pela borda, e só então as colunas de navegação.
 *
 * O footer anterior era o pedaço mais genérico do site: card claro com botão
 * comum e quatro colunas iguais. Aqui ele passa a ser o par visual do hero,
 * fechando a página com o mesmo peso com que ela abre.
 */
export function FooterSection({
  data,
  brand,
  contato,
}: {
  data: FooterContent;
  brand: BrandContent;
  contato: ContatoContent;
}) {
  return (
    <footer className="px-3 pb-3 md:px-4 md:pb-4">
      <div className="ink-grid relative isolate overflow-hidden rounded-3xl bg-ink">
        <div
          aria-hidden="true"
          className="ink-arc pointer-events-none absolute inset-0 opacity-25"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pt-16 md:px-10 md:pt-24">
          {/* CTA final */}
          <Reveal>
            <div className="flex flex-col gap-8 rounded-2xl border border-ink-border bg-ink-elevated/50 p-7 backdrop-blur md:flex-row md:items-center md:justify-between md:gap-14 md:p-11">
              {/* Largura em rem, não em ch — `ch` resolveria contra a fonte de
                  16px deste bloco e estrangularia o h2 de ~52px. Mesmo erro já
                  corrigido em Section.tsx. */}
              <div className="max-w-[34rem]">
                <h2 className="display-2 text-ink-foreground">{data.ctaTitulo}</h2>
                <p className="mt-4 text-[0.9375rem] leading-[1.65] text-ink-muted">
                  {data.ctaDescricao}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <PillButton
                  label={data.ctaBotao.label}
                  href={data.ctaBotao.href}
                  tone="light"
                  external
                />
                <ArrowButton
                  href={data.ctaBotao.href}
                  ariaLabel={data.ctaBotao.label}
                  external
                />
              </div>
            </div>
          </Reveal>

          {/* Colunas */}
          <div className="mt-24 grid grid-cols-2 gap-10 md:mt-32 md:grid-cols-4 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.logoAlt}
                  className="h-10 w-auto"
                />
              ) : (
                <p className="text-[0.9375rem] font-semibold text-ink-foreground">
                  {brand.wordmark}
                </p>
              )}
              <p className="mt-5 text-sm leading-[1.7] text-ink-muted">
                {contato.endereco}
                <br />
                {contato.cidadeUf} · {contato.cep}
              </p>
              <p className="mt-4 text-sm leading-[1.7] text-ink-muted">{contato.horario}</p>

              <ul className="mt-7 flex items-center gap-2.5">
                {data.socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-border text-ink-muted transition-colors duration-300 hover:border-ink-foreground hover:text-ink-foreground"
                    >
                      <SocialIcon name={s.icon} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Coluna titulo={data.colunaAreasLabel} links={data.colunaAreas} />
            <Coluna titulo={data.colunaClinicaLabel} links={data.colunaClinica} />

            <div>
              <p className="text-[0.8125rem] text-ink-muted">{data.colunaContatoLabel}</p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href={telHref(contato.telefone)}
                    className="text-sm text-ink-foreground transition-colors duration-300 hover:text-ink-muted"
                  >
                    {contato.telefone}
                  </a>
                  <p className="mt-0.5 text-xs text-ink-muted">{data.telefoneLabel}</p>
                </li>
                <li>
                  <a
                    href={whatsappHref(contato.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ink-foreground transition-colors duration-300 hover:text-ink-muted"
                  >
                    {contato.whatsapp}
                  </a>
                  <p className="mt-0.5 text-xs text-ink-muted">{data.whatsappLabel}</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Barra inferior. O padding-bottom generoso abre espaço para o
              wordmark gigante, que é cortado pela borda do cartão. */}
          <div className="mt-20 border-t border-ink-border pb-40 pt-7 md:pb-56">
            <p className="text-xs leading-[1.7] text-ink-muted">{brand.copyright}</p>
          </div>
        </div>

        <GhostWord className="bottom-0 left-0 translate-y-[24%] px-5 md:px-10">
          {brand.ghostWord}
        </GhostWord>
      </div>
    </footer>
  );
}
