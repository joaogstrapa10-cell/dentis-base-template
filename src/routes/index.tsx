import { createFileRoute } from "@tanstack/react-router";
import { clinica } from "@/content/clinica";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/sections/Hero";
import { DiferenciaisSection } from "@/components/sections/Diferenciais";
import { AcompanhamentoSection } from "@/components/sections/Acompanhamento";
import { LocalizacaoSection } from "@/components/sections/Localizacao";
import { EstruturaSection } from "@/components/sections/Estrutura";
import { AreasSection } from "@/components/sections/Areas";
import { CasosSection } from "@/components/sections/Casos";
import { DepoimentosSection } from "@/components/sections/Depoimentos";
import { TratamentosSection } from "@/components/sections/Tratamentos";
import { BioSection } from "@/components/sections/Bio";
import { FaqSection } from "@/components/sections/Faq";
import { FooterSection } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Suzuki Odontologia — Alta complexidade em Curitiba",
      },
      {
        name: "description",
        content:
          "Clínica odontológica de alta complexidade em Curitiba/PR. Corpo clínico de mestres e especialistas em implantodontia, reabilitação oral e estética.",
      },
      {
        property: "og:title",
        content: "Suzuki Odontologia — Alta complexidade em Curitiba",
      },
      {
        property: "og:description",
        content:
          "Corpo clínico de mestres e especialistas. Casos de alta complexidade, planejamento por escrito e harmonização com a face.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      <Header
        data={clinica.header}
        logo={clinica.brand.logo}
        logoAlt={clinica.brand.logoAlt}
      />
      <main>
        <HeroSection data={clinica.hero} />
        <DiferenciaisSection data={clinica.diferenciais} />
        <AcompanhamentoSection data={clinica.acompanhamento} />
        <EstruturaSection data={clinica.estrutura} />
        <AreasSection data={clinica.areas} />
        <CasosSection data={clinica.casos} />
        <DepoimentosSection
          data={clinica.depoimentos}
          logo={clinica.brand.logoEscuro}
          logoAlt={clinica.brand.logoAlt}
        />
        <TratamentosSection data={clinica.tratamentos} />
        <BioSection data={clinica.bio} />
        <FaqSection data={clinica.faq} />
        <LocalizacaoSection data={clinica.localizacao} contato={clinica.contato} />
      </main>
      <FooterSection
        data={clinica.footer}
        brand={clinica.brand}
        contato={clinica.contato}
      />
    </div>
  );
}
