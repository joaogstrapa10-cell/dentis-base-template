# CLAUDE.md — Base (template) de site para clínica odontológica de alto padrão

Memória de trabalho entre sessões. Manter atualizado.

---

## 1. Contexto do projeto

Construir a **BASE (template)** de um site para clínica odontológica de alto padrão no Brasil.
Depois de validada, a base é replicada e customizada individualmente para **3 sócios**:
**Dalton, Rogério e Décio** — cada um com sua própria clínica/site.

**Referência de layout e pegada visual** (estrutura + estética a seguir):
`https://productized-agency-template-acetern.vercel.app/`

**Fonte de conteúdo** (textos, imagens, seções a reaproveitar):
`https://suzukiodontologia.com.br/` — WordPress/Elementor, clínica **Suzuki Odontologia**,
Curitiba/PR. Posicionamento atual: conservador/institucional. A base nova deve elevar isso
sem perder a autoridade.

**Stack:** projeto gerado no **Lovable** (React + Vite + TypeScript + Tailwind + shadcn/ui),
repositório no GitHub.

**Objetivo de arquitetura:** replicar para Dalton, Rogério e Décio deve ser
`trocar src/content/clinica.ts + tokens de tema`, **sem tocar em componente**.

---

## 2. Divisão de papéis

| Quem | Faz |
|---|---|
| **Usuário (João)** | Opera a interface do Lovable: cria o projeto, conecta o GitHub em Settings/Integrations, puxa o sync após os pushes. Fornece dados que só ele tem (telefone correto, fotos, CRO dos sócios). |
| **Claude** | Opera o repositório: raspa as fontes, escreve o prompt do Lovable, mapeia o código gerado, refatora, integra componentes, commita e faz push. |

**Regra dura:** Claude **não** acessa nem automatiza o Lovable. Quando precisar de uma ação
na UI do Lovable, pede explicitamente e **para**.

---

## 3. Regras de operação

### Créditos Lovable
- Lovable é usado para **uma geração inicial** e para os syncs.
- Todo refino visual, ajuste de copy e correção acontece **no repo, por Claude** — não por
  prompts novos no Lovable.
- Por isso o prompt-mestre da Fase 1 precisa acertar de primeira.

### Tokens
- Antes de ler qualquer arquivo, localizar com `rg`/glob. Ler apenas os trechos necessários
  (offset/limit). Nunca ler arquivo inteiro acima de ~400 linhas.
- **Nunca ler:** `node_modules/`, `dist/`, `package-lock.json`, `*.lock`, assets binários,
  `src/components/ui/*` do shadcn (assumir comportamento padrão).
- **Nunca rodar** `npm run dev` nem qualquer processo em watch.
- Validar com `npx tsc --noEmit` e `npm run build`, **só ao final de cada fase**, e reportar
  **apenas as linhas de erro** — nunca o log completo.
- Edições cirúrgicas (str_replace). Não reescrever arquivos inteiros para mudar poucas linhas.
- Não mostrar diffs longos. Resumir em bullets: `arquivo → o que mudou e por quê`.
- Não repetir de volta conteúdo que acabou de ser escrito em arquivo. Dizer só o caminho.
- Agrupar dúvidas: **máximo 3 perguntas por vez**, e só quando a decisão for irreversível ou
  depender de informação que só o usuário tem. Se puder decidir com bom senso, decidir e
  registrar a decisão em uma linha no log abaixo.
- Pedir OK antes de **qualquer** `git commit`.

### Checkpoints
- Ao final de **cada fase**, parar e esperar OK explícito antes de avançar. **Não emendar fases.**

### Git
- **Este repositório (`joaogstrapa10-cell/dentis-base-template`) é a fonte única de verdade
  do código.** Ele está conectado ao Lovable por sync bidirecional.
- **Trabalhar na `main`.** O Lovable sincroniza a partir da branch default — commit em branch
  lateral não chega no projeto do Lovable, e o site não atualiza.
- Push sempre com `git push -u origin main`. Retry em falha de rede: 2s, 4s, 8s, 16s.
- Não abrir Pull Request sem pedido explícito.
- O repo `joaogstrapa10-cell/ippouniverso` (branch `claude/dental-clinic-site-base-s7tibx`)
  guarda o histórico da Fase 0 e 1. Está espelhado aqui; não é mais onde o trabalho acontece.

---

## 4. Restrições de conteúdo e compliance

- **CFO-196/2019** restringe divulgação de antes/depois em publicidade odontológica.
  Qualquer galeria de comparação deve ser **genérica e reutilizável** (estrutura da clínica,
  tecnologia, processo), sem copy que prometa resultado.
- **Zero lorem ipsum.** Onde faltar informação, usar placeholder explícito e nomeado
  (ex: `[CRO-PR 00000]`), nunca texto genérico de preenchimento.
- Sem clichê de estoque: dente branco brilhando, sorriso genérico, azul-claro de consultório.
- Não replicar o vazamento `http://localhost/website-susuki-odontologia/...` (resíduo da
  agência anterior) encontrado num link de logo do site antigo.

---

## 5. Estado das fases

| Fase | Descrição | Estado |
|---|---|---|
| 0 | Mapear antes de executar | **Concluída com ressalva** — OK do usuário em 24/07; egress policy bloqueou as fontes (ver §7) |
| 1 | Prompt-mestre do Lovable (`docs/prompt-lovable.md`) | **Concluída** — prompt enviado ao Lovable via MCP em 24/07 |
| 2 | Assumir o repositório gerado | **Concluída em 25/07** — repo clonado, `bun install`, `tsc` e `build` rodando de verdade |
| 3 | Primeiro ciclo completo de edição | **Concluída em 25/07** — loop `repo → push → main → sync do Lovable` fechado |
| 4 | Componente de galeria de comparação | **Construído do zero** — `21st.dev` bloqueado por egress policy, ver §7 |
| 5 | Preparar a replicação (`docs/replicacao.md`) | **Concluída** |
| — | QA visual por screenshot | **Concluída em 25/07** — 4 bugs corrigidos, ver log §9 |
| — | Redesign a partir da referência real | **Concluída em 25/07** — ver §5.1 |
| — | Imagens reais do site antigo | **Concluída em 29/07** — ver §5.1 |
| — | Avaliações do Google | **EM ANDAMENTO** — ver §5.2, é o ponto de retomada |

---

## 5.1 O que mudou depois da Fase 5

**As fases 0–5 descrevem um site que não existe mais.** O layout foi refeito do zero
em 25/07, quando o usuário enviou screenshots da referência — que nunca foi acessível
deste ambiente. Até então o layout era invenção de Claude, e era essa a causa do
"cara de IA" que o usuário reprovou três vezes.

Estado atual, em uma frase: **página clara com blocos escuros encaixados, paleta azul,
Instrument Sans, e cada seção com uma estrutura própria.**

O que a referência revelou e estava errado antes:

| | Estava | Ficou |
|---|---|---|
| Base | página toda escura | clara, com blocos escuros pontuais |
| Hero | tudo empilhado numa coluna | cartão escuro arredondado, 2 colunas |
| Botão | pill sólido | pill escura com tile de ícone colorido |
| Cards | borda 1px, raio 10px | brancos, raio 22px, sombra suave |
| Headings | peso médio | bold |
| Assinatura | — | wordmark gigante translúcido cortado pela borda |

**Monotonia estrutural era o problema mais fundo.** Seis das treze seções eram o mesmo
componente: cabeçalho, parágrafo, fileira de cards iguais. Hoje cada uma tem uma ideia
própria: Diferenciais é lista editorial numerada sem card; Áreas é índice interativo com
revelação por hover; Depoimentos é carrossel; Bio é faixa escura de largura cheia;
Tratamentos é um card largo dividido por fios. **Não reintroduzir grid de cards uniforme.**

**Imagens reais estão no site** desde 29/07: 12 fotos de estrutura, 9 retratos de equipe,
3 fotos de depoentes e o logo. Baixadas pelo agente do Lovable, que tem rede própria —
`suzukiodontologia.com.br` é bloqueado para Claude. Ver `public/imagens/originais/MANIFESTO.md`.

---

## 5.2 Ponto de retomada

**Tarefa em voo:** foi enviada ao agente do Lovable (projeto `1f2b8513`) a extração das
avaliações do Google Business da clínica, a partir de `https://maps.app.goo.gl/xuMdNzBAhSLkJ7cA8`.
O agente deve escrever `public/imagens/originais/AVALIACOES-GOOGLE.json` com o resumo do
perfil (nome, nota, total, link de avaliar) e até 12 avaliações (autor, nota, quando,
texto integral, foto).

**Status em 30/07: ainda `running` após sete minutos, e o arquivo não foi escrito.**
Isso é sinal de dificuldade, não de lentidão: o Google Maps monta a página por JavaScript
e resiste a leitura automatizada. Antes de reenviar a tarefa, **verificar se o arquivo
apareceu** — pode ter terminado depois. Se não apareceu, não insistir na mesma abordagem
mais de uma vez: cada tentativa consome crédito do usuário.

**Plano B, sem crédito e sem depender do Google:** o usuário abre o perfil, copia as
avaliações e cola no chat. Para cada uma são necessários apenas quatro campos — autor,
nota, quando e texto. Mais os três números do resumo: nota média, total de avaliações e o
link de "escrever avaliação".

**Quando o JSON chegar, fazer numa operação só:**

1. `git pull` para trazer o arquivo.
2. Preencher `depoimentos.resumo` com os números reais. Hoje estão como
   `[NOTA: ex. 4,9]` e `[TOTAL: ex. 512 avaliações no Google]`, visíveis na tela.
3. Substituir `depoimentos.itens` pelas avaliações do Google, com `fonte: "google"` —
   é o que liga as estrelas e a marca no cartão.
4. **Remover os três depoimentos antigos** (Adriane Cardoso, Josélia Bellegard,
   Adília Miguel). Decisão do usuário em 30/07: eles saem quando o Google entrar.
   Não foram removidos antes porque deixariam a seção vazia no preview.

O campo `fonte` existe para não atribuir origem falsa: `"site"` renderiza sem marca e sem
estrelas, porque depoimento de site não tem nota e não veio do Google.

### Pendências que bloqueiam publicação

| O quê | Onde aparece | Quem resolve |
|---|---|---|
| Telefone e WhatsApp | `[TELEFONE-PRINCIPAL: a confirmar]` na tela | só o usuário |
| CRO e especialidade dos 8 profissionais | `[CRO e ESPECIALIDADE]` na tela | página `/equipe/`, via agente do Lovable |
| 4 respostas do FAQ | `[CONFIRMAR: ...]` na tela | clínica |
| Logo em versão escura | não existe | clínica |
| CNPJ e nome jurídico | `[CNPJ]`, `[NOME DA CLÍNICA]` | usuário |

**CRO é obrigatório em publicidade odontológica.** Enquanto os 8 estiverem com
placeholder, o site não pode ir ao ar.

### Achado que afeta a replicação

Nos retratos do site antigo há Dalton e mais oito nomes, e **nem Rogério nem Décio
aparecem**. A premissa de três sócios com uma base comum precisa ser confirmada antes de
gerar as variantes.

### Seções que ainda repetem o molde antigo

Acompanhamento, Localização e Estrutura seguem no formato cabeçalho + conteúdo. O FAQ
continua accordion de largura cheia, quando na referência é de duas colunas.

---

### Como validar e renderizar

```bash
bun install
bunx tsc --noEmit                          # tipos
bun run build                               # build (preset Cloudflare Workers)
bunx vite dev --host 127.0.0.1 --port 4173  # render local — o --host é obrigatório, não há IPv6
```

Não usar `vite preview` (procura `dist/server/`, que este build não gera) nem
`node .output/server/index.mjs` (é módulo de Worker, não servidor).

---

## 6. Arquivos deste projeto

| Caminho | Conteúdo |
|---|---|
| `CLAUDE.md` | Este arquivo. Contexto, papéis, regras, log de decisões. |
| `docs/referencia-layout.md` | Especificação de layout extraída da referência visual. |
| `docs/conteudo-fonte.md` | Conteúdo consolidado do site antigo, com proveniência marcada. |
| `docs/prompt-lovable.md` | Fase 1. Prompt único para colar no Lovable. |
| `docs/replicacao.md` | Fase 5. Passo a passo para gerar as 3 variantes. |

---

## 7. Bloqueio de rede ativo (ambiente)

A sessão roda em ambiente remoto com **network policy de allowlist**. Hosts testados:

| Host | Resultado |
|---|---|
| `productized-agency-template-acetern.vercel.app` | **403 — bloqueado** |
| `suzukiodontologia.com.br` | **403 — bloqueado** |
| `21st.dev` | **403 — bloqueado** |
| `example.com`, `vercel.com`, `web.archive.org` | **403 — bloqueado** |
| `github.com` | liberado |
| `registry.npmjs.org` | liberado |

`WebSearch` funciona (não passa pelo egress proxy), mas devolve só fragmentos indexados —
não substitui a raspagem das páginas.

**Consequência:** as fontes primárias não podem ser lidas por Claude. Resolver por uma das vias:
1. Ampliar a network policy do ambiente para incluir os 3 hosts
   (ver `https://code.claude.com/docs/en/claude-code-on-the-web`); **ou**
2. O usuário cola o conteúdo das páginas / exporta os assets manualmente.

Nunca contornar a policy (proxies de terceiros, mirrors). Reportar o host bloqueado.

---

## 8. Projeto no Lovable

| Campo | Valor |
|---|---|
**Projeto em uso (o que vale):**

| Campo | Valor |
|---|---|
| Nome | Dentis Base Template |
| `project_id` | `1f2b8513-c555-4640-a43b-1b94dbd2734d` |
| Workspace | `João's Lovable` (`qCoB80YgpW4IRvvgLeAi`) — **João é owner** |
| Editor | `https://lovable.dev/projects/1f2b8513-c555-4640-a43b-1b94dbd2734d` |
| Preview | `https://id-preview--1f2b8513-c555-4640-a43b-1b94dbd2734d.lovable.app` |
| GitHub | `joaogstrapa10-cell/dentis-base-template`, sync bidirecional na `main` |

**Projeto original (obsoleto — apagar):** `9d05bd27-0257-47ec-bd63-1901ee5d1c12`, no workspace
`Giulliano's Lovable` (`9G3fAkdnuvQqWzEwcVjW`). Parou no commit `e8fa86b1`, **sem** as
correções visuais de 25/07. Foi remixado para o workspace do João porque o plano `member` não
dá permissão de workspace Git — sem isso não havia como conectar o GitHub do João.

**Entregue ao Giulliano em 25/07:**

| Campo | Valor |
|---|---|
| Nome | `Dentis Base Template — base tech` |
| `project_id` | `1896d5fd-49f6-447e-88a1-adfbe7293de4` |
| Workspace | `Giulliano's Lovable` (`9G3fAkdnuvQqWzEwcVjW`) |
| Editor | `https://lovable.dev/projects/1896d5fd-49f6-447e-88a1-adfbe7293de4` |
| Preview | `https://id-preview--1896d5fd-49f6-447e-88a1-adfbe7293de4.lovable.app` |

⚠️ **Essa cópia NÃO está ligada ao GitHub.** Remix copia arquivos, não a conexão de sync.
Push neste repositório atualiza o projeto do João (`1f2b8513`), **não** o do Giulliano.

### Fluxo decidido pelo usuário em 29/07

**Trabalhar só no projeto do João. Recopiar para o Giulliano no momento da entrega.**

Consequência prática, e a fonte de uma confusão real que já aconteceu: a cópia do Giulliano
fica **congelada** entre entregas. O usuário abriu ela procurando as imagens novas e concluiu
que nada tinha subido — quando na verdade estava tudo no projeto dele.

- ✅ **Projeto de trabalho:** `1f2b8513-c555-4640-a43b-1b94dbd2734d` — `Dentis Base Template`,
  workspace `João's Lovable`. É o único que recebe push. Toda verificação visual é aqui.
- 🧊 **Cópia de entrega:** `1896d5fd-49f6-447e-88a1-adfbe7293de4` —
  `Dentis Base Template — base tech`, workspace do Giulliano. **Não editar.** Está parada no
  estado de 25/07: sem imagens, sem depoimentos reais, sem corpo clínico.
- Na entrega: `remix_project` do `1f2b8513` para `workspace_id: 9G3fAkdnuvQqWzEwcVjW`, e apagar
  as cópias antigas para não sobrar versão paralela editável.

Os nomes dos dois projetos são quase iguais, o que agrava o risco de abrir o errado. Vale
renomear a cópia de entrega com a data quando ela for gerada.

🗑️ **Apagar `9d05bd27-0257-47ec-bd63-1901ee5d1c12`** do workspace do Giulliano: é a primeira
tentativa, parou no commit `e8fa86b1`, sem tema tech, sem tipografia e sem a reformulação
estrutural. Manter os dois convida a editar o errado.

### Estrutura de arquivos gerada

```
src/content/types.ts          tipos, um por seção + raiz Clinica, zero `any`
src/content/clinica.ts        100% do conteúdo; telefone/whatsapp em constante única
src/lib/contato.ts            telHref() / whatsappHref() — derivam o link do número exibido
src/hooks/useReveal.ts        IntersectionObserver à mão
src/components/Reveal.tsx     wrapper de animação de entrada
src/components/Header.tsx     header fixo, âncoras, CTA
src/components/sections/      Section.tsx (wrapper de ritmo) + SectionHeader
                              Hero, Selos, Diferenciais, Acompanhamento, Localizacao,
                              Estrutura, Areas, Depoimentos, Comparativo, Tratamentos,
                              Bio, Faq, Footer
src/routes/index.tsx          lê clinica.ts e distribui props tipadas
src/styles.css                @theme + :root com os tokens; --section-py
```

Ordem de render: Hero → Selos → Diferenciais → Acompanhamento → Localizacao →
**Estrutura** → Areas → Depoimentos → Comparativo → Tratamentos → Bio → Faq → Footer.

### Stack real do scaffold (≠ do que o prompt assumiu)

O prompt da Fase 1 assumiu Vite + `tailwind.config.ts` + `src/index.css` + npm.
O scaffold que o Lovable entregou é outro:

| Prompt assumiu | Scaffold real |
|---|---|
| Vite + React puro | **TanStack Start** (`src/router.tsx`, `src/routes/`, `src/server.ts`, `src/start.ts`) |
| `tailwind.config.ts` | **não existe** — Tailwind v4, config CSS-first via `@theme` |
| `src/index.css` | `src/styles.css` |
| `npm install` | **bun** (`bun.lock`, `bunfig.toml`) |
| "sem router" | scaffold é router-based; a página vive em `src/routes/index.tsx` |

Consequência para a Fase 2: auditar se o agente criou um `tailwind.config.ts` inerte
(ignorado pelo Tailwind v4) e migrar os tokens para `@theme` no `src/styles.css`.
Usar `bun install`, não `npm install`.

O scaffold também traz `AGENTS.md` e `.lovable/project.json` — ler antes de refatorar.

---

## 9. Log de decisões (append-only, uma linha por decisão)

- 2026-07-24 — Base do projeto criada na branch `claude/dental-clinic-site-base-s7tibx` do repo `joaogstrapa10-cell/ippouniverso`, que já contém material não relacionado (`A10_PADRAO/`, `EMPREENDIMENTOS A10/`, `capetown/`) — pendente confirmar se é o repo definitivo.
- 2026-07-24 — `CLAUDE.md` e `docs/` ficam na raiz conforme especificado; na Fase 2 serão copiados para o repo gerado pelo Lovable, que passa a ser a fonte única de verdade.
- 2026-07-24 — Fontes primárias (referência de layout, site antigo, 21st.dev) inacessíveis por egress policy do ambiente. Registrado em §7; não contornar.
- 2026-07-24 — `docs/referencia-layout.md` escrito com a ordem de seções fornecida pelo usuário (ground truth) + proposta de sistema visual marcada como `PROPOSTA`, para não bloquear a Fase 1. Substituir por extração real quando a referência for acessível.
- 2026-07-24 — Proveniência do conteúdo marcada por tag em `docs/conteudo-fonte.md` (`[HOME]`, `[WS]`, `[FALTA]`) para nunca confundir dado verificado com inferência.
- 2026-07-24 — `odontosuzuki.com.br`, `suzukikannoodontologia.com.br` e `clinicaseizosuzuki.com.br` são clínicas Suzuki distintas em Curitiba; não misturar conteúdo com a fonte.
- 2026-07-24 — Fase 1 seguiu sem as respostas das lacunas de conteúdo: a geração do Lovable define **estrutura e arquitetura**, e copy vive em `clinica.ts` — preencher depois é edição no repo, custo zero de crédito. Arquitetura errada é que sai caro.
- 2026-07-24 — Instância base do template = **Suzuki / Dr. Dalton** (único conteúdo real disponível). Rogério e Décio derivam trocando `clinica.ts` + accent.
- 2026-07-24 — Seção 9 da referência (pricing) → **"Tratamentos" com `Valor sob avaliação`**: a clínica não divulga preço e não se inventa valor. Formato de 3 cards preservado.
- 2026-07-24 — Depoimentos ficam como `[DEPOIMENTO VERBATIM — Nome]` visível no render. Não se fabrica depoimento atribuído a paciente real.
- 2026-07-24 — Descrições das 8 especialidades no prompt são **rascunho de Claude** (factuais, sem promessa de resultado), não a copy do site. Substituir quando as 8 páginas forem raspadas.
- 2026-07-24 — Telefone exibido e `href` saem do **mesmo campo** de `clinica.ts`, para não repetir o bug do site antigo (display do celular apontando para `tel:4133633040`).
- 2026-07-24 — **Regra do §2 revogada pelo usuário:** um MCP do Lovable ficou disponível e o usuário autorizou Claude a dirigir o Lovable por ele. Claude agora cria projeto e manda mensagem; conectar o GitHub continua manual (o MCP não faz).
- 2026-07-24 — Projeto criado no workspace do **Giulliano** (pro), escolha do usuário, por o plano free do João não aguentar a geração. Crédito consumido é do Giulliano.
- 2026-07-24 — `create_project` estourou o timeout de 60s do cliente MCP mas **o projeto foi criado**. Sempre checar com `list_projects` antes de repetir uma chamada de criação — repetir duplica projeto e queima crédito.
- 2026-07-24 — Scaffold do Lovable é TanStack Start + Tailwind v4 + bun, não Vite + `tailwind.config.ts` + npm. Ver §8. Corrigir o prompt-mestre antes de reusar para Rogério e Décio.
- 2026-07-24 — **Primeira geração falhou silenciosamente**: `agentFinished: true`, `project.error: null`, `list_edits` vazio, zero arquivo criado. Causa provável: tamanho da mensagem inicial. Sempre validar com `list_edits` + `list_files`, nunca confiar no status.
- 2026-07-24 — Arquitetura movida para **project knowledge** do Lovable (config, não consome crédito) e a mensagem de geração ficou só com o conteúdo das 12 seções. Essa divisão funcionou de primeira e passa a valer para todos os syncs futuros.
- 2026-07-24 — Colisão de convenção detectada: no `@theme` o Lovable mapeia `--color-muted` para `var(--surface)` (padrão shadcn, muted = fundo). Texto secundário é `text-muted-foreground`, **não** `text-muted`. Corrigir o prompt-mestre para não induzir ao erro.
- 2026-07-24 — Usuário autorizou operação 100% autônoma (sem perguntas, sem gate de commit, sem checkpoint de fase) para a sessão seguir sem ele. Regra de OK antes de commit suspensa por decisão dele.
- 2026-07-24 — Fase 4 sem o 21st.dev: host bloqueado, impossível pesquisar os 3 candidatos. Galeria de comparação construída do zero, sem dependência nova, com divisor navegável por teclado (`role="slider"`) — o que atende a restrição de "sem dependência pesada" melhor que qualquer adaptação.
- 2026-07-24 — Galeria da Fase 4 nasce com 12 slots `src: null` e rótulo `[ESTRUTURA NN]` visível, porque os binários de "Nossa Estrutura" estão atrás do host bloqueado.
- 2026-07-24 — O agente do Lovable **ignora itens** de mensagem multi-tarefa: a rodada de 3 itens virou só o move de um arquivo. Mandar tarefa por mensagem, imperativo e curto, e sempre verificar com `list_files`/`read_file` — nunca confiar no commit message.
- 2026-07-24 — O agente recriou `telefone: { display, href }` mesmo com instrução explícita contra. Corrigido para `telefone: string` + `src/lib/contato.ts` derivando o href. **Verificar isso em cada variante** — é o desvio que mais reincide.
- 2026-07-24 — Ritmo vertical consolidado em `--section-py` (6rem mobile / 10rem ≥768px), aplicado por `paddingBlock` no `Section.tsx`. Nenhum `py-` de seção sobrou.
- 2026-07-24 — `descricao: ""` em 4 seções (acompanhamento, localizacao, areas, comparativo): string vazia é falsy e o `SectionHeader` não renderiza o parágrafo. Não é lorem ipsum, mas preencher quando houver copy real.
- 2026-07-24 — **Usuário corrigiu a direção visual para "estilo tech"**, invalidando o accent bronze proposto por Claude. Re-tematizado para violeta vivo + preto frio + raio 10px + monoespaçada nos metadados + grid no hero. Valores em `docs/referencia-layout.md` §3.
- 2026-07-24 — A re-tematização custou **2 rodadas e zero edição de componente na primeira**: a troca de paleta inteira foi só `:root` no `styles.css`. Primeira evidência real de que a arquitetura de replicação funciona.
- 2026-07-24 — Accent claro (`L 0.74`) é requisito de acessibilidade, não gosto: o mesmo token serve de texto de 12px sobre fundo escuro e de fundo de botão. Escurecer o accent quebra o contraste do eyebrow.
- 2026-07-24 — Usuário mandou desistir do GitHub (`esquece o github`). Consequência: todo trabalho no código segue via MCP do Lovable, **consumindo crédito do Giulliano** a cada rodada, e Claude não consegue rodar `tsc`/`build` localmente — validação é por leitura de código e pelo build do Lovable.
- 2026-07-24 — Repo `giullianozanelatto/dentis-base-template` é **inalcançável** por esta sessão: o app da Claude está instalado só na conta `joaogstrapa10-cell` e o ambiente não permite misturar owners. Sessão nova não resolve. Para trabalhar no repo: transferir para `joaogstrapa10-cell` ou refazer o sync do Lovable apontando para lá.
- 2026-07-25 — Impasse resolvido por **remix para o workspace do João**: como owner ele tem a permissão de workspace Git que faltava, conectou o próprio GitHub, e o repo nasceu em `joaogstrapa10-cell`. Giulliano saiu do caminho crítico. Entrega final volta pra ele por remix.
- 2026-07-25 — **Primeira validação com ferramenta real** (antes era só leitura de código): `tsc --noEmit` 0 erros, `bun run build` OK, 0 erro de console no browser, 0 elemento preso em opacidade — todos os `IntersectionObserver` do Reveal disparam.
- 2026-07-25 — Site renderizado e auditado por screenshot com Chromium. **4 bugs que leitura de código não pegaria:** (1) headline transbordava a viewport no mobile porque o piso do `clamp` era `3rem` — o `7vw` nunca entrava; (2) o grid tech estava invisível por `-z-10`, que jogava a camada para trás do fundo da página, não por opacidade; (3) borda a 9% em botão ghost desaparece — criado `--border-strong` a 20%; (4) `font-semibold` na headline do hero lê truculento nesse tamanho — `font-medium` é o certo.
- 2026-07-25 — Slot de imagem vazio precisa **parecer deliberado**: 12 caixas cinzas lisas leem como site quebrado. Resolvido com textura `.tech-grid-sm` + rótulo em pill monoespaçada ancorado embaixo à esquerda. Seção Estrutura caiu de 1969px para 1393px (comparador 21/9 + miniaturas em 6 colunas).
- 2026-07-25 — Build usa preset **Cloudflare Workers** (gera `wrangler.json`), então `node .output/server/index.mjs` sai na hora — não é servidor. Para renderizar local, usar `bunx vite dev --host 127.0.0.1`. `vite preview` também não serve: procura `dist/server/`, que este build não gera.
- 2026-07-25 — Ambiente **não tem IPv6**: qualquer servidor precisa de `--host 127.0.0.1` explícito, senão falha com `EAFNOSUPPORT` ao tentar bind em `::`.

---

## 10. Como retomar num chat novo

O contexto vive neste repositório, não na conversa. Uma sessão nova com este repo
anexado carrega este arquivo automaticamente.

**Ao abrir o chat novo, anexar:** `joaogstrapa10-cell/dentis-base-template`

Não é preciso anexar `joaogstrapa10-cell/ippouniverso`. Ele guarda o histórico das
fases 0 e 1, já espelhado aqui, e o ambiente não permite misturar owners.

**Primeira mensagem sugerida:**

> Leia o CLAUDE.md e os docs/. Retome de onde parou: §5.2 tem o ponto exato.

**Ordem de leitura para entrar no assunto:**

1. `CLAUDE.md` §5.1 (o que o site é hoje) e §5.2 (o que fazer agora)
2. `docs/referencia-layout.md` §8 (tokens em vigor e por que são esses)
3. `docs/imagens.md` (o que já veio e o que falta)
4. `docs/replicacao.md` (Fase 5, gerar as variantes)

**Não ler** `docs/prompt-lovable.md` como especificação: é o prompt da geração inicial,
descreve um site escuro que não existe mais. Só a seção final, de correções, segue válida.

### Armadilhas já pagas, não repetir

- **`ch` em `max-width`** resolve contra a fonte do elemento onde está, não do filho.
  `max-w-[42ch]` num wrapper de 16px estrangula um `h2` de 52px. Aconteceu três vezes.
- **`leading-[...]` com `text-[clamp(...)]`** não funciona no Tailwind v4: o utilitário de
  font-size arbitrário reimpõe o line-height. Por isso existe a escala `.display-1/2/3`.
- **Translate no Tailwind v4** usa a propriedade CSS `translate`, não `transform`.
  Inspecionar `getComputedStyle().transform` devolve `none` e engana.
- **`@import` de fonte remota no CSS** derruba o build: o lightningcss tenta resolver a URL
  como arquivo local. Fontes entram por `<link>` em `src/routes/__root.tsx`.
- **Ambiente sem IPv6:** todo servidor precisa de `--host 127.0.0.1` explícito.
- **O agente do Lovable ignora itens** de mensagem multi-tarefa. Uma tarefa por mensagem,
  e sempre conferir com `list_files`/`read_file` — o commit message dele não descreve o
  que foi feito.
- **Egress policy:** Claude alcança apenas `github.com` e `registry.npmjs.org`. Fontes
  externas (site antigo, referência, Google Maps, 21st.dev) são 403. Quando precisar de
  algo da web aberta, delegar ao agente do Lovable, que tem rede própria.
