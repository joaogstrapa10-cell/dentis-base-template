import { useEffect, useRef, useState } from "react";
import type { ChamadaCinematicaContent } from "@/content/types";
import { IconeWhatsApp } from "@/components/Primitives";
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

export function ChamadaCinematica({ data }: { data: ChamadaCinematicaContent }) {
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
          {/* ⚠️ AS DUAS COLUNAS SÃO UM GRUPO CENTRADO, e isso já foi o contrário: por
              uma rodada a grade teve TRÊS colunas com a terceira vazia, para pôr o
              APARELHO no centro exato da tela. Ele viu no ar e pediu o oposto —
              "deixar os dois elementos centralizados juntos, agrupe o celular + os
              textos + o botão juntos". Com o celular no centro da tela o texto era
              empurrado para a borda e sobrava um vazio do outro lado, que é o que
              aparece no print dele.

              `w-fit` + `justify-center`: as trilhas ocupam só o que precisam e o PAR
              fica centrado. Uma largura fixa com `mx-auto` não serviria — a coluna de
              texto mudaria de tamanho conforme a copy e o conjunto sairia do eixo. */}
          <div className="mx-auto grid w-full grid-cols-1 items-center justify-center gap-8 px-5 py-6 md:px-10 lg:w-fit lg:grid-cols-[minmax(0,24rem)_auto] lg:gap-14">
            {/* Texto do cartão. No celular vem DEPOIS do aparelho, porque ali o
                aparelho é a peça que explica a seção. */}
            <div
              className="order-2 text-center lg:order-1 lg:text-left"
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

            {/* O APARELHO com a conversa, na coluna do MEIO.

                ⚠️ A ENTRADA É A DO TEMPLATE, a pedido ("a animação do scroll ao chegar
                no celular precisa ser igual ao template"): ele vem de baixo e de LONGE
                (z negativo), tombado nos dois eixos, pequeno, e chega reto no lugar.
                Os números são os do original — `y: 300, z: -500, rotationX: 50,
                rotationY: -30, scale: 0.6` — interpolados aqui em vez de pelo GSAP.

                ⚠️ É `transform` numa string só, e NÃO as propriedades `translate`/
                `scale`/`rotate` que o Tailwind v4 usa: as duas famílias não se somam,
                uma sobrescreve a outra em silêncio. Por isso este elemento não pode
                receber classe de translate ou scale.

                ⚠️ E a ORDEM importa: `translate3d` antes de `rotate`/`scale` aplica a
                escala e o giro primeiro, e o deslocamento depois em px não escalados.
                Invertida, o deslocamento viria multiplicado. Registrado em 19/08. */}
            <div
              className="order-1 flex justify-center lg:order-2"
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
                <Aparelho data={data} revelado={v.entraCelular} />
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
function Aparelho({ data, revelado }: { data: ChamadaCinematicaContent; revelado: number }) {
  return (
    <div
      aria-hidden="true"
      /* ⚠️ A ALTURA SAI DA JANELA e não de um px cravado, e o motivo foi MEDIDO: com
         640px fixos o aparelho passava POR TRÁS da pílula de navegação numa tela de
         1440x800 (folga de -18px) embora coubesse folgado em 1440x900. Quem manda é a
         ALTURA da janela, e um número em px não sabe disso — é o defeito que ele
         reportou em 24/09 ("ele passa do tamanho da seção de navegação ali").

         O teto de 470px é o tamanho da PRIMEIRA versão desta peça, e foi um vaivém:
         nasceu em 470, subiu para 640 a pedido ("aumente o tamanho do celular"), caiu
         para 384 no mesmo dia ("diminuir em 40%") e voltou para 470 logo depois ("faça
         o celular da primeira versão, agora tá minúsculo"). Ficou aqui.

         O `56vh` é o que protege a tela baixa: abaixo de ~840px de janela ele passa a
         mandar, e o aparelho encolhe sozinho em vez de invadir o menu. É essa regra,
         e não o número do teto, que resolve o defeito que ele reportou com print.

         ⚠️ O TETO É MENOR NO CELULAR (420px), e isso é medição e não descuido: ali o
         aparelho e o texto ficam na MESMA coluna dentro do cartão, então a altura dele
         empurra o botão do WhatsApp para fora. Medido em 390px: a 470 a folga do cartão
         vira -31px e o botão sai; a 420 ele fica dentro. No desktop os dois ficam lado
         a lado e a altura do cartão não depende do aparelho, então o teto pode ser maior.

         A proporção vem do `aspectRatio`, então a largura acompanha e a tela nunca
         deforma. 232/420 é a do aparelho real. */
      style={{ height: "min(56vh, var(--aparelho-teto))", aspectRatio: "232 / 420" }}
      className="relative w-auto shrink-0 rounded-[2.4rem] border border-white/10 bg-[#0d1210] p-2 shadow-[0_30px_70px_-20px_oklch(0_0_0/0.8),inset_0_1px_2px_oklch(1_0_0/0.14)] [--aparelho-teto:420px] md:[--aparelho-teto:470px]"
    >
      {/* Ilha do alto-falante */}
      <div className="absolute left-1/2 top-3 z-20 h-5 w-[74px] -translate-x-1/2 rounded-full bg-black" />

      <div className="flex h-full w-full flex-col overflow-hidden rounded-[2rem] bg-[#0b141a]">
        {/* Barra do contato */}
        <div className="flex items-center gap-2.5 border-b border-white/5 bg-[#1f2c34] px-3 pb-2.5 pt-9">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15">
            <IconeWhatsApp className="h-4 w-4 text-[#25D366]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-small font-medium text-white">{data.contatoNome}</p>
            <p className="truncate text-[11px] leading-tight text-white/45">{data.contatoStatus}</p>
          </div>
        </div>

        {/* Conversa */}
        <div className="flex flex-1 flex-col gap-2 px-3 py-4">
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
                    "max-w-[86%] rounded-xl px-2.5 py-1.5",
                    /* Verde do WhatsApp, na cor REAL: recolorir marca de terceiro
                       para casar com a paleta é adulterá-la (30/07). */
                    doCliente
                      ? "rounded-br-sm bg-[#005c4b] text-white"
                      : "rounded-bl-sm bg-[#1f2c34] text-white",
                  )}
                >
                  <p className="text-[11px] leading-[1.45]">{balao.texto}</p>
                  <p className="mt-0.5 text-right text-[9px] leading-none text-white/40">
                    {balao.hora}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campo de digitação, só como moldura do aplicativo */}
        <div className="flex items-center gap-2 px-3 pb-4">
          <div className="h-8 flex-1 rounded-full bg-[#1f2c34]" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
