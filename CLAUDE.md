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
| — | Repaginação por densidade (diagnóstico da Apple) | **Concluída em 03/08** — escala tipográfica fechada em 5 degraus, 2 seções deletadas |
| — | Rodada de templates do usuário (Áreas, FAQ, casos, mapa) | **Concluída em 12/08** |
| — | Ordem das seções, hero em colagem, corpo clínico em círculo | **Concluída em 13/08** — ver §5.2 |
| — | Replicar para Rogério e Décio | **Não iniciada** — ver a ressalva de §5.2 e `docs/replicacao.md`, que precisa de correção antes |

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
própria — **a lista atualizada é a tabela de anatomias em §5.2**, e é lá que se olha antes
de criar seção nova; este parágrafo já descreveu três layouts diferentes e não vale mais
como referência. O que continua valendo é a regra: **não reintroduzir grid de cards
uniforme**, e a exceção registrada da grade de células, que já serve TRÊS seções e não pode
servir uma quarta.

**Imagens reais estão no site** desde 29/07: 12 fotos de estrutura, 9 retratos de equipe,
3 fotos de depoentes e o logo. Baixadas pelo agente do Lovable, que tem rede própria —
`suzukiodontologia.com.br` é bloqueado para Claude. Ver `public/imagens/originais/MANIFESTO.md`.

---

## 5.2 Ponto de retomada

**Última sessão: 19/08.** O último commit da `main` é o da abertura em `hero-scrub`. Nada
pendente no working tree, nada esperando OK.

⚠️ **A HOME ABRE PELA ABERTURA (`#abertura`)**, que nasceu do template do Ferrari
Amalfi em 19/08 e foi **despida em três rodadas do mesmo dia**. Hoje é: a marca completa
da Suzuki em cima, e embaixo dela a arcada 3D **se formando** — gengivas com os
implantes de titânio, e as coroas entrando uma a uma, primeiro a de cima e depois a de
baixo. SEM moldura,
sem sombra e sem uma palavra de texto. As duas peças estão PARADAS; a rolagem só comanda
o `currentTime` do vídeo. Custa **2,4 telas**, e esse número é `TRILHO_MULT` em
`AberturaArcada.tsx` — um lugar só.

O que saiu, em ordem, tudo a pedido dele: o zoom e o afastamento das pontas ("é para ela
manter do mesmo tamanho que inicia, sem o efeito de aproximação"), o lockup recortado da
marca ("a logo da Suzuki não tá completa"), a assinatura "ODONTOLOGIA ESPECIALIZADA"
("tire o odontologia especializada"), e o cartão em volta do vídeo ("como se ela fizesse
parte do site, sem sombras").

⚠️ **O CLIPE VOLTOU A SER A FORMAÇÃO** em 19/08, a pedido dele ("aparecer a gengiva →
depois os implantes de ferro → e por fim os dentes brancos"). O giro de três quartos,
que ficou no ar por algumas horas do mesmo dia, saiu — está no git, em `e56679a`.

⚠️ **O QUE ELE PEDIU E NÃO EXISTE: as duas coisas JUNTAS** — a arcada girando de lado
ENQUANTO os ferros e os dentes entram. Não é recorte nem encode, é geração nova em 3D, e
em 19/08 os dois caminhos fecharam no mesmo dia: **Claude não tem ferramenta de geração
nesta sessão** e **ele está sem crédito no Higgsfield**. O prompt pronto para gerar foi
entregue a ele no chat. Enquanto isso o site serve a formação, que entrega dois dos três
tempos do pedido — falta a gengiva VAZIA antes dos implantes, porque no quadro 0 os pinos
já estão instalados.

⚠️ **`assets-originais/` NÃO SOBREVIVE a contêiner novo** — é gitignored, e os quatro
masters de 18/08 já se perderam uma vez. Recuperável é só o que foi COMITADO: os encodes
da formação em `38f8b02` e os 6 quadros de etapa em `70e56cb`.

O histórico: era a SEQUÊNCIA DE FORMAÇÃO (dentes entrando um por vez, de
cima e depois de baixo — pedido explícito em 17/08) e virou a arcada COMPLETA girando,
porque ele pediu "meio de lado". Nenhum dos quatro masters que ele mandou tem as duas
coisas juntas; ter vista de lado COM os dentes entrando exige geração nova. O clipe da
formação está no git e em `assets-originais/2-dentes-um-a-um.mp4`. O hero estilo apple.com veio logo abaixo, de 18/08.
O histórico das três aberturas anteriores (vídeo com viagem até o hero, tela só com a
logo, e esta) está no §9; **não reconstruir nenhuma de memória, está tudo no git.**

O que aconteceu nessa sessão, em uma linha cada — o log do §9 tem o detalhe e o
porquê de cada decisão:

| O quê | Onde |
|---|---|
| Ordem das seções trocada pelo usuário | `src/routes/index.tsx`, e o menu/rodapé seguem ela |
| 5 imagens nos cartões de Casos, uma por especialidade | `public/imagens/casos/` |
| Hero refeito no template de COLAGEM: texto + 3 números à esquerda, 3 fotos à direita | `Hero.tsx` |
| Foto da equipe recortada à mão (fundo transparente) e integrada ao bloco | `public/imagens/hero/` |
| Corpo clínico: passou por círculo aberto por rolagem (13/08) e terminou em ESTEIRA em laço, retratos em COR e cabeçalho um degrau acima (14/08) | `CorpoClinicoEsteira.tsx` |
| CRO dos 8 saiu da tela (só a especialidade) — **ver o aviso legal abaixo** | `BioMembro` |
| Gerador de `.html` avulso do layout | `scripts/congelar-html.mjs` |
| `scroll-mt-12` nas seções: a pílula fixa cortava o título de toda âncora do menu | `Section.tsx` + 3 seções |

**O que fazer a seguir não está definido pelo usuário.** A última rodada foi de
refino visual pedido item por item; ele encerrou com "salve tudo isso". Ou seja:
abrir a próxima sessão perguntando o que ele quer, e não presumindo trabalho. As
únicas frentes com trabalho conhecido são as pendências abaixo, e nenhuma delas
depende de Claude — todas esperam dado da clínica ou decisão dele.

### O aviso que mais importa

⚠️ **O CRO dos oito profissionais não é mais exibido**, a pedido dele em 13/08
("manter apenas a especialidade"). A Resolução CFO-196/2019 exige nome e número de
inscrição na divulgação de cirurgião-dentista, e hoje o site só mostra CRO do
responsável técnico (hero e título da Bio). O dado NÃO foi apagado: vive em
`BioMembro.cro`, e voltar a exibir é uma linha no cartão de
`CorpoClinicoEsteira.tsx`. Isso foi dito ao usuário quando ele pediu. **Antes de publicar,
confirmar com quem cuida do jurídico da clínica.**

### Pendências que bloqueiam publicação

| O quê | Onde aparece | Quem resolve |
|---|---|---|
| ~~Telefone e WhatsApp~~ | ✅ resolvido em 12/08: `(41) 99206-1073` confirmado pelo usuário e aplicado | — |
| CRO e especialidade dos 8 profissionais | `[ESPECIALIDADE]` na tela; o CRO está em `m.cro` e **não é exibido** desde 13/08, a pedido do usuário | página `/equipe/`, via agente do Lovable |
| 4 respostas do FAQ | `[CONFIRMAR: ...]` na tela | clínica |
| ~~Logo em versão escura~~ | ✅ resolvido em 30/07: `brand.logoEscuro`, os 21 traços do SVG recoloridos | — |
| CNPJ e nome jurídico | `[CNPJ]`, `[NOME DA CLÍNICA]` | usuário |
| 3 casos da galeria: situação, conduta, duração e registro clínico | `[CASO 0N — ...]` na tela | clínica |
| Latitude e longitude da clínica | não bloqueia: sem elas a Localização usa o embed do Google, que acha pelo endereço. Com elas, liga o mapa em mosaico de tiles | usuário — botão direito no ponto exato no Google Maps |

**CRO é obrigatório em publicidade odontológica**, e desde 13/08 ele nem é exibido para os
oito — ver o aviso no começo do §5.2. Enquanto isso não se resolver, o site não vai ao ar.

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

**Nenhuma.** A lista fechou em 12/08. As ONZE seções da home têm anatomia própria, e são
estas — **é esta tabela que se consulta antes de criar seção nova**, para não repetir gesto:

| Anatomia | Seções |
|---|---|
| Palco `sticky`: marca e arcada 3D PARADAS, sem moldura, e a rolagem só comanda o tempo do vídeo | Abertura |
| Bloco escuro sangrando, duas colunas: texto + fileira de números à esquerda, COLAGEM de três fotos sobrepostas à direita | Hero |
| Painel escuro com a lista + pilha de fotos que troca (`CarrosselDeCartoes`) | **Áreas (8), Diferenciais (4), Tratamentos (3)** |
| Esteira contínua | Estrutura, Depoimentos, **corpo clínico da Bio** |
| Pilha de cartões arrastável | Casos (na home) |
| Pilha de dossiês alternando de lado | Casos (em `/casos`) |
| Esteira de retratos em laço, painel de nome dentro do cartão | Bio (corpo clínico) |
| Título em cima, accordion em coluna única de largura cheia | FAQ |
| Fileira de dados à esquerda + cartão de mapa à direita | Localização |
| Faixa escura curta, texto à esquerda e chamada à direita | Chamada final |

São **onze** seções mais o rodapé, na ordem: Hero, Casos, Áreas, Bio, Diferenciais,
Estrutura, Tratamentos, Depoimentos, FAQ, Localização, Chamada final, Footer. "Cada etapa,
acompanhada." foi removida em 12/08 e a chamada final saiu do rodapé e virou seção na mesma
data.

⚠️ **`CarrosselDeCartoes` SERVE TRÊS SEÇÕES, e isso foi DECISÃO DO USUÁRIO CONTRA
UMA OBJEÇÃO EXPLÍCITA.** Não "corrigir" numa próxima sessão sem falar com ele — é o
mesmo caso da exceção de Áreas em 12/08. A objeção que ele ouviu antes de mandar
seguir está inteira no topo de `CarrosselDeCartoes.tsx`, em três pontos: seriam três
seções com a mesma anatomia (a 3ª, a 5ª e a 7ª da home), que é o defeito que reprovou
o layout como "cara de IA" em 25/07; Diferenciais e Tratamentos não têm foto própria;
e as fotos de Tratamentos são REPETIDAS de Especialidades. Ele respondeu "mesmo assim,
o carrossel nas duas".

🗑️ **`GradeDeCelulas` foi APAGADA** — ficou sem uso nenhum quando a terceira seção
saiu dela. Está no git, em `bc92186`. Seis das treze seções sendo o mesmo molde foi exatamente o que
reprovou o layout como "cara de IA" em 25/07.

**Quatro seções têm foto**: o hero (colagem de três — a equipe recortada, um sorriso
em plano fechado e um atendimento em curso), Estrutura (esteira de
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
src/lib/contato.ts            telHref() / whatsappHref() / mapaHref() — derivam o link
                              do próprio dado exibido
src/hooks/useReveal.ts        IntersectionObserver à mão
src/components/Reveal.tsx     wrapper de animação de entrada (aceita `style`)
src/components/Header.tsx     header fixo (pílula), marca que se apaga na rolagem
src/components/Primitives.tsx PillButton, ArrowButton, TextLink
src/components/IconesEspecialidade.tsx  8 ícones dentais desenhados aqui (o lucide
                              não tem nenhum)

src/components/sections/
  AberturaArcada.tsx        a abertura: marca, arcada se formando, assinatura
                            (exporta ABERTURA_VH e ABERTURA_NAV_VH, que o Header usa)
  Section.tsx                 wrapper de ritmo (--section-py) + SectionHeader + scroll-mt
  Hero.tsx                    colagem de 3 fotos + fileira de números
  Casos.tsx                   PilhaDeCasos (dossiê, /casos) + AvisoCasos + seção da home
  GaleriaDeCasos.tsx          pilha arrastável de cartões (home)
  Areas.tsx / Diferenciais.tsx / Tratamentos.tsx
                              as TRÊS usam CarrosselDeCartoes — ver a objeção no
                              topo dele antes de mudar isso
  CarrosselDeCartoes.tsx      lista escura + pilha de fotos, sem dep. de animação
  GradeDeCelulas.tsx          grade de células com fio, ícone e realce no hover
  Bio.tsx                     faixa escura: responsável + corpo clínico
  CorpoClinicoEsteira.tsx     esteira de retratos em laço, uma forma para toda largura
  Estrutura.tsx               esteira de 12 fotos
  Depoimentos.tsx             esteira das 4 avaliações do Google
  Faq.tsx                     accordion em coluna única, acessível por teclado
  Localizacao.tsx             dados + MapaLocalizacao
  MapaLocalizacao.tsx         mosaico de tiles (ou embed do Google sem coordenadas)
  ChamadaFinal.tsx            faixa escura com o convite à avaliação
  Footer.tsx                  navegação e créditos

src/routes/index.tsx          ordem das seções + props tipadas
src/routes/casos.tsx          página /casos, com todos os casos em dossiê
src/styles.css                @theme + :root com os tokens; --section-py; escala de
                              cinco degraus; máscaras e keyframes
scripts/congelar-html.mjs     gera o layout num .html avulso (ver §"Como validar")
```

⚠️ **Seções e formas que EXISTIRAM e não voltam:** Selos, Acompanhamento ("Cada etapa,
acompanhada."), Comparativo ("nós vs. o convencional"), a **GRADE DE CÉLULAS**
(`GradeDeCelulas.tsx`, apagada em 19/08 por ficar sem uso — está em `bc92186`) e a **ÓRBITA do corpo clínico**
(`CorpoClinicoOrbita.tsx`, 413 linhas, apagado). As quatro saíram com aprovação ou pedido
explícito, cada uma por um motivo registrado no §9 — a órbita com as palavras "não quero
mais a órbita". Se aparecerem numa
variante, é sinal de que alguém partiu de um commit antigo.

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
- 2026-08-13 — **A foto da EQUIPE substituiu o retrato do Dalton no hero**, a pedido do usuário, e "sem fundo" no pedido seguinte. O arquivo dele é 2000×2000 sobre branco; o fundo branco num bloco verde-petróleo seria um retângulo aceso, então entrou recortado. Recorte feito NESTA MÁQUINA, em canvas do Chromium — havia serviço de remoção de fundo por MCP e não foi usado: foto de quatorze pessoas identificáveis da clínica não se manda para terceiro sem o usuário pedir.
- 2026-08-13 — O recorte é **flood fill a partir das bordas**, não "todo pixel branco vira transparente", e a diferença decide o resultado: metade da equipe usa jaleco cinza-CLARO e uma pessoa usa blusa creme, então o global abriria buracos nas roupas. Brancura medida pelo canal mais ESCURO do pixel, não pela média — a média aceita cinza colorido. Limite 238 (o fundo do arquivo mede 252–255), mais um passe de franja com alpha parcial em 6.064px.
- 2026-08-13 — **A máscara do hero virou DUAS**, escolhidas pelo conteúdo (`retratoSemFundo`), porque figura recortada e foto retangular pedem bordas opostas: `.retrato-fundido` dissolve as quatro bordas para o fundo da foto não desenhar aresta; `.figura-recortada` só apaga os cortes que a moldura fez na gente — base 22% (56% da borda de baixo são pernas cortadas), laterais 5% (a 18% a mulher da ponta ficaria semitransparente, o rosto dela começa a 5% da largura) e **nada no topo**, onde o ponto mais alto é a cabeça do homem da última fileira. Trocar as duas de lugar apaga metade da figura.
- 2026-08-13 — **A proporção da imagem do hero saiu do componente e foi para o conteúdo** (`retratoLargura`/`retratoAltura`). Estava cravada em 500×482, o que serviu enquanto o arquivo era o retrato do Dalton e passaria a recortar no dia em que fosse outro — que é literalmente o que aconteceu hoje. Medido depois: 0% de recorte em 1024, 1440 e 1920.
- 2026-08-13 — A foto que o usuário mandou tem **marcas de IA**, e elas estão no arquivo original, não no recorte: os logos bordados saem como letras sem sentido ("NIRULIO", "DIHIIL") no lugar do wordmark, e a pessoa da última fileira tem o rosto deformado. No tamanho do hero (~608px) viram borrão de 10px e ~25px; em qualquer uso maior aparecem. Registrado em `public/imagens/hero/LEIA-ME.txt`.
- 2026-08-13 — **Li errado um screenshot e quase abri caça a um bug que não existe:** dei a subheadline, os botões e a linha do responsável como "não pintados" no hero em dpr 1, o que já foi defeito real nesta sessão (`will-change` na figura flutuante). A medição desmentiu na hora — opacidade 1, 12.607 pixels acima de luminância 120 na faixa do texto, proporcionalmente iguais em dpr 2. Texto de 16px em `--ink-muted` sobre bloco escuro simplesmente desaparece a olho num screenshot de página inteira. **Amostrar pixel antes de acreditar que algo não foi pintado.**
- 2026-08-13 — **O hero virou o template de COLAGEM** que o usuário mandou: duas colunas, texto + fileira de números à esquerda, três fotos sobrepostas em cartões com sombra à direita, e formas pequenas flutuando atrás. Com isso saiu a máquina da foto sangrada — o `lg:pr-[42vw]` do container e o `right` negativo sobre `50vw - 600px` —, porque colagem dentro de coluna não precisa dela. A foto da equipe recortada, de duas horas antes, virou o cartão MAIOR da colagem, e é o único com passe-partout claro: figura sem fundo precisa de fundo para não flutuar no vazio, e o recorte dela foi feito sobre branco de estúdio.
- 2026-08-13 — A largura da coluna da colagem é `min(38vw, 26rem)`, em rem e não em fração, **e isso é requisito, não gosto**: em fração ela rouba largura da headline conforme a janela encolhe e "complexidade, conduzida" quebra — o mesmo defeito que em 12/08 empurrou a foto para fora do container. Medido: 672px de texto em 1440 e 523px em 1024, contra 644 e 508 da linha mais longa.
- 2026-08-13 — **Meu medidor de quebra de linha estava errado e sempre "passava"**: comparava a largura do span com a do `h1`, e o span estica até o container, então os dois batem sempre. O certo é contar RETÂNGULOS (`getClientRects().length`) — 1 por linha significa que não quebrou. Com o medidor certo: 3 linhas, 3 retângulos, em 1024/1280/1440/1920.
- 2026-08-13 — Os três números do hero são **5,0 (nota do Google), 8 (especialidades) e 9 (corpo clínico)**, e todos saem de dado que já está no repo — a nota do perfil, a contagem de `areas.itens` e a de `bio.equipe`. O rótulo do terceiro diz "no corpo clínico" e não "especialistas", porque o CRO e a especialidade de oito deles ainda são placeholder. **Não acrescentar "anos de clínica" nem "pacientes atendidos"** sem a clínica fornecer: é a métrica mais fácil de inventar e a mais fácil de desmentir.
- 2026-08-13 — Adaptar este template cobrou três correções que não são cor: `bg-muted` do original pintaria o passe-partout com a cor do TEXTO (neste projeto `--color-muted` é `--muted`, o texto secundário, não um fundo); as formas decorativas eram azul-claro, roxo e verde pastel, três clichês e uma quarta paleta de uma vez; e o `<Button onClick>` virou link, porque chamada de clínica que não navega é botão morto.
- 2026-08-13 — **O recorte quadrado do cartão exigiu campo de FOCO no conteúdo** (`HeroImagem.foco`). A recepção é 3:2 e perde 33% da largura no quadrado; centralizada, o que sobrava era o corredor e a parede branca, porque o balcão curvo e as orquídeas estão no terço esquerdo do arquivo. Com `foco: "esquerda"` o assunto volta. Foto de ambiente aceita corte, **gente não**: o cartão da equipe usa a proporção nativa e recorta 0%.
- 2026-08-13 — **A colagem do hero aumentou ~30%**, a pedido, e o espaço NÃO veio da coluna do texto: a headline precisa de 644px em 1440 e a grade só tem 1120 de conteúdo, então a coluna da colagem tem teto de ~436px ali. Veio da MARGEM DO BLOCO, com margem direita negativa em degraus (24px em `lg`, 64px em `xl`, 112px em `2xl`) — o container para em 1200px e o bloco sangra até a janela. Cartões de 232/192/160 para 304/224/192 em 1440 e 336/256/224 acima de 1600.
- 2026-08-13 — Detalhe de grade que decide se aquilo funciona: **item de grade com largura AUTO estica para a trilha MENOS as margens**, então margem negativa o alarga. Com `w-full` (width 100%) a largura fica presa na trilha e a margem negativa não alarga nada. Tirar o `w-full` era o passo que faltava.
- 2026-08-13 — A colagem aumentou **de novo**, no mesmo dia, e a escada de breakpoints virou UMA expressão: `min(12rem, max(0px, 50vw - 600px) + 2rem)` de margem direita negativa. Colagem em 421px (1024), 488 (1280), 568 (1440) e 608 (1600+); cartões em 360/272/224 em 1440 e 384/288/256 acima de 1600. O teto de 12rem existe porque sem ele, em 1920, a colagem iria a 808px — maior que a coluna de texto. **A trilha da grade não pode crescer**: com `.display-1` em teto de 3rem, a linha mais longa mede ~644px e a trilha do texto tem 664px. São 20px de folga, e é esse número que fecha o assunto.
- 2026-08-13 — **As duas fotos de ambiente do hero saíram e entraram um sorriso e um atendimento**, a pedido do usuário (ele pediu arcada dentária e corrigiu para "um sorriso bem bonito" na mensagem seguinte). O sorriso encosta no clichê que a §4 proíbe e entrou por decisão dele; a escolha dentro do acervo foi pelo menos clichê possível — perfil em plano fechado, dentes naturais, sem fundo azul-claro. O registro clínico de reabilitação total foi descartado também por compliance: **sorriso reabilitado no topo da página lê como promessa de resultado.** A foto de atendimento é a única do acervo que mostra trabalho em curso, e por isso se repete na esteira de estrutura.
- 2026-08-13 — **A foto da equipe saiu do passe-partout claro e virou FIGURA sobre o bloco**, a pedido do usuário: "essa foto eu quero que fique em relação ao site, condizente". O retângulo branco de 360px era a coisa mais acesa do hero e lia como print colado, não como parte do bloco. Sem cartão, sem sombra e com `.figura-recortada` de volta, ela pertence ao verde. `semFundo` no conteúdo passou a decidir FIGURA ou CARTÃO, que são dois acabamentos e não uma variação de estilo.
- 2026-08-13 — Sorriso e atendimento **trocaram de posição** (o sorriso foi para baixo à esquerda, "mais à esquerda da seção" como pedido) e **ganharam flutuação** (`.carta-flutua`, 0,75rem em 5,4s, defasados em 1,8s). Keyframe próprio e não o `.retrato-flutua`: em cartão de ~250px os 8px daquele são imperceptíveis, e cartão é objeto solto — deriva mais que um retrato de pessoa sem ficar cômico. Em fase, os dois leem como a página respirando em vez de duas peças flutuando.
- 2026-08-13 — ⚠️ **A flutuação não pode ir para a figura da equipe**, e é armadilha de Tailwind v4: o keyframe escreve a propriedade `translate`, e o cartão do centro é posicionado com `-translate-x-1/2` — a animação zeraria a centralização e a figura pularia meia largura para a direita. Anotado no CSS e no componente.
- 2026-08-13 — O usuário mandou a foto da equipe de novo, agora em 500×500 já recortada perto do grupo. **Ficou o recorte de 1200×1078** que eu já tinha feito do arquivo de 2000×2000: é a mesma foto, mesmo enquadramento depois do meu corte na caixa do conteúdo, e com o dobro da resolução — o cartão exibe 360px, então 500px ficaria mole em tela retina.
- 2026-08-13 — **Quase reportei um bug de revelação que era o dev server hidratando.** Os três cartões da colagem apareciam com `opacity: 0` em alguns viewports e 1 em outros, sempre depois de 2,6s de espera. Medido no tempo: viram 1 entre 1000 e 2000ms — o TanStack em dev recompila a cada primeiro acesso de página. Em screenshot de coisa animada, **esperar pela condição (`waitForFunction`) e não pelo cronômetro.**
- 2026-08-13 — **O corpo clínico virou ÓRBITA aberta por ROLAGEM** em `lg`+, do template que o usuário mandou: os oito retratos partem de um aglomerado no centro e se afastam num raio conforme a seção passa pela tela, com nome e credencial aparecendo embaixo de cada um no fim. Três anéis, **cada um de uma cor** a pedido dele: fio claro do bloco por fora, dourado no meio, degradê petróleo→dourado no núcleo.
- 2026-08-13 — O progresso da órbita **não pode vir de `window.scrollY`** como no template: ali a seção é a primeira da página; esta é a quarta, e `scrollY` já vale ~3.450px quando ela aparece — a animação nasceria terminada. Vem da fração que o TRILHO da própria seção já rolou por dentro de si (`getBoundingClientRect().top` sobre `altura - innerHeight`), lida dentro de `requestAnimationFrame`.
- 2026-08-13 — ⚠️ **`overflow-hidden` no bloco da Bio teve de SAIR**, e é requisito do `sticky`, não limpeza: ancestral com `overflow` diferente de `visible` vira o contêiner de rolagem do sticky, e como ele não rola, o palco simplesmente não gruda. Medido depois de tirar: 0 elementos passando do canto arredondado. **Ao pôr `sticky` dentro de bloco escuro, conferir os `overflow` do caminho até o `<body>`.**
- 2026-08-13 — A órbita é **só de `lg` para cima**, e a grade continua abaixo. Não é preguiça: a órbita precisa de `2·raio + cartão + rótulo`, e em 390px o raio cairia para ~55px com os oito retratos empilhados. Duas formas para o mesmo conteúdo, escolhidas pelo espaço — e `display:none` tira a cópia inativa da árvore de acessibilidade, então leitor de tela não lê a lista duas vezes.
- 2026-08-13 — O raio parte de **32% e não de zero**. Com zero os oito retratos ficam exatamente um sobre o outro e, como o palco é `sticky`, a tela inteira mostra UM retrato solto no vazio até a rolagem começar — visto no render. Em 32% eles formam aglomerado, que lê como grupo apertado, e o gesto de expansão continua inteiro.
- 2026-08-13 — A órbita virou ELIPSE e **voltou a ser CÍRCULO no mesmo dia**: a elipse foi para ocupar a largura sobrando ("tem muito espaço") e o usuário reprovou — "ficou muito expansivo e muito para a direita, quero um círculo igual o do template". Ficou círculo perfeito (os oito raios medidos: 279px idênticos em 1440), e a sangria até a largura do bloco saiu junto: ela só ajudava enquanto era elipse, porque num círculo o limite é a ALTURA do palco, não a largura.
- 2026-08-13 — ⚠️ **`rounded-full` em caixa não quadrada não dá elipse, dá ESTÁDIO**: o raio infinito é clampado e sobram lados retos em cima e embaixo. Os três anéis pareciam retângulos arredondados no primeiro render da elipse. `rounded-[50%]` é sempre metade de cada eixo, então dá elipse verdadeira em qualquer proporção.
- 2026-08-13 — **O tamanho do retrato da órbita é CALCULADO, não escolhido**, e foram três rodadas de "aumentar os cards" para chegar nisso: um número que cabe em 1440 colide em 1280 (10px) e em 1024 (46px). O componente testa candidatos de 240px para baixo e fica com o maior que passa no teste de colisão de todos os pares vizinhos — duas caixas só se cruzam se AMBOS os eixos se cruzam. Resultado: **188px em 1440, 236 em 1920, 164 em 1280, 152 em 1024**, e zero sobreposição nos quatro.
- 2026-08-13 — **O nome foi para DENTRO do cartão, e é o que fez o círculo fechar.** Com o rótulo fora, num círculo o par diagonal↔lateral se separa por `0,707·raio` na vertical, e o raio vem da altura do palco: o teto do retrato cai para ~100px numa janela de 900px de altura e é impossível numa de 800 — medido, a roda colapsava no mínimo e ainda sobrepunha 25px. Com o nome dentro, a peça volta a ser um quadrado e o teto sobe para `0,261·altura_do_palco − 10`: 192px em 1440×900. Véu sólido até 58% da altura dele, porque num degradê contínuo o nome pegava a faixa de fundo creme do estúdio — luminância medida atrás do texto: 24 de 255.
- 2026-08-13 — **Eu medi a altura do rótulo só da PRIMEIRA peça, e as oito não têm a mesma altura**: "Ana Lúcia" cabe numa linha e "Cláudio Kleinhans" quebra em duas. O cálculo aprovava 128px de retrato e o render mostrava 26px de sobreposição nas peças de nome longo. Ao dimensionar por medição, **medir o pior caso da lista, não o primeiro item**.
- 2026-08-13 — Duas armadilhas de geometria da órbita, as duas medidas: (a) **girar a fase meio passo é PIOR** — tira os retratos dos extremos dos eixos, mas cria dois pares de mesmo X separados só pelo vão vertical, que é menor que a peça (17px de sobreposição em 1440, 55px em 1280); com a fase em -90° nenhum par vizinho compartilha X. (b) **tolerância de 1px no teste não basta**: o cálculo "passava" e o render ainda mostrava 3 a 5px de sobreposição, por subpixel e pela borda de 2px do retrato. Folga de 8px resolve.
- 2026-08-13 — **O CRO dos oito saiu da tela**, a pedido do usuário ("manter apenas a especialidade"), e o campo FICOU no conteúdo — `credencial` virou `cro` + `especialidade`. ⚠️ A CFO-196/2019 exige nome e número de inscrição na divulgação de cirurgião-dentista; hoje o site só mostra CRO do responsável técnico (hero e título da Bio). Voltar a exibir é uma linha em cada um dos dois layouts. Apagar o dado do conteúdo tornaria isso uma coleta nova.
- 2026-08-13 — Custo medido da animação: a página foi de 9,7 para **11,4 telas** em 1440 (o trilho tinha 190vh, ou seja ~810px de curso). Isso foi revertido em 14/08 junto com a órbita — a esteira não usa trilho e a página devolveu os ~810px.
- 2026-08-13 — O congelamento em `.html` precisou aprender a órbita: o estado dela é estilo inline escrito pelo React, então voltando ao topo ela era serializada FECHADA. O script agora rola até o ponto de abertura ANTES de serializar — a posição de rolagem não vai para o arquivo, o estilo inline vai.
- 2026-08-13 — Três detalhes menores do congelamento, todos medidos: (a) `loading="lazy"` tem de sair, senão imagem fora da viewport nem decodifica — 5 das 7 de /casos vinham "quebradas"; (b) o `src` original precisa virar `data-congelado` com um GIF de 1px no lugar, senão o navegador dispara 29 requisições `file:///imagens/...` antes de o script trocar pelo data URI; (c) a marca volta a ser `absolute`, porque `fixed` sem o JS que a apaga deixa o logo branco fixo por cima das seções claras.

- 2026-08-14 — **O corpo clínico virou ESTEIRA em laço**, de um template que o usuário mandou, e a ÓRBITA de 13/08 foi deletada junto (`CorpoClinicoOrbita.tsx`, 413 linhas). Três ganhos medidos, e é por isso que a troca se sustenta: retrato de 188px para **288px** (o maior que o corpo clínico já teve, contra a auditoria de 03/08 que achou 28 das 32 fotos abaixo de 15% da largura da tela); **uma forma só** para toda largura, em vez de órbita em `lg`+ mais grade abaixo; e a seção deixou de precisar do trilho de 190vh, devolvendo ~810px de página.
- 2026-08-14 — **É a TERCEIRA esteira do site** (Estrutura e Depoimentos são as outras), e passou porque o usuário pediu. O que a justifica aqui é o mesmo que justificava a grade: os nove retratos são do mesmo ensaio de estúdio e leem como série. ⚠️ Se aparecer pedido de uma quarta, vale a conversa que travou a `GradeDeCelulas` em três.
- 2026-08-14 — Do template entrou o carrossel, o cartão em retrato e o painel de identificação; **ficaram fora** o cabeçalho com ícone em quadrado azul, os rabiscos em SVG e o depoimento no pé do bloco — nenhum dos três é corpo clínico, e os dois primeiros reintroduziriam vocabulário que saiu em 03/08. O painel do template era CLARO e virou escuro: as fotos são de estúdio com fundo creme, e painel claro sobre elas desaparece.
- 2026-08-14 — ⚠️ **O `grayscale` do template entrou e SAIU no mesmo dia, reprovado:** "as imagens estão em preto e branco, coloque no padrão que elas já estavam". Ele tinha entrado atrás de `@media (hover:hover)` para o celular não ficar com nove retratos permanentemente em cinza — o que resolvia metade do problema e não o problema. É a COR dos retratos (fundo creme, uniforme cinza-azulado, mesmo ensaio de estúdio) que faz os nove lerem como série sobre o bloco escuro, e esse é o mesmo argumento que sustentava a grade antiga. A classe `group` saiu junto, porque só existia para o `group-hover:grayscale-0` — **classe de estado sem estado é convite a reintroduzir o efeito por engano.** Não devolver o filtro.
- 2026-08-14 — `aspect-[3/4]` na esteira é a proporção NATIVA dos arquivos, então o recorte é ZERO. É o oposto da grade que saiu, que recortava em quadrado para ganhar ~180px de altura — numa esteira a altura é fixa e não há esse imposto a pagar.
- 2026-08-14 — Velocidade em 40s para ~152rem de faixa (~61px/s), **metade** da esteira de Estrutura. Lá passam ambientes, aqui passam nomes, e nome que passa rápido demais não chega a ser lido.

- 2026-08-14 — ⚠️ **A ÓRBITA foi restaurada por engano e apagada de novo no mesmo dia.** Eu li "volte para o prompt do código que mandei por último" como o template do círculo, restaurei os 413 linhas do `CorpoClinicoOrbita.tsx` de `c71d8be` e comecei a validar — o "último código" era o template do CARROSSEL, que o usuário colou em seguida, e ele fechou o assunto com **"não quero mais a órbita"**. Nada disso virou commit: o estado bom já era o `e474c9f`. Lição de processo: quando o pedido é "volte para o código que mandei", **confirmar QUAL antes de mexer** — havia dois templates na mesa e o histórico do git tornou o desfazer barato, mas a rodada foi perdida.
- 2026-08-14 — A esteira do corpo clínico bate item por item com o que o usuário pediu do template ("apenas o carrossel com as fotos e o elemento em cada card com nome e especialidade"), medido em 1440 e 390: cartão 288×384 (3:4, **0% de recorte**), 8 retratos mais 8 cópias `aria-hidden` fechando o laço, laço de 40s, painel com nome e especialidade dentro de cada cartão, zero overflow. A página caiu de 11,4 para **10,1 telas** com a saída do trilho de 190vh.
- 2026-08-14 — **Cabeçalho do corpo clínico subiu um degrau na escala**, a pedido: rótulo de `display-3` para `display-2` (22 → 36px) e a nota de `text-base` para 22px. Com isso "Corpo clínico" virou **par do nome do responsável**, que também é `display-2` — e é o correto ali: as duas são as metades do mesmo bloco escuro, separadas por um fio, não título e subtítulo. Nenhum degrau novo de tamanho entrou; a escala de 03/08 segue em cinco.
- 2026-08-14 — ⚠️ **Armadilha que custou uma correção e explica uma classe nova:** os degraus `.display-1/2/3` são declarados **FORA de `@layer`** no `styles.css`, e estilo sem camada vence qualquer utilitário do Tailwind (que vive em `@layer utilities`). Pôr `display-3 font-normal` num elemento computava peso **600**, e o `leading-[...]` do mesmo elemento era ignorado do mesmo jeito — silenciosamente, sem erro. Daí `.display-3-leve`: mesmo 1.375rem da escala, peso 400. **Não tentar ajustar peso ou leading de um `.display-*` por utilitário** — não funciona e não avisa.
- 2026-08-14 — `max-w` do cabeçalho foi de `52ch` para `44rem`, e é a MESMA armadilha do `ch` pela quarta vez: ele resolve contra a fonte do elemento onde está, e o wrapper é 16px — os 52ch davam ~416px e estrangulavam um rótulo que agora tem 36px. Em bloco cujo filho muda de tamanho, largura em `rem`.
- 2026-08-14 — Medição da rodada, em 1440×900 e 390×844: rótulo 36px/peso 700, nota 22px/peso 400, `filter` na foto `none`, **saturação média do retrato 29,1** (cinza seria ~0), zero overflow, esteira inalterada. E no `.html` congelado, servido de `file://`: 140 regras de CSS, 52 imagens todas decodificadas, 0 `src` de arquivo local pendente, um único request falhado — o Google Fonts, que é bloqueado aqui e carrega na máquina do usuário.

- 2026-08-17 — **Seção ARCADA criada**, do template `scroll-expansion-hero` que o usuário mandou: sequência de reabilitação sobre implantes comandada pela rolagem, em cinco etapas. Entrou depois de Tratamentos, que é o "como funciona" da lista dele — ler a política de orçamento e então ver as etapas acontecerem é a ordem que fecha. **Não entrou no menu**: item novo na pílula recria a colisão com a marca em 1024px, já paga duas vezes, e ele não pediu link. Tem `id="arcada"` para link direto.
- 2026-08-17 — ⚠️ **Do template entrou o GESTO e não a MECÂNICA, e isso não é preferência.** O original registra `wheel` e `touchmove` com `preventDefault` e chama `window.scrollTo(0,0)` a cada scroll, ou seja congela a página até a mídia expandir — funciona lá porque o componente É a página. Aqui travaria o topo da home e mataria as âncoras do menu, as três esteiras e tudo abaixo. É parente do defeito da órbita de 13/08 (`scrollY` global numa seção que não é a primeira), mas pior: aquela animava errado, esta bloqueia a navegação. O progresso vem da fração que o TRILHO da própria seção já rolou, em `requestAnimationFrame` — o mesmo mecanismo que a órbita provou.
- 2026-08-17 — **É sequência de QUADROS, não vídeo**, e a razão principal é o pedido do usuário: "um dente após o outro, começando de um lado, sem aparecer aleatoriamente". Ordenar objeto um a um é justamente o que modelo de vídeo não faz — acende vários juntos ou fora de ordem. Em quadros, a ordem é o índice de um array. De quebra: cinco WebP pesam uma fração de um mp4 de 10s em 1080p, e os quadros são o início e o fim de qualquer clipe, então existiriam de todo jeito — os clipes seriam gasto a mais para entregar menos controle.
- 2026-08-17 — **A etapa dos dentes virou DUAS** (coroas da superior, coroas da inferior), com um quadro no meio mostrando a superior pronta e a inferior ainda sem dentes. É o que torna a ordem "superior primeiro" explícita nos arquivos em vez de depender de o modelo acertar. O usuário falou só dos dentes de cima; a arcada só fecha com a de baixo, e separar resolve os dois.
- 2026-08-17 — ⚠️ **Higgsfield caiu no meio da sessão e não voltou do meu lado** (o `select:` do ToolSearch segue vazio mesmo depois de ele reconectar duas vezes). Com 251 créditos e pedido explícito de economizar, os cinco quadros foram gerados no **Magnific** — 75 créditos por imagem, saldo de 45.000, e o modo ilimitado NÃO estava ativo na sessão, então consome crédito mesmo assim. O pacote de prompts que eu tinha escrito para o Higgsfield rodou sem alteração no Magnific.
- 2026-08-17 — O CDN do Magnific (`pikaso.cdnpk.net`) também é **403** aqui, como o do Higgsfield. Então os cinco quadros existem mas **não estão no repo**: `src: null` nos cinco, slot nomeado na tela, e as URLs em `public/imagens/arcada/LEIA-ME.txt`. Quem baixa é o usuário ou o agente do Lovable — mesmo caminho das 12 fotos de estrutura em 29/07.
- 2026-08-17 — ⚠️ **Quase reportei o desktop como travado, e o defeito era o MEU TESTE.** A régua não saía da etapa 1 em 1440 enquanto o mobile percorria as cinco. A geometria, medida direto, dava `p` de −0,86 → 0,36 → 1, ou seja o componente estava certo: a página tem `scroll-smooth`, cada salto do script virava animação, e `window.scrollTo({behavior:"instant"})` não vence o CSS quando se amostra 260ms depois — eu lia a página em pleno voo. Corrigido desligando `scrollBehavior` no teste e **esperando a posição PARAR** em vez de um cronômetro. Terceira vez nesta memória que uma medição minha acusa bug inexistente; a regra continua a mesma: conferir a medição antes de mexer no código.
- 2026-08-17 — Medido depois da correção, em 1440×900 e 390×844: `sticky` grudando (`top=0` em todo o curso), quadro de 436→752px em 1440 e 189→326px em 390 **com a proporção travada em 1,78** (16:9 nativo, recorte zero — ao contrário do template, que estica 300×400 para 1550×800 e deforma), as cinco etapas na ordem, barra de 0 a 100%, zero overflow. Sob `prefers-reduced-motion`: sem `sticky`, os cinco quadros viram LISTA com legenda — desligar o movimento não pode custar a sequência, porque a sequência é o conteúdo.
- 2026-08-17 — **A ARCADA VIROU O HERO, e a seção de explicação foi deletada no mesmo dia.** O usuário reanexou o template e foi explícito: "não é para mostrar os elementos", "não quero que tenha essa seção de explicação", "é apenas o hero e, abaixo, vai mostrar a seção inicial que já tem no site". Saíram o título, a régua de etapas, as descrições e a versão em lista — a peça agora é só a animação, na PRIMEIRA posição da página, e o hero de colagem virou a segunda seção. `titulo`, `descricao` e `etapas[].descricao` saíram do TIPO em vez de virarem opcionais: campo morto é o que faz padrão removido voltar, e neste projeto já sustentou a tabela de preços por três semanas.
- 2026-08-17 — "Home" no menu passou a apontar para `#arcada` (era `#top`, o hero de colagem). Com a arcada abrindo a página, "Home" levaria para a SEGUNDA seção e pularia a abertura sem avisar. Mesma troca na marca do header.
- 2026-08-17 — ⚠️ **A mecânica do template continua fora, e agora que ele É a primeira seção a tentação de usá-la é maior.** O original sequestra a rolagem (`preventDefault` em `wheel`/`touchmove` + `scrollTo(0,0)`). Três quebras concretas nesta página: a pílula de navegação é fixa e tem âncoras, então clicar em "Áreas" antes de a animação acabar voltaria para o topo; teclado não dispara `wheel`, então Espaço/Page Down/setas deixariam o site inalcançável para quem não usa roda; e arrastar a barra de rolagem, idem. O trilho com `sticky` entrega o mesmo visual — a única diferença perceptível é a barra de rolagem andar durante a abertura.
- 2026-08-17 — ⚠️ **Defeito de dimensionamento achado por medição, não a olho:** a primeira versão usava `aspectRatio: 0.8` com `maxHeight: 88svh`, e em 1440×900 o teto vencia — a caixa saía 893×792 (1,13:1), quase quadrada, e o estado em RETRATO que faz a abertura ler como abertura nunca aparecia. Trocado por largura e altura explícitas.
- 2026-08-17 — ⚠️ **E o segundo, que era pior:** interpolando os dois eixos até 100%, o estado final no celular ficava 390×844 (0,46:1) para um quadro 16:9 — `object-cover` mostraria ~26% da largura, um talho vertical no meio da arcada. É a armadilha de 12/08 (arquivo 3,6:1 numa faixa 0,83:1) reencenada. A altura passou a sair da PROPORÇÃO, terminando em 16:9: recorte ZERO no estado final, que é o que a pessoa fica olhando. Altura em `vw` e não em `svh`, para derivar da mesma unidade da largura.
- 2026-08-17 — ⚠️ **Duas vezes na mesma sessão eu quase reportei o desktop como travado, e as duas vezes era o MEU laço de estabilização** — ele quebrava na primeira leitura igual, antes de o salto começar. Só depois de registrar `scrollY` e `p` lado a lado ficou claro que `p` acompanha a fração exatamente nos dois viewports. Quinta ocorrência desta família de erro na memória: **medição suspeita se conferre antes de tocar no código.**
- 2026-08-17 — Medido, 1440×900 e 390×844: caixa de 490×597 (0,82:1) a 1440×810 (16:9) no desktop e de 257×303 (0,85:1) a 390×219 (16:9) no celular, raio 24→0px, `p` batendo com a fração em sete pontos do trilho, os cinco quadros na ordem, `sticky` grudado em todo o curso, zero overflow. Página: 13,1 telas em 1440.
- 2026-08-17 — **A abertura ficou SEM UMA PALAVRA**, a pedido ("sem nada de escrita", dito duas vezes na mesma mensagem). O aviso da CFO-196/2019 que ainda estava no pé da seção saiu de lá e foi para o **bloco legal do rodapé**, junto do CRO do responsável e do CNPJ. ⚠️ O aviso agora está a doze seções de distância de quem vê a animação, e isso NÃO é equivalente a estar ao lado dela — a peça abre a página mostrando uma arcada ficar perfeita. Confirmar com o jurídico da clínica antes de publicar; o campo segue em `clinica.arcada.aviso` e voltar é uma linha.
- 2026-08-17 — **A pílula de navegação só aparece depois de a arcada terminar de abrir** ("a aba de navegação ali só vai aparecer após a gente terminar de rolar e aparecer todo o vídeo completo"). A MARCA fica ("a Suzuki pode deixar o logo"): ela para de se apagar aos 180px e passa a se apagar 180px depois do FIM da arcada — sem isso ela desapareceria nos primeiros 9% da animação, que é o oposto do pedido. A prop `esperarArcada` só é passada na home; `/casos` e `/estrutura` seguem com a navegação de saída, porque esconder menu em página interna deixa o visitante sem volta.
- 2026-08-17 — Uma vez revelada, a pílula **não volta a esconder** ao subir a página. Menu que pisca ao rolar para cima lê como defeito, e quem já viu o site não deveria perder o menu por voltar ao topo.
- 2026-08-17 — `ARCADA_TRILHO_VH` passou a ser exportada do componente e importada pelo Header: é ele que precisa saber quando a abertura termina. Duplicar o 300 faria a navegação aparecer no momento errado no dia em que o trilho mudasse.
- 2026-08-17 — ⚠️ **A pílula PISCAVA no carregamento** e só a medição pegou: nascendo revelada, ela aparecia por ~600ms antes de se esconder (0,62 de opacidade no primeiro quadro amostrado). Corrigido nascendo escondida — `esperarArcada` é conhecido na renderização, então o SSR já manda o HTML sem ela. O caso sem JS ficou coberto por um `<noscript>` com um `<style>` que a devolve: sem script não há rolagem que revele nada, e a home ficaria sem menu.
- 2026-08-17 — ⚠️ **`inert` não funciona posto pelo React** — atributo booleano vazio não é serializado, e `hasAttribute("inert")` deu false na medição. Pílula opaca a 0 que ainda recebe foco manda quem navega por teclado para links invisíveis. Resolvido com `tabIndex={-1}` em cada link e `hidden` de verdade no CTA, que é um `<a>` e não aceitaria tabIndex sem furar a API do primitivo.
- 2026-08-17 — O quadro nasce ~7svh ABAIXO do centro ("um pouco para baixo ali da seção inicial") e volta ao centro conforme abre — em tela cheia não há para onde deslocar sem cortar. Medido em repouso: 183px acima e 120px abaixo da caixa.
- 2026-08-17 — Medido: pílula em 0 do carregamento até o fim da arcada (14 amostras no primeiro 1,7s, todas 0) e em 1 a partir de 1805px num trilho que termina em 1800; marca em 1 durante toda a abertura e 0 aos 2100px; ZERO elementos de texto dentro da seção; `/casos` com a navegação intacta.
- 2026-08-17 — **OS CINCO QUADROS ENTRARAM NO REPO** e a animação está ligada. Baixados pelo **agente do Lovable** — o CDN do Magnific é 403 aqui, como o do Higgsfield, então foi o mesmo caminho das 12 fotos de estrutura em 29/07. 2048×1152 (16:9), WebP, 82–160KB cada, ~567KB no total. Verificado no repo depois do pull, não pelo log do agente. Custo: 1,2 crédito do Lovable.
- 2026-08-17 — **Primeira vez que eu VI as imagens**: com os arquivos em disco dá para inspecionar, e o CDN bloqueado deixou de importar. Conversão para PNG feita em canvas do Chromium porque **não há ffmpeg neste ambiente**. Confirmado nos quadros: os alvéolos existem (quadro 1), os implantes aparecem como plataformas na crista (2), o quadro 4 tem a superior restaurada e a inferior ainda sem dentes — a divisão que torna a ordem explícita —, os dentes ficaram mais brancos como pedido, e **nenhum metal aparece** nos estados finais.
- 2026-08-17 — ⚠️ **O ENQUADRAMENTO dos cinco NÃO é consistente, e é o defeito real desta peça.** 1 e 2 são planos fechados só da arcada inferior, 4 é plano aberto com as duas arcadas pequenas, 5 é mais fechado que 4. Cada quadro foi uma chamada separada, então a câmera não se manteve — e na troca a sequência lê como cinco fotos em vez de uma coisa se formando. Conserto: regerar 1, 2, 3 e 5 passando o quadro 4 como REFERÊNCIA de imagem (`references: [{type:"image"}]`), o que trava composição e escala. ~300 créditos do Magnific, que tem 45.000.
- 2026-08-17 — ⚠️ No estado FINAL a marca branca fica sobre a gengiva rosada do quadro, e o contraste cai — o `drop-shadow` segura, mas não resolve. Se for corrigir, é véu escuro no topo da mídia ou sombra mais forte na marca; não mexi porque é decisão visual do usuário.
- 2026-08-17 — Medido com os arquivos reais: 5 imagens, todas decodificadas, 4 delas `lazy` e a primeira `eager`, zero overflow, único request falhado é o Google Fonts (bloqueado aqui).
- 2026-08-17 — **A ABERTURA VIROU VÍDEO ESCRUBADO PELA ROLAGEM, e a pilha de quadros saiu.** O usuário reprovou a versão anterior com a razão exata: "não tá fluido, não tá animado, apenas frame a frame". Estava certo — cinco estados são cinco estados, e transição de opacidade não inventa o meio. Agora os cinco quadros são as PONTAS de quatro clipes interpolados (1→2, 2→3, 3→4, 4→5), concatenados num arquivo de 20,2s, e a rolagem controla o `currentTime`. Resolve a fluidez **e** de graça a inconsistência de enquadramento: o modelo interpola entre duas pontas fixas, então a câmera não pula mais.
- 2026-08-17 — **A página abre com a marca GRANDE no centro**, a pedido, e ela encolhe e sai nos primeiros 22% do curso enquanto a mídia entra atrás. As duas curvas se cruzam de propósito: sem sobreposição há um instante de tela vazia entre as duas, que lê como falha de carregamento. `ARCADA_INTRO_ATE` é exportada porque o Header também precisa — enquanto a marca grande está na tela, a do canto fica escondida; a mesma logo em dois tamanhos ao mesmo tempo lê como defeito.
- 2026-08-17 — **A caixa diminuiu**, a pedido ("tá muito grande a gengiva, diminua para ficar proporcional no desktop e no celular"): terminava em 100vw (1440×810 em 1440) e agora fecha em 66vw no desktop (950×535) e 88vw no celular (343×193), sempre 16:9 — recorte zero em qualquer ponto.
- 2026-08-17 — ⚠️ **Este Chromium NÃO decodifica H.264.** `canPlayType('avc1')` volta vazio e o `<video>` erra com `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`, embora o arquivo seja servido com 200 e `video/mp4`. Sexta ocorrência da família "minha medição é o problema" — mas esta tinha conserto de produto: entrou um **WebM/VP9** como primeira `<source>`, que o ambiente decodifica e que é metade do tamanho (2,7MB contra 5,8MB). O mp4 fica como par universal para Safari.
- 2026-08-17 — O WebM foi gerado com `-g 24`, keyframe por segundo, e isso é **requisito e não capricho**: procurar um instante entre keyframes distantes salta para o anterior, e animação comandada por rolagem andaria aos pulos.
- 2026-08-17 — ⚠️ **A marca do canto piscava junto com a grande no primeiro quadro do desktop** (opacidade 1 antes da primeira medição). Corrigida nascendo em 0 quando `esperarArcada` — mesmo padrão que consertou a pílula. É a terceira vez na sessão que "nasce visível e esconde depois" produz pisca: **em peça controlada por rolagem, o estado inicial tem de ser o estado de repouso, decidido na renderização.**
- 2026-08-17 — Medido, 1440×900 e 390×844: `currentTime` acompanhando a rolagem (0 → 3,4 → 7,2 → 12,4 → 16,3 → 20,2s), vídeo `paused` em todo o curso (quem toca é a rolagem), caixa de 530×298 a 950×535 no desktop e 215×121 a 343×193 no celular travada em 1,78, zero overflow, marca grande e marca do canto nunca visíveis ao mesmo tempo, navegação em 0 até o fim.
- 2026-08-17 — Custo do Magnific nesta rodada: 4 clipes × 700 = **2.800 créditos** (de 45.000) mais a concatenação. Zero do Higgsfield, que segue com os 251 do usuário intactos. O agente do Lovable baixou os dois arquivos e converteu o WebM — 1,8 crédito somado.
- 2026-08-17 — ⚠️ Chamada de `send_message` do Lovable **estourou o timeout de 60s do cliente e o trabalho FOI FEITO**. É a segunda vez nesta memória (a primeira foi `create_project` em 24/07). Conferir com `git fetch` / `list_files` antes de repetir — repetir duplica trabalho e queima crédito.
- 2026-08-17 — **Fio de progresso removido** da abertura, a pedido. Ele existia como pista de que a seção tem fim; aqui o risco de ler como "página travada" é menor do que no template original, porque a barra de rolagem do navegador continua andando durante a abertura — é o trilho que rola, não um sequestro de scroll. Não reintroduzir sem pedido.
- 2026-08-17 — **A MARCA DO CANTO NÃO EXISTE MAIS NA HOME** — "não quero que a logo volte após o scroll do vídeo". Ela reaparecia no canto logo depois de sair do centro, e era isso que ele viu como a logo voltando. Agora a marca aparece UMA vez na home: grande, no centro, na abertura. Depois disso a página segue só com a pílula. Nas rotas internas (`/casos`, `/estrutura`) ela CONTINUA, porque lá não há abertura e é a única marca da página. Nada se perde em navegação: a pílula tem "Home" apontando para `#arcada`.
- 2026-08-17 — Não renderizar é melhor que esconder por opacidade, e é a lição que já apareceu duas vezes nesta sessão: link opaco a 0 continua no Tab e continua sendo anunciado por leitor de tela. Medido: `marcaCantoNoDOM=0` em nove posições de rolagem da home, e `1` em `/casos`.
- 2026-08-17 — Custo em página: **10,1 → 12,7 telas** em 1440, pelo trilho de 260vh (160vh de curso, ~32vh por etapa). É a seção mais alta do site, e é inerente ao pedido — sequência comandada por rolagem consome distância de rolagem por definição. Se incomodar, é UM número no `Arcada.tsx`; abaixo de ~200vh a etapa passa antes de ser lida.

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

1. `CLAUDE.md` §5.2 — o ponto de retomada, a tabela de anatomias e o aviso do CRO
2. `CLAUDE.md` §8 — mapa dos arquivos, qual projeto do Lovable é o certo, e qual URL
   mostra o trabalho (essa confusão já aconteceu duas vezes)
3. `CLAUDE.md` §9 — o log. É longo, mas é onde está o **porquê** de cada decisão, e
   quase toda ideia "nova" que aparecer já foi tentada e reprovada uma vez
4. `docs/referencia-layout.md` §9 (paleta medida) e §8 (tokens em vigor)
5. `public/imagens/*/LEIA-ME.txt` — proveniência de cada imagem, com o que foi
   descartado e por quê. `hero/` e `casos/` são os que mais importam
6. `docs/replicacao.md` — só quando for gerar as variantes, e **corrigir antes**: ele
   ainda promete que trocar de clínica é trocar tokens, o que vale para mudar de
   matiz e não para inverter claro/escuro (decisão de 30/07)

**Não ler** `docs/prompt-lovable.md` como especificação: é o prompt da geração inicial,
descreve um site escuro que não existe mais. Só a seção final, de correções, segue válida.

**Como o usuário trabalha, e vale saber antes da primeira resposta:** ele manda
template de terceiro (código colado ou print) e pede para aplicar na identidade da
Suzuki; corrige em rodadas curtas, às vezes trocando de ideia na mensagem seguinte
("arcada dentária" → "um sorriso bem bonito"); e pede remoção com verbo explícito
("essa seção quero que retire"). Ausência de menção **não** é pedido de remoção — foi
assim que o FAQ ficou. Ele não lê diff: o que funciona é screenshot, o `.html`
congelado, e resposta curta dizendo o que mudou e o que foi medido.

### Armadilhas já pagas, não repetir

- **`overflow-hidden` mata `position: sticky`.** Ancestral com overflow diferente de
  `visible` vira o contêiner de rolagem do sticky e, como não rola, o elemento não gruda.
  Foi por isso que o bloco da Bio perdeu o `overflow-hidden` — e ele **continua sem**, o que
  está certo: a esteira que substituiu a órbita recorta nela mesma (`esteira-mask`).
- **Esteira parada precisa virar rolável.** Sob `prefers-reduced-motion` a regra global
  congela a animação, e dentro de `overflow-hidden` isso deixaria os últimos itens
  inalcançáveis — daí o `motion-reduce:overflow-x-auto` obrigatório em cada esteira.
- **Filtro de hover em imagem só atrás de `@media (hover:hover)`** — e, nos retratos do corpo
  clínico, **nem assim**: o `grayscale` do template foi reprovado em 14/08 e não volta. A cor
  do ensaio é o que faz os nove lerem como série.
- **Peso e leading de um `.display-*` não se ajustam por utilitário do Tailwind.** Os degraus
  da escala são declarados FORA de `@layer`, então vencem `@layer utilities`: `font-normal`
  num `.display-3` computa 600, e `leading-[...]` é ignorado — sem erro nenhum. Para 22px com
  peso de texto existe `.display-3-leve`.
- **`rounded-full` em caixa NÃO quadrada dá estádio, não elipse** — o raio infinito é
  clampado e sobram lados retos. `rounded-[50%]` é sempre metade de cada eixo.
- **Ao dimensionar por medição, medir o PIOR caso da lista, não o primeiro item.** Medi a
  altura do rótulo só da primeira peça do círculo; os nomes quebram em número diferente de
  linhas e o cálculo aprovou um tamanho que sobrepunha 26px nas peças de nome longo.
- **Screenshot em dev engana duas vezes:** o TanStack recompila no primeiro acesso de cada
  página, então esperar por CRONÔMETRO pega a página pré-hidratação (elemento em opacity 0
  que parece bug). Esperar pela CONDIÇÃO (`waitForFunction`). E texto de 16px em cor secundária
  sobre bloco escuro desaparece a olho num screenshot de página inteira — **amostrar pixel
  antes de acreditar que algo não foi pintado**.
- **Print de um botão que se repete não identifica qual é** — amostrar a cor computada antes
  de apagar. Cinco "Agendar" na página, quatro visualmente iguais.
- **`window.scrollTo` num script de medição precisa ser CONFERIDO, E DEPOIS DE ESPERAR.**
  Medido em 18/08: a restauração de rolagem do TanStack zera o scroll **~600ms depois do
  load** — o script rola, a amostra sai certa por 400ms, e então volta para 0. Confirmar
  em laço que `window.scrollY` parou no alvo NÃO basta, porque ela desfaz depois. Esperar
  ~3,5s após o load ANTES de rolar. Aconteceu quatro vezes em 17–18/08 e nas quatro a
  peça estava certa; uma delas parecia "o Reveal não dispara" e o Reveal estava correto
  (o elemento simplesmente não estava na tela).
- **Ao medir onde um objeto está dentro de um quadro, contar pixels acima de um limiar
  ALTO** — o máximo de luminância por coluna acha o brilho de fundo, não o objeto, e o
  erro é de centenas de pixels. Custou um recorte errado em 19/08.
- **Escrubagem de vídeo por rolagem: `-g` curto no encode, e no laço interpolar em valor
  próprio, quantizar o instante ao quadro, e nunca pedir com `v.seeking` verdadeiro.**
  Sem isso a fila de seeks cresce e o vídeo parece travado. `-g 1` é inviável em 1080p:
  4× o peso.
- **`mix-blend-mode` morre em silêncio se algum ancestral ISOLAR o grupo.** `position:
  sticky`, `z-index` em elemento posicionado, `opacity` < 1, `filter` e `will-change` de
  opacidade todos criam contexto de empilhamento, e aí o elemento mistura contra
  transparência em vez do fundo. Paguei duas dessas na abertura de 19/08.
- **Para julgar perda de compressão em vídeo, VMAF — nunca SSIM**, e **sempre contra um
  encode LOSSLESS do mesmo pipeline**, nunca contra o master em outro contêiner: o
  comparador desalinha timebases e o número despenca. Conferir sempre medindo o lossless
  primeiro — ele tem de dar ~100, e se não der, o defeito é do teste. Num clipe de câmera
  parada o erro passa quase invisível; num de rotação vira 17 pontos de VMAF. O encode 720p da
  abertura marcava SSIM 0,988 contra o master, que parece ótimo, e tinha apagado os
  capilares da gengiva. O VMAF separou os candidatos por 5,6 pontos onde o SSIM separou
  por 0,007. Há `libvmaf` no ffmpeg estático baixado do GitHub. ⚠️ E o `-v error` do
  ffmpeg ESCONDE a linha do score: o filtro loga em nível info.
- **Imagem anexada pelo usuário não existe como arquivo no disco.** O base64 está no
  transcript da sessão (`/root/.claude/projects/.../<sessão>.jsonl`); é de lá que se extrai
  para poder processar os pixels. Script em `scratchpad/extrai-anexo.mjs`.
- **"Não quebrou" não é "cabe".** Ao dimensionar texto por `clamp`, medir a LARGURA do
  elemento contra a da janela. `getClientRects().length === 1` e `scrollWidth` os dois
  PASSAM num texto cortado, se o contêiner tiver `overflow-hidden`. Nesta fonte, em caixa
  alta com tracking -0,035em, cada caractere avança **0,664em** — medido em sete larguras.
- **`scale` cresce em volta do centro do PRÓPRIO elemento.** Numa coluna `flex` centrada,
  o que está no centro da tela é a PILHA, não cada peça: se os itens acima e abaixo têm
  alturas diferentes, o item do meio cresce fora de eixo. Vale `(acima − abaixo) / 2`.
- **`translate3d(...) scale(...)`** aplica a escala primeiro e o deslocamento depois, em px
  não escalados. Invertida, a ordem multiplica o deslocamento pela escala.
- **Fórmula de cobertura (`max(vw/w, vh/h)`) quebra em tela EM PÉ.** Com mídia 16:9 num
  celular o termo da altura domina e o `object-cover` mostra ~25% da largura — um talho
  vertical. Já custou três rodadas (12/08, 17/08, 19/08). O teto tem de sair de onde o
  ASSUNTO começa e acaba dentro do quadro, medido, não da caixa.
- **`cn()` COME o `text-small` quando há classe de cor depois.** O tailwind-merge não
  conhece esse token do projeto, classifica como cor de texto, e `text-ink` /
  `text-ink-muted` na mesma mesclagem o descartam — o elemento renderiza a 16px sem
  erro nenhum e a classe não chega ao DOM. Em string simples (como no `Footer.tsx`)
  funciona. Custou uma rodada em 19/08 no carrossel: pôr o degrau no elemento que
  NÃO tem classe de cor.
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

- 2026-08-19 — **A ABERTURA VIROU O TEMPLATE `hero-scrub` DO FERRARI AMALFI**, mandado pelo usuário, com o mapeamento que ele ditou: a logo da Suzuki onde estava "FERRARI", "ODONTOLOGIA ESPECIALIZADA" onde estava "AMALFI", e a arcada se formando onde estava o 3D do carro. A coreografia é a de lá, nas mesmas frações: as duas pontas se afastam para os lados enquanto o quadro cresce, o quadro toma a tela no miolo (é onde os dentes entram) e tudo volta à pose de abertura no fim. `AberturaMarca.tsx` (a tela só com a logo, de 18/08) foi deletada; `AberturaArcada.tsx` é o que está no lugar.
- 2026-08-19 — Isso **RECOLOCA o vídeo escrubado apagado em 18/08** ("desisti de fazer isso"), e não é revert: lá o vídeo VIAJAVA até o slot do hero e trocava por crossfade; aqui ele cresce até tomar a tela e volta. A escrubagem, as duas strings de codec e o destravamento do iOS foram **recuperados do git** (`caa2962`), não reescritos de memória — que é o que o §8 manda fazer.
- 2026-08-19 — **SEM GSAP, e a decisão não é preferência.** O template pede `gsap` + `ScrollTrigger` e não usa o `pin` dele: a mecânica é `sticky`, que este projeto já tem. Sobrava interpolar números, que é uma linha de conta. Somam-se dois motivos duros: `gsap.set/to` escreve a propriedade `transform` e o Tailwind v4 escreve `translate`/`scale`/`rotate` SEPARADAS — misturar as duas famílias no mesmo elemento é a armadilha já registrada aqui, e o sintoma é silencioso; e o projeto não tem nenhuma dependência de animação. O progresso sai da fração que o TRILHO da própria seção já rolou, em `requestAnimationFrame`, o mesmo mecanismo provado três vezes (órbita, abertura em vídeo, marca).
- 2026-08-19 — **SEM a sequência de quadros em `<canvas>` do template, e o motivo foi MEDIDO.** Exportar os 193 quadros do clipe a 1280px em WebP q72 dá **6,3 MB em 193 requisições**, contra **3,4 MB do WebM a 1920×1080** que já está no repo. A razão é o material: a câmera é travada e a diferença entre quadros vizinhos é um dente — o melhor caso possível para compressão interframe e o pior para uma pilha de imagens independentes. A 12fps empata no peso e ainda perde resolução. Amostrado a q60/q72/q82 em nove quadros antes de decidir.
- 2026-08-19 — **Logo em versão LOCKUP** (`logo-lockup-branco.svg`, 8,6KB): a mesma arte com os 12 traços da linha "odontologia" removidos e o viewBox justo no que ficou (`13 13 666 274`). Existe porque o logo horizontal completo já traz a palavra, e com a linha de baixo dizendo "ODONTOLOGIA ESPECIALIZADA" ela apareceria DUAS vezes empilhada — lê como erro. Os traços foram separados por `getBBox()` de cada um dos 21 elementos, não a olho: 0–2 é o símbolo, 3–8 é "SUZUKI", 9–20 é a segunda linha.
- 2026-08-19 — ⚠️ **A linha ficou CORTADA nas duas bordas e minhas verificações não pegaram.** Dimensionei em 6,2vw a partir de 0,58em por caractere, de cabeça; o valor medido é **0,664em**, constante em sete larguras de janela. A 6,2vw a linha media 1461px numa janela de 1440. Passou nos dois testes que eu tinha: `getClientRects().length === 1` (não quebrou em duas linhas) e `scrollWidth` (o palco tem `overflow-hidden`, então o recorte não gera rolagem). **Ao dimensionar texto, medir a LARGURA do elemento contra a da janela — "não quebrou" não é "cabe".** Ficou `clamp(1.1rem, 5.4vw, 5.5rem)`, ~10% de folga de 360 a 1920px, e a conta está amarrada aos 25 caracteres desta assinatura: outra clínica recalcula por `vw = 92 / (0,664 × nº de caracteres)`.
- 2026-08-19 — ⚠️ **A fórmula de imersão do template quebra em tela EM PÉ, e esse era o defeito grave.** `max(vw/w, vh/h)` levava o quadro a **1588px de largura** em 390×844: a tela mostraria 25% dele, um talho vertical no meio da arcada. Terceira encarnação da mesma armadilha (12/08, arquivo 3,6:1 em caixa 0,83:1; 17/08, 16:9 interpolado até 0,46:1). Consertado com um TETO medido: varredura de luminância nos quadros de 0s, 4s e 8s mostra que a arcada ocupa **69,1% da largura** e **83,9% da altura** do quadro, então o teto é o tamanho em que o assunto ainda cabe com 2% de folga. Celular fechou em 542px em vez de 1588, e o desktop segue coberto (a cobertura recorta só o vazio das laterais). Se o clipe for regerado, **remedir os dois números**.
- 2026-08-19 — ⚠️ **O quadro não nascia no centro da tela, e `scale` cresce em volta do próprio centro.** A coluna `flex` centra a PILHA, e como a marca tem 197px de altura contra 74px da linha, o centro do quadro cai `(197−74)/2 ≈ 61px` abaixo do centro do palco: medido no render, a imersão subia fora de eixo e sobrava uma faixa de 29px de fundo no TOPO (luminância 14,5 contra 26 do clipe). O template tem a mesma geometria e não sofre porque as duas palavras dele têm a MESMA altura.
- 2026-08-19 — Tentei consertar isso pondo as três peças em `absolute` em volta do centro, o que centra o quadro por construção. **Funcionou e ficou pior de olhar:** 42px de ar acima da marca contra 165px abaixo da linha, e a composição lia como se tivesse escorregado para cima — a assimetria vale `marca − linha` e nenhum tamanho de fonte a resolve sem encolher a marca a 180px. A saída foi o quadro CONVERGIR para o centro do palco enquanto cresce, com o desvio medido em runtime. Conserta o eixo e acrescenta um movimento que ajuda. Folgas medidas depois: iguais em cima e embaixo nos quatro tamanhos (150/150 em 1920, 104/104 em 1440, 91/91 em 1024, 233/233 em 390).
- 2026-08-19 — O desvio é remedido sozinho, **sem listener de `load`/`resize`**: o laço o relê sempre que a página está parada no topo (`p < 0,02`), onde a escala é 1 e o `getBoundingClientRect` do quadro é a caixa de layout. Custa uma leitura por quadro só enquanto ninguém rolou, e se a fonte carregar depois e a linha mudar de altura, a próxima visita ao topo corrige. Calcular de cabeça a partir do CSS é o que errou o alvo por 131px na viagem do vídeo em 18/08.
- 2026-08-19 — ⚠️ **A ORDEM da lista de `transform` importa:** `translate3d(...) scale(...)` aplica a escala primeiro e o deslocamento depois, em px NÃO escalados. Invertida, os 61px de convergência viriam multiplicados por 2,45 na imersão.
- 2026-08-19 — Fundo do cartão é a cor da VINHETA (`--abertura-vinheta: #050b0f`, o pixel do canto do próprio clipe, amostrado com ffmpeg) e não `--ink-elevated`. A caixa fecha em 1694×954 e o vídeo em 16:9 exato, então sobra meio pixel de arredondamento na borda — com fundo mais CLARO que o clipe, esse meio pixel virava um fio de 2px visível a 2,45× de escala. Medido depois: linha 0 e linha 899 as duas em luminância 26, ou seja o clipe de ponta a ponta.
- 2026-08-19 — O cartão com raio, fio e sombra **dispensa a máscara `.video-fundido`** na abertura, e isso é um ganho de graça: ela existia porque o fundo do clipe difere do `--ink` e desenhava um retângulo no meio da tela, mas cobrava 26% da borda em opacidade — os molares das duas pontas renderizavam a 60%. Sendo um cartão declarado, o retângulo passa a ser a intenção.
- 2026-08-19 — Do template ficaram FORA, além do GSAP e do canvas: o `letterSpacing` animado (animar `letter-spacing` refaz o layout do texto a cada quadro, e o ganho é invisível ao lado do deslocamento de meia tela) e o `accentHex` `#3a9b8a` / o `#62B2FE` do outro template — azul-claro de consultório é clichê proibido no §4, e a paleta é a medida da Suzuki.
- 2026-08-19 — O limiar da navegação virou **`ABERTURA_NAV_VH`, derivado** (`TRILHO_MULT × IMERSAO_ATE`, o ponto em que a arcada fica completa), no lugar de `ABERTURA_VH × 0,7`. Aquele 0,7 era um chute que só por acaso caía perto do fim da animação — mudar o ritmo da abertura o desalinhava sem avisar. Atende o pedido de 17/08 ao pé da letra: o menu aparece quando o vídeo completa, e os 22% finais rolam com ele na tela.
- 2026-08-19 — Nas rotas internas a marca do canto apontava para **`#arcada`, âncora morta desde 18/08** — rola para o topo sem avisar, que é o defeito registrado em 12/08 no link "Como conduzimos" do rodapé. Passou a apontar para `/`. Defeito antigo, achado ao mexer no Header.
- 2026-08-19 — Custo de página: a abertura foi de 1 tela (`AberturaMarca`) para **3,6 telas** (1 parada + 2,6 de curso). É a seção mais alta do site e é inerente ao pedido — sequência comandada por rolagem gasta distância de rolagem. O template pede 4,2; 2,6 de curso dá ~184px de rolagem por segundo de vídeo (~7,7px por quadro a 24fps), folgado para a escrubagem ler contínua. Abaixo de ~2,0 os dentes passam mais rápido do que se lê. **Se incomodar, é UM número: `TRILHO_MULT` no `AberturaArcada.tsx`.**

- 2026-08-19 — **O ZOOM DA ABERTURA SAIU no mesmo dia em que entrou**, a pedido: "a arcada tá muito grande no final, é para ela manter do mesmo tamanho que inicia, sem o efeito de aproximação". O quadro passou a ter UM tamanho do começo ao fim, e a rolagem comanda só o `currentTime` do vídeo. Morreram com ele a escala em três curvas, o teto de imersão derivado do assunto dentro do quadro, e a convergência do quadro para o centro do palco — a última só existia PORQUE `scale` cresce em volta do próprio centro. Versão com zoom em `98bf5e7`.
- 2026-08-19 — **O afastamento lateral das pontas saiu JUNTO com o zoom, e é decisão de composição, não conserto.** No template ele existe para abrir espaço para o quadro que cresce; sem o crescimento, mandar a marca e a assinatura para fora deixaria o miolo da seção com um quadro PEQUENO sozinho num campo escuro vazio. ⚠️ Voltar a ter o afastamento sem o zoom é possível — está no git — mas é escolha dele, não um bug a corrigir.
- 2026-08-19 — Com o zoom fora, `TRILHO_MULT` caiu de 2,6 para **1,6**, e o ritmo da escrubagem ficou praticamente igual: sem a imersão, o curso INTEIRO carrega os 8,04s do clipe em vez de só 63% dele — ~180px de rolagem por segundo de vídeo contra ~184px antes. A seção foi de 3,6 para **2,6 telas**. A escrubagem começa aos 5% e acaba aos 95% do curso: as sobras seguram o primeiro e o último quadro, senão a arcada completa aparece no mesmo pixel em que a seção acaba.
- 2026-08-19 — **O LOCKUP DA MARCA FOI UM ERRO MEU, e o arquivo foi apagado.** Eu tinha recortado os 12 traços da linha "odontologia" do SVG para a palavra não aparecer duas vezes empilhada com a assinatura de baixo; o usuário reprovou na hora — "a logo da Suzuki não tá completa". **A marca da clínica não se recorta para resolver repetição de palavra: quem cede é o layout.** A abertura passou a usar o mesmo `brand.logo` do header, agora por uma constante única (`BRAND_LOGO`) para os dois caminhos não divergirem, e a repetição da palavra ficou registrada como deliberada no tipo.
- 2026-08-19 — Tudo da abertura diminuiu, a pedido ("diminua o tamanho de tudo dessa sessão, tá muito grande"): quadro de 691×389 para **547×308** em 1440 (−21%), marca de 480 para **304px** (−37%), assinatura de 78px para **36px** (−54%). O teto da assinatura ficou em 2,25rem, que é **exatamente o degrau `.display-2`** — no desktop, portanto, nenhum tamanho novo entra na página, e a parte fluida em vw existe só porque 25 caracteres em caixa alta não cabem num celular com tamanho fixo da escala.
- 2026-08-19 — Medido depois, em 1920/1440/1024/390: proporção travada em 1,78 (recorte zero) e o quadro no MESMO tamanho nos seis pontos do curso, vídeo escrubando 0 → 8,03s e sempre pausado, marca e assinatura em opacidade 1 do começo ao fim, folgas iguais em cima e embaixo (233/233, 194/194, 183/183, 257/257), assinatura em uma linha em todas as larguras, UMA requisição de vídeo, zero overflow.

- 2026-08-19 — **A ABERTURA PERDEU A ASSINATURA DE TEXTO** ("tire o odontologia especializada"), e com ela morreu a classe `.abertura-linha` — a ÚNICA exceção à escala tipográfica fechada de cinco degraus, criada horas antes para a linha ter massa embaixo do quadro. A abertura hoje não tem texto nenhum na tela: só o alt da marca. Campo `linha` saiu do TIPO, não virou opcional. **Se voltar a haver assinatura, tentar `.display-1`/`.display-2` antes de recriar a classe** — o que tornava a exceção necessária era o tamanho gigante que o gesto do template pedia, e esse gesto também já saiu.
- 2026-08-19 — **O CLIPE DA ABERTURA TROCOU: da FORMAÇÃO para a ROTAÇÃO de três quartos**, a pedido ("faça a arcada em 3D meio de lado, bem diferente e alto nível de 3D"). É o master `4-giro-hero.mp4`, um dos quatro que o usuário mandou em 18/08 e o único que nunca tinha sido usado — em 17/08 ficou de fora porque o giro havia sido trocado pela descida em CSS. ⚠️ **O custo é de CONTEÚDO**: a formação (dentes entrando um por vez) era pedido explícito de 17/08 e não existe em vista de três quartos em nenhum dos quatro masters. Ter as duas coisas juntas exige geração nova.
- 2026-08-19 — **A ARCADA NÃO É CENTRADA NO MASTER**, e isso decidiu o recorte: varredura de luminância em cinco instantes dá x de 24,6% a 97,2% da largura — ela encosta na borda direita e sobra 25% de vazio à esquerda. `crop=1500:1080:420:0` deixa 53px de margem de cada lado; a altura fica INTEIRA porque a arcada chega a 92,9% dela. ⚠️ Por isso o arquivo é **1,389:1 e não 16:9**, e a proporção foi para o CONTEÚDO (`arcada.videoLargura/videoAltura`) — cravada no componente, ela recortaria em silêncio na próxima troca de clipe, que é exatamente o defeito de 13/08 no hero.
- 2026-08-19 — **O PLACEHOLDER SAIU E O QUE O SUBSTITUI É `mix-blend-mode: screen`** ("sem estar em um placeholder, como se ela fizesse parte do site, sem sombras"). O fundo do clipe é praticamente preto, e sob `screen` um fundo nesse nível soma ~1% ao que está atrás: o petróleo da página atravessa e a moldura deixa de existir. Escolhido em vez da máscara de borda (`.video-fundido`) porque a máscara apaga 26% de cada lado, e NESTE clipe a arcada chega a 97,2% da largura — seria recortar dente.
- 2026-08-19 — ⚠️ **`screen` exigiu ZERAR o ponto de preto no encode.** O fundo do master não era preto puro (cantos em rgb 0–3/2–4/7–11, centro-topo em rgb 13,22,24), e sob `screen` isso somava luz e desenhava um retângulo **MAIS CLARO** que a página — o defeito inverteu de sinal em vez de sumir. `colorlevels=rimin=0.105:gimin=0.105:bimin=0.105` põe oito pontos de fundo em 0 ou 1, em três instantes do clipe.
- 2026-08-19 — ⚠️ **DUAS CONDIÇÕES DE DOM que matam o `mix-blend-mode` em silêncio, e paguei as duas.** (a) `position: sticky` cria contexto de empilhamento, então o vídeo mistura contra o que está pintado DENTRO do palco — foi preciso pôr `bg-ink` no palco, não só na seção. (b) `z-index` num elemento posicionado também cria contexto: com `z-10` no contêiner do quadro, o interior media luminância 8 contra 26 da página, ou seja o retângulo preto voltava. Qualquer `opacity` < 1, `filter` ou `will-change` de opacidade no caminho faz o mesmo — foi por isso que a animação de entrada saiu do quadro.
- 2026-08-19 — **VMAF contra o master deu 79 e o número era FALSO.** O mesmo comparador dá PSNR 35,8 dB para um encode LOSSLESS, que deveria ser infinito, e o quadro 0 do lossless é byte-idêntico ao do master — então não é o encode, é o comparador desalinhando dois contêineres de timebase diferente. Medindo contra o lossless, a escada real aparece: CRF 28 → 95,5 / CRF 24 → 96,3 / CRF 20 → 96,8 / CRF 16 → 97,2. Ficou CRF 24, 1,60 MB. ⚠️ **Num clipe de câmera parada um desalinhamento de um quadro quase não pesa; num de ROTAÇÃO pesa muito** — foi isso que fez o número parecer catastrófico. Regra nova: **VMAF sempre contra um lossless do mesmo pipeline**, nunca contra o master em outro contêiner.
- 2026-08-19 — **NÃO foi para 4K**, apesar de "em 4K" estar no pedido: o master é 1080p e o quadro exibe 605px no desktop (1210px em retina), então o arquivo de 1500px já entrega mais do que a tela mostra. Chegar a 4K só por upscale de IA, que num render 3D de gradiente liso inventa micro-textura na gengiva e serrilha a borda do dente — em peça apresentada como ilustração técnica isso é inventar detalhe anatômico. Mesma recusa de 18/08.
- 2026-08-19 — A marca subiu ("suba um pouco a logo da Suzuki"): o vão marca→quadro foi de 16 para **64px**, num único número (`VAO_MARCA`). ⚠️ Tentei primeiro centrar o QUADRO no palco e pôr a marca acima dele, porque assim "subir a logo" mexe só na logo — e o render reprovou: com nada abaixo da arcada, sobravam **330px de vazio embaixo contra 55px acima**. Voltou a coluna centrada como GRUPO, e aí os dois vazios ficam iguais (171/171 em 1920, 133/133 em 1440, 138/138 em 1024, 240/240 em 390).
- 2026-08-19 — A largura do quadro **subiu** de 0,34 para 0,42 da tela, e isso NÃO desfaz o "diminua o tamanho de tudo" dele: com cartão, o que a pessoa via era a moldura inteira; sem cartão, vê-se só a arcada, que ocupa 72% da largura do quadro. A 0,34 ela media 353px em 1440 — MENOR do que era com o cartão. A 0,42 fecha em ~436px, a mesma presença de antes sem a caixa.
- 2026-08-19 — ⚠️ **Sétimo falso positivo de medição desta memória:** meu teste de "moldura invisível" acusou 4 níveis de diferença em 390px. Cruzando a fronteira pixel a pixel, o degrau é de **2 níveis em 255** e cai 3px DENTRO do quadro (resíduo do VP9) — os 4 níveis eram a vinheta radial mudando nos 20px entre os meus dois pontos de amostra, que numa tela estreita é um gradiente rápido. **Ao comparar dois lados de uma borda, amostrar pixels ADJACENTES, não pontos afastados.**
- 2026-08-19 — Peso: a pasta `public/imagens/arcada/` caiu de **8,3 MB para 3,7 MB** com a troca (o clipe de rotação tem 6,04s contra 8,04s e é mais fácil de comprimir).

- 2026-08-19 — **A ARCADA SAIU DO HERO** ("tire essa arcada da sessão hero"). A página abria com a arcada 3D girando e o hero, logo abaixo, repetia a MESMA arcada em imagem parada — duas arcadas seguidas leem como a página se repetindo. Foi uma linha: `hero.arcada: null`, e o campo já era `HeroImagem | null` desde que existe justamente para isso, então nenhum componente mudou. `arcada-fim.webp` foi apagado por ficar órfão. **Nas variantes de Rogério e Décio o campo aceita uma foto.**
- 2026-08-19 — **"Travado, não tá fluido" era o KEYFRAME, e o conserto principal é `-g 4`.** Procurar um instante no meio de um GOP de 24 obriga o navegador a decodificar até 23 quadros antes de mostrar um, e a rolagem pede um instante novo a cada quadro de tela. ⚠️ Todo-keyframe (`-g 1`) foi medido e é inviável: **7,9 MB a 1200px e 11,2 MB a 1500px**, contra 2,4 MB de `-g 4`. Tabela a 1280px — `-g 1`: 7877KB / `-g 2`: 4377KB / `-g 4`: 2425KB / `-g 6`: 1819KB.
- 2026-08-19 — E TRÊS CUIDADOS NO LAÇO, que valem para qualquer escrubagem futura: (a) interpolar num valor PRÓPRIO e nunca em `v.currentTime`, que volta quantizado no quadro entregue e faz o lerp brigar com o arredondamento do vídeo; (b) QUANTIZAR o instante pedido ao quadro (`Math.round(t*fps)/fps`) — a 60Hz de tela contra 24 de vídeo, mais da metade dos pedidos apontava para o quadro que já estava na tela, e cada pedido custa um seek; (c) não pedir nada enquanto `v.seeking` — empilhar seeks é exatamente o que produz a sensação de travamento, porque o quadro que aparece é sempre o de vários pedidos atrás. Medido depois: 108 seeks pedidos, 108 concluídos, zero retrocessos.
- 2026-08-19 — CRF do WebM subiu de 26 para **33**: VMAF 95,2 contra um lossless do mesmo recorte, que é o patamar já aceito aqui, com 1,94 MB em vez de 3,16 MB. Menos bits por quadro é menos trabalho de decodificação, então ajuda a fluidez duas vezes.
- 2026-08-19 — ⚠️ **O RECORTE DO CLIPE ESTAVA ERRADO E A CULPA FOI DA MINHA MEDIÇÃO.** Eu centrei em x=1170 e a arcada aparecia deslocada para a direita no render. O limiar que usei (máximo de luminância por coluna, fundo+16) pegava o BRILHO DE FUNDO como se fosse gengiva e dava o assunto começando em x=473, quando ele começa em ~731. Com limiar alto e por CONTAGEM (≥6 pixels acima de 60 por coluna), a união é x 731..1868 e y 189..1002 → centro (1300, 596), e o recorte virou `1180:900:710:146`. **Ao medir onde um objeto está num quadro, contar pixels acima de um limiar alto — o máximo por coluna acha o brilho, não o objeto.**
- 2026-08-19 — **A arcada SE DESLOCA enquanto gira** — 115px na horizontal e 144px na vertical ao longo do clipe — e a compensação é por **CSS, não por encode**. Fazer o recorte acompanhar o objeto com expressão de tempo no `crop` do ffmpeg funciona (desvio de 34px contra 215px), mas o conteúdo passa a se deslocar a cada quadro, a predição interframe piora e o arquivo vai de 1,9 para 3,2 MB: como o gargalo da seção é decodificar rápido, pagar 70% de peso para centrar seria trocar o problema pelo problema. A tabela `DERIVA` no componente desloca o ELEMENTO pelo oposto do caminho, e isso o compositor faz de graça. ⚠️ Regerar o clipe obriga a remedir a tabela; errada, ela deriva para o lado oposto e nada avisa.
- 2026-08-19 — `transform` no elemento que carrega `mix-blend-mode` é seguro, e vale saber para não hesitar: o que mata o blend é ANCESTRAL isolando o grupo, não o próprio elemento — ele já cria contexto de empilhamento por causa do blend. Conferido no render.
- 2026-08-19 — **O CLIPE VIROU UMA MONTAGEM DE DOIS**, a pedido ("faça metade da boca com dentes já, e quero que mantenha aquele giro ao scrollar a arcada de antes, mostrava todos os dentes"): formação a partir de 4,4s do master (a arcada de cima já completa, a de baixo entrando dente a dente) e, na sequência, o GIRO recuperado do git. 9,25s no total.
- 2026-08-19 — **A emenda é passagem pelo PRETO, não dissolve.** O dissolve mostrava as DUAS arcadas sobrepostas — a de mordida aberta da formação e a fechada do giro — e ficava turvo; conferido em recorte ampliado nos dois casos. Com `mix-blend-mode: screen` o preto é ausência, então a arcada some e volta em vez de fantasmar.
- 2026-08-19 — ⚠️ **A  VOLTOU, e agora é METADE ZERO.** Juntar os dois clipes trouxe de volta o defeito que a tabela existia para resolver: a formação não deriva (1px), mas o giro deriva 115px na horizontal e 144px na vertical, e sem compensação a arcada descia para a direita na segunda metade — visto no render. A tabela nova tem 20 pares: (0,0) até ~3,2s e os valores medidos do giro depois disso, remapeados para a linha do tempo da montagem (o giro foi ampliado por fator uniforme, então a fração se preserva). Medido no pixel: centro do assunto em x=720 numa tela de 1440 nos três pontos do curso, desvio máximo de 3px.
- 2026-08-19 — ⚠️ **Compensar no ENCODE não era possível aqui**, e o motivo é geométrico: o assunto ocupa 96% da largura do quadro, então deslocar o recorte para centrá-lo cortaria dente. Deslocar o ELEMENTO não tem esse limite.
- 2026-08-19 — ⚠️ **OITAVO falso positivo de medição desta memória, e o mais caro em tempo:** o VMAF da montagem deu 82,7 a CRF 32 e SATUROU em 84 mesmo a CRF 21 com 8,7MB. Não era compressão — era o teste. O VP9 LOSSLESS contra a própria referência marcava 85,4, quando tem de dar ~100: as duas trilhas tinham timebase diferente (1/12288 contra 1/1000) e o comparador desalinhava os quadros. Com `settb=AVTB,setpts=PTS-STARTPTS,fps=24` nos dois lados, a sanidade sobe para 98,3 e o CRF 32 mostra o número real: **94,98**. **A regra do log salvou a rodada: medir o lossless PRIMEIRO, e se ele não der ~100, o defeito é do teste.**
- 2026-08-19 — ⚠️ **A metade do giro tem uma geração de perda a mais**: ela é ampliada de 1180 para 1400 de largura, porque o master dela não existe mais (`assets-originais/`, gitignored, contêiner novo) e só há o encode comitado. Se o master reaparecer, refazer essa metade a partir dele.
- 2026-08-19 — ⚠️ **CORTE SECO NO PRETO DEIXA MANCHA, e o usuário pegou antes de mim** ("tire essas manchas quando os dentes vão se encaixando, tá feio"). Com `if(lt(val,52),16,val)` os pontos do fundo que caíam LOGO ACIMA do limiar sobreviviam como blocos claros sobre preto puro — no vão entre as arcadas viravam manchas cinzas visíveis. A correção é uma curva, não um degrau: `16+(val-16)*pow(clip((val-16)/72,0,1),3)` leva o escuro a zero suavemente, sem sobra isolada. Fundo continua em 1–3 (o `screen` segue sem desenhar retângulo), VMAF 95,5, e o vão fica limpo — conferido em recorte ampliado, lado a lado com a versão anterior. **Ao crushar preto para blend, usar joelho suave; degrau produz mancha exatamente na faixa que se quer apagar.**
- 2026-08-19 — ⚠️ **O rótulo mais longo do projeto ESTOURAVA o painel em telas reais.** "Planejamento antes de execução", em Diferenciais, mede 323px com ícone e recuo, e a coluna escura tem 320px numa janela de 360 e 280 numa de 320. Numa linha só não há tamanho de fonte que resolva sem sair da escala de cinco degraus. Abaixo de 420px o rótulo passa a quebrar em duas linhas e o slot cresce de 56 para 76px — e o slot TEM de crescer junto, porque a posição de cada item é calculada a partir dele; sem isso a segunda linha vazaria por cima do item de baixo. Medido depois: folga de 66 a 150px em 320, 360 e 390, e o desktop intacto.
- 2026-08-19 — **O CARROSSEL PASSOU A SERVIR TRÊS SEÇÕES**, a pedido ("colocar o mesmo template que colocou em especialidades em Experiência aplicada caso a caso e Orçamento após avaliação"). ⚠️ Foi decidido CONTRA uma objeção que ele ouviu inteira e recusou: (1) três seções com a mesma anatomia é o defeito que reprovou o layout em 25/07, e a razão da trava dos três na grade antiga; (2) o carrossel é componente de FOTO e essas duas não têm foto própria; (3) as de Tratamentos seriam repetidas de Especialidades. Ele respondeu "mesmo assim, o carrossel nas duas". Registrado no topo do componente e no §5.2 — não corrigir sem falar com ele.
- 2026-08-19 — 🗑️ **`GradeDeCelulas` apagada**: com a terceira seção saindo dela, ficou sem uso nenhum. Componente sem uso é convite a reintroduzir o molde por engano, e a prática deste projeto é apagar e anotar o commit (foi assim com `CorpoClinicoOrbita.tsx`). Está em `bc92186`.
- 2026-08-19 — ⚠️ **O laço da lista SÓ FUNCIONA COM MAIS ITENS QUE A JANELA**, e o defeito só apareceu ao generalizar. No laço circular um item salta de uma ponta à outra quando a distância troca de sinal, e esse salto precisa cair FORA da janela: com 8 itens e janela de 7 sobra exatamente uma posição escondida. Com 4 (Diferenciais) e 3 (Tratamentos) não sobra nenhuma — o salto aconteceria no meio da tela. Solução: quando a lista não é maior que a janela, ela não gira; fica parada e centrada, e só o realce anda.
- 2026-08-19 — Painel da lista ganhou `items-center` pelo mesmo motivo: a lista tem altura fixa (um slot por item) e o painel tem a altura da coluna da foto. Com 8 itens as duas quase coincidem e o defeito não aparece; com 3 e 4 a lista encostava no topo e sobrava petróleo vazio embaixo.
- 2026-08-19 — Imagens das duas seções novas: Diferenciais usa fotos do consultório (`estrutura/`) mais o **scanner intraoral**, que estava ÓRFÃO desde 12/08, quando saiu desta mesma seção — voltou como cartão de "planejamento antes de execução", que é o que ele mostra. Tratamentos repete duas de Especialidades, e a repetição está anotada no LEIA-ME: foi decisão, não descuido.
- 2026-08-19 — ⚠️ **Duas armadilhas de shell que corromperam arquivo em silêncio nesta sessão.** (a) `node -e "..."` com aspas DUPLAS: as crases dentro do script viram substituição de comando do bash, e três termos entre crases sumiram do CLAUDE.md sem erro nenhum — usar heredoc `<<'EOF'` para script com crase. (b) Comentário de bloco que contém o caminho `public/imagens/*` seguido de barra fecha o comentário na hora e quebra o arquivo inteiro: `tsc` acusou 10 erros de sintaxe num tipo que eu não tinha tocado.
- 2026-08-19 — **A ABERTURA VOLTOU PARA A SEQUÊNCIA DE FORMAÇÃO**, a pedido ("volte com a ideia do scroll, aparecer a gengiva → depois os implantes de ferro → e por fim os dentes brancos e centralizar"). O clipe do giro saiu depois de meio dia no ar. Nada foi reconstruído de memória: o encode da formação foi RECUPERADO do git (`38f8b02`), como o §8 manda.
- 2026-08-19 — ⚠️ **O pedido COMPLETO dele não é entregável com o material que existe**, e os dois caminhos fecharam no mesmo dia: ele refinou para "em movimento de um lado para o outro, mostrando os dois lados da boca, MAS adicione essa ação de ir adicionando os ferros e os dentes" — giro E formação juntos, o que exige geração nova; e então (a) esta sessão não tem MCP de geração e (b) ele respondeu "eu to sem crefito no higgsfield". Foi ao ar a formação sozinha: entrega implantes → dentes entrando um a um, e NÃO entrega o giro nem a gengiva vazia antes dos implantes.
- 2026-08-19 — **A `DERIVA` FOI DELETADA, e a ausência é MEDIDA.** O giro caminhava 115px na horizontal e 144px na vertical, e sem a tabela terminava visivelmente deslocado. A formação não caminha: 32 amostras ao longo dos 8,04s dão o centro do assunto em x=960 num quadro de 1920 — o meio exato — e deriva de **1px na horizontal, 0 na vertical**. Mantida, a tabela do giro deslocaria este clipe para o lado errado. É isso que resolve o "centralizar" do pedido, e resolve no ARQUIVO (recorte `1400:1056:260:24`, centrado em 960,552), sem nada em runtime.
- 2026-08-19 — ⚠️ **`colorlevels` e `lutrgb` TRIPLICAM o arquivo, e o culpado é a conversão para RGB.** O ponto de preto tem de ir a zero para o `mix-blend-mode: screen` não desenhar um retângulo mais claro que a página — o fundo deste master chega a 34 de 255 na faixa do topo. Medido no mesmo CRF: `colorlevels` 15.836 KB, `lutrgb` (corte seco, sem esticar) 15.303 KB, e **sem filtro nenhum 4.525 KB**. Ou seja não é o esticamento de faixa, é o dither da ida e volta para RGB. No domínio YUV (`lutyuv=y='if(lt(val,52),16,val)'`): **4.431 KB, VMAF 95,1**, fundo em 1 nos cantos e 2 na faixa do topo, pico do assunto intacto em 255.
- 2026-08-19 — Minha primeira hipótese estava errada e a segunda medição desmentiu: culpei o esticamento de faixa e troquei por corte seco, que custou igual. Só testar SEM filtro nenhum mostrou que o custo é a conversão de espaço de cor, não a operação. **Isolar a variável antes de trocar a solução.**
- 2026-08-19 — Resolução SUBIU: 1400×1056 contra 1180×900 do giro, +18,6% linear, sem redução depois do recorte. É o máximo REAL — o master é 1080p e não há 4K em nenhuma fonte, apesar de "em 4k" estar no pedido. Terceira vez que essa recusa aparece (18/08, 19/08, e agora): 4K só sairia de upscale por IA, que num render 3D de gradiente liso inventa micro-textura na gengiva. O quadro exibe 720px no desktop, 1440 num retina — 1400 é praticamente 1:1.
- 2026-08-19 — `TRILHO_MULT` de 1,6 para **1,4**, atendendo "sem parecer lento a ação". O clipe é 33% mais longo que o do giro, então só a troca já acelerava; com o trilho menor o ritmo foi de 238 para **157px de rolagem por segundo de vídeo** (34% mais rápido) e a seção de 2,6 para **2,4 telas**.
- 2026-08-19 — Voltaram os DOIS quadros-poster (gengivas com implantes → coroas instaladas), como o próprio `clinica.ts` previa: "se a formação voltar, voltam os dois — e a ORDEM deles é conteúdo, porque inverter é inverter um procedimento clínico na tela". Extraídos do próprio clipe já recortado, então a troca de poster para vídeo não salta um pixel.
- 2026-08-19 — Medido em 1440×900 e 390×844: escrubagem de 0 a 8,04s acompanhando a rolagem em seis pontos, vídeo `paused` em todo o curso, caixa travada em **1,326 (recorte ZERO)** — 720×543 no desktop, 351×265 no celular —, zero overflow, e a moldura invisível (o fundo do clipe dissolve no petróleo da página). Única requisição falhada é o Google Fonts, bloqueado aqui.
- 2026-08-19 — **ESPECIALIDADES virou CARROSSEL de duas metades**, de um template que o usuário mandou: painel petróleo com a lista das oito à esquerda, pilha de fotos à direita, e a descrição sobre a foto do item ativo. É a QUARTA forma desta seção (índice com hover → índice tipográfico → grade de células → carrossel), e a primeira que tem FOTO. ✅ Tirou a `GradeDeCelulas` de uma seção: servia três, agora serve duas.
- 2026-08-19 — Do template ficaram fora TRÊS dependências e cinco gestos, todos por motivo já pago aqui: `motion/react` (o projeto não tem dep. de animação, e é o mesmo argumento que barrou o GSAP — essas libs escrevem `transform` e o Tailwind v4 escreve `translate`/`scale`/`rotate` separadas, e misturar falha em silêncio); `@hugeicons/react` + `@hugeicons/core-free-icons` (os oito ícones dentais já existem desenhados no projeto — instalar duas deps para ter pizza, nuvem e celular numa clínica não se sustenta); o azul `#62B2FE`; o "Live Session" em monoespaçada; a pill "1 • Nome"; e o `grayscale` nos inativos. A interpolação é `transition` de CSS sobre `transform` inline.
- 2026-08-19 — ⚠️ **Defeito que só um teste de LARGURA pega, e é a segunda vez na memória:** a 320px o rótulo "Implantodontia e Cirurgia" (205px a 16px, numa coluna de 240px) era CORTADO. Não quebra em duas linhas, e o painel tem `overflow-hidden`, então também não gera rolagem — os dois testes padrão PASSAM. Resolvido com `text-small` até `sm` (degrau da escala, não tamanho novo): folga de 6px a 320 e 46px a 360.
- 2026-08-19 — ⚠️ **E o `text-small` não chegava ao DOM.** O `cn()` (tailwind-merge) não conhece esse token, trata como cor de texto, e o `text-ink` que vem depois na mesma mesclagem o descarta — sem erro, e o elemento segue a 16px. Só apareceu ao medir `getComputedStyle().fontSize` em vez de confiar na classe escrita. O degrau foi para o `<span>` do rótulo, que não tem classe de cor. Registrado no §10.
- 2026-08-19 — Cartão em **4:3 e não no 4:5 do template**, e é geometria medida: sete das oito imagens são 1,5:1 e uma é 1:1, então em retrato perderiam 47% da largura. Em 4:3 o recorte é de 11% da largura nas panorâmicas e 25% da altura na quadrada. Conferido nas oito num quadro de contato ANTES de entrar — é a quarta encarnação da armadilha de arquivo panorâmico em caixa vertical (12/08, 13/08, 17/08).
- 2026-08-19 — **Primeiro render foi reprovado por mim antes de mostrar**, e o defeito era de contraste de token: o painel direito em `--surface-raised` (L 0.968) sobre `--background` (L 0.984) é 1,6% de diferença — o lado direito lia como página vazia e o bloco parecia cortado ao meio. Virou `bg-foreground/[0.055]`, petróleo a 5,5%, que amarra com o painel escuro em vez de introduzir um cinza que não é da paleta. Junto: cartão de 30 para 34rem, painel esquerdo de 42% para 38%, e o desfoque saiu dos vizinhos — sobre painel CLARO o borrão virava mancha cinza em vez de profundidade (no template o painel era escuro).
- 2026-08-19 — Três imagens novas entraram do acervo do site antigo (harmonização, odontopediatria, reabilitação), e as escolhas foram por COMPLIANCE antes de estética: `asset-8.jpeg` ("close de sorriso com reabilitação total") ficou fora porque sorriso reabilitado como ilustração de especialidade lê como promessa de resultado — mesma razão de 13/08 no hero; e o bebê sorrindo da odontopediatria é o clichê de estoque que o §4 proíbe. Nenhuma das oito é registro clínico. Proveniência, descartadas e as duas ressalvas abertas em `public/imagens/especialidades/LEIA-ME.txt`.
- 2026-08-19 — Medido no render: painel 480×360 (1,333 exato), **0% de recorte** na foto ativa, 7 dos 8 chips na tela (o oitavo é onde o laço salta, e por isso é invisível), zero overflow de 320 a 1920, troca automática a 4,2s parando no mouse E no foco, setas/Home/End andando na lista, `prefers-reduced-motion` desligando movimento sem esconder texto. Seção em 0,81 tela no desktop e 1,18 no celular.
- 2026-08-19 — ⚠️ **O MCP do Lovable NÃO existe nesta sessão** (nem conector do Lovable na conta), e o sync do GitHub continua vivo — 14 commits do `gpt-engineer-app[bot]`, o último em 17/08. Consequência: o diagnóstico de 30 segundos do §8 (comparar `latest_commit_sha` dos dois projetos) fica pela metade, e não há como delegar download de host bloqueado ao agente do Lovable. Push na `main` continua chegando no projeto dele.
- 2026-08-19 — ⚠️ **`assets-originais/` NÃO SOBREVIVE a contêiner novo** — é gitignored, e os quatro masters 1080p que o usuário mandou em 18/08 não estão mais em disco. Recuperável do git só o que foi COMITADO: os encodes da formação (`arcada.mp4` 1920×1080/8,04s e `arcada.webm`, em `38f8b02`) e os 6 quadros de etapa (2048×1152, em `70e56cb`). Ao pedir master novo, comitar ou avisar que se perde.
- 2026-08-19 — O contêiner novo também **não tem ffmpeg nem playwright**. Os dois se resolvem: ffmpeg estático do BtbN (com `libvmaf`) e `playwright-core` do npm, usando o Chromium de `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` — o caminho `chromium/` do enunciado do ambiente NÃO existe, é o sufixo `-1194`.
- 2026-08-19 — Quadro maior e menos vazio, a pedido ("aumente o tamanho um pouco, não tão grande, mas tá sobrando muito espaço entre o final da sessão a logo da Suzuki"): de 0,42 para **0,50** da largura da tela, com o teto de altura em 0,62. Em 1440 o quadro fecha em 720×549 e as folgas caíram de 133 para **77px** em cima e embaixo.
