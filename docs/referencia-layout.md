# Referência de layout — especificação

**Fonte:** `https://productized-agency-template-acetern.vercel.app/`
**Status:** ⚠️ **extração não realizada** — host bloqueado pela network policy do ambiente
(403 no CONNECT). Ver `CLAUDE.md` §7.

Legenda de proveniência:
- `[USER]` = fornecido pelo usuário nas instruções → **ground truth**
- `[PROPOSTA]` = definido por Claude para não bloquear a Fase 1 → **precisa de aprovação ou
  de substituição por extração real**

---

## 1. Ordem exata das seções, de cima a baixo `[USER]`

| # | Seção na referência | Adaptação odontológica |
|---|---|---|
| 1 | Hero | Headline + subheadline + CTA |
| 2 | Barra de logos "empresas que confiam" | Selos, parcerias, formações, certificações |
| 3 | Proposta de valor / diferencial | Diferenciais da clínica |
| 4 | Mockup de acompanhamento/atualizações | Acompanhamento do tratamento do paciente |
| 5 | Mapa / presença | Localização da clínica |
| 6 | Grid de cases (card: título, descrição, tags) | Casos de tratamento |
| 7 | Depoimentos | Depoimentos de pacientes |
| 8 | Tabela comparativa | A clínica vs. atendimento odontológico tradicional |
| 9 | Planos / pricing | Tratamentos ou planos oferecidos |
| 10 | Bio | Bio do dentista/sócio |
| 11 | FAQ | FAQ |
| 12 | Footer com CTA final + colunas de navegação | Idem |

Nota: a seção 2 **se mantém mesmo sem material** — com placeholders nomeados, nunca removida.

---

## 2. Hierarquia tipográfica `[PROPOSTA]`

Duas famílias, contraste alto entre display e corpo.

| Papel | Tamanho (desktop / mobile) | Peso | Tracking | Line-height |
|---|---|---|---|---|
| Hero display | `clamp(3rem, 7vw, 5.5rem)` | 500–600 | `-0.03em` | `0.95–1.05` |
| H2 de seção | `clamp(2rem, 4vw, 3.25rem)` | 500 | `-0.02em` | `1.1` |
| H3 / título de card | `1.25–1.5rem` | 500 | `-0.01em` | `1.25` |
| Corpo | `1rem–1.125rem` | 400 | `0` | `1.6` |
| Eyebrow / badge | `0.75rem` | 500 | `+0.08em`, uppercase | `1` |
| Meta / footnote | `0.8125rem` | 400 | `0` | `1.5` |

- Display: sans geométrica/neo-grotesca de peso médio (não bold-black). Nunca serif clássica —
  isso puxa para "clínica tradicional".
- Corpo: mesma família ou grotesca neutra, em cinza-médio sobre fundo escuro (não branco puro).
- Números e preços na escala de display, para ancorar a seção de planos.

---

## 3. Paleta e superfícies `[PROPOSTA]`

Base escura, neutra-fria, com **um único** accent. Sem azul-de-consultório.

| Token | Uso | Valor sugerido |
|---|---|---|
| `--background` | fundo da página | quase-preto neutro (`~4% L`) |
| `--surface` | card, painel | +3–4% de luminosidade sobre o fundo |
| `--surface-raised` | hover de card, popover | +6–8% sobre o fundo |
| `--border` | borda de card, divisores | branco a 8–12% de opacidade |
| `--foreground` | texto principal | branco a 92% |
| `--muted` | texto secundário | branco a 55–60% |
| `--accent` | CTA, destaque, ativo | **1 cor só** — ver decisão abaixo |
| `--accent-foreground` | texto sobre accent | contraste ≥ 4.5:1 |

- Bordas fazem o trabalho de separação, **não** sombras. Sombra só em elemento flutuante.
- Superfície de card = fundo levemente elevado + borda de 1px, raio `12–16px`.
- Gradiente permitido **apenas** como glow radial suave atrás do hero e como fade de máscara
  na barra de logos. Nunca gradiente em texto de corpo nem em card.
- Accent aplicado com parcimônia: CTA primário, indicador de plano recomendado, ícone de check
  na tabela comparativa. Se aparecer em mais de ~5% da área visível, está demais.

**Decisão de accent — REVISADA em 24/07 pelo usuário `[USER]`:**

A proposta original era um accent quente (bronze/champanhe dessaturado), para afastar do
clichê clínico. **O usuário corrigiu a direção: o alvo é "estilo tech"**, como a referência.

Valores em vigor (`src/styles.css`):

| Token | Valor | Nota |
|---|---|---|
| `--background` | `oklch(0.13 0.008 265)` | preto mais fundo, neutro frio |
| `--foreground` | `oklch(0.97 0.002 265)` | contraste alto (tech), não branco a 92% |
| `--surface` | `oklch(0.17 0.009 265)` | |
| `--surface-raised` | `oklch(0.215 0.011 265)` | |
| `--border` | `oklch(1 0 0 / 0.09)` | |
| `--muted` | `oklch(0.685 0.012 265)` | |
| `--accent` | `oklch(0.74 0.165 285)` | **violeta vivo** |
| `--accent-foreground` | `oklch(0.145 0.02 285)` | texto escuro sobre o accent |
| `--radius` | `0.625rem` | 10px — mais fechado que os 14px iniciais |

Por que violeta e não azul: azul, mesmo elétrico, resvala no "azul de consultório" que a
restrição de conteúdo proíbe. Violeta lê como produto de software e não tem associação clínica.

Por que o accent é **claro** (`L 0.74`) e não escuro: ele serve simultaneamente como texto de
12px sobre fundo escuro (eyebrows) e como fundo de botão. Nessa luminosidade os dois passam
contraste com folga — um accent escuro derruba a legibilidade do eyebrow. **Não escurecer.**

Assinatura tech adicional:
- `--font-mono` aplicada só em **metadados pequenos** (eyebrow, tags, badge, números de etapa,
  labels de estado, credencial). Nunca em título, corpo, FAQ ou label de botão.
- `.tech-grid` + `.tech-grid-fade`: grid de linhas de 64px com máscara radial, atrás do glow
  do hero.

Accent segue sendo o eixo de diferenciação entre Dalton, Rogério e Décio — sugestão:
violeta / ciano / lime.

---

## 4. Grid, densidade e ritmo vertical `[PROPOSTA]`

- Container: `max-width 1200px`, padding lateral `24px` mobile / `40px` desktop.
- Grid de 12 colunas, `gap 24px`.
- **Ritmo vertical entre seções:** `py-24` mobile → `py-32` / `py-40` desktop
  (`96px → 128–160px`). Generoso e constante — é o principal responsável pela sensação de
  "alto padrão". Não variar por seção sem motivo.
- Cabeçalho de seção: eyebrow → H2 → parágrafo de apoio, largura máxima `~680px`,
  alinhado à esquerda (não centralizado) para leitura editorial.
- Cases: grid `1 / 2 / 3` colunas (mobile / tablet / desktop).
- Pricing: `1 / 3` colunas, card do meio destacado por borda em accent.
- Densidade interna de card: padding `24–32px`, espaçamento interno `12–16px`.

---

## 5. Padrões de componente `[PROPOSTA]`

**Card (case/tratamento)**
`[imagem ou ícone] → título (H3) → descrição 2–3 linhas em --muted → linha de tags`
Borda 1px `--border`; no hover, borda clareia e superfície sobe um degrau. Sem escala/zoom.

**Badge / tag**
Pill de raio total, `padding 4px 10px`, fundo `--surface-raised`, borda `--border`,
texto `0.75rem` uppercase com tracking `+0.06em` em `--muted`. Variante `accent` só para
"Recomendado" / "Mais procurado".

**CTA**
- Primário: fundo `--accent`, texto `--accent-foreground`, raio `10px`,
  altura `48px` (`56px` no hero), peso 500. Hover = leve escurecimento, sem sombra colorida.
- Secundário: `ghost` com borda `--border`, texto `--foreground`.
- Setinha `ArrowRight` (lucide) opcional à direita, deslocando `2px` no hover.
- Máximo **um** CTA primário por dobra.

**Tabela comparativa**
Duas colunas de valor (`A clínica` × `Tradicional`); coluna da clínica com fundo `--surface` e
borda em accent; ícones `Check` (accent) × `X`/`Minus` (`--muted`). Linhas separadas por
`--border`, sem zebra.

**FAQ**
Accordion (shadcn `Accordion`), um item aberto por vez, divisor `--border` entre itens,
chevron rotacionando. Sem card por pergunta.

---

## 6. Animação e scroll reveal `[PROPOSTA]`

- **Intensidade: baixa.** Fade + translate-Y de `12–16px`, duração `400–500ms`,
  easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- Dispara uma vez, ao entrar no viewport, via `IntersectionObserver` — **sem** biblioteca de
  animação (nada de framer-motion / GSAP).
- Stagger de `60–80ms` entre itens de um mesmo grid. Nunca mais que ~6 itens em stagger.
- Barra de logos: marquee CSS linear e lento (`~30s`), com máscara de fade nas duas pontas.
- Respeitar `prefers-reduced-motion`: desliga translate e stagger, mantém opacidade final.
- Sem parallax, sem animação disparada por scroll contínuo, sem contador animado.

---

## 7. Pendências desta especificação

1. Extrair de verdade §2–§6 quando o host da referência estiver liberado — hoje são propostas.
2. Confirmar a cor de accent (§3) ou definir uma por sócio.
3. A referência tem seções 8 (tabela comparativa), 9 (pricing) e 11 (FAQ) que **não têm
   conteúdo correspondente** no site antigo. Ver `docs/conteudo-fonte.md` §7.

---

## 8. CORREÇÃO 25/07 — violeta descartado, paleta azul `[USER]`

O usuário viu o render e reprovou: **"tá com muita cara de IA"**. Diagnóstico aceito, e a causa
foi escolha de Claude, não do usuário. O kit completo do clichê de página gerada por IA estava
lá: fundo quase-preto azulado + accent violeta + glow radial atrás do hero + grid quadriculado
+ eyebrow em monoespaçada maiúscula + tudo alinhado à esquerda numa coluna de 680px, com todas
as seções no mesmo ritmo.

Direção nova, dada pelo usuário: **paleta azul**, tecnológico, moderno, minimalista, animado.

| Token | Valor | Nota |
|---|---|---|
| `--background` | `oklch(0.163 0.028 252)` | navy profunda — o azul está no **fundo**, não só no botão |
| `--foreground` | `oklch(0.985 0.002 252)` | |
| `--surface` | `oklch(0.206 0.031 252)` | |
| `--surface-raised` | `oklch(0.252 0.034 252)` | |
| `--border` | `oklch(1 0 0 / 0.09)` | |
| `--border-strong` | `oklch(1 0 0 / 0.2)` | botão ghost — a 9% o contorno desaparece |
| `--muted` | `oklch(0.685 0.014 252)` | |
| `--accent` | `oklch(0.72 0.135 245)` | azure limpo |
| `--accent-foreground` | `oklch(0.163 0.028 252)` | |

Por que azul **no fundo** e não só no accent: azul-claro em elemento isolado sobre fundo escuro
cai no genérico de consultório; azul saturado como accent sobre preto repete a fórmula do
violeta. Com a navy carregando a identidade, a cor deixa de ser adesivo.

`--accent` em `L 0.72` é requisito de acessibilidade, não gosto: o mesmo token serve de texto
de 12px sobre a navy e de preenchimento de botão. Escurecer quebra o contraste do eyebrow.

**Removidos por serem clichê de IA:**
- `.tech-grid` / `.tech-grid-fade` (grid quadriculado) → substituídos por `.rules-x` /
  `.rules-fade`: réguas **verticais** alinhadas ao grid de 12 colunas, que leem como estrutura
  arquitetônica em vez de textura decorativa.
- Glow radial atrás do hero → removido, sem substituto.

**Mantidos:** `.tech-grid-sm` nos slots de imagem vazios (ali a textura tem função — faz o slot
parecer deliberado em vez de caixa quebrada) e a monoespaçada nos metadados pequenos.

**Adicionado para "animado":** `.line-mask` + `.line-rise` — revelação linha a linha com
máscara, 900ms, `cubic-bezier(0.16, 1, 0.3, 1)`, respeitando `prefers-reduced-motion`.
Ainda **não aplicado**: depende de `hero.headline` virar `string[]`, para ter quebras de linha
deliberadas em vez de deixar o navegador decidir.

### ⚠️ O layout continua sendo invenção de Claude

A referência `productized-agency-template-acetern.vercel.app` **nunca foi acessível** — 403 por
egress policy, 4 tentativas em 2 dias. Tudo nesta especificação é aproximação a partir de
descrição verbal do usuário.

O usuário vai enviar screenshots da referência. **Quando chegarem, tratar como ground truth e
substituir esta especificação** — não conciliar com ela.
