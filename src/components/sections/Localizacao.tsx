import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import type { ContatoContent, LocalizacaoContent } from "@/content/types";
import { Section, SectionHeader } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { telHref, whatsappHref } from "@/lib/contato";

export function LocalizacaoSection({
  data,
  contato,
}: {
  data: LocalizacaoContent;
  contato: ContatoContent;
}) {
  return (
    <Section id="localizacao">
      <SectionHeader eyebrow={data.eyebrow} titulo={data.titulo} descricao={data.descricao} />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-border bg-surface p-6 md:p-8">
            <dl className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    {data.enderecoLabel}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    {contato.endereco}
                    <br />
                    {contato.cidadeUf} · {contato.cep}
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    {data.horarioLabel}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">{contato.horario}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    {data.telefoneLabel}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    <a
                      href={telHref(contato.telefone)}
                      className="transition-colors hover:text-accent"
                    >
                      {contato.telefone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    {data.whatsappLabel}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    <a
                      href={whatsappHref(contato.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {contato.whatsapp}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <iframe
              src={contato.mapaEmbedSrc}
              title={contato.mapaTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-tint block h-[360px] w-full md:h-[460px]"
              style={{ border: 0 }}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
