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
| — | Avaliações do Google | **Concluída em 03/08** — 4 avaliações reais no site, via print. Ver log §9 |

---

## 5.1 O que mudou depois da Fase 5

**As fases 0–5 descrevem um site que não existe mais.** O layout foi refeito do zero
em 25/07, quando o usuário enviou screenshots da referência — que nunca foi acessível
deste ambiente. Até então o layout era invenção de Claude, e era essa a causa do
"cara de IA" que o usuário reprovou três vezes.

Estado atual, em uma frase: **página clara morna com blocos escuros em verde-petróleo da
Suzuki, dourado como ornamento, Instrument Sans, e cada seção com uma estrutura própria.**

A paleta azul descrita abaixo **foi substituída em 30/07** pela paleta medida da Suzuki.
Ver `docs/referencia-layout.md` §9 — é a primeira paleta do projeto que não é proposta de
Claude, e sim medição do site e das fotos da clínica.

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

**A extração do Google terminou, e voltou pela metade.** O agente do Lovable escreveu
`public/imagens/originais/AVALIACOES-GOOGLE.json`, já no repo. Ler o array `falhas` dele antes
de tentar qualquer coisa: **0 de 12 avaliações**. O Google entrega a IP de datacenter uma
"visualização limitada do Google Maps" — nome, nota, endereço e telefone carregam, a aba de
avaliações não renderiza (0 nós `[data-review-id]` após rolagem e expansão). O agente tentou
quatro caminhos: o endpoint interno devolveu 404 e `search.google.com/local/reviews` caiu em
reCAPTCHA por dois IPs distintos. **Não repetir a raspagem — é crédito gasto para o mesmo 403.**

**O que entrou no site em 30/07** (`depoimentos.resumo`, tudo verificado no perfil):

| Campo | Valor |
|---|---|
| `nota` | `5,0` — real; alimenta o texto e o preenchimento das estrelas |
| `cta.href` | `search.google.com/local/writereview?placeid=ChIJzSb5vkjk3JQREHbgq6qWPhA` |
| `place_id` | `ChIJzSb5vkjk3JQREHbgq6qWPhA` — confirmado: abre com nome e endereço certos |
| `totalLabel` | segue placeholder; a contagem não aparece na visualização limitada |

O endereço do perfil confere com o do `clinica.ts` (Atílio Bório, 547, CEP 80045-120), o que
confirma que o `place_id` é **desta** clínica e não de outra Suzuki de Curitiba.

**O caminho limpo para as avaliações, e é o único que falta:** `maps.googleapis.com` **está
liberado** nesta sessão (testado, HTTP 200 — é a exceção à §7). Com uma chave da Places API dá
para puxar oficialmente `rating`, `userRatingCount` e até 5 avaliações com autor, nota, texto,
data e foto, sem raspagem:

```bash
curl -s "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJzSb5vkjk3JQREHbgq6qWPhA&fields=name,rating,user_ratings_total,reviews&language=pt-BR&key=$CHAVE"
```

Alternativa sem chave: o usuário abre o perfil no navegador dele e cola as avaliações. Por
avaliação bastam quatro campos — autor, nota, quando, texto — mais o total do resumo.

Até uma das duas acontecer, `depoimentos.itens` **continua com os três depoimentos do site
anterior**, marcados `fonte: "site"`. A decisão de 30/07 de removê-los vale **quando as do
Google entrarem**; antes disso, removê-los esvazia a seção, e não se inventa avaliação
atribuída a paciente real.

O campo `fonte` existe para não atribuir origem falsa: `"site"` renderiza sem marca e sem
estrelas, porque depoimento de site não tem nota e não veio do Google.

**Achado colateral, que destrava uma pendência de publicação:** o perfil expõe o telefone
**`+55 41 99206-1073`**. É celular, então serve de WhatsApp. **Não foi aplicado** — telefone
está na coluna "só o usuário" abaixo, e número errado em site de clínica é caro. Ao confirmar,
trocar `TELEFONE_NUMERO` em `src/content/clinica.ts:6`.

### Pendências que bloqueiam publicação

| O quê | Onde aparece | Quem resolve |
|---|---|---|
| ~~Telefone e WhatsApp~~ | ✅ resolvido em 12/08: `(41) 99206-1073` confirmado pelo usuário e aplicado | — |
| CRO e especialidade dos 8 profissionais | `[CRO e ESPECIALIDADE]` na tela | página `/equipe/`, via agente do Lovable |
| 4 respostas do FAQ | `[CONFIRMAR: ...]` na tela | clínica |
| ~~Logo em versão escura~~ | ✅ resolvido em 30/07: `brand.logoEscuro`, os 21 traços do SVG recoloridos | — |
| CNPJ e nome jurídico | `[CNPJ]`, `[NOME DA CLÍNICA]` | usuário |
| 3 casos da galeria: situação, conduta, duração e registro clínico | `[CASO 0N — ...]` na tela | clínica |

**CRO é obrigatório em publicidade odontológica.** Enquanto os 8 estiverem com
placeholder, o site não pode ir ao ar.

**A galeria de casos é a seção mais exposta da CFO-196/2019.** Ela foi construída para
documentar processo, não resultado: um registro por caso (não par), campos de situação /
conduta / duração / especialidades, e aviso visível. O tipo `CasoClinico` tem `imagem` no
singular de propósito — não dá para montar antes-e-depois com ele. Ao preencher, **não**
acrescentar campo de "antes", nem copy que prometa desfecho. Registro clínico de paciente
exige autorização de uso de imagem, por escrito.

### Achado que afeta a replicação

Nos retratos do site antigo há Dalton e mais oito nomes, e **nem Rogério nem Décio
aparecem**. A premissa de três sócios com uma base comum precisa ser confirmada antes de
gerar as variantes.

### Seções que ainda repetem o molde antigo

**Nenhuma.** A lista fechou em 12/08. As treze seções têm anatomia própria, e são estas —
usar como referência antes de criar seção nova, para não repetir gesto:

| Anatomia | Seções |
|---|---|
| Bloco escuro sangrando, texto à esquerda e retrato sangrando à direita, dissolvido por máscara nas quatro bordas | Hero |
| Grade de células com fio, ícone e realce no hover (`GradeDeCelulas`) | Áreas (4 col.), Diferenciais (4 col.), **Tratamentos (3 col.)** |
| Esteira contínua | Estrutura, Depoimentos |
| Pilha de cartões arrastável | Casos (na home) |
| Pilha de dossiês alternando de lado | Casos (em `/casos`) |
| Grade de retratos sobre bloco escuro | Bio |
| Título em cima, accordion em coluna única de largura cheia | FAQ |
| Fileira de dados à esquerda + cartão de mapa à direita | Localização |
| Faixa escura curta, texto à esquerda e chamada à direita | Chamada final |

São **doze** seções: "Cada etapa, acompanhada." foi removida em 12/08 e a chamada
final saiu do rodapé e virou seção na mesma data.

⚠️ **`GradeDeCelulas` já serve TRÊS seções**, e desde 13/08 a única coisa que
distingue Tratamentos das outras duas é a contagem de colunas — a linha de fecho,
que era a outra diferença, saiu a pedido do usuário. **Não usar essa grade numa
quarta seção.** Seis das treze seções sendo o mesmo molde foi exatamente o que
reprovou o layout como "cara de IA" em 25/07.

**Quatro seções têm foto**: o hero (retrato do responsável), Estrutura (esteira de
12 ambientes), Bio (nove retratos) e — desde 13/08 — **Casos**, com uma imagem por
cartão ilustrando a especialidade do caso. As de Diferenciais e do FAQ entraram e
saíram em 12/08.

⚠️ As cinco imagens de Casos **não são registro clínico**: são ilustração e banco de
imagem das páginas de especialidade do site antigo. O alt de cada uma descreve o que
a imagem é, e a última frase de `casos.aviso` diz isso ao visitante. Ver
`public/imagens/casos/LEIA-ME.txt` para proveniência, pareamento e o que foi
descartado.

O que **não** existe mais em nenhuma seção, e não deve voltar: cartão com fundo e sombra
próprios, rótulo em maiúscula com tracking largo, pill de tag, e mais de uma chamada de
agendamento por seção.

**Exceção registrada em 12/08, e não é descuido:** Áreas voltou a ter grade uniforme e
ícone por item, por pedido explícito do usuário, a partir de um template que ele mandou.
O que sustenta a volta é que a objeção de 03/08 era o texto existir **só no hover** — ali
as descrições agora são permanentes, e o hover só acende fundo e barra. Não "corrigir"
essa seção de volta para índice tipográfico.

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

### Gerar o layout num arquivo .html avulso

Quando o usuário pedir o layout **sem link** — o que ele pediu em 13/08, e faz
sentido depois da confusão das URLs do Lovable (§8):

```bash
bun run build                                    # o CSS compilado sai daqui
bunx vite dev --host 127.0.0.1 --port 4176 &
PLAYWRIGHT_CORE=/caminho/node_modules/playwright-core \
  node scripts/congelar-html.mjs                 # saída em ./snapshots (gitignored)
```

Gera `suzuki-layout-home.html` (~3,2 MB) e `suzuki-layout-casos.html` (~490 KB),
cada um autossuficiente: CSS inline e imagens em data URI. O script documenta as
cinco armadilhas que custaram uma versão inteira — a principal é que **o CSS não
pode sair do DOM**, porque em dev o TanStack Start emite
`<link href="/src/styles.css">` e num arquivo local isso é 404 (o primeiro
snapshot saiu em Times New Roman, sem uma regra de estilo).

⚠️ É snapshot de **layout**: sem os scripts do app, o arraste da galeria, o
accordion do FAQ e o menu do mobile não respondem.

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

### ⚠️ A cópia CONGELADA é a que está publicada

Descoberto em 13/08, quando o usuário reportou "as edições não saíram para mim" — e era
a segunda vez que essa confusão acontecia. O estado dos dois projetos naquele dia:

| | Projeto do João (`1f2b8513`) | Cópia do Giulliano (`1896d5fd`) |
|---|---|---|
| `latest_commit_sha` | o commit do último push | `de9b9450`, de **25/07** |
| `is_published` | **false** — só existe preview | **true** |
| URL pública | não tem | `clinic-base-starter.lovable.app` |

Ou seja: **o único endereço público do projeto serve a versão de 25 de julho.** Quem abre
`clinic-base-starter.lovable.app` esperando ver o trabalho novo vê o site antigo — tema
azul, wordmark gigante, barra de formações — e conclui que o push não saiu.

O endereço que reflete o trabalho é o preview do projeto do João:
`https://id-preview--1f2b8513-c555-4640-a43b-1b94dbd2734d.lovable.app`

**Como diagnosticar em 30 segundos**, sem adivinhar: `git rev-parse origin/main` e
`get_project` nos dois projetos, comparando `latest_commit_sha`. Se o do João bate com o
`origin/main`, o sync funcionou e o problema é qual URL a pessoa abriu (ou cache do
navegador). Não refazer push nem re-editar código antes de fazer essa comparação.

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

**Ordem de render, ditada pelo usuário em 13/08** (a de antes era herança da
geração inicial, com seções que já não existem):

Hero → **Casos** → Areas → Bio → Diferenciais → Estrutura → Tratamentos →
Depoimentos → Faq → Localizacao → ChamadaFinal → Footer.

A lista que ele mandou tem dez seções e o rodapé; o **FAQ não estava nela e ficou**,
entre Depoimentos e Localização — que é a posição que já ocupava em relação ao mapa.
Ele sempre pediu remoção com verbo ("essa seção quero que retire"), e o FAQ havia
sido refeito duas vezes a pedido dele na véspera. "Como funciona" da lista dele é a
seção de **Tratamentos**, a que descreve como o orçamento e o processo funcionam.

O menu (`header.nav`) e a coluna "Clínica" do rodapé seguem esta ordem. Âncora que
sobe a página enquanto a de baixo desce lê como link errado.

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
- 2026-07-30 — Avaliações do Google **não são obtíveis por raspagem**, nem por Claude nem pelo agente do Lovable: os dois saem de IP de datacenter e o Google devolve "visualização limitada" (sem a aba de avaliações) ou reCAPTCHA. Quatro caminhos testados, 0 de 12 extraídas. Encerrado esse vetor; próxima tentativa só via Places API com chave.
- 2026-07-30 — Entrou no site só o que o perfil confirmou: `nota: "5,0"` e o `writereview` com o `place_id` `ChIJzSb5vkjk3JQREHbgq6qWPhA`. `totalLabel` segue placeholder porque a contagem não aparece na visualização limitada — **preencher número de avaliações por estimativa é fabricar prova social**, e a seção inteira existe para ser verificável.
- 2026-07-30 — Os três depoimentos do site antigo **ficam** até as avaliações do Google entrarem, contra o plano de 30/07 de removê-los junto. Removê-los agora esvazia a seção sem nada para pôr no lugar; o `fonte: "site"` já garante que renderizam sem estrela e sem a marca do Google, então não há atribuição falsa enquanto esperam.
- 2026-07-30 — Bug de template achado no cartão de resumo: `<Estrelas nota={5} />` estava **fixo em 5**, ignorando `resumo.nota`. Coincidia com a Suzuki (5,0) e teria pintado 5 estrelas cheias para um 4,6 do Rogério ou do Décio. Trocado por preenchimento fracionário (fileira dourada recortada por `width` percentual), que também serve nota quebrada — arredondar para cima seria propaganda, não layout.
- 2026-07-30 — `maps.googleapis.com` responde 200 daqui, então a Places API é caminho viável e oficial: `place_id` + chave devolvem `rating`, `userRatingCount` e até 5 avaliações completas. É a única pendência das avaliações.
- 2026-07-30 — Telefone `+55 41 99206-1073` apareceu no perfil do Google (celular, serve de WhatsApp). **Não aplicado**: telefone é da coluna "só o usuário" e o site antigo já teve bug de número errado. Registrado para confirmação.
- 2026-07-30 — Cartão de avaliações reduzido a **logo + estrelas + nota**, por pedido do usuário: saíram a contagem e o botão "Escreva sua avaliação". O `place_id` e a URL de avaliar ficaram em comentário no `clinica.ts` para não se perderem.
- 2026-07-30 — **Logo em versão escura passou a existir**: os 21 traços do SVG branco recoloridos para `#1b222c`. Era pendência sem solução na lista de bloqueios de publicação; o cartão de avaliações fica em fundo claro e o logo branco simplesmente não aparecia. `brand.logoEscuro` é o par de `brand.logo`.
- 2026-07-30 — **Paleta azul descartada. Primeira paleta medida do projeto**, não proposta: `getComputedStyle` em 4 páginas do site antigo (pelo agente do Lovable, host 403 aqui) + quantização das 12 fotos de estrutura. O site da Suzuki é **verde-petróleo** (`#013435`) com botão **amarelo** (`#ffc501`), e o consultório é madeira mel + granito preto + parede branca. A suposição de que a identidade era azul estava errada desde 24/07. Valores e contraste medido em `docs/referencia-layout.md` §9.
- 2026-07-30 — Armadilha do Elementor: as variáveis `--e-global-color-*` do site são **defaults do tema** (`#6EC1E4`, `#61CE70`) e não pintam elemento nenhum. Ler o CSS sem conferir uso monta a paleta errada — o agente do Lovable acertou em separá-las.
- 2026-07-30 — Dois tokens de accent em vez de um, e é requisito de contraste: **petróleo** (`--accent`, L 0.44) é estrutura e serve de ícone sobre fundo claro (7,48:1); **dourado** (`--gold`, L 0.80) é ornamento e só existe sobre escuro. Dourado como texto no claro não tem contraste — não unificar os dois.
- 2026-07-30 — Retrato do Dr. Dalton no hero, o mesmo que o site antigo usa em "sobre nós". O hero deixou de ter duas colunas de texto. O fundo verde da foto casa com o petróleo por coincidência, não por montagem.
- 2026-07-30 — **Wordmark fantasma e quadriculado removidos de todas as seções** por decisão do usuário, com o CSS, o componente `GhostWord` e o campo `brand.ghostWord` junto. Eram as duas últimas peças do kit "cara de IA" identificado em 25/07. O hero perdeu 7rem de padding inferior, que só existia para caber a palavra gigante.
- 2026-07-30 — Hero passou a **sangrar até a borda** da janela, sem moldura clara e sem canto arredondado no topo. A moldura era `px-3 pt-3` na seção; num bloco que abre a página ela lia como janela dentro de janela.
- 2026-07-30 — Pílula de navegação **centralizada de verdade** (`left-1/2`). O deslocamento de 8% à direita existia para não encostar no logo; resolvido descendo o logo, que também cresceu para `h-24`.
- 2026-07-30 — Paleta clara **tingida de petróleo** (matiz 196), não creme. O usuário pediu duas vezes "o site todo na paleta da Suzuki" e a leitura certa não era escurecer tudo: era tirar o claro do neutro. `background`, `surface` e texto passaram ao mesmo matiz dos blocos escuros, e a estrutura clara-com-blocos-escuros continua. `--surface` deixou de ser branco puro — cartão branco sobre fundo tingido salta como peça de outro projeto.
- 2026-07-30 — `.slot-grid` tinha `oklch(0.248 0.022 258)` cravado, matiz da paleta azul, e ficou fora da paleta na virada. Reescrito com `color-mix` sobre `--foreground`. **Procurar literal de cor antes de declarar uma retematização completa** — token amarrado não desalinha.
- 2026-07-30 — Marca passou a ser `fixed` e se apaga nos primeiros 180px de scroll, a pedido do usuário ("livre", não pertencendo ao bloco inicial). Era `absolute` por um motivo real — o logo é branco e fixo ficaria invisível sobre seção clara — e o desaparecimento é o que resolve isso: ela se apaga antes de a primeira seção clara chegar ao topo. Centro alinhado ao da pílula por conta, não a olho.
- 2026-07-30 — Pílula de navegação subiu de `bg-ink/75` para `/95`, por contraste. Sendo `fixed`, ela atravessa as seções claras, e a 75% o fundo claro subia por baixo: 3,52:1 nos rótulos de 14px (reprova) contra 6,58:1 a 95%. Medido por amostragem do pixel do render.
- 2026-07-30 — **Duas medições de contraste minhas deram falso positivo** e quase geraram correção desnecessária: (a) canvas transparente lê cor com alfa como quase-preto — usar canvas preenchido de branco antes; (b) amostrar perto do canto da bounding box de um elemento `rounded-full` cai fora da forma. Sempre amostrar ao lado do próprio texto.
- 2026-07-30 — **"Elementos presos em opacidade 0" é falso positivo se a rolagem do script for rápida**: os `IntersectionObserver` do Reveal precisam de ~400ms por passo. Deu 13 e depois 46 elementos "presos", ambos 0 na remedição. Rolar devagar antes de reportar bug.
- 2026-07-30 — Ícone dos CTAs: calendário por 20 minutos, depois **WhatsApp**, por correção do usuário. Todos os `PillButton` apontam para `WHATSAPP_HREF`, então a marca é a informação certa. O lucide-react não traz ícones de marca — glifo inline em `IconeWhatsApp`.
- 2026-07-30 — `.display-1` (só a headline do hero) reduzida de 3.5rem para 3rem de teto, a pedido do usuário. A 56px a headline de três linhas dominava o bloco e apertava o retrato ao lado.
- 2026-07-30 — **Galeria de casos** criada depois de Áreas, em pilha de dossiês com o registro alternando de lado — não em grade de cards, que é o molde que deu "cara de IA" em 25/07. Construída para a CFO-196/2019: um registro por caso, campos de processo (situação, conduta, duração, especialidades), aviso visível. Categorias reais, dado de caso em placeholder nomeado — inventar caso clínico é fabricar prontuário.
- 2026-07-30 — **Paleta fechou em VERDE + BRANCO**, por alternância e não por predominância: branco carrega o conteúdo de leitura, o petróleo carrega os blocos de presença, e `--foreground` é petróleo escuro — é isso que mantém a página branca sendo da Suzuki mesmo sem bloco verde na tela. Foram **quatro tentativas** para chegar aqui (creme morno → claro tingido → tudo escuro → verde e branco), as três primeiras leituras erradas minhas de "o site todo na paleta da Suzuki". Não refazer o caminho.
- 2026-07-30 — Virar a paleta de claro para escuro e volta exigiu mexer em **componente**, não só em token: `PillButton` (os dois tones), o CTA em destaque de Tratamentos, o logo do cartão de avaliações e `color-scheme`. **A promessa de "trocar clínica = trocar tokens" vale para mudar de matiz, não para inverter claro/escuro.** Corrigir `docs/replicacao.md` antes de gerar as variantes.
- 2026-07-30 — Logo monocromático na cor errada **não quebra o build, só desaparece**. O cartão de avaliações trocou de `logoEscuro` para `logo` e voltou, acompanhando a paleta. Conferir essa prop em toda virada de tema.
- 2026-07-30 — Marca do Google (`IconeGoogle`, o "G" nas quatro cores) na atribuição do cartão de resumo, com cores FIXAS — recolorir marca de terceiro para casar com a paleta é adulterá-la. O rótulo diz **"Nota no Google"**, não "avaliações": só a nota veio de lá. Nos cartões, a palavra "Google" virou o glifo, e ele só aparece com `fonte: "google"`.
- 2026-07-30 — **Página `/casos`** criada (`src/routes/casos.tsx`), primeira rota além da home. A home virou chamada: mostra `casos.limiteNaHome` casos e manda para lá. `PilhaDeCasos` e `AvisoCasos` são compartilhados pelas duas — layout duplicado divergiria na primeira correção, e o aviso da CFO-196/2019 tem de ser idêntico nos dois lugares.
- 2026-07-30 — `src/routeTree.gen.ts` **precisa ser comitado** quando entra rota nova: é gerado, mas é ele que registra a rota. Nesta rodada o vite não acrescentou o bloco `declare module` extra — o diff saiu limpo, só o `/casos`.
- 2026-07-30 — Seção de endereço movida para o **fim da página**, depois do FAQ, por pedido do usuário.
- 2026-08-03 — **Diagnóstico de densidade, medido.** O usuário pediu crítica do layout contra os princípios da Apple. Medição em 1440px revelou o número que explica o "pesado em tecnologia": **14 tamanhos de fonte distintos** numa página (referências do porte usam 4 a 6), 9 a 69 elementos por tela (contra 3 a 8), 64 ícones, 31 pills, 1.624 palavras, e **28 das 32 fotos exibidas abaixo de 15% da largura da tela**, com 8 de 13 seções sem foto nenhuma. Conclusão: **o problema não era comprimento, era densidade** — o ritmo de ~1,15 tela por seção já estava certo. Script em `scratchpad/densidade.mjs`.
- 2026-08-03 — Recomendação: **repaginar, não recomeçar.** Critério objetivo: o problema vive na escala tipográfica e no volume editorial, não no código. Recomeçar custaria a camada de conteúdo (1.005 palavras de copy real com proveniência e compliance), os tokens, o a11y, as duas rotas e os scripts de QA — nada disso é a causa. Risco real da repaginação nomeado de antemão: **não deletar o suficiente** por apego ao que já existe.
- 2026-08-03 — Os quatro dispositivos que carregavam o "ar de tecnologia", nomeados: monoespaçada nos metadados, ícone-por-item-de-lista, pill de tag, e tabela "nós vs. o convencional". Todos entraram na rodada de 24/07, quando a direção pedida era "estilo tech" — **o site estava carregando um briefing que não tinha mais.**
- 2026-08-03 — **Escala tipográfica FECHADA em cinco degraus** (48/36/22/16/13), com a regra escrita no `styles.css`: proibido `text-[...]` arbitrário em seção, proibido `text-xs`/`sm`/`lg`/`xl`. Catorze tamanhos não são hierarquia, são gradiente. Foi a mudança de maior impacto por menor esforço de todo o projeto.
- 2026-08-03 — **Seções Comparativo e Selos deletadas.** Comparativo era retórica de software B2B e encostava em desqualificar concorrente; Selos era a seção mais densa do site (68,9 elementos/tela) e duplicava `bio.titulacao`. Aprovação explícita do usuário antes de apagar.
- 2026-08-03 — **Janela de aplicativo falsa removida do Acompanhamento** — moldura com os três pontinhos de macOS repetindo as mesmas 4 etapas em cartões com pills. Três motivos somados: era o elemento mais "empresa de software" do site, era conteúdo duplicado na mesma tela, e **insinuava um painel de acompanhamento que a clínica não tem** ("Paciente · Caso clínico #0000" numa moldura de app lê como print de sistema real). Densidade da seção: 45,9 → 16,4.
- 2026-08-03 — **Comparador arrastável e as 12 miniaturas de Estrutura deletados**, trocados por 3 fotos em largura total (medido: 100% da viewport). Era o maior desperdício da página — as fotos do consultório são boas e estavam sendo usadas como prova em miniatura em vez de argumento. O comparador era o componente da Fase 4; construído do zero e removido por não servir mais à direção. Densidade: 15,5 → 2.
- 2026-08-03 — **Áreas virou índice tipográfico**: número + nome. Saíram 19 pills e as 8 descrições reveladas por hover. Texto que só existe se o mouse passar em cima não é lido por quem rola a página, mas pesa no DOM e na atenção. `AreaAtuacao.descricao` FICA no conteúdo — é copy real e é o material da futura página de cada especialidade. Densidade: 50 → 14,6.
- 2026-08-03 — **Depoimentos: uma citação em corpo grande, sem carrossel.** O laço contínuo truncava cada depoimento em 6 linhas com "…", que é o pior dos dois mundos: ocupa o espaço de um texto inteiro e não entrega nenhum. 619 → 129 palavras.
- 2026-08-03 — Errei duas vezes no processo desta rodada, ambas corrigidas antes do commit: (a) um script de "limpeza" de espaços com `re.sub(r'"\s+', '"')` arrancou o espaço em volta de **toda aspa** dos `.tsx`, mangling imports e atributos JSX — revertido com `git checkout` e refeito sem a limpeza; (b) comecei pelos itens mais baratos, que mudavam pouco acima da dobra, e o usuário reportou "não mudou nada" com razão. **Ordenar repaginação por visibilidade, não por facilidade.**
- 2026-08-03 — **AS AVALIAÇÕES DO GOOGLE ENTRARAM.** Quatro, reais, verbatim: Lucia Feitoza Caversan, EDI STEIN, Mauricio Roberto e Guilherme Rocha, todas 5 estrelas. Encerra a pendência aberta desde 30/07.
- 2026-08-03 — **O caminho que funcionou foi PRINT.** O usuário perguntou se link ou print resolveriam; testei os hosts na hora: `maps.app.goo.gl`, `google.com/maps` e `search.google.com` seguem bloqueados, e o link nunca era o que faltava — o `place_id` estava no repo desde 30/07. O bloqueio é o Google não servir a aba de avaliações para IP de datacenter. **Print é imagem, e imagem se lê.** Depois de quatro tentativas de raspagem e uma proposta de Places API com cartão de crédito, a solução era o usuário fotografar a tela. Registrar como primeira opção numa próxima: pedir print antes de propor API.
- 2026-08-03 — Texto das avaliações mantido **verbatim**, com os desvios de digitação dos autores ("A clinica" sem acento, "desejada.Parabéns!" sem espaço, vírgulas espaçadas, emoji de palmas). São palavras de pacientes reais; normalizar quote é reescrever o que a pessoa disse.
- 2026-08-03 — `quando: ""` nas quatro, por pedido do usuário — todas são de "8 meses atrás" e ele não quis exibir recência. `foto: null` porque as fotos de perfil não são baixáveis (host bloqueado, print sem resolução): cai no avatar de inicial, que é melhor que foto errada.
- 2026-08-03 — **Armadilha de leitura de print, quase caí nela:** cada avaliação mostra "14 avaliações", "3 avaliações" embaixo do nome do autor. Esse é o total de avaliações que **aquela pessoa** escreveu no Google, NÃO o total da clínica. `totalLabel` segue sem número — o total da clínica continua desconhecido.
- 2026-08-03 — Os 3 depoimentos do site antigo entraram e saíram no mesmo dia: mantidos por pedido, removidos por pedido logo depois. **A faixa ficou só com as 4 avaliações do Google.** Duas consequências encadeadas: `resumo.fonteLabel` voltou para **"Avaliações no Google"** (agora todo cartão veio de lá), e a faixa voltou para `items-stretch` — com todas as avaliações entre 20 e 45 palavras, altura uniforme fecha alinhada (369px) em vez dos 672px que os depoimentos longos impunham. `fonte: "site"` fica no tipo sem nenhum item usando: é a trava para quando voltar a haver depoimento colhido pela clínica.
- 2026-08-03 — Esteira de depoimentos com `items-start`, não `items-stretch`. Avaliação do Google tem 20–45 palavras e depoimento do site tem 70–126: uniformizando altura, os curtos esticavam para 672px e sobravam ~400px de branco dentro deles. **Com procedência mista numa faixa só, altura uniforme sem truncar é impossível** — e truncar é o erro que derrubou o carrossel de 30/07.
- 2026-08-03 — Duas avaliações citam "dra Ana" e "Dra Ana Carolina", e a lista de equipe do repo (vinda do site antigo) tem Ana Lúcia e Carolina Cabral, não uma Ana Carolina. Provavelmente a lista está desatualizada. **Conferir com a clínica antes de publicar a página de equipe.**
- 2026-08-03 — Sobras de padding do wordmark removido: o rodapé ficou com `pb-40 md:pb-56` (14rem) depois que a palavra gigante saiu, e sobravam 224px de verde vazio abaixo do copyright, com o arco dourado brilhando no nada. **Ao remover um elemento, procurar o espaçamento que existia só para ele.**
- 2026-08-12 — Telefone `(41) 99206-1073` confirmado pelo usuário e aplicado. Encerra a pendência aberta em 30/07 e tira a primeira linha da tabela de bloqueios de publicação. Exibido em 4 lugares, `tel:+5541992061073` e `wa.me/5541992061073` derivados do mesmo campo.
- 2026-08-12 — **Retrato do hero passou a SANGRAR na borda direita do bloco**, na altura inteira. Era cartão de 30% da largura dentro da grade, e ampliá-lo ali roubava largura da headline (a linha "complexidade, conduzida" quebrava). Sangrando, ganha presença por altura e por corte sem disputar espaço com o texto. Arquivo trocado para 2560×703 — o de 500×482 ficaria mole nesse tamanho. Fio dourado e flutuação ficaram só na versão mobile: em imagem que sangra não há borda para o fio contornar.
- 2026-08-12 — **A costura vertical na borda da foto não era o degradê**, e eu ia mexer no lugar errado. O arco de luz era a primeira camada e a faixa da foto o COBRIA, então o brilho parava morto na borda da imagem — desenhando exatamente a aresta que o degradê existe para dissolver. Amostragem de luminância em 1440, coluna x=864: 40 à esquerda contra 24 à direita, 16 pontos de salto em um pixel. Corrigido pela ORDEM das camadas, não por gradiente novo. **Antes de suavizar uma borda, checar se alguma camada de atmosfera está sendo recortada por ela.**
- 2026-08-12 — Marca sobrepunha a navegação entre 1024 e 1090px: pílula centralizada na janela começando em 230px e marca de 80px terminando em 238px, com o "SUZUKI" coberto. Só aparecia nessa faixa porque a navegação surge em `lg`. Marca cai para 64px em `lg` (com o `top` recalculado, centro em 65px) e os vãos da pílula apertam um degrau. **Toda vez que a marca ou o padding da pílula mudar, remedir a folga em 1024** — é o pior caso, não o desktop largo.
- 2026-08-12 — **Tratamentos era uma tabela de preços de software, e a anatomia era inteira:** três colunas iguais, a do meio destacada, selo "Mais procurado", uma linha de valor por coluna, e um botão por coluna — num bloco cuja copy diz que a clínica NÃO trabalha com tabela fechada. A seção contradizia o próprio texto. Virou ficha técnica em faixas horizontais. `TratamentoCard` virou `TratamentoEixo` e perdeu `valorLabel`, `cta`, `destaque` e `badge`: **campo morto no tipo é convite a reintroduzir o padrão.**
- 2026-08-12 — Os três botões de Tratamentos apontavam para o MESMO link de WhatsApp. **Chamada repetida com destino idêntico não é escolha**, e o header fixo já carrega "Agendar" em toda a página. Ficou uma. O selo "Mais procurado" saiu por ser pressão de demanda aplicada a decisão de saúde — o destaque de fundo na coluna do meio existia só para sustentá-lo.
- 2026-08-12 — FAQ em duas colunas, título à esquerda acompanhando a rolagem. O defeito era a largura: 1120px de régua para uma pergunta de ~300px, com o chevron a mais de 1000px do rótulo. **Affordance separada do próprio texto por um vão do tamanho da tela não funciona como affordance.** O accordion FICA — é diferente do texto revelado por hover que saiu das Áreas, porque ali não havia como saber que o texto existia e aqui a pergunta é o próprio convite.
- 2026-08-12 — "Telefone" e "WhatsApp" eram duas linhas com o MESMO número embaixo das duas, desde que o celular passou a servir para os dois: lê como erro de conteúdo. Agora viram uma linha quando coincidem e voltam a ser duas sozinhas quando não coincidirem. Os três rótulos coexistem no tipo **por causa das variantes** — Rogério e Décio podem ter fixo e celular separados.
- 2026-08-12 — **Corpo clínico era a última grade de cartões uniforme da página**: oito caixas com borda e um retrato circular de 48px dentro. Virou grade de retratos sem cartão nenhum. Os nove retratos são do mesmo ensaio de estúdio (mesmo fundo creme, mesmo uniforme, mesma proporção), e é isso que faz a grade funcionar sobre o bloco escuro — nove campos claros de tom idêntico leem como série, não como remendo.
- 2026-08-12 — Recorte quadrado no corpo clínico por RITMO, não por gosto: em 3:4 as duas fileiras levavam a seção a 2,13 telas contra ~1,15 de média das outras. O quadrado devolveu ~180px sem tirar retrato da grade. Fechou em 1,94 tela, ainda a mais alta da página, e **isso é aceitável**: o diagnóstico de 03/08 concluiu que o problema é densidade, não comprimento, e a densidade dela caiu de 23 para 17.
- 2026-08-12 — **Duas métricas minhas dão falso positivo e quase geraram trabalho inútil.** (a) O contador de átomos acusa 191,5/tela em Depoimentos por causa de 99 `<svg>`: fileira de 5 estrelas com preenchimento fracionário são 10 nós, a esteira duplica os cartões, e **uma fileira de estrelas é percebida como UM objeto**. (b) O check de overflow acusou 201 elementos "fora da direita" com `scrollWidth == innerWidth`, ou seja zero rolagem horizontal — são os itens duplicados das esteiras e a foto sangrada do hero, todos recortados de propósito. Conferir `scrollWidth` antes de acreditar em contagem de overflow.
- 2026-08-12 — **Seção "Cada etapa, acompanhada." removida**, a pedido do usuário. Saiu inteira — componente, conteúdo, os dois tipos e o link "Como conduzimos" do rodapé, que apontava para `#acompanhamento`: **âncora de rodapé para seção inexistente rola para o topo sem avisar**, e o visitante não tem como saber que o destino sumiu. Ao remover seção, procurar quem linka para ela.
- 2026-08-12 — **Áreas virou grade 4×2 com ícone**, de um template do Aceternity mandado pelo usuário. Isso reintroduz os dois padrões removidos em 03/08 (grade uniforme e ícone por item), e a volta se sustenta por um motivo: a objeção de 03/08 era o texto existir **só no hover**, e agora as descrições são permanentes — o hover só acende fundo e barra. Registrado como exceção no §5.1 para a próxima sessão não "corrigir" de volta.
- 2026-08-12 — Adaptar template de terceiro custa mais que trocar cor: saiu todo `dark:` (o projeto não tem modo escuro por classe), `text-lg`/`text-sm` viraram `display-3`/`text-base` pela escala fechada, `px-10` virou `px-6` (em coluna de 280px, 40px de recuo quebra nome de especialidade em três linhas), e o azul do realce virou `--accent` — **dourado não serve para realce em fundo claro**, L 0.80 desaparece.
- 2026-08-12 — **Oito ícones dentais desenhados no projeto.** O `lucide-react` não tem nenhum ícone dental e o `@tabler/icons-react` tem três, o que deixaria cinco especialidades com ícone genérico — e ícone genérico em especialidade clínica é enfeite no lugar de informação. Os quatro que usam silhueta de dente usam a MESMA silhueta, variando só a marca interna; renderizam a 28px porque a 24px a marca interna não se distingue da raiz.
- 2026-08-12 — **Meu primeiro path de dente fechava em x≈6,8 em vez de 12**: o lado direito nunca era desenhado e a silhueta virava um blob torto, em três ícones ao mesmo tempo. Na página, a 24px, passava por "ícone pequeno" — só apareceu ao renderizar os oito a 64px num quadro HTML isolado. **Aprovar desenho em tamanho grande antes de pôr na página**, e conferir que path simétrico fecha no ponto de partida.
- 2026-08-12 — **FAQ com foto ao lado e accordion próprio**, do segundo template do usuário. Duas coisas do original NÃO entraram: a fonte Poppins, porque `@import` de fonte remota derruba este build e a tipografia é a identidade da Suzuki; e o `<div onClick>`, que virou `<button>` com `aria-expanded`/`aria-controls` — no template a pergunta não é alcançável por teclado nem anunciada como controle, e quem navega por Tab não abre resposta nenhuma. Visual idêntico, passa a funcionar sem mouse.
- 2026-08-12 — A foto do atendimento sobreviveu à remoção da seção dela e foi para o FAQ: é a única do acervo que mostra trabalho em curso, e as perguntas da seção são sobre isso. **Ao apagar seção, checar se algum asset dela é único** antes de deixá-lo órfão.
- 2026-08-12 — **Bloco escuro não usa `--section-py` por dentro.** A Bio usava, e os 160px viravam ~200px de verde vazio acima do nome — o "espaço sobrando" que o usuário apontou. `--section-py` é o espaço ENTRE seções que dividem o mesmo fundo, onde o vão é a própria separação; dentro de uma faixa a separação já é a borda do bloco. Ficou em 96px, e o container repete a largura e o `px` do `Section` para o conteúdo alinhar com as seções claras vizinhas.
- 2026-08-12 — `git add -p` é **interativo e não roda neste ambiente**: a chamada imprime o hunk e segue sem estagiar. Tentar dividir um commit por hunk em arquivo compartilhado terminou num `--amend` que engoliu tudo. Quando várias mudanças da mesma rodada compartilham `types.ts`/`clinica.ts` e dependem uma da outra, **um commit só é mais honesto que uma divisão que produz commit que não compila**.
- 2026-08-12 — **A faixa sangrada do retrato do hero foi reprovada e desfeita no mesmo dia:** "muito pra direita, não centralizada, cortada". A causa era GEOMÉTRICA — arquivo 2560×703 (3,6:1) numa faixa 576×693 (0,83:1) faz `object-cover` mostrar 22% da largura, ou seja um talho vertical. Nenhum `object-position` resolve. Voltou o arquivo original de 500×482 num cartão `aspect-square`, recorte de 3,6%. **Não encaixar arquivo panorâmico em caixa vertical.**
- 2026-08-12 — Manter DUAS versões da mesma foto (faixa sangrada em `lg`, cartão no mobile) foi o que deixou o recorte extremo passar no desenvolvimento: em tela estreita ele não aparecia, e eu conferia as duas como se fossem casos independentes. Agora é uma figura só para todos os tamanhos.
- 2026-08-12 — **`--section-py` vale para os DOIS lados**, então o vão entre seções é o dobro dele. Estava em 5rem/8rem, o que dava 256px no desktop e vãos medidos de até 344px — o usuário apontou como "espaços em branco entre as seções". Foi para 3,5rem/4,5rem e os vãos ficaram entre 137 e 180px; a página caiu de 12,2 para 10,8 telas sem perder uma palavra. **Ao mexer nesse token, medir o vão resultante, não o valor.**
- 2026-08-12 — Meu medidor de vãos usa o texto-FOLHA, não a caixa do elemento, então superestima onde a última peça é um botão com padding (acusou 232px entre Estrutura e Áreas, sendo ~144px reais) e subestima onde a primeira é um título com leading (96px entre FAQ e Localização, sendo ~150px). **Conferir vão suspeito por screenshot antes de corrigir.**
- 2026-08-12 — **"Comece pela avaliação." saiu do rodapé e virou seção** depois da Localização. A moldura do cartão não veio junto: no rodapé ela existia para o CTA se destacar das colunas de navegação logo abaixo, e virando seção o bloco escuro já é a superfície — manter a borda seria caixa dentro de caixa. Os três campos saíram de `FooterContent` para `ChamadaFinalContent`, porque seção própria tem conteúdo próprio.
- 2026-08-12 — Fotos de Diferenciais e do FAQ removidas a pedido, as duas com `imagem: null`. Nos dois casos o componente precisou deixar de RESERVAR a coluna, não só de renderizar a imagem: em Diferenciais a coluna de 17rem vazia comprimia o texto de abertura a 70% da largura, e no FAQ a coluna da esquerda ficaria com só a nota dentro e a altura das sete perguntas. **`null` numa prop de imagem só funciona se o layout também colapsar.**
- 2026-08-12 — "Home" entrou na navegação (`#top`, não `/`: âncora rola suave, a rota recarregaria a página). Alargou a pílula em 74px e **recriou a colisão com a marca em 1024**, com a folga caindo de 44px para 9px. Marca para 56px em `lg` e vãos da pílula apertados devolveram 39px. Pílula centralizada distribui cada pixel de largura nos dois lados — **remedir 1024 a cada item novo**.
- 2026-08-12 — O rodapé tinha o MESMO defeito de telefone que a Localização, e eu corrigi só um dos dois na primeira passada: o mesmo número embaixo de "Telefone" e de "WhatsApp". **Ao corrigir defeito de conteúdo repetido, procurar todos os lugares que exibem o mesmo campo** — aqui eram quatro.
- 2026-08-13 — **"As edições não saíram" era a URL, não o push.** `origin/main` e o `latest_commit_sha` do projeto do João batiam no mesmo commit, e o screenshot do Lovable já mostrava o trabalho novo. A causa: a cópia CONGELADA do Giulliano (`1896d5fd`, parada em 25/07) é a única com `is_published: true`, servindo `clinic-base-starter.lovable.app` — então o único endereço público do projeto mostra o site de julho. Ver §8. **Antes de refazer push ou reabrir código, comparar `git rev-parse origin/main` com o `latest_commit_sha` dos dois projetos.**
- 2026-08-13 — **Tratamentos perdeu a última chamada e a nota de valor**, os dois a pedido do usuário. A seção agora não exibe valor em lugar nenhum nem convida a agendar: a política de orçamento vive só no parágrafo de abertura, e a conversão está no header fixo, no hero e na "Comece pela avaliação". `notaValor` e `cta` saíram do tipo em vez de virarem opcionais — **campo morto neste tipo específico é o que sustentou a tabela de preços por três semanas**. Consequência a vigiar: a grade de três colunas ficou com UMA diferença só em relação às de Áreas e Diferenciais (a contagem de colunas), então não usar essa grade numa quarta seção.
- 2026-08-13 — Antes de remover o botão, medi os cinco "Agendar" da página por cor de fundo, porque o print não diz qual é qual: quatro são pílulas claras (header ×2, hero, chamada final) e só o de Tratamentos era escuro. **Print de um botão que se repete não identifica o botão** — amostrar a cor computada antes de apagar.
- 2026-08-13 — **"Comece pela avaliação." e o rodapé estavam encostados**, e a causa era estrutural: as duas são faixas escuras sangradas e nenhuma das duas usa `--section-py` por fora, então só a goteira lateral separava as bordas. `pt-6 md:pt-8` no rodapé — o **dobro da goteira**: igual à goteira (12/16px) o vão viraria um fio entre dois cantos de raio 24px, e no ritmo de seção sobraria mais branco que a separação entre duas superfícies precisa. Medido: 24px no mobile, 32px no desktop, goteira 12/16, zero overflow. **Duas seções que não participam do ritmo de seção não ganham vão nenhum de graça** — ao criar faixa sangrada nova, conferir quem vem antes e depois.
- 2026-08-13 — **Ordem das seções ditada pelo usuário**, em lista: hero, casos, especialidades, corpo clínico, experiência aplicada, ambiente, como funciona, avaliações, onde ficamos, comece a sua avaliação, rodapé. Aplicada em `src/routes/index.tsx`. Casos subiu da 5ª para a 2ª posição, o que muda o argumento da página: ela agora abre pelo trabalho feito, não pelos diferenciais.
- 2026-08-13 — **O FAQ não estava na lista e FICOU**, entre Depoimentos e Localização. Duas razões, e as duas são evidência, não gosto: o usuário sempre pediu remoção com verbo explícito ("essa seção quero que retire", "esse botão pode tirar"), e o FAQ tinha sido refeito duas vezes a pedido dele no dia anterior. "Como funciona" da lista é Tratamentos — as outras dez etiquetas batem uma a uma com o título ou o assunto de uma seção existente. **Se a intenção era removê-lo, é uma linha no index e outra no clinica.ts.**
- 2026-08-13 — **Cinco imagens entraram nos cartões de Casos**, uma por especialidade: implante de titânio, facetas de cerâmica, aparelho fixo, canais radiculares, raspagem periodontal. Todas das páginas de especialidade do site antigo, e todas ilustração ou banco de imagem — **nenhuma é registro clínico**. É o que torna o uso possível: registro de paciente exige autorização de uso de imagem por escrito, e a CFO-196/2019 restringe imagem comparativa. O alt descreve o que a imagem É, e uma frase nova em `casos.aviso` diz isso na tela, nos dois lugares onde as imagens aparecem.
- 2026-08-13 — O filtro para escolher as cinco foi o **RECORTE**, não o assunto: o cartão da galeria é retrato 2:3 e quase todo arquivo do acervo é paisagem 1,5:1, então um recorte centralizado mostra 44% da largura. Só serve imagem de assunto vertical ou compacto. Foi o que descartou a fileira de próteses e as arcadas inteiras — cortadas, viram talho sem assunto. Mesma armadilha da foto do hero em 12/08. Duas foram descartadas por CONTEÚDO: `asset-5-2` (modelo loira, sorriso de estúdio, fundo azul-claro — três clichês proibidos de uma vez) e `asset-7-2` (metade do dente limpa, metade com cálculo — imagem comparativa, que é o gesto que a resolução restringe; ser ilustração não muda o que comunica).
- 2026-08-13 — **A pílula fixa cortava o título de TODA seção alcançada pelo menu**, e era defeito antigo que só apareceu ao remedir as âncoras depois da troca de ordem: base da pílula em 85px, topo do título em 72px. `scroll-mt-12` no `Section` e nas três seções de marcação própria (Estrutura, Bio, Chamada final) — título passou a cair em 120px, folga de 35px. **Nenhum `scroll-mt` existia no projeto**; ao criar seção com id, herdar o do `Section` ou repetir a classe.
- 2026-08-13 — **O layout passou a ter versão em arquivo `.html` avulso** (`scripts/congelar-html.mjs`), a pedido do usuário: "gerar uma página html do layout ao invés de link". Faz sentido além do pedido — é o antídoto para a confusão de URLs do §8, porque o arquivo não depende de qual projeto do Lovable está publicado. `snapshots/` está no .gitignore: 3,2 MB de imagens embutidas não entram no repo nem no sync.
- 2026-08-13 — A armadilha do congelamento, e ela consumiu a primeira versão inteira: **o CSS não pode sair do DOM**. Em dev o TanStack Start emite `<link rel="stylesheet" href="/src/styles.css">`, que num `file://` é 404 — o arquivo saiu com zero regra de estilo, fonte Times New Roman e fundo transparente, e `document.styleSheets.length` era 2, o que faz o defeito passar por "tem CSS". Medir `cssRules.length`, não a contagem de folhas. O CSS vem de `.output/public/assets/styles-*.css`, já compilado.
- 2026-08-13 — Três detalhes menores do congelamento, todos medidos: (a) `loading="lazy"` tem de sair, senão imagem fora da viewport nem decodifica — 5 das 7 de /casos vinham "quebradas"; (b) o `src` original precisa virar `data-congelado` com um GIF de 1px no lugar, senão o navegador dispara 29 requisições `file:///imagens/...` antes de o script trocar pelo data URI; (c) a marca volta a ser `absolute`, porque `fixed` sem o JS que a apaga deixa o logo branco fixo por cima das seções claras.

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
- **Egress policy:** Claude alcança `github.com`, `registry.npmjs.org` e — descoberto em
  30/07 — **`maps.googleapis.com`**. O resto (site antigo, referência, `google.com/maps`,
  `search.google.com`, 21st.dev) é 403. Quando precisar da web aberta, delegar ao agente do
  Lovable, que tem rede própria — mas ele tem IP de datacenter, então o Google o trata como
  bot (ver §5.2). Rede própria não é o mesmo que rede confiável.
- **`bun install` quebra depois de sync do Lovable.** O `bun.lock` que ele escreve resolve
  os pacotes `@lovable.dev/*` por `europe-west1-npm.pkg.dev` (cache interno deles), host
  **bloqueado** aqui — e `bun install --registry` não sobrepõe URL já gravada no lockfile.
  As mesmas versões existem em `registry.npmjs.org`. Contorno, sem sujar o commit:
  `sed -i 's#https://europe-west1-npm\.pkg\.dev/lovable-core-prod/sandbox-npm-cache/#https://registry.npmjs.org/#g' bun.lock`,
  instalar (os hashes sha512 continuam conferindo, é o mesmo tarball), e **restaurar o
  `bun.lock` antes de comitar**.
- **`bunx vite dev` reescreve `src/routeTree.gen.ts`** com um bloco `declare module` que a
  versão do plugin no Lovable não gera. É arquivo gerado: `git checkout --` nele antes de
  comitar, senão o diff briga com o sync a cada rodada.
