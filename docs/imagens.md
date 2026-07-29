# Imagens — o que falta e como entregar

## Situação

O site novo está com **toda a canalização de imagem pronta**, mas **zero arquivo**. Todo slot
está em `null` e renderiza um placeholder rotulado no lugar.

O motivo é ambiental, não técnico: `suzukiodontologia.com.br` é **bloqueado pela network policy**
desta sessão (403 na negociação de CONNECT, confirmado em 24/07 e 29/07). Claude não consegue
baixar nada de lá e não deve contornar a policy.

## Como entregar os arquivos

Duas vias. A primeira é a mais simples.

### Via 1 — subir direto no GitHub (recomendado)

1. Baixe as imagens do site antigo (botão direito → salvar, ou baixe o backup do WordPress)
2. Abra `https://github.com/joaogstrapa10-cell/dentis-base-template`
3. Navegue até `public/imagens/`, clique em **Add file → Upload files**
4. Solte os arquivos usando exatamente os nomes da tabela abaixo
5. Commit

Feito isso, Claude troca os `null` por caminhos em `src/content/clinica.ts`. É mecânico.

### Via 2 — Google Drive

Suba tudo numa pasta do Drive e passe o nome dela. Claude tem acesso ao Drive nesta sessão e
consegue baixar de lá para o repositório.

## Nomes de arquivo esperados

Use estes nomes. Assim a troca em `clinica.ts` é direta, sem adivinhação.

### Estrutura da clínica — 12 imagens

Origem: seção "Nossa Estrutura" do site antigo (`/wp-content/uploads/2022/04/asset-*.webp`
e `img001.webp`).

| Destino | Campo em `clinica.ts` |
|---|---|
| `public/imagens/estrutura/01.webp` … `12.webp` | `estrutura.imagens[n].src` |

Mantenha a **ordem do site antigo**. As duas primeiras (`01` e `02`) alimentam também o
comparador arrastável no topo da seção — escolha duas que façam sentido comparar.

Junto com os arquivos, mande a **descrição de cada ambiente** (ex: "consultório 3",
"sala de tomografia", "recepção"). Hoje o `alt` é `[ESTRUTURA 01 — imagem a confirmar]`, e
`alt` genérico é falha de acessibilidade.

### Retratos do corpo clínico

| Destino | Campo |
|---|---|
| `public/imagens/equipe/dalton.webp` | `bio.retrato` |
| `public/imagens/equipe/membro-01.webp` … `03.webp` | `bio.corpoClinicoMembros[n].retrato` |

No site antigo os retratos estavam em `dalton.1620766963.webp`, `1.1620766982.webp`,
`13.1620766984.webp` e `4.1620766985.webp` — mas **não há vínculo conhecido entre arquivo e
nome**. Ao mandar, diga quem é quem.

### Depoimentos — retrato das pacientes

| Destino | Campo |
|---|---|
| `public/imagens/depoimentos/adriane-cardoso.webp` | `depoimentos.itens[0].foto` |
| `public/imagens/depoimentos/joselia-bellegard.webp` | `depoimentos.itens[1].foto` |
| `public/imagens/depoimentos/adilia-miguel.webp` | `depoimentos.itens[2].foto` |

> ⚠️ **Falta também o texto.** Só os três nomes chegaram até aqui; o corpo de cada depoimento
> nunca foi repassado. Hoje renderiza `[DEPOIMENTO VERBATIM — Nome]` visível na tela.
> Mande o texto junto com a foto — Claude não fabrica depoimento atribuído a paciente real.
>
> O depoimento da **Josélia Bellegard** tem um parágrafo duplicado no original. Deduplicar.

> ⚠️ **Autorização de imagem.** Retrato de paciente em material de divulgação exige
> autorização de uso de imagem (LGPD, e a Resolução CFO-196/2019 para publicidade
> odontológica). As fotos já estarem no site atual sugere que a autorização existe, mas quem
> confirma é a clínica. Vale checar antes de publicar.

### Logo

| Destino | Uso |
|---|---|
| `public/imagens/logo.svg` | wordmark do header e do footer |

No site antigo: `logo-horizontal-branco.1620766974.svg`. É a **versão branca** — o site novo
tem fundo claro na maior parte, então provavelmente é preciso a versão escura também. Se
existir, manda as duas.

**Não** copiar o link do logo do site antigo: um deles vaza
`http://localhost/website-susuki-odontologia/...`, resíduo da agência anterior.

## Formato

- **WebP** de preferência, ou JPG. PNG só para logo.
- Largura útil: **1600px** basta para estrutura; **800px** para retrato. Maior que isso só
  pesa o carregamento.
- Não precisa recortar: os slots já têm `aspect-ratio` fixo e `object-cover`.

## O que já está pronto no código

- `EstruturaSlot.src`, `BioContent.retrato`, `BioMembro.retrato` e `Depoimento.foto` aceitam
  `string | null`. Com `null` cai no placeholder rotulado; com caminho, renderiza a imagem.
- Todo `<img>` já tem `loading="lazy"`, `alt` vindo do conteúdo e proporção fixa, para não
  causar deslocamento de layout ao carregar.
- Nenhum caminho de imagem está escrito dentro de componente — tudo em `clinica.ts`, o que
  mantém a replicação para Rogério e Décio funcionando.
