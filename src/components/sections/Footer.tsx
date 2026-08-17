import { Facebook, Instagram } from "lucide-react";
import type {
  BrandContent,
  ContatoContent,
  FooterContent,
  NavLink,
  SocialLink,
} from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { telHref, whatsappHref } from "@/lib/contato";

function SocialIcon({ name, className }: { name: SocialLink["icon"]; className?: string }) {
  if (name === "facebook") return <Facebook className={className} strokeWidth={1.75} />;
  return <Instagram className={className} strokeWidth={1.75} />;
}

function Coluna({ titulo, links }: { titulo: string; links: NavLink[] }) {
  return (
    <div>
      <p className="text-small text-ink-muted">{titulo}</p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label + link.href}>
            <a
              href={link.href}
              className="text-base text-ink-foreground transition-colors duration-300 hover:text-ink-muted"
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
 * Estrutura: FAIXA ESCURA fechando a página — quatro colunas de navegação,
 * endereço e créditos.
 *
 * O cartão de CTA que abria este bloco SAIU em 12/08 e virou a seção
 * `ChamadaFinal`, logo antes daqui. Com ele foram também o `mt-24 md:mt-32` das
 * colunas, que existia só para afastá-las do cartão, e os imports de
 * `PillButton`/`ArrowButton`. O rodapé volta a ser rodapé: navegação e créditos,
 * sem conversão dentro.
 *
 * O `pt` do wrapper existe por causa dessa mudança, e não é decoração: a
 * `ChamadaFinal` também é uma faixa escura sangrada, e nenhuma das duas usa
 * `--section-py` por fora. Sem ele os dois blocos ficavam ENCOSTADOS, e duas
 * massas verdes coladas leem como um bloco só com uma emenda no meio — foi o que
 * o cliente apontou em 13/08. O vão é o dobro da goteira lateral: igual à
 * goteira ele viraria um fio de 12px entre dois cantos de raio 24px, e no ritmo
 * de seção (`--section-py`) sobraria uma faixa de branco maior que a separação
 * entre superfícies precisa ser.
 */
export function FooterSection({
  data,
  brand,
  contato,
  avisoArcada,
}: {
  data: FooterContent;
  brand: BrandContent;
  contato: ContatoContent;
  /** Aviso legal da animação da arcada. Opcional porque só a home tem a peça —
   *  `/casos` e `/estrutura` usam o mesmo rodapé e não a exibem. */
  avisoArcada?: string;
}) {
  return (
    <footer className="px-3 pb-3 pt-6 md:px-4 md:pb-4 md:pt-8">
      <div className="relative isolate overflow-hidden rounded-3xl bg-ink">
        <div
          aria-hidden="true"
          className="ink-arc pointer-events-none absolute inset-0 opacity-25"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pt-16 md:px-10 md:pt-24">
          {/* Colunas */}
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.logoAlt}
                  className="h-10 w-auto"
                />
              ) : (
                <p className="text-base font-semibold text-ink-foreground">
                  {brand.wordmark}
                </p>
              )}
              <p className="mt-5 text-base leading-[1.7] text-ink-muted">
                {contato.endereco}
                <br />
                {contato.cidadeUf} · {contato.cep}
              </p>
              <p className="mt-4 text-base leading-[1.7] text-ink-muted">{contato.horario}</p>

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
              <p className="text-small text-ink-muted">{data.colunaContatoLabel}</p>
              {/* Uma linha quando os dois números coincidem, duas quando não.
                  Mesmo defeito que a Localização tinha: com o celular servindo de
                  telefone e de WhatsApp, o rodapé listava o MESMO
                  (41) 99206-1073 embaixo de dois rótulos, o que lê como erro de
                  conteúdo. Os rótulos separados ficam no tipo para as variantes
                  com fixo e celular distintos. */}
              <ul className="mt-5 space-y-3">
                {contato.telefone === contato.whatsapp ? (
                  <li>
                    <a
                      href={telHref(contato.telefone)}
                      className="text-base text-ink-foreground transition-colors duration-300 hover:text-ink-muted"
                    >
                      {contato.telefone}
                    </a>
                    <p className="mt-0.5 text-small text-ink-muted">
                      {data.telefoneWhatsappLabel}
                    </p>
                  </li>
                ) : (
                  <>
                    <li>
                      <a
                        href={telHref(contato.telefone)}
                        className="text-base text-ink-foreground transition-colors duration-300 hover:text-ink-muted"
                      >
                        {contato.telefone}
                      </a>
                      <p className="mt-0.5 text-small text-ink-muted">{data.telefoneLabel}</p>
                    </li>
                    <li>
                      <a
                        href={whatsappHref(contato.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base text-ink-foreground transition-colors duration-300 hover:text-ink-muted"
                      >
                        {contato.whatsapp}
                      </a>
                      <p className="mt-0.5 text-small text-ink-muted">{data.whatsappLabel}</p>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Barra inferior. O padding-bottom era `pb-40 md:pb-56` — 10rem e
              14rem — e existia só para caber o wordmark gigante que era cortado
              pela borda do bloco. A palavra saiu em 30/07 e o padding ficou:
              sobravam 14rem de verde vazio depois do copyright, com o arco
              dourado brilhando no meio do nada. Encolhido junto. */}
          <div className="mt-20 border-t border-ink-border pb-10 pt-7 md:pb-12">
            <p className="text-small leading-[1.7] text-ink-muted">{brand.copyright}</p>
            {/* ⚠️ Aviso da CFO-196/2019 sobre a animação da arcada. Ele ficava DENTRO
                da seção da arcada e veio para cá em 17/08, quando o usuário pediu a
                abertura "sem nada de escrita". Aqui é o bloco legal da página — CRO
                do responsável técnico, CNPJ —, que é onde aviso legal pertence.

                Fica a doze seções de distância de quem vê a animação, e isso é
                exposição a discutir com o jurídico da clínica: não é o mesmo que
                estar ao lado da peça. Está registrado no CLAUDE.md. */}
            {avisoArcada ? (
              <p className="mt-4 max-w-[60rem] text-small leading-[1.7] text-ink-muted/80">
                {avisoArcada}
              </p>
            ) : null}
          </div>
        </div>

      </div>
    </footer>
  );
}
