import { useEffect, useRef, useState } from "react";
import type { BrandContent, ChamadaCinematicaContent } from "@/content/types";
import { IconeWhatsApp } from "@/components/Primitives";
import { PistaDeRolagem } from "@/components/PistaDeRolagem";
import { cn } from "@/lib/utils";

/**
 * CHAMADA EM ROLAGEM: a manchete some, um cartão escuro sobe e toma a tela, e
 * dentro dele um celular mostra a conversa do WhatsApp já pronta.
 *
 * Adaptada de um template que o usuário mandou em 24/09 ("cinematic-landing-hero").
 * O GESTO é o de lá. A MECÂNICA não, e isso não é preferência:
 *
 * ⚠️ SEM GSAP. O template pede `gsap` + `ScrollTrigger`, e o projeto tem decisão
 *    registrada contra (19/08, duas vezes): `gsap.set/to` escreve a propriedade
 *    `transform`, o Tailwind v4 escreve `translate`/`scale`/`rotate` SEPARADAS, e
 *    misturar as duas famílias no mesmo elemento faz uma sobrescrever a outra em
 *    SILÊNCIO. Somando: o projeto não tem nenhuma dependência de animação, e o
 *    mecanismo daqui (fração do trilho lida em `requestAnimationFrame`) já está
 *    provado em quatro seções.
 *
 * ⚠️ SEM `pin` e SEM `scrub` da biblioteca. O `pin: true` do template com
 *    `end: "+=7000"` sequestra 7000px de rolagem; aqui a pílula de navegação é
 *    fixa e tem âncoras, e em 17/08 esse mesmo padrão foi recusado por quebrar o
 *    menu, o teclado e a barra de rolagem. `sticky` entrega o mesmo visual.
 *
 * ⚠️ SEM o azul do template (`#162C6D`, `#3B82F6`). Azul-claro de consultório é
 *    clichê proibido no §4 do CLAUDE.md, e a paleta é a medida da Suzuki.
 *
 * ⚠️ SEM os botões de App Store e Google Play, e SEM o app de contagem de dias:
 *    a clínica não tem aplicativo. O celular mostra o WHATSAPP, que ela tem e que
 *    é o canal de agendamento do site inteiro. Em 03/08 uma janela de aplicativo
 *    falsa saiu daqui justamente por insinuar um sistema inexistente.
 */

/** Altura do trilho, em telas ALÉM da que fica grudada. É o único número a mexer
 *  se o ritmo incomodar: abaixo de ~1,6 as fases se atropelam. */
const TRILHO_MULT = 2.2;

/** Interpola `a`→`b` na faixa [de, ate] de `p`, com suavização de entrada e saída. */
function fase(p: number, de: number, ate: number) {
  const t = Math.min(1, Math.max(0, (p - de) / (ate - de)));
  return t * t * (3 - 2 * t);
}

export function ChamadaCinematica({
  data,
  brand,
}: {
  data: ChamadaCinematicaContent;
  brand: BrandContent;
}) {
  const trilhoRef = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);
  /* ⚠️ A INCLINAÇÃO PELO PONTEIRO SAIU em 24/09, a pedido: "deixe o celular sem mexer,
     fixo, porque ao passar o mouse em cima ele mexe". Era o segundo gesto do template
     e entrou na rodada anterior junto com a entrada 3D; ele reprovou ao ver no ar.
     Depois da entrada, o aparelho fica PARADO. Não reintroduzir sem pedido. */
  const [semMovimento, setSemMovimento] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplica = () => setSemMovimento(mq.matches);
    aplica();
    mq.addEventListener("change", aplica);
    return () => mq.removeEventListener("change", aplica);
  }, []);

  /* O progresso sai da fração que o TRILHO da própria seção já rolou por dentro de
     si, nunca de `window.scrollY`: esta seção não é a primeira da página, e em
     13/08 a órbita nasceu terminada por ler o scroll global. */
  useEffect(() => {
    if (semMovimento) return;
    const el = trilhoRef.current;
    if (!el) return;
    let vivo = true;
    let ultimo = -1;
    const laco = () => {
      if (!vivo) return;
      const r = el.getBoundingClientRect();
      /* Sai fora quando a seção não está na janela: um `getBoundingClientRect` por
         quadro ao longo de dez telas de rolagem é trabalho por nada, e no celular
         é bateria (15/09). */
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const curso = el.offsetHeight - window.innerHeight;
        const v = curso > 0 ? Math.min(1, Math.max(0, -r.top / curso)) : 0;
        if (Math.abs(v - ultimo) > 0.0005) {
          ultimo = v;
          setP(v);
        }
      }
      requestAnimationFrame(laco);
    };
    const id = requestAnimationFrame(laco);
    return () => {
      vivo = false;
      cancelAnimationFrame(id);
    };
  }, [semMovimento]);

  /* As quatro fases. Elas se SOBREPÕEM de propósito: sem cruzamento há um instante
     de tela vazia entre uma e outra, que lê como falha de carregamento (17/08). */
  const saiTexto = fase(p, 0.05, 0.3);
  const sobeCartao = fase(p, 0.08, 0.42);
  const abreCartao = fase(p, 0.34, 0.56);
  const entraCelular = fase(p, 0.44, 0.68);
  const entraTexto = fase(p, 0.56, 0.74);
  const entraBotao = fase(p, 0.68, 0.84);

  /* Sob `prefers-reduced-motion` a peça vira o estado FINAL, parado: desligar o
     movimento não pode custar o conteúdo, que é a regra de 17/08. */
  const v = semMovimento
    ? { saiTexto: 1, sobeCartao: 1, abreCartao: 1, entraCelular: 1, entraTexto: 1, entraBotao: 1 }
    : { saiTexto, sobeCartao, abreCartao, entraCelular, entraTexto, entraBotao };

  return (
    <section
      id="chamada"
      ref={trilhoRef}
      aria-label={`${data.linha1} ${data.linha2}`}
      className="relative scroll-mt-12"
      style={{ height: semMovimento ? undefined : `${(1 + TRILHO_MULT) * 100}vh` }}
    >
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden px-3 md:px-4",
          semMovimento ? "py-16" : "sticky top-0 h-screen",
        )}
      >
        {/* A MANCHETE. Sai de cena enquanto o cartão sobe. */}
        <div
          aria-hidden={v.saiTexto > 0.9 || undefined}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center"
          style={{
            opacity: 1 - v.saiTexto,
            translate: `0 ${-v.saiTexto * 8}vh`,
            scale: String(1 - v.saiTexto * 0.08),
          }}
        >
          <p className="display-1 text-foreground">{data.linha1}</p>
          <p className="display-1 text-accent">{data.linha2}</p>
        </div>

        {/* A PISTA DE ROLAGEM, o MESMO componente da tela de entrada, a pedido
            ("o sinal da scroll também precisa ser o mesmo").

            ⚠️ Ela vive com a MANCHETE e não dentro do cartão, e isso foi decidido
            depois de ver no render: dentro do cartão ela cai em cima do aparelho,
            que é centrado e sangra pelo pé — não há lugar embaixo que não seja o
            celular. Aqui ela some com a manchete, que é a curva certa: é no começo
            do trilho que a pessoa ainda não sabe que a peça responde à rolagem, e
            depois disso o cartão subindo já é o próprio aviso.

            Fica em `z-10`, abaixo do cartão, então o cartão a cobre ao subir sem
            precisar de mais nenhuma conta. */}
        <PistaDeRolagem
          rotulo={data.rotuloRolagem}
          className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-muted"
          style={{ opacity: 1 - v.saiTexto }}
        />

        {/* O CARTÃO que sobe e toma a tela. */}
        <div
          className="relative z-20 flex w-full items-center justify-center overflow-hidden bg-ink"
          style={{
            /* Dois eixos numa conta só: ele sobe (fase 1) e então cresce (fase 2). */
            translate: `0 ${(1 - v.sobeCartao) * 105}vh`,
            width: `${72 + v.abreCartao * 28}%`,
            height: `${64 + v.abreCartao * 30}vh`,
            borderRadius: `${32 - v.abreCartao * 8}px`,
            boxShadow: "0 40px 100px -20px oklch(0 0 0 / 0.55)",
          }}
        >
          {/* ⚠️ A GRADE É A DO TEMPLATE: TRÊS COLUNAS, texto na PRIMEIRA e aparelho na
              do MEIO. A terceira fica vazia, e é ela que põe o aparelho no centro
              exato do cartão.

              Isso DESFAZ o agrupamento centrado de 24/09 ("agrupe o celular + os
              textos + o botão juntos"), e é reversão pedida por ele no dia seguinte,
              com o print do template na mão: "não gostei dos centralizados ali, faça
              igual ao template... aumente ali e fique para o centro o celular, e a
              mensagem fique à esquerda". Não é para "corrigir" de volta.

              No template a terceira coluna carrega o wordmark gigante da marca. Aqui
              ela fica VAZIA de propósito: ele pediu duas vezes que o "SOBERS" não
              existisse, e a marca da Suzuki já aparece uma vez na home, grande, na
              tela de entrada. Repetir aqui é o defeito de 17/08.

              ⚠️ O `pt` DO CELULAR NÃO É RESPIRO, é a folga da pílula de navegação.
              Ela é FIXA e termina em 74px numa janela de 390; com o texto em cima
              (que é a ordem nova) a primeira linha da manchete nascia em 47px e
              passava POR BAIXO do botão do menu. Medido em 390, 320 e 768: cruzava
              nas três. Com 80/96px a folga fica em 31px no celular e 17px em 768.
              De `lg` para cima o texto está na coluna da esquerda, longe da pílula
              centralizada, e o `pt` volta a zero. */}
          <div className="relative mx-auto grid h-full w-full max-w-[1200px] grid-rows-[auto_minmax(0,1fr)] gap-6 px-5 pt-20 md:px-10 md:pt-24 lg:max-w-[1280px] lg:grid-cols-3 xl:max-w-[1440px] lg:grid-rows-1 lg:items-center lg:gap-8 lg:px-12 lg:pt-0">
            {/* TEXTO. À esquerda no desktop, em cima no celular — que é a mesma ordem
                do template (lá ele é `order-3 lg:order-1`, embaixo no celular, mas ali
                o aparelho não sangra; aqui o aparelho é cortado pelo pé do cartão, e
                texto DEPOIS dele ficaria coberto). */}
            <div
              className="z-20 text-center lg:text-left"
              style={{
                opacity: v.entraTexto,
                translate: `${(1 - v.entraTexto) * -24}px 0`,
              }}
            >
              <h2 className="display-2 text-ink-foreground">{data.cardTitulo}</h2>
              <p className="desc-secao mt-4 text-ink-muted">{data.cardDescricao}</p>

              <div
                className="mt-7 flex justify-center lg:justify-start"
                style={{
                  opacity: v.entraBotao,
                  translate: `0 ${(1 - v.entraBotao) * 14}px`,
                }}
              >
                {/* ⚠️ O DESTAQUE É PULSO, NÃO PISCADA, e a diferença é norma e não
                    gosto: a WCAG 2.3.1 trata conteúdo que pisca acima de 3 vezes por
                    segundo como risco real, e mesmo abaixo disso a alternância de
                    ligado/desligado num botão lê como defeito de renderização. O que
                    está aqui é um halo que respira em 2,4s — chama atenção sem
                    sequestrá-la, e para sob `prefers-reduced-motion`.

                    O halo é um irmão `absolute`, não um `box-shadow` animado: sombra
                    animada repinta o elemento a cada quadro, e este botão fica na tela
                    o tempo todo depois que a seção abre. */}
                <a
                  href={data.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-ink-foreground px-8 py-4.5 text-lg font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <span aria-hidden="true" className="halo-cta" />
                  <IconeWhatsApp className="relative h-6 w-6" />
                  <span className="relative">{data.cta.label}</span>
                </a>
              </div>
            </div>

            {/* O APARELHO, na coluna do MEIO.

                ⚠️ ELE É CORTADO PELO PÉ DO CARTÃO, de propósito, e é o que ele pediu
                olhando o print do template: "não completando o celular, igual tá
                cortado ali". A conta que produz o corte é simples e não tem número
                mágico: o aparelho é ANCORADO NO TOPO da própria célula e tem altura
                MAIOR que ela, então quem decide onde ele acaba é a borda do cartão,
                que já é `overflow-hidden`. Em qualquer janela ele sangra sozinho.

                ⚠️ O `top` é PERCENTUAL da célula e não px, e isso é o que mantém o
                aparelho fora da pílula de navegação: a pílula é fixa e termina em
                98px, e um recuo em px não sabe a altura da janela — foi o defeito que
                ele reportou com print em 24/09 ("ele passa do tamanho da seção de
                navegação"). Medido depois em três janelas; ver o commit.

                ⚠️ A ENTRADA É A DO TEMPLATE, a pedido: vem de baixo e de LONGE
                (z negativo), tombado nos dois eixos, pequeno, e chega reto no lugar.
                Os números são os do original — `y: 300, z: -500, rotationX: 50,
                rotationY: -30, scale: 0.6` — interpolados aqui em vez de pelo GSAP.

                ⚠️ É `transform` numa string só, e NÃO as propriedades `translate`/
                `scale`/`rotate` que o Tailwind v4 usa: as duas famílias não se somam,
                uma sobrescreve a outra em silêncio. Por isso este elemento não pode
                receber classe de translate ou scale — o `-translate-x-1/2` que centra
                mora no PAI, que é outro elemento. */}
            <div className="relative z-10 h-full min-h-0">
              <div
                className="absolute left-1/2 top-[7%] -translate-x-1/2 lg:top-[14%]"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="will-change-transform"
                  style={{
                    opacity: v.entraCelular,
                    transform: [
                      `translate3d(0, ${(1 - v.entraCelular) * 300}px, ${(1 - v.entraCelular) * -500}px)`,
                      `rotateX(${(1 - v.entraCelular) * 50}deg)`,
                      `rotateY(${(1 - v.entraCelular) * -30}deg)`,
                      `scale(${0.6 + v.entraCelular * 0.4})`,
                    ].join(" "),
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Aparelho data={data} brand={brand} revelado={v.entraCelular} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* O aparelho é decorativo para leitor de tela: tudo que ele mostra já está no
   texto ao lado e no link. Anunciar a conversa balão a balão faria a pessoa ouvir
   uma encenação como se fosse mensagem recebida. */
function Aparelho({
  data,
  brand,
  revelado,
}: {
  data: ChamadaCinematicaContent;
  brand: BrandContent;
  revelado: number;
}) {
  return (
    <div
      aria-hidden="true"
      /* ⚠️ UMA MEDIDA MANDA NO APARELHO INTEIRO: a altura. O `font-size` sai dela
         (`altura / 580`), e daí para baixo tudo é `em` com o número que o template
         usa em px — moldura de 280x580, ilha de 100x28, botões físicos, raios de
         48 e 40. É o que torna literal o "o celular precisa ser o mesmo": a
         proporção não muda em nenhum tamanho.

         ⚠️ A ALTURA SAI DA JANELA e não de um px cravado, e o motivo foi MEDIDO em
         24/09: com px fixo o aparelho passava POR TRÁS da pílula de navegação numa
         janela de 1440x800 embora coubesse folgado em 1440x900. Quem manda é a
         ALTURA da janela.

         ⚠️ E ELE É MAIOR QUE A CÉLULA DE PROPÓSITO — é assim que o pé do cartão o
         corta, como no print do template. Não "consertar" reduzindo a altura até
         ele caber: o corte é o pedido. */
      style={{ fontSize: "calc(var(--fone-altura) / 580)" }}
      className="relative h-[580em] w-[280em] rounded-[48em] moldura-aparelho [--fone-altura:min(66vh,540px)] lg:[--fone-altura:min(104vh,900px)]"
    >
      {/* Botões físicos, nas posições do template */}
      <span className="absolute -left-[3em] top-[120em] z-0 h-[25em] w-[3em] rounded-l-[4em] botao-aparelho" />
      <span className="absolute -left-[3em] top-[160em] z-0 h-[45em] w-[3em] rounded-l-[4em] botao-aparelho" />
      <span className="absolute -left-[3em] top-[220em] z-0 h-[45em] w-[3em] rounded-l-[4em] botao-aparelho" />
      <span className="absolute -right-[3em] top-[170em] z-0 h-[70em] w-[3em] -scale-x-100 rounded-l-[4em] botao-aparelho" />

      {/* A TELA. `inset` uniforme em `em` — em % os lados e o topo dariam recuos
          diferentes, porque % resolve contra eixos diferentes. */}
      <div className="absolute inset-[7em] z-10 overflow-hidden rounded-[40em] bg-[#0b141a]">
        <span className="brilho-tela pointer-events-none absolute inset-0 z-40" />

        {/* Ilha dinâmica */}
        <div className="absolute left-1/2 top-[5em] z-50 h-[28em] w-[100em] -translate-x-1/2 rounded-full bg-black" />

        <div className="flex h-full w-full flex-col">
          {/* Barra do contato */}
          <div className="flex items-center gap-[12em] border-b border-white/5 bg-[#1f2c34] px-[16em] pb-[14em] pt-[46em]">
            {/* ⚠️ A FOTO DE PERFIL É A MARCA DA CLÍNICA, a pedido de 24/09 ("logo da
                Suzuki na foto de perfil do whatsapp"). Era o glifo genérico do
                WhatsApp, que dizia qual é o aplicativo e nada sobre quem atende.

                ⚠️ É a logo COMPLETA (`brand.logoEscuro`), não um recorte só do
                símbolo. A regra é de 19/08 e foi paga: eu tinha recortado os traços
                da linha de baixo para caber melhor e ele reprovou na hora, "a logo da
                Suzuki não tá completa". Marca não se recorta para caber, quem cede é
                o layout.

                Campo BRANCO e a arte escura, e não o contrário: a barra do contato é
                `#1f2c34`, e a logo branca sobre ela some. Branco também é o que faz o
                círculo ler como foto de perfil de verdade em vez de ícone. */}
            <div
              className={cn(
                "flex h-[40em] w-[40em] shrink-0 items-center justify-center overflow-hidden rounded-full",
                brand.logoEscuro ? "bg-white" : "bg-[#25D366]/15",
              )}
            >
              {/* `logoEscuro` é opcional no tipo, e a reserva não é enfeite: numa
                  variante sem a arte escura o campo branco ficaria vazio, e um
                  círculo branco vazio lê como imagem quebrada. Sem ela, volta o
                  glifo do WhatsApp, que era o estado anterior. */}
              {brand.logoEscuro ? (
                <img src={brand.logoEscuro} alt="" className="w-[30em]" />
              ) : (
                <IconeWhatsApp className="h-[20em] w-[20em] text-[#25D366]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[16em] font-medium leading-tight text-white">
                {data.contatoNome}
              </p>
              <p className="truncate text-[13em] leading-tight text-white/45">
                {data.contatoStatus}
              </p>
            </div>
          </div>

          {/* Conversa */}
          <div className="flex flex-1 flex-col gap-[10em] px-[14em] py-[18em]">
            {data.conversa.map((balao, i) => {
              /* Cada balão entra depois do anterior, dentro do próprio curso de
                 revelação do aparelho: a conversa acontece, não aparece pronta. */
              const inicio = 0.35 + i * 0.3;
              const t = Math.min(1, Math.max(0, (revelado - inicio) / 0.3));
              const doCliente = balao.de === "cliente";
              return (
                <div
                  key={balao.texto}
                  className={cn("flex", doCliente ? "justify-end" : "justify-start")}
                  style={{ opacity: t, translate: `0 ${(1 - t) * 10}px` }}
                >
                  <div
                    className={cn(
                      "max-w-[86%] rounded-[16em] px-[12em] py-[8em]",
                      /* Verde do WhatsApp, na cor REAL: recolorir marca de terceiro
                         para casar com a paleta é adulterá-la (30/07). */
                      doCliente
                        ? "rounded-br-[5em] bg-[#005c4b] text-white"
                        : "rounded-bl-[5em] bg-[#1f2c34] text-white",
                    )}
                  >
                    <p className="text-[14em] leading-[1.45]">{balao.texto}</p>
                    <p className="mt-[2em] text-right text-[11em] leading-none text-white/40">
                      {balao.hora}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Campo de digitação, só como moldura do aplicativo */}
          <div className="flex items-center gap-[10em] px-[14em] pb-[26em]">
            <div className="h-[40em] flex-1 rounded-full bg-[#1f2c34]" />
            <div className="flex h-[40em] w-[40em] items-center justify-center rounded-full bg-[#25D366]">
              <svg viewBox="0 0 24 24" className="h-[20em] w-[20em] fill-white">
                <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
