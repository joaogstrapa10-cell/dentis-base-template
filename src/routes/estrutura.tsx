import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { clinica } from "@/content/clinica";
import { Header } from "@/components/Header";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/Reveal";
import { FooterSection } from "@/components/sections/Footer";

/**
 * Todas as fotos da clínica, paradas e identificadas.
 *
 * Esta página é a razão pela qual a esteira da home pode existir: ela é a saída
 * para quem "quer ver todas as fotos de uma vez sem precisar ficar esperando".
 * Sem ela, o carrossel esconderia conteúdo atrás de tempo de espera. Se a
 * esteira for removida, esta página FICA.
 *
 * Cada foto vem com o nome do ambiente em `figcaption` — é isso que responde "o
 * que é cada ambiente". `alt` continua carregando a descrição visual completa,
 * para quem não vê a imagem; a legenda não substitui o alt.
 *
 * Grade de duas colunas, e aqui uma grade É o formato certo: o propósito da
 * página é comparação e varredura rápida, não narrativa. É o oposto do caso da
 * home, onde grade uniforme era o problema.
 */
export const Route = createFileRoute("/estrutura")({
  head: () => ({
    meta: [
      { title: "A clínica, ambiente por ambiente — Suzuki Odontologia" },
      {
        name: "description",
        content:
          "Fotos da Suzuki Odontologia na unidade do Alto da XV, em Curitiba: recepção, sala de espera, consultórios, área administrativa, área externa e jardim.",
      },
      {
        property: "og:title",
        content: "A clínica, ambiente por ambiente — Suzuki Odontologia",
      },
      {
        property: "og:description",
        content:
          "Recepção, consultórios e áreas de apoio da unidade do Alto da XV, com a identificação de cada ambiente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaginaEstrutura,
});

function PaginaEstrutura() {
  const { estrutura } = clinica;
  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground">
      {/* SKIP LINK — primeiro elemento focável, item do quality floor da skill. */}
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-full focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:text-ink-foreground"
      >
        Pular para o conteúdo
      </a>

      {/* CAMADA DE AMBIENTE — a mesma da home, para as três rotas serem um lugar só. */}
      <div aria-hidden className="ambiente" />
      <Header
        data={clinica.header}
        logo={clinica.brand.logo}
        logoAlt={clinica.brand.logoAlt}
      />

      {/* `id` para o skip link ter destino, `tabIndex` para o foco PARAR aqui. */}
      <main id="main" tabIndex={-1}>
        {/* Faixa verde do topo, mesmo tratamento do hero e da página de casos:
            sangra até a borda e arredonda só embaixo. */}
        <div className="rounded-b-3xl bg-ink">
          <Section id="topo-estrutura">
            <div className="pt-20 md:pt-24">
              <Reveal>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-small text-ink-muted transition-colors hover:text-ink-foreground"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                  {estrutura.pagina.voltarLabel}
                </a>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="display-2 mt-6 text-ink-foreground">
                  {estrutura.pagina.titulo}
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="mt-5 max-w-[62ch] text-base text-ink-muted">
                  {estrutura.pagina.descricao}
                </p>
              </Reveal>
            </div>
          </Section>
        </div>

        <Section id="fotos">
          <ul className="grid gap-4 sm:grid-cols-2 md:gap-6">
            {estrutura.imagens.map((slot, i) => (
              <Reveal key={`${slot.src ?? slot.rotulo}-${i}`} delay={Math.min(i, 6) * 60} as="li">
                <figure>
                  <div className="aspect-[3/2] overflow-hidden rounded-2xl bg-surface">
                    {slot.src ? (
                      <img
                        src={slot.src}
                        alt={slot.alt}
                        loading={i < 2 ? "eager" : "lazy"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={slot.alt}
                        className="slot-grid h-full w-full"
                      />
                    )}
                  </div>
                  <figcaption className="mt-3 text-base text-foreground">
                    {slot.rotulo}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
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
