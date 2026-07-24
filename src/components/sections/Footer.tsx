import { Facebook, Instagram, ArrowRight } from "lucide-react";
import type {
  BrandContent,
  ContatoContent,
  FooterContent,
  SocialLink,
} from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { telHref, whatsappHref } from "@/lib/contato";

function SocialIcon({ name, className }: { name: SocialLink["icon"]; className?: string }) {
  if (name === "facebook") return <Facebook className={className} strokeWidth={1.75} />;
  return <Instagram className={className} strokeWidth={1.75} />;
}

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
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10" style={{ paddingBlock: "var(--section-py)" }}>
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-12">
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
              <div className="max-w-[52ch]">
                <h2 className="font-medium leading-[1.05] tracking-[-0.02em] text-[clamp(1.75rem,3.5vw,2.5rem)] text-foreground">
                  {data.ctaTitulo}
                </h2>
                <p className="mt-4 text-base leading-[1.6] text-muted-foreground">
                  {data.ctaDescricao}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 self-center bg-accent px-6 text-accent-foreground hover:bg-accent/90"
              >
                <a href={data.ctaBotao.href} target="_blank" rel="noreferrer">
                  {data.ctaBotao.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
              {brand.wordmark}
            </p>
            <p className="mt-4 text-sm leading-[1.6] text-muted-foreground">
              {contato.endereco}
              <br />
              {contato.cidadeUf} · {contato.cep}
            </p>
            <p className="mt-4 text-sm leading-[1.6] text-muted-foreground">{contato.horario}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {data.colunaAreasLabel}
            </p>
            <ul className="mt-4 space-y-2.5">
              {data.colunaAreas.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {data.colunaClinicaLabel}
            </p>
            <ul className="mt-4 space-y-2.5">
              {data.colunaClinica.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {data.colunaContatoLabel}
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={telHref(contato.telefone)}
                  className="text-sm text-foreground/80 transition-colors hover:text-accent"
                >
                  {data.telefoneLabel}: {contato.telefone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(contato.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-foreground/80 transition-colors hover:text-accent"
                >
                  {data.whatsappLabel}: {contato.whatsapp}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex items-center gap-3">
              {data.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    <SocialIcon name={s.icon} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-6">
          <p className="text-xs leading-[1.6] text-muted-foreground">{brand.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
