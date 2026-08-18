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
import { AberturaMarca } from "@/components/sections/AberturaMarca";
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
        /* Só aqui: a home abre pela arcada, e a navegação espera a animação
           terminar. Ver a nota da prop em Header.tsx. */
        esperarArcada
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
        {/* ⚠️ ABERTURA SÓ COM A MARCA desde 18/08. A abertura em VÍDEO escrubado pela
            rolagem foi APAGADA a pedido do usuário: "desisti de fazer isso, manter o
            hero no início do site, mas talvez manter a ideia da sessão inicial com a
            logo da Suzuki ao meio e ao scrollar aparecer o hero".

            O que saiu: trilho de 210vh com palco sticky, escrubagem do vídeo pelo
            currentTime, viagem da arcada até o slot do hero e a troca por crossfade.
            O histórico está no git e os arquivos de vídeo continuam em
            public/imagens/arcada/ — voltar atrás é revert, não refazer.

            A arcada NÃO saiu do site: é a figura do hero, ao lado do texto, e ficou
            40% maior porque o vídeo era o que obrigava a imagem a ser o quadro 16:9
            inteiro. Ver a nota em clinica.hero.arcada.

            "Home" aponta para `#abertura`, que é o topo da página. */}
        <AberturaMarca
          logo={clinica.brand.logo}
          logoAlt={clinica.brand.logoAlt}
          wordmark={clinica.brand.wordmark}
        />
        <HeroSection data={clinica.hero} />
        <CasosSection data={clinica.casos} />
        <AreasSection data={clinica.areas} />
        <BioSection data={clinica.bio} />
        <DiferenciaisSection data={clinica.diferenciais} />
        <EstruturaSection data={clinica.estrutura} />
        <TratamentosSection data={clinica.tratamentos} />
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
        /* O aviso da arcada mora no bloco legal do rodapé desde 17/08, quando a
           abertura passou a ser "sem nada de escrita". */
        avisoArcada={clinica.arcada.aviso}
      />
    </div>
  );
}
