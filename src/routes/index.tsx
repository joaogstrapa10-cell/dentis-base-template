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
import { Trajetoria } from "@/components/sections/Trajetoria";
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

        {/* ⚠️ A ORDEM DESTA PÁGINA FOI DITADA PELO USUÁRIO EM 30/09, com a lógica
            escrita por ele, e é a QUARTA vez que ela muda. Vale registrar o
            argumento inteiro, porque sem ele a próxima sessão reordena de novo:

              quem conduz e como  →  Bio + Diferenciais
              o que a clínica faz →  Áreas, com a prova logo em seguida (Casos)
              quem aprovou        →  Depoimentos, que aquecem antes do CTA
              objeções práticas   →  Estrutura, FAQ e Localização (onde, como, quanto)

            O que mudou em relação a 25/09: Diferenciais subiu para logo depois da
            Bio, Casos DESCEU para depois de Áreas (a prova vem depois do que ela
            prova), Depoimentos subiu para antes da chamada, e a chamada desceu
            para o meio. Antes disso a página já tinha aberto pelos diferenciais
            (até 13/08), pelo trabalho feito (Casos, 13/08) e por quem conduz o
            trabalho (Bio, 25/09).

            ⚠️ O MENU e a coluna "Clínica" do rodapé seguem esta ordem. Âncora que
            sobe a página enquanto a de baixo desce lê como link errado. */}

        {/* ⚠️ Hero e Bio são as DUAS faixas escuras sangradas em sequência, e
            nenhuma participa do ritmo de `--section-py`. É por isso que a Bio tem
            `pt-6 md:pt-8`: sem ele os dois blocos ficam com os cantos encostados e
            leem como um bloco só com uma emenda no meio. Defeito pago em 13/08,
            15/09 e 25/09. Ao mover faixa sangrada, conferir quem passa a vir
            antes. */}
        <BioSection data={clinica.bio} />

        {/* TRAJETÓRIA, logo depois da Bio e dentro do bloco "quem conduz e como"
            que o usuário desenhou em 30/09: a Bio apresenta o responsável, esta
            mostra COMO ele chegou até aqui, e só então Diferenciais fala do
            método. Entrar depois de Diferenciais separaria a pessoa da formação
            dela por uma seção inteira.
            Seção CLARA: a Bio acima é faixa escura sangrada, e duas escuras em
            contato é o defeito dos cantos encostados, pago três vezes. */}
        <Trajetoria data={clinica.trajetoria} />

        <DiferenciaisSection data={clinica.diferenciais} />
        <AreasSection data={clinica.areas} />
        <CasosSection data={clinica.casos} />
        <DepoimentosSection
          data={clinica.depoimentos}
          logo={clinica.brand.logoEscuro}
          logoAlt={clinica.brand.logoAlt}
        />

        {/* ⚠️ A CHAMADA É A TERCEIRA faixa escura sangrada, e aqui ela fica entre
            Depoimentos e Estrutura — as duas CLARAS, com `--section-py` próprio,
            que é quem dá o vão. Se alguma das duas vizinhas virar bloco escuro, o
            vão some e volta o defeito dos cantos encostados.

            ⚠️ SUBSTITUI a `ChamadaFinalSection`, que era a faixa escura curta com
            texto à esquerda e botão à direita. As duas são a MESMA chamada, e
            manter ambas daria dois convites de agendamento seguidos com o mesmo
            destino. `ChamadaFinal.tsx` e o bloco `clinica.chamadaFinal` FICAM no
            repositório: voltar é trocar esta linha. */}
        <ChamadaCinematica data={clinica.chamadaCinematica} brand={clinica.brand} />
        <EstruturaSection data={clinica.estrutura} />
        <FaqSection data={clinica.faq} />
        {/* ⚠️ Fecha a página, e desde 30/09 carrega o próprio botão de agendar, a
            pedido: com a chamada no meio, a última seção ficava sem nenhuma ação. */}
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
