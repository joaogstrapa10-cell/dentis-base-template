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
import { AberturaPortal } from "@/components/sections/AberturaPortal";
import { BioSection } from "@/components/sections/Bio";
import { FaqSection } from "@/components/sections/Faq";
import { ChamadaCinematica } from "@/components/sections/ChamadaCinematica";
import { FooterSection } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Suzuki Odontologia | Alta complexidade em Curitiba",
      },
      {
        name: "description",
        content:
          "Clínica odontológica de alta complexidade em Curitiba/PR. Corpo clínico de mestres e especialistas em implantodontia, reabilitação oral e estética.",
      },
      {
        property: "og:title",
        content: "Suzuki Odontologia | Alta complexidade em Curitiba",
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
      {/* SKIP LINK — primeiro elemento focável da página, item do quality floor da
          skill. Invisível até receber foco; quem navega por teclado aperta Tab uma vez
          e pula a pílula inteira direto para o conteúdo. */}
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-full focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:text-ink-foreground"
      >
        Pular para o conteúdo
      </a>

      {/* CAMADA DE AMBIENTE — uma só, fixa, atrás de tudo, derivando em 90s. A skill:
          "make the page one environment (...) so scrolling feels like moving through a
          place instead of past stacked sections." Fica em -z-10 e não recebe ponteiro. */}
      <div aria-hidden className="ambiente" />

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

          🗑️ "Como funciona" era a seção de TRATAMENTOS ("Orçamento após
          avaliação."), e ela foi REMOVIDA em 15/09 a pedido — "retirar por completo
          a sessão orçamento após avaliação". Saiu inteira: componente, bloco de
          conteúdo, os três tipos e o item do menu. Está no git.

          ⚠️ Com ela some a única explicação de COMO o orçamento funciona ("não
          trabalhamos com tabela fechada: o valor depende do diagnóstico"). O site
          não fala mais de valor em lugar nenhum — o que é coerente, mas é
          informação que a clínica tinha e deixou de dar. Voltar é restaurar do git.

          A ordem do menu (`header.nav`) e da coluna "Clínica" do rodapé segue
          esta mesma sequência — âncora que sobe a página em vez de descer lê como
          link errado. */}
      {/* `id` e `tabIndex` juntos: sem o id o skip link não tem destino, e sem o
          tabIndex o foco não PARA aqui — o navegador rola até a âncora mas deixa o foco
          no link, então o próximo Tab volta para o topo. Item do quality floor. */}
      <main id="main" tabIndex={-1}>
        {/* TELA DE ENTRADA — a primeira coisa do site, e a única abertura que
            sobrou. Verde padrão, marca em cima e três pontos embaixo; ao rolar, a
            marca sobe, os pontos descem e se abrem para os lados, tudo cresce e se
            apaga, e o HERO aparece atrás.

            ⚠️ A ARCADA 3D SAIU em 19/08, a pedido do usuário ("tire a ideia dos
            dentes, a ideia da sessão do scroll com a logo tá boa, e após scrollar
            começa o hero"). Ela foi a abertura do site por dois dias e passou por
            quatro formas — quadros, vídeo escrubado, giro de três quartos e a
            montagem formação+giro. Está tudo no git, em `b4292fc`, junto com os
            arquivos de vídeo: `AberturaArcada.tsx` e `public/imagens/arcada/`.
            Voltar é restaurar os dois caminhos e uma linha aqui.

            "Home" no menu aponta para `#portal`, que é o topo da página. */}
        <AberturaPortal data={clinica.abertura} />
        <HeroSection data={clinica.hero} />
        <CasosSection data={clinica.casos} />
        <AreasSection data={clinica.areas} />
        {/* ⚠️ A CHAMADA SOBE PARA CÁ, logo depois de Especialidades, por pedido de
            15/09 ("o CTA colocar depois de especialidades"). Ela era a última seção
            antes do rodapé desde 12/08.

            Consequência a vigiar, e não é bug: **a página deixou de terminar numa
            chamada** — fecha em Localização e rodapé. A conversão continua no header
            fixo (que acompanha a página inteira) e no hero. Se ele quiser fechar a
            página com chamada de novo, o caminho é ter DUAS, e aí vale a regra de
            12/08: chamada repetida com destino idêntico não é escolha. */}
        {/* ⚠️ SUBSTITUI a `ChamadaFinalSection`, que era a faixa escura curta com
            texto à esquerda e botão à direita. As duas são a MESMA chamada, e manter
            ambas daria dois convites de agendamento seguidos com o mesmo destino — o
            que a regra de 12/08 chama de escolha que não é escolha.
            A `ChamadaFinal.tsx` e o bloco `clinica.chamadaFinal` FICAM no repositório:
            voltar é trocar esta linha. */}
        <ChamadaCinematica data={clinica.chamadaCinematica} brand={clinica.brand} />
        <BioSection data={clinica.bio} />
        <DiferenciaisSection data={clinica.diferenciais} />
        <EstruturaSection data={clinica.estrutura} />
        <DepoimentosSection
          data={clinica.depoimentos}
          logo={clinica.brand.logoEscuro}
          logoAlt={clinica.brand.logoAlt}
        />
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
