import { createFileRoute } from "@tanstack/react-router";
import { clinica } from "@/content/clinica";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/sections/Hero";
import { DiferenciaisSection } from "@/components/sections/Diferenciais";
import { LocalizacaoSection } from "@/components/sections/Localizacao";
import { EstruturaSection } from "@/components/sections/Estrutura";
import { AreasSection } from "@/components/sections/Areas";
import { CasosSection } from "@/components/sections/Casos";
import { DepoimentosSection } from "@/components/sections/Depoimentos";
import { TratamentosSection } from "@/components/sections/Tratamentos";
import { ArcadaSection } from "@/components/sections/Arcada";
import { BioSection } from "@/components/sections/Bio";
import { FaqSection } from "@/components/sections/Faq";
import { ChamadaFinalSection } from "@/components/sections/ChamadaFinal";
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
      {/* ORDEM DAS SEÇÕES — ditada pelo usuário em 13/08, nesta sequência:
          hero, casos, especialidades, corpo clínico, experiência aplicada,
          ambiente, como funciona, avaliações, onde ficamos, comece a sua
          avaliação, rodapé.

          O FAQ não estava na lista e FICOU, entre avaliações e "onde ficamos" —
          que é a posição que ele já ocupava em relação à Localização. Duas razões
          para não tratar a ausência como remoção: o usuário sempre pediu remoção
          com verbo ("essa seção quero que retire", "esse botão pode tirar"), e o
          FAQ foi refeito duas vezes a pedido dele na véspera. Se a intenção era
          removê-lo, é uma linha aqui e outra no `clinica.ts`.

          "Como funciona" = a seção de Tratamentos ("Orçamento após avaliação"),
          que é a que descreve como o processo e o orçamento funcionam. As outras
          dez etiquetas da lista batem com o título ou o assunto de uma seção
          existente, uma a uma.

          A ordem do menu (`header.nav`) e da coluna "Clínica" do rodapé segue
          esta mesma sequência — âncora que sobe a página em vez de descer lê como
          link errado. */}
      <main>
        <HeroSection data={clinica.hero} />
        <CasosSection data={clinica.casos} />
        <AreasSection data={clinica.areas} />
        <BioSection data={clinica.bio} />
        <DiferenciaisSection data={clinica.diferenciais} />
        <EstruturaSection data={clinica.estrutura} />
        <TratamentosSection data={clinica.tratamentos} />
        {/* Arcada entrou em 17/08, depois de Tratamentos de propósito: Tratamentos
            é o "como funciona" da lista do usuário, e esta seção é o mesmo assunto
            em imagem — a sequência do procedimento. Ler a política de orçamento e
            então ver as etapas acontecerem é a ordem que faz sentido.

            Não entrou no menu (`header.nav`). Item novo na pílula recria a colisão
            com a marca em 1024px, que já foi paga duas vezes (12/08, quando "Home"
            entrou e a folga caiu de 44px para 9px), e o usuário não pediu link.
            A seção tem `id="arcada"` para link direto. */}
        <ArcadaSection data={clinica.arcada} />
        <DepoimentosSection
          data={clinica.depoimentos}
          logo={clinica.brand.logoEscuro}
          logoAlt={clinica.brand.logoAlt}
        />
        <FaqSection data={clinica.faq} />
        <LocalizacaoSection data={clinica.localizacao} contato={clinica.contato} />
        <ChamadaFinalSection data={clinica.chamadaFinal} />
      </main>
      <FooterSection
        data={clinica.footer}
        brand={clinica.brand}
        contato={clinica.contato}
      />
    </div>
  );
}
