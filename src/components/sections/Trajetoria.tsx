import type { TrajetoriaContent } from "@/content/types";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeader } from "./Section";

/**
 * Trajetória do responsável técnico, em TRILHO VERTICAL com marcos.
 *
 * ⚠️ ANATOMIA NOVA, e é o requisito mais duro desta seção. A tabela do
 * CLAUDE.md §5.2 lista onze anatomias e nenhuma é linha do tempo: grade de
 * cartões uniforme, esteira, pilha arrastável e accordion já estão ocupadas, e
 * repetir qualquer uma aqui é exatamente o que reprovou o layout como "cara de
 * IA" em 25/07, quando seis de treze seções eram o mesmo componente.
 *
 * ⚠️ O que NÃO pode voltar por aqui, e já foi removido do site inteiro:
 * cartão com fundo e sombra próprios, rótulo em maiúscula com tracking largo,
 * pill de tag, e mais de uma chamada de agendamento por seção. Esta seção não
 * tem chamada nenhuma — ela é prova, e a conversão vive no header fixo.
 *
 * Seção CLARA de propósito. A Bio, logo acima, é faixa escura sangrada; duas
 * faixas escuras em contato deixam dois cantos de raio 24px encostados, que é o
 * defeito pago em 13/08, 15/09 e 25/09. Sendo clara, ela participa do ritmo de
 * `--section-py` e o vão vem de graça.
 *
 * UM layout só para todas as larguras: o trilho fica à esquerda e o texto
 * pendura nele, do celular ao desktop. Duas versões do mesmo conteúdo foi o que
 * deixou o recorte extremo da foto do hero passar em 12/08, e o que obrigou a
 * órbita a existir em duas formas em 13/08.
 */
export function Trajetoria({ data }: { data: TrajetoriaContent }) {
  return (
    <Section id="trajetoria">
      <SectionHeader titulo={data.titulo} descricao={data.descricao} />

      <ol className="mt-12 md:mt-16">
        {data.marcos.map((marco, i) => {
          const ultimo = i === data.marcos.length - 1;
          return (
            <li key={marco.etapa + marco.titulo} className="relative pb-9 pl-9 last:pb-0 md:pb-11 md:pl-12">
              {/* O FIO E A MARCA ficam FORA do `Reveal`: o trilho é estrutura e
                  precisa estar inteiro desde o primeiro quadro. Dentro da
                  animação ele entraria com `translate-y-4`, e o fio apareceria
                  partido entre um marco e o seguinte enquanto a página rola. */}
              {ultimo ? null : (
                /* Segmento de fio até a marca do próximo item. Os segmentos se
                   encostam, então lê como um fio só. Desenhar um fio único no
                   `<ol>` exigiria saber a altura do último item em CSS, que não
                   é possível sem medir em runtime.
                   Contraste: é DIVISOR, e decoração é isenta da regra de não
                   texto da WCAG. Um fio a 3:1 seria um traço preto atravessando
                   a seção.
                   ⚠️ `-bottom-3.5` e NÃO `bottom-0`, e o número é medido: com o
                   fio parando na borda do `li`, sobrava um vão de 7px até a
                   marca seguinte e o trilho lia como linha tracejada. Os 14px
                   levam o fio até o CENTRO da próxima marca, que é desenhada
                   depois dele no DOM e portanto o cobre. */
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-5 -bottom-3.5 w-px bg-accent/25"
                />
              )}
              <span
                aria-hidden="true"
                className={
                  ultimo
                    ? "absolute left-0 top-[6px] block h-[15px] w-[15px] rounded-full border-2 border-accent bg-accent"
                    : "absolute left-0 top-[6px] block h-[15px] w-[15px] rounded-full border-2 border-accent/45 bg-background"
                }
              />

              <Reveal delay={i * 70}>
                {/* ⚠️ `text-small` em elemento SEM classe de cor, e a cor vai no
                    elemento de fora. O `cn()` não conhece esse token do projeto,
                    classifica como cor de texto, e `text-accent` na mesma
                    mesclagem o descarta em silêncio — o elemento renderiza a
                    16px e a classe nem chega ao DOM. Custou uma rodada em 19/08.
                    Aqui a className é string simples, mas a regra fica anotada
                    para quem vier envolver isto num `cn()`.
                    E sem caixa alta com tracking largo: é o rótulo que saiu do
                    site inteiro em 03/08. */}
                <p className="text-accent">
                  <span className="text-small">
                    {marco.ano ? `${marco.ano} · ${marco.etapa}` : marco.etapa}
                  </span>
                </p>

                <h3 className="display-3 mt-2 text-foreground">{marco.titulo}</h3>

                {marco.instituicao ? (
                  /* Instituição em `--foreground`, NÃO em `--muted`, e é o
                     ponto da seção: ILAPEO, ABO-PR, APCD Bauru e PUC-PR são o
                     sinal de autoridade, e em cinza secundário liam mais fracas
                     que a palavra genérica do título logo acima. A descrição
                     fica no secundário e a hierarquia se inverte na direção
                     certa. */
                  <p className="mt-1 text-base font-medium text-foreground">{marco.instituicao}</p>
                ) : null}

                {/* Largura em `rem` e não em `ch`: `ch` resolve contra a fonte do
                    próprio elemento, e a armadilha já custou cinco rodadas
                    (12/08, 14/08, 18/09). */}
                <p className="mt-3 max-w-[44rem] text-base text-muted">{marco.descricao}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
