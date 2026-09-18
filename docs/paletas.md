# Três direções de paleta — proposta

Três sistemas de cor **completos e distintos entre si**, cada um preenchendo os mesmos
slots de token, aplicados no site real e medidos. Nada aqui está em vigor: a paleta
publicada continua sendo a verde + branco de 30/07.

- Os valores: `docs/paletas/a-grafite.css`, `b-areia.css`, `c-noturno.css`
- O render: `scripts/comparar-paletas.mjs`
- As telas e a tabela de contraste: `snapshots/paletas/` (gitignored, gerar com o script)

**Como gerar de novo**

```bash
bunx vite dev --host 127.0.0.1 --port 4182 &
node scripts/comparar-paletas.mjs
```

**Como adotar uma delas:** o bloco `:root` do arquivo escolhido substitui o `:root` do
`src/styles.css`. As quatro linhas de `.paleta-X img` viram regra normal (sem o prefixo).
Nenhum componente muda — **exceto na C**, ver §5.

---

## 1. Por que três direções e não três tons

O pedido foi explícito em não entregar variações do mesmo caminho. As três mudam em eixos
diferentes, não em matiz:

| | Campo | Blocos escuros | Cor de ação | Ornamento | Forma |
|---|---|---|---|---|---|
| **Atual** | branco tingido de verde | verde-petróleo | petróleo médio | dourado | raio 22px |
| **A — Grafite** | neutro de verdade | **grafite**, sem cor | petróleo (único croma) | **nenhum** | raio 10px, fio |
| **B — Areia** | **areia quente** | **marrom de madeira** | **terracota** | bronze | raio 24px, sombra |
| **C — Noturno** | **petróleo (a página toda)** | mais fundos que a página | **petróleo claro** | dourado **promovido a texto** | raio 16px, fio claro |

A herança também difere, e isso importa na hora de decidir: **A preserva o verde da Suzuki**
(só muda o papel dele), **B abandona o verde** e assume a madeira das fotos da clínica como
identidade, **C leva o verde ao extremo** e faz dele o ambiente inteiro.

---

## 2. A — Grafite + um sinal

**A ideia.** Hoje o verde está em toda parte: fundo tingido, texto, bordas, blocos. Ele vira
ambiente e, por estar em tudo, não sinaliza nada. Aqui o campo é grafite neutro e o verde só
aparece onde há ação ou hierarquia — ganha força por ser raro. Sem dourado em lugar nenhum.

**Escolher se** a clínica quer ler como técnica e precisa, e o verde é inegociável.
**Não escolher se** o site precisa parecer acolhedor: sem nenhuma nota quente, a página é severa.

| Papel | Token | Valor |
|---|---|---|
| Fundo da página | `--background` | `oklch(0.982 0.002 200)` |
| Texto | `--foreground` | `oklch(0.190 0.008 200)` |
| Texto secundário | `--muted` | `oklch(0.468 0.010 200)` |
| Cartão | `--surface` / `--surface-raised` | `oklch(1 0 0)` / `oklch(0.957 0.003 200)` |
| Bloco escuro | `--ink` / `--ink-elevated` | `oklch(0.175 0.009 200)` / `oklch(0.238 0.010 200)` |
| Texto no bloco | `--ink-foreground` / `--ink-muted` | `oklch(0.980 0.002 200)` / `oklch(0.726 0.008 200)` |
| **Cor principal** | `--accent` | `oklch(0.44 0.085 196)` — o petróleo da Suzuki |
| **Destaque** | `--gold` | `oklch(0.760 0.070 194)` — o próprio verde clareado, não ouro |
| Divisor | `--border` | `oklch(0.190 0.008 200 / 0.18)` |
| Contorno de controle | `--border-strong` | `oklch(0.190 0.008 200 / 0.48)` |

**Botões.** Escuro: `--ink` → hover `--ink-elevated`. Claro: `--surface` → hover `--surface-raised`.
Desabilitado: fundo `oklch(0.928 0.003 200)`, texto `oklch(0.505 0.008 200)`, fio a 10%.

**Imagem.** Raio 8px, fio de contenção, **zero sombra**. A foto entra como documento, não
como objeto pousado.

---

## 3. B — Areia + bronze

**A ideia.** Em 30/07 as 12 fotos da clínica foram quantizadas e o consultório é **madeira mel
+ granito + parede branca**. A paleta em vigor pegou o verde do site antigo e deixou a madeira
como ornamento. Esta faz o inverso: a madeira vira o ambiente, e o verde sai de cena.

**Escolher se** a marca vai ser refeita junto e a clínica quer ler como acolhedora — é a mais
próxima de hotelaria de alto padrão.
**Não escolher se** o verde-petróleo é inegociável: esta é a única das três que não o cita.

| Papel | Token | Valor |
|---|---|---|
| Fundo da página | `--background` | `oklch(0.963 0.013 79)` |
| Texto | `--foreground` | `oklch(0.243 0.026 58)` |
| Texto secundário | `--muted` | `oklch(0.492 0.026 62)` |
| Cartão | `--surface` / `--surface-raised` | `oklch(0.991 0.006 82)` / `oklch(0.940 0.018 77)` |
| Bloco escuro | `--ink` / `--ink-elevated` | `oklch(0.228 0.030 54)` / `oklch(0.292 0.035 54)` |
| Texto no bloco | `--ink-foreground` / `--ink-muted` | `oklch(0.976 0.011 84)` / `oklch(0.748 0.022 76)` |
| **Cor principal** | `--accent` | `oklch(0.46 0.098 46)` — terracota queimada |
| **Destaque** | `--gold` | `oklch(0.800 0.128 77)` — bronze, **só sobre escuro** |
| Divisor | `--border` | `oklch(0.243 0.026 58 / 0.15)` |
| Contorno de controle | `--border-strong` | `oklch(0.243 0.026 58 / 0.53)` |

**Botões.** Mesma mecânica. Desabilitado: fundo `oklch(0.906 0.014 77)`, texto
`oklch(0.487 0.020 62)`, fio a 9%.

**Imagem.** Raio 20px, sem fio, **sombra baixa e quente** — sombra cinza sobre areia lê como
sujeira. A foto é objeto pousado na página.

---

## 4. C — Noturno

**A ideia.** A página inteira no petróleo, e o branco vira exceção. Inverte a estrutura atual:
hoje o claro carrega a leitura e o escuro entra em blocos; aqui o escuro é o ambiente. O
dourado é promovido — sobre campo escuro ele finalmente pode ser texto e número, e não só
ornamento.

**Escolher se** a prioridade é presença e as fotos clínicas: imagem sobre campo escuro lê como
iluminada, e é a única das três em que elas ganham peso de verdade.
**Não escolher se** o site precisa entrar no ar rápido — ver o custo abaixo.

| Papel | Token | Valor |
|---|---|---|
| Fundo da página | `--background` | `oklch(0.178 0.028 197)` |
| Texto | `--foreground` | `oklch(0.966 0.006 190)` |
| Texto secundário | `--muted` | `oklch(0.722 0.020 194)` |
| Cartão | `--surface` / `--surface-raised` | `oklch(0.222 0.032 197)` / `oklch(0.262 0.034 197)` |
| Bloco escuro | `--ink` / `--ink-elevated` | `oklch(0.128 0.024 197)` / `oklch(0.196 0.030 197)` |
| **Cor principal** | `--accent` | `oklch(0.740 0.090 190)` — **invertido de 0.44 para 0.74** |
| **Destaque** | `--gold` | `oklch(0.822 0.140 84)` — aqui pode ser texto |
| Divisor | `--border` | `oklch(1 0 0 / 0.14)` — derivado do TEXTO, não do fundo |
| Contorno de controle | `--border-strong` | `oklch(1 0 0 / 0.36)` |

⚠️ **O accent inverte de luminosidade e isso não é gosto.** É a lição de 24/07: o mesmo token
serve de texto pequeno **e** de fundo de botão. Num campo escuro ele precisa ser claro pelos
dois lados — escurecê-lo quebraria o texto.

**Botões.** Desabilitado sobre campo escuro é **menos luz**, não mais cinza: fundo
`oklch(0.262 0.020 197)`, texto `oklch(0.645 0.014 197)`. Cinza médio sobre petróleo continua
chamando atenção.

**Imagem.** Raio 16px, fio claro de 1px, **nenhuma sombra** — sombra sobre campo escuro é
invisível por definição. O que separa a foto do fundo é a luz dela.

---

## 5. O custo da C, medido

A promessa "trocar de clínica = trocar token" vale para mudar de matiz, **não para inverter
claro/escuro** — decisão de 30/07, e esta rodada confirmou por medição:

| O que quebra | Medido | Conserto |
|---|---|---|
| `PillButton` sem `tone` (o "Ver a clínica inteira", em `Estrutura.tsx`) fica `--ink` sobre `--background` | **1,07:1** — botão invisível | passar `tone="light"` ali, ou inverter o padrão do primitivo |
| `brand.logoEscuro` no cartão de avaliações (`index.tsx:132`) cai sobre superfície de luminância **0,006** | logo escuro em cartão preto: some | trocar para `brand.logo` (a versão branca) |
| `color-scheme` | já tratado no arquivo (`dark`) | — |

São duas linhas de componente. **As paletas A e B não custam nenhuma.**

---

## 6. Contraste medido

Rasterizado (pintar no canvas e ler o pixel), porque `getComputedStyle` devolve a string
`oklch(...)` e lê-la como RGB dá cor inventada. Cor com alfa é composta sobre o fundo real
antes de medir. Alvos: **4,5:1** texto normal, **3:1** não-texto.

| Verificação | Atual | A | B | C |
|---|---|---|---|---|
| Texto na página | 14,99 | 17,47 | 14,74 | 17,02 |
| Texto secundário na página | 5,55 | 6,51 | 5,61 | 7,67 |
| Texto no cartão | 15,63 | 18,42 | 16,01 | 15,44 |
| Texto no bloco escuro | 16,69 | 17,89 | 15,90 | 18,58 |
| Texto secundário no bloco | 7,54 | 7,82 | 7,59 | 7,64 |
| Accent como ícone na página | 7,08 | 6,99 | 6,66 | 8,44 |
| Texto sobre o accent | 7,19 | 7,16 | 7,11 | 8,67 |
| Dourado sobre o bloco escuro | 9,21 | 9,10 | 8,95 | 11,47 |
| Botão: rótulo (normal) | 16,69 | 17,89 | 15,90 | 18,58 |
| Botão: rótulo (hover) | 14,22 | 15,65 | 13,23 | 16,76 |
| **Botão: rótulo (desabilitado)** | **não existe** | **4,75** | **4,83** | **4,63** |
| **Contorno de botão sem fundo** | **1,63 ❌** | **3,22 ✅** | **3,42 ✅** | **3,29 ✅** |

**Dourado sobre a página**: 1,81 / 1,97 / 1,70 nas paletas de campo claro — é o resultado
CERTO, e o teste existe para flagrar o dia em que alguém puser dourado como texto no claro.
Na C dá 10,69, e ali é legítimo: todo fundo é escuro.

**Divisores** (`--border`, `--ink-border`) ficam entre 1,3 e 1,5 nas quatro. A WCAG 1.4.11
isenta decoração, e um divisor a 3:1 seria um traço preto que destruiria as quatro direções.
O número está no relatório para comparar as paletas entre si, não como aprovação.

### O que a medição achou no site ATUAL

Dois achados que não são das propostas — são de hoje:

1. **O contorno das setas da galeria reprova: 1,63:1, contra 3:1 exigido.** Aquelas setas são
   botão sem fundo, então o fio é a única fronteira do controle e a regra de não-texto vale.
   As três paletas novas corrigem; a atual corrige subindo `--border-strong` para ~0,45 de alfa.
2. **Não existe estado desabilitado no projeto.** Nenhum botão do site está desabilitado hoje,
   então nunca fez falta — mas o sistema de cor estava incompleto. As três propostas trazem os
   três tokens (`--disabled-surface`, `--disabled-foreground`, `--disabled-border`).

---

## 7. Ressalvas honestas

- **A tipografia dos screenshots não é a do site.** O navegador deste ambiente não alcança o
  Google Fonts, então todo render sai na fonte de reserva do sistema, não na Instrument Sans.
  Isso não afeta cor nem contraste; afeta o "ar" das telas.
- **As quatro telas capturadas** (hero, casos, áreas, bio) cobrem os quatro contextos de cor do
  site: bloco escuro sangrado, página clara com foto, painel escuro dentro de seção clara e
  faixa escura com retratos. Uma paleta que funciona nos quatro funciona no site inteiro.
- **Nenhuma das três foi otimizada para as fotos existentes.** As 12 fotos de estrutura são
  madeira mel + granito + parede branca — isso favorece a B por construção e é uma vantagem
  dela, não um empate.
