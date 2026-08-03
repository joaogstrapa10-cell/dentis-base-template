import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { clinica } from "@/content/clinica";
import { Header } from "@/components/Header";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { AvisoCasos, PilhaDeCasos } from "@/components/sections/Casos";
import { FooterSection } from "@/components/sections/Footer";

/**
 * Página dedicada aos casos. A home mostra `casos.limiteNaHome` e manda para cá;
 * aqui vem a lista inteira, pela mesma `PilhaDeCasos` — nenhum layout duplicado.
 *
 * Sem hero: a página abre no título, porque quem chega aqui já veio de um "ver
 * todos" e repetir a apresentação da clínica só empurraria os casos para baixo.
 * O bloco escuro do topo existe para a pílula de navegação, que é clara e
 * precisa de fundo escuro atrás — e para o cabeçalho não colar na primeira
 * faixa de caso.
 *
 * O aviso de compliance da CFO-196/2019 aparece aqui também. É o mesmo
 * componente da home, de propósito: as duas cópias não podem divergir.
 */
export const Route = createFileRoute("/casos")({
  head: () => ({
    meta: [
      { title: "Casos conduzidos — Suzuki Odontologia" },
      {
        name: "description",
        content:
          "Casos de alta complexidade conduzidos na Suzuki Odontologia, documentados por etapa: situação clínica, conduta, especialidades envolvidas e duração.",
      },
      { property: "og:title", content: "Casos conduzidos — Suzuki Odontologia" },
      {
        property: "og:description",
        content:
          "Descrição de processo clínico, por etapa. Sem imagens comparativas de antes e depois, em conformidade com a CFO-196/2019.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaginaCasos,
});

function PaginaCasos() {
  const { casos } = clinica;
  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground">
      <Header
        data={clinica.header}
        logo={clinica.brand.logo}
        logoAlt={clinica.brand.logoAlt}
      />

      <main>
        {/* Faixa escura do topo, com o mesmo tratamento do hero: sangra até a
            borda e arredonda só embaixo. */}
        <div className="rounded-b-3xl bg-ink">
          <Section id="topo-casos">
            <div className="pt-20 md:pt-24">
              <Reveal>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-small text-ink-muted transition-colors hover:text-ink-foreground"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                  {casos.pagina.voltarLabel}
                </a>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="display-2 mt-6 text-ink-foreground">
                  {casos.pagina.titulo}
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="mt-5 max-w-[62ch] text-base leading-[1.65] text-ink-muted">
                  {casos.pagina.descricao}
                </p>
              </Reveal>
            </div>
          </Section>
        </div>

        <Section id="casos">
          <PilhaDeCasos data={casos} />
          <AvisoCasos texto={casos.aviso} />
        </Section>
      </main>

      <FooterSection
        data={clinica.footer}
        brand={clinica.brand}
        contato={clinica.contato}
      />
    </div>
  );
}
