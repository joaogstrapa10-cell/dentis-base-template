import type { BioContent } from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { CorpoClinicoEsteira } from "@/components/sections/CorpoClinicoEsteira";

/**
 * Estrutura: FAIXA ESCURA de largura cheia. Em cima, retrato grande do
 * responsável à esquerda e texto corrido à direita. Embaixo, o corpo clínico
 * como ESTEIRA de retratos em laço (`CorpoClinicoEsteira.tsx`).
 *
 * É o contraponto de ritmo da página: depois de uma sequência de seções claras,
 * uma faixa escura funciona como respiro e reancora a atenção. Não usa o
 * cabeçalho padrão das outras seções — aqui o nome do responsável É o título.
 *
 * O corpo clínico era OITO CARTÕES iguais, cada um com borda, fundo próprio e um
 * retrato circular de 48px ao lado do nome. Dois defeitos, e os dois estão
 * nomeados no diagnóstico de densidade:
 *
 * - Grade de cartões uniforme é exatamente o molde que fez o layout ser reprovado
 *   como "cara de IA" três vezes, e a única seção que ainda o usava era esta.
 * - Retrato de 48px não é retrato, é ícone. Das 32 fotos da página, 28 apareciam
 *   abaixo de 15% da largura da tela — e as oito daqui eram as menores de todas.
 *
 * Os nove retratos (os oito do corpo clínico mais o do responsável) são fotos de
 * estúdio do mesmo ensaio: mesmo fundo creme, mesmo uniforme, mesma proporção
 * 3:4. Isso é o que faz a série funcionar sobre o bloco escuro — nove campos
 * claros de tom idêntico leem como conjunto, não como remendo. É também o que
 * permite que a esteira exiba todos em 3:4 sem recortar nada: o enquadramento do
 * ensaio já é o certo. O retrato do responsável fica maior e à parte, porque ali
 * a foto é o argumento e não um item de série.
 */

/** Retrato real quando `src` existe; slot rotulado enquanto não existe. */
function Retrato({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`overflow-hidden rounded-2xl border border-ink-border object-cover ${className ?? ""}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`slot-grid-ink flex items-end overflow-hidden rounded-2xl border border-ink-border bg-ink-elevated p-3 ${className ?? ""}`}
    >
      {/* Maiúscula e tracking removidos: era o último resto do vocabulário de
          rótulo pequeno que saiu de todas as outras seções. */}
      <span className="rounded-md border border-ink-border bg-ink/95 px-2 py-1 text-small text-ink-muted lg:backdrop-blur">
        {alt}
      </span>
    </div>
  );
}

export function BioSection({ data }: { data: BioContent }) {
  return (
    /* ⚠️ O `pt` NÃO É RESPIRO, é a separação de duas faixas escuras. Desde 25/09
       esta seção vem logo DEPOIS DO HERO, que também é bloco escuro sangrado, e
       nenhuma das duas participa do ritmo de `--section-py` — então sem ele os
       dois cantos arredondados ficam encostados e o fio claro entre eles lê como
       risco no meio de um bloco só. É o mesmo defeito pago em 13/08 (chamada x
       rodapé) e de novo em 15/09 (chamada x Bio). O valor é o DOBRO da goteira
       lateral: igual à goteira viraria um fio, e no ritmo de seção sobraria mais
       branco do que a separação entre duas superfícies precisa.
       ⚠️ Se esta seção mudar de lugar, remedir quem passa a vir antes. */
    <section id="responsavel" className="scroll-mt-12 px-3 pt-6 md:px-4 md:pt-8">
      {/* ⚠️ SEM `overflow-hidden`, e é requisito da órbita, não descuido: o palco
          dela é `position: sticky`, e um ancestral com `overflow` diferente de
          `visible` vira o contêiner de rolagem do sticky — que não rola, então o
          elemento simplesmente não gruda. Estava aqui por cópia do padrão dos
          outros blocos escuros; medido depois de tirar, nada transborda o canto
          arredondado. Ao acrescentar peça que sangre neste bloco, recortar nela e
          não aqui. */}
      <div className="relative isolate rounded-3xl bg-ink">
        {/* Padding PRÓPRIO, menor que o `--section-py` da página (160px em
            desktop), e a diferença é conceitual: `--section-py` é o espaço ENTRE
            seções que dividem o mesmo fundo, onde o vão é a própria separação.
            Dentro de uma faixa escura a separação já é a borda do bloco, e os
            160px viravam ~200px de verde vazio acima do nome — foi o "espaço
            sobrando" que o usuário apontou em 12/08. Os 96px daqui leem como
            respiro do bloco, não como falha de alinhamento.

            O container repete a largura e o `px` do `Section` de propósito: o
            conteúdo do bloco tem de alinhar com o das seções claras vizinhas. */}
        <div className="mx-auto w-full max-w-[1200px] px-5 py-14 md:px-10 md:py-24">
          <div className="relative z-10">
            {/* ⚠️ TEMPLATE EDITORIAL, mandado pelo usuário em 25/09 ("preciso mudar
                esse layout, não estou gostando, quero fazer nesse sentido"): retrato
                de um lado, e o bloco de informação SOBREPONDO a borda dele, com o
                nome em tipo gigante e fino e o sobrenome um grau mais cheio.

                DUAS COISAS DELE FICARAM FORA, as duas a pedido: o botão redondo de
                seta e o rótulo de cargo ("Backend Engineer"). O rótulo não virou
                outra coisa no mesmo lugar — quem carrega a identificação é o par
                nome + CRO, e ele está logo abaixo do nome, que é onde a
                CFO-196/2019 exige os dois juntos.

                ⚠️ E O `framer-motion` DO TEMPLATE NÃO ENTROU. O projeto não tem
                dependência de animação, e o motivo é duro: essas bibliotecas
                escrevem a propriedade `transform`, o Tailwind v4 escreve
                `translate`/`scale`/`rotate` SEPARADAS, e misturar as duas famílias
                no mesmo elemento faz uma apagar a outra sem erro nenhum. A entrada
                é o `Reveal` que o site inteiro já usa. Mesma decisão do GSAP em
                19/08 e do `motion/react` em 19/08. */}
            <div className="lg:flex lg:items-center">
              {/* O RETRATO. `aspect-[3/4]` é a proporção NATIVA do arquivo
                  (300x400), então o recorte é zero — o template pede 360x500, que
                  é 0,72, e forçar o arquivo nele cortaria de lado. */}
              <Reveal className="relative w-full max-w-[20rem] shrink-0 sm:max-w-[22rem] lg:max-w-none lg:w-[22rem]">
                <Retrato
                  src={data.retrato}
                  alt={data.retratoAlt}
                  className="aspect-[3/4] w-full"
                />
                {/* ⚠️ O VÉU É REQUISITO DA SOBREPOSIÇÃO, não enfeite. No template o
                    bloco de texto cruza a borda da foto por ~32px, e lá o texto é
                    ESCURO sobre página clara. Aqui ele é claro sobre um bloco
                    escuro, e a foto do Dalton é de estúdio com fundo CREME: texto
                    claro cruzando creme simplesmente desaparece. O véu leva a borda
                    direita da foto ao `--ink` da faixa, então o nome atravessa
                    campo escuro. Só de `lg` para cima, que é onde há sobreposição. */}
                <span
                  aria-hidden="true"
                  style={{
                    /* Desce apagando: forte onde o NOME cruza (o topo da foto, que
                       ali é só o fundo creme do estúdio) e ausente na altura do
                       rosto e do corpo. Sem isso o véu enevoa o retrato inteiro,
                       que foi o primeiro render desta rodada. */
                    maskImage: "linear-gradient(to bottom, #000 0%, #000 22%, transparent 48%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 0%, #000 22%, transparent 48%)",
                  }}
                  className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 rounded-r-2xl bg-gradient-to-l from-ink via-ink/90 to-transparent lg:block"
                />
              </Reveal>

              {/* O BLOCO DE INFORMAÇÃO, sobrepondo a foto. A margem negativa é o
                  gesto do template; abaixo de `lg` ela some e as duas peças
                  empilham, porque numa coluna de 350px não há o que sobrepor. */}
              <Reveal
                delay={120}
                className="relative z-20 mt-10 lg:-ml-16 lg:mt-0 lg:min-w-0 lg:flex-1"
              >
                <h2 className="display-1-leve text-ink-foreground">
                  {data.nomeLinha1}
                  <br />
                  <span className="forte">{data.nomeLinha2}</span>
                </h2>
                <p className="mt-4 text-base text-ink-muted">{data.credencial}</p>

                {/* ⚠️ O RECUO É O QUE FAZ SÓ O NOME SOBREPOR. No template o corpo do texto
                    é empurrado para a direita pelo botão redondo de seta; tirando o
                    botão a pedido dele, o texto caiu para a borda do bloco e passou a
                    cruzar a foto inteira, com as linhas correndo por cima do rosto.
                    O `pl` devolve esse empurrão sem devolver o botão. */}
                <p className="mt-10 max-w-[56ch] text-base leading-[1.8] text-ink-foreground/85 lg:pl-20">
                  {data.corpo}
                </p>

                <ul className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:pl-20">
                  {data.titulacao.map((t) => (
                    <li
                      key={t}
                      className="border-t border-ink-border pt-3 text-base text-ink-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Corpo clínico. O fio acima substitui as bordas dos cartões que
                saíram: sem ele as duas metades do bloco encostam sem transição.

                UMA FORMA SÓ, para todas as larguras, desde 14/08: a esteira de
                retratos que o usuário pediu. Antes eram duas — órbita aberta por
                rolagem em `lg`+ e grade abaixo dela —, e manter duas formas do
                mesmo conteúdo foi o que deixou recorte extremo passar sem ser
                visto em 12/08. Ver `CorpoClinicoEsteira.tsx`. */}
            <div className="mt-20 border-t border-ink-border pt-12">
              <Reveal>
                <CorpoClinicoEsteira
                  membros={data.corpoClinicoMembros}
                  label={data.corpoClinicoLabel}
                  nota={data.corpoClinicoNota}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
