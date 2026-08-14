import type { BioMembro } from "@/content/types";

/**
 * Corpo clínico: ESTEIRA de retratos em laço, com nome e especialidade num
 * painel dentro do próprio cartão.
 *
 * Do template que o usuário trouxe em 14/08 entrou só o que ele pediu: o
 * carrossel, o cartão em retrato e o painel de identificação ancorado embaixo da
 * foto. Ficaram de fora o cabeçalho com o ícone em quadrado azul, os rabiscos em
 * SVG e o depoimento no rodapé do bloco — nenhum dos três é corpo clínico, e os
 * dois primeiros reintroduziriam vocabulário que saiu da página em 03/08.
 *
 * É a TERCEIRA esteira do site (Estrutura e Depoimentos são as outras duas), e
 * isso é escolha do usuário, registrada: aqui o gesto se justifica porque os
 * nove retratos são do mesmo ensaio de estúdio e passam como série. Se aparecer
 * pedido de uma quarta, vale a mesma conversa que travou a `GradeDeCelulas`.
 *
 * O que esta forma resolve em relação à órbita que ela substitui:
 * - o retrato passa de 188px (o que a órbita comportava em 1440) para 288px, o
 *   maior que o corpo clínico já teve — a auditoria de densidade de 03/08 mediu
 *   28 das 32 fotos do site abaixo de 15% da largura da tela;
 * - uma forma só para todas as larguras, em vez de órbita em `lg`+ e grade
 *   abaixo. Duas formas para o mesmo conteúdo era o que fazia um recorte extremo
 *   passar despercebido no desenvolvimento;
 * - a seção deixa de precisar de um trilho de 190vh. A página encolhe ~810px.
 *
 * Acessibilidade, os mesmos três cuidados da esteira de Estrutura:
 * - pausa no hover e no foco de teclado;
 * - a cópia que fecha o laço é `aria-hidden`, para o leitor de tela não anunciar
 *   o corpo clínico duas vezes;
 * - sob `prefers-reduced-motion` a faixa PARA (regra global no `styles.css`) e
 *   passa a rolar na mão — sem isso, parada dentro de `overflow-hidden`, os
 *   últimos profissionais ficariam inalcançáveis.
 */

/** Cartão: retrato ocupando a caixa inteira e o painel de identificação por
 *  cima, ancorado embaixo. */
function CartaoMembro({ m }: { m: BioMembro }) {
  return (
    <div className="group relative aspect-[3/4] w-60 shrink-0 overflow-hidden rounded-2xl border border-ink-border bg-ink-elevated md:w-72">
      {m.retrato ? (
        <img
          src={m.retrato}
          alt={m.retratoAlt}
          loading="lazy"
          /* `aspect-[3/4]` é a proporção NATIVA dos arquivos, então o recorte é
             zero — o enquadramento do ensaio já é o certo e não há o que
             reposicionar.

             Cinza que vira cor no hover, como no template. Só onde existe
             ponteiro (`@media (hover:hover)`): no celular não há como acender a
             foto, e nove retratos permanentemente em cinza deixariam o corpo
             clínico em preto e branco para quem entra pelo telefone — que é a
             maioria. */
          className="h-full w-full object-cover transition-[filter] duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
        />
      ) : (
        <div
          role="img"
          aria-label={m.retratoAlt}
          className="slot-grid-ink absolute inset-0"
        />
      )}

      {/* Painel ESCURO, não claro como no template: as fotos são de estúdio com
          fundo creme, e um painel claro sobre elas some. Este é o mesmo
          vocabulário do rótulo de slot usado no resto do site. */}
      <div className="absolute inset-x-2 bottom-2 rounded-xl border border-ink-border bg-ink/85 px-4 py-3 backdrop-blur">
        <p className="text-base font-medium leading-[1.2] text-ink-foreground">
          {m.nome}
        </p>
        {/* O CRO não é exibido desde 13/08, a pedido do usuário: só a
            especialidade. O dado segue em `m.cro` — ver a nota do tipo
            `BioMembro`, que explica por que ele não foi apagado. */}
        <p className="mt-1 text-small leading-[1.35] text-ink-muted">
          {m.especialidade}
        </p>
      </div>
    </div>
  );
}

export function CorpoClinicoEsteira({
  membros,
  label,
  nota,
}: {
  membros: BioMembro[];
  label: string;
  nota: string;
}) {
  // Duplicada: a faixa desliza 50% e a emenda cai sobre uma cópia idêntica.
  const faixa = [...membros, ...membros];

  return (
    <div>
      <div className="max-w-[52ch]">
        <p className="display-3 text-ink-foreground">{label}</p>
        <p className="mt-3 text-base leading-[1.6] text-ink-muted">{nota}</p>
      </div>

      {/* Sangra até as bordas do bloco escuro (`-mx-5 md:-mx-10` desfaz o `px` do
          container da Bio): esteira que começa e termina alinhada com o texto lê
          como carrossel dentro de uma caixa, e o laço perde o sentido.

          `motion-reduce:overflow-x-auto` é o par obrigatório da regra global que
          congela a animação: parada, a faixa continuaria cortada pelo overflow. */}
      <div className="esteira-pausa esteira-mask -mx-5 mt-10 overflow-hidden motion-reduce:overflow-x-auto md:-mx-10 md:mt-12">
        <ul
          className="esteira flex gap-4 px-5 md:px-10"
          /* 40s para ~152rem de faixa, ou ~61px/s: metade da velocidade da
             esteira de Estrutura. Lá passam ambientes, aqui passam nomes — e
             nome que passa rápido demais não chega a ser lido. */
          style={{ animationDuration: "40s" }}
        >
          {faixa.map((m, i) => {
            const duplicado = i >= membros.length;
            return (
              <li key={`${m.nome}-${i}`} aria-hidden={duplicado || undefined}>
                <CartaoMembro m={m} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
