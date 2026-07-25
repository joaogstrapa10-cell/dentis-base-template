# Prompt-mestre do Lovable — Fase 1

Colar **inteiro**, de uma vez, como primeira mensagem do projeto no Lovable.
Não fragmentar, não pedir "o resto depois".

---

Construa uma landing page single-page para uma clínica odontológica de alto padrão em Curitiba/PR, em português do Brasil. Este projeto é uma **BASE (template)** que depois será replicada para três clínicas diferentes, então a arquitetura de dados é tão importante quanto o visual — leia a seção ARQUITETURA OBRIGATÓRIA antes de escrever qualquer componente e trate-a como requisito de aceite, não como sugestão.

## Restrições técnicas

- Use apenas o que já vem no scaffold: React, Vite, TypeScript, Tailwind CSS, shadcn/ui e lucide-react. **Não instale nenhuma dependência nova.**
- Proibido: framer-motion, GSAP, react-spring, AOS, swiper, biblioteca de carrossel, biblioteca de ícones adicional, biblioteca de gráficos.
- Animação de entrada usa `IntersectionObserver` escrito à mão em um hook próprio (`src/hooks/useReveal.ts`) + transições do Tailwind. Nada além disso.
- Single page. Sem router, sem rotas internas. Navegação por âncora com scroll suave.
- Sem backend, sem banco, sem formulário que envie dados. Todo CTA aponta para WhatsApp ou telefone.

## ARQUITETURA OBRIGATÓRIA

Isto é o núcleo do pedido. Replicar esta base para outra clínica precisa ser **trocar um arquivo de conteúdo e alguns tokens de cor, sem abrir nenhum componente.**

1. **Todo** o conteúdo textual e todas as referências de imagem ficam em `src/content/clinica.ts`, que exporta um único objeto tipado `export const clinica: Clinica = { ... }`. Não pode existir **nenhuma** string de conteúdo hardcoded dentro de componente — nem headline, nem label de botão, nem título de seção, nem texto de FAQ, nem `alt` de imagem, nem endereço, nem telefone.
2. Os tipos ficam em `src/content/types.ts`. Um tipo por seção (`HeroContent`, `SelosContent`, `DiferenciaisContent`, etc.) mais o tipo raiz `Clinica` que os agrega. Sem `any`.
3. Cada seção é um componente próprio em `src/components/sections/`, um arquivo por seção, e recebe seus dados **por props tipadas** — o componente nunca importa `clinica.ts` diretamente. Quem lê `clinica.ts` e distribui as props é a página principal.
4. Tema centralizado em CSS variables no `src/index.css` (bloco `:root`) e exposto no `tailwind.config.ts` via `theme.extend.colors`, com **tokens semânticos**: `--background`, `--surface`, `--surface-raised`, `--border`, `--foreground`, `--muted`, `--accent`, `--accent-foreground`. Nenhum componente pode usar cor literal — proibido `bg-zinc-900`, `text-white`, `#0a0a0a`, `bg-[#...]`. Só `bg-background`, `text-muted`, `border-border`, `bg-accent` e afins.
5. Espaçamento de seção também via token: crie uma classe utilitária ou um wrapper `<Section>` que aplique o ritmo vertical, para o ritmo ser ajustável em um lugar só.

Critério de aceite: um `grep` por cor literal ou por texto em português dentro de `src/components/sections/` não deve retornar nada.

## Sistema de design

Base escura, neutra-fria, editorial. Densa em tipografia, generosa em respiro. Deve parecer software de alto padrão, **não** site de consultório.

- **Fundo** quase-preto neutro. **Cards** são o fundo elevado 3–4% de luminosidade, com borda de 1px em branco a ~10% de opacidade e raio 12–16px. Separação vem de **borda**, não de sombra. Sombra só em elemento flutuante.
- **Accent único: bronze/champanhe dessaturado** (algo como `hsl(35, 45%, 62%)`). Usado só em: CTA primário, borda do plano destacado, ícone de check da tabela comparativa e eyebrow ativo. Se passar de ~5% da área visível, está demais. **Nunca** azul-claro de consultório, nunca ciano/verde-tech.
- **Texto** em branco a 92% para o principal e branco a ~58% para o secundário. Nunca branco puro.
- **Tipografia:** sans neo-grotesca de peso médio, duas escalas com contraste forte entre display e corpo. Hero em `clamp(3rem, 7vw, 5.5rem)`, peso 500–600, tracking `-0.03em`, line-height `~1`. H2 de seção em `clamp(2rem, 4vw, 3.25rem)`, tracking `-0.02em`. Corpo em `1rem–1.125rem`, line-height `1.6`. Eyebrow em `0.75rem`, uppercase, tracking `+0.08em`. **Sem serif clássica** — puxa para clínica tradicional.
- **Grid:** container `max-w-[1200px]`, padding lateral 24px mobile / 40px desktop, 12 colunas, gap 24px.
- **Ritmo vertical entre seções:** `py-24` no mobile, `py-32`/`py-40` no desktop. Constante. É o que produz a sensação de alto padrão.
- **Cabeçalho de seção:** eyebrow → H2 → parágrafo de apoio, largura máxima ~680px, **alinhado à esquerda**, não centralizado.
- **Animação de intensidade baixa:** fade + translate-Y de 12–16px, 400–500ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`, dispara uma vez ao entrar no viewport. Stagger de 60–80ms entre itens de um mesmo grid, no máximo 6 itens. Respeitar `prefers-reduced-motion` (desliga translate e stagger, mantém opacidade final). Sem parallax, sem contador animado, sem animação amarrada a scroll contínuo.
- **Imagens:** todas com `alt` descritivo vindo de `clinica.ts`, `loading="lazy"` fora da primeira dobra, `aspect-ratio` fixo para não causar layout shift. Onde não houver arquivo, use um placeholder sólido em `--surface` com o rótulo do slot visível — não use foto de banco de imagem.

## Regras de conteúdo

- **Zero lorem ipsum.** Zero texto genérico de preenchimento.
- Onde a informação real ainda não existe, use um **placeholder explícito e nomeado entre colchetes**, exatamente como escrito abaixo (ex: `[DEPOIMENTO VERBATIM — Adriane Cardoso]`). O placeholder deve ficar visível no render, para ser fácil localizar o que falta.
- **Compliance CFO-196/2019:** proibido antes/depois, proibido prometer ou sugerir resultado, proibido superlativo de resultado ("o melhor sorriso", "resultado garantido"). Fale de **processo, formação e critério técnico**. Toda comparação compara **processo**, nunca resultado.
- Sem clichê de estoque: dente branco brilhando, sorriso genérico de banco de imagem, azul-claro de consultório, ícone de dentinho fofo.

## As 12 seções, nesta ordem exata

### 1. Hero
- Eyebrow: `Curitiba · Alto da XV`
- Headline: `Odontologia de alta complexidade, conduzida por mestres e especialistas.`
- Subheadline: `Saúde, função mastigatória e estética em harmonização com a face. Um corpo clínico reunido para tratar o que exige critério técnico — não volume de atendimento.`
- CTA primário: `Agendar avaliação` → link de WhatsApp
- CTA secundário: `Conhecer a clínica` → âncora para a seção de diferenciais
- Linha de apoio discreta abaixo dos CTAs: `Responsável técnico: Dr. Dalton Suzuki — CRO-PR 9112`
- Glow radial suave em accent atrás do bloco de texto, bem sutil. Sem foto de hero — ou, se usar imagem, apenas a fachada/estrutura da clínica com overlay escuro forte.

### 2. Barra de formações e certificações
Substitui a barra de "empresas que confiam". **Mantenha o bloco mesmo com placeholders — não remova.**
- Rótulo acima: `Formação e titulação do corpo clínico`
- Itens (texto, não logo, até os arquivos existirem): `ILAPEO — Mestrado em Implantodontia`, `ABO-PR — Especialização em Implantodontia`, `APCD Bauru — Especialização em Periodontia`, `PUC-PR — Graduação`, `CRO-PR`, `[SELO ADICIONAL 1]`, `[SELO ADICIONAL 2]`
- Marquee CSS linear e lento (~30s), com máscara de fade nas duas pontas. Pausa no hover. Puro CSS.

### 3. Diferenciais da clínica
- Eyebrow: `Por que aqui`
- H2: `Experiência e credibilidade, aplicadas caso a caso.`
- Parágrafo de apoio: `Nosso corpo clínico é formado por mestres e especialistas em diversas áreas da Odontologia. A proposta é unir conhecimento, experiência, ética e alta tecnologia em benefício de cada paciente.`
- 4 cards, cada um com ícone lucide, título e 2–3 linhas:
  1. `Corpo clínico de especialistas` — `Cada área conduzida por quem se especializou nela. O caso não muda de mãos por conveniência de agenda.`
  2. `Casos de alta complexidade` — `Reabilitações extensas e situações que exigem planejamento multidisciplinar são o centro da nossa rotina, não a exceção.`
  3. `Planejamento antes de execução` — `Nenhum procedimento começa sem diagnóstico fechado e plano apresentado ao paciente, com etapas e critérios definidos.`
  4. `Harmonização com a face` — `Função mastigatória e estética tratadas em conjunto, considerando a face como um todo — não o dente isolado.`

### 4. Acompanhamento do tratamento
Adaptação do mockup de acompanhamento/atualizações da referência.
- Eyebrow: `Como conduzimos`
- H2: `Você acompanha cada etapa do seu tratamento.`
- Layout: coluna de texto à esquerda + mockup de interface à direita (painel fake em `--surface`, construído em HTML/CSS, sem imagem). O painel mostra uma timeline de 4 etapas com estados visuais distintos (concluído / em andamento / previsto).
- As 4 etapas: `Avaliação e diagnóstico` (`Exame clínico, imagens e histórico. O caso é fechado antes de qualquer proposta.`), `Plano de tratamento` (`Etapas, prazos e critérios técnicos apresentados a você por escrito.`), `Execução` (`Cada fase conduzida pelo especialista da área, com registro do que foi feito.`), `Manutenção` (`Acompanhamento periódico para preservar o que foi reabilitado.`)
- **Sem** nenhuma copy que prometa resultado. Fala de condução, não de desfecho.

### 5. Localização
- Eyebrow: `Onde estamos`
- H2: `Alto da XV, Curitiba.`
- Card com: endereço `Rua Atílio Bório, 547 — Alto da XV, Curitiba/PR, CEP 80045-120`; horário `Segunda a sexta, 8h–12h e 13h30–18h`; telefone `[TELEFONE-PRINCIPAL — a confirmar]`; WhatsApp `[WHATSAPP — a confirmar]`
- Mapa: `<iframe>` do Google Maps embed apontando para o endereço, com `border-0`, raio 16px, `loading="lazy"` e `title` descritivo. Aplique um filtro CSS escuro leve para o mapa não brigar com o tema.
- **Importante:** o número exibido e o `href` do link devem sair do **mesmo campo** de `clinica.ts`. Não crie campos separados para display e link.

### 6. Áreas de atuação
Adaptação do grid de cases. **Mantenha esta ordem exata.**
- Eyebrow: `Áreas de atuação`
- H2: `Oito especialidades, sob um mesmo critério.`
- 8 cards em grid 1 / 2 / 3 colunas (mobile / tablet / desktop). Card = título + descrição + tags:
  1. `Implantodontia e Cirurgia` — `Reposição de dentes ausentes com implantes e procedimentos cirúrgicos, do caso unitário à reabilitação total.` — tags: `Implantes`, `Cirurgia`, `Alta complexidade`
  2. `Estética Dental` — `Facetas, coroas em cerâmica e clareamento, planejados a partir da proporção da face.` — tags: `Facetas`, `Cerâmica`, `Clareamento`
  3. `Endodontia` — `Tratamento de canal com foco em preservar o dente natural sempre que houver condição para isso.` — tags: `Canal`, `Preservação`
  4. `Harmonização Facial` — `Procedimentos faciais conduzidos em conjunto com o plano odontológico, respeitando as proporções individuais.` — tags: `Face`, `Proporção`
  5. `Ortodontia` — `Correção de posicionamento dentário e de mordida, com aparelhos fixos e alinhadores.` — tags: `Aparelho`, `Alinhadores`, `Mordida`
  6. `Odontopediatria` — `Atendimento infantil com condução adequada à idade e acompanhamento do desenvolvimento.` — tags: `Infantil`, `Prevenção`
  7. `Periodontia` — `Tratamento dos tecidos de suporte do dente — gengiva e osso — base de qualquer reabilitação duradoura.` — tags: `Gengiva`, `Suporte`
  8. `Reabilitação Oral` — `Reconstrução da função mastigatória em casos extensos, integrando as demais especialidades.` — tags: `Função`, `Multidisciplinar`

### 7. Depoimentos de pacientes
- Eyebrow: `Pacientes`
- H2: `Quem já passou por aqui.`
- 3 cards. Nomes reais, textos ainda pendentes — use exatamente estes placeholders no corpo:
  1. `[DEPOIMENTO VERBATIM — Adriane Cardoso]` / autor: `Adriane Cardoso`
  2. `[DEPOIMENTO VERBATIM — Josélia Bellegard]` / autor: `Josélia Bellegard`
  3. `[DEPOIMENTO VERBATIM — Adília Miguel]` / autor: `Adília Miguel`
- Sem estrelas, sem nota, sem foto de avatar genérico. Inicial do nome em um círculo em `--surface-raised`.

### 8. Comparativo
- Eyebrow: `Diferença de método`
- H2: `Nosso processo, comparado ao atendimento odontológico convencional.`
- Tabela de 3 colunas: critério · `Nossa clínica` · `Atendimento convencional`. A coluna da clínica com fundo `--surface` e borda em accent. Ícone `Check` em accent × `Minus` em `--muted`. Linhas separadas por `--border`, sem zebra.
- Critérios (comparam **processo**, nunca resultado): `Diagnóstico antes da proposta comercial`; `Especialista dedicado por área`; `Plano de tratamento entregue por escrito`; `Casos de alta complexidade conduzidos internamente`; `Função e estética planejadas em conjunto`; `Acompanhamento de manutenção após a alta`
- Nota de rodapé da seção: `Comparativo de processo de atendimento. Não constitui promessa de resultado clínico.`

### 9. Tratamentos
Ocupa o lugar do pricing da referência. **A clínica não divulga preço** — não invente valor, não invente plano.
- Eyebrow: `Tratamentos`
- H2: `Cada caso é orçado após avaliação.`
- Parágrafo: `Não trabalhamos com tabela fechada: o valor depende do diagnóstico, da extensão do caso e das etapas envolvidas. A avaliação inicial define o plano e o orçamento.`
- 3 cards em grid 1 / 3, o do meio destacado com borda em accent e badge `Mais procurado`:
  1. `Avaliação e prevenção` — `Consulta de avaliação, diagnóstico, limpeza e plano de acompanhamento.` — inclui: `Exame clínico completo`, `Diagnóstico por imagem`, `Plano de tratamento por escrito`
  2. `Reabilitação` — `Implantes, próteses e reabilitação da função mastigatória em casos extensos.` — inclui: `Planejamento multidisciplinar`, `Cirurgia e implantes`, `Prótese sobre implante`, `Manutenção periódica`
  3. `Estética e harmonização` — `Facetas, cerâmicas, clareamento e harmonização facial integrados ao plano.` — inclui: `Planejamento a partir da face`, `Facetas e coroas em cerâmica`, `Clareamento`, `Harmonização facial`
- No lugar do preço, em cada card: `Valor sob avaliação`. CTA de cada card: `Agendar avaliação`.

### 10. Bio do responsável técnico
- Eyebrow: `Responsável técnico`
- H2: `Dr. Dalton Suzuki`
- Layout duas colunas: retrato à esquerda (placeholder rotulado `[RETRATO — Dr. Dalton Suzuki]`, `aspect-[4/5]`), texto à direita.
- Linha de credencial: `CRO-PR 9112`
- Corpo: `Graduado em Odontologia pela PUC-PR e mestre em Implantodontia pelo ILAPEO, com especialização em Periodontia pela APCD Bauru e em Implantodontia pela ABO-PR. Atua especialmente em pacientes de alta complexidade e coordena o corpo clínico da clínica, com foco em ética, compromisso e qualidade dos serviços. Em docência e pesquisa, tem trabalhos publicados, participação em livros didáticos e ministra aulas em cursos de pós-graduação em Implantodontia.`
- Lista de titulação em pills: `Mestre em Implantodontia — ILAPEO`, `Especialista em Implantodontia — ABO-PR`, `Especialista em Periodontia — APCD Bauru`, `Graduação — PUC-PR`
- Abaixo, um bloco secundário `Corpo clínico` com 3 slots de placeholder: `[NOME COMPLETO — CRO — ESPECIALIDADE]` repetido, cada um com placeholder de retrato. Este bloco existe para receber o restante da equipe.

### 11. FAQ
- Eyebrow: `Dúvidas`
- H2: `Perguntas frequentes.`
- Accordion do shadcn, um item aberto por vez, divisor `--border` entre itens, chevron rotacionando. Sem card por pergunta.
- 7 itens. As respostas marcadas com `[CONFIRMAR: ...]` precisam de validação da clínica — mantenha o marcador visível:
  1. `Como funciona a primeira consulta?` — `É uma consulta de avaliação: exame clínico, imagens quando necessário e levantamento do histórico. Ao final você recebe o diagnóstico e o plano de tratamento com as etapas previstas.`
  2. `Vocês atendem convênio?` — `[CONFIRMAR: lista de convênios atendidos, ou informar atendimento exclusivamente particular]`
  3. `É possível parcelar o tratamento?` — `[CONFIRMAR: formas de pagamento e condições de parcelamento]`
  4. `Quanto tempo leva um tratamento com implantes?` — `Depende da condição óssea e da extensão do caso. O prazo estimado é definido no plano de tratamento, após a avaliação — não antes.`
  5. `Existe garantia sobre os procedimentos?` — `[CONFIRMAR: política de garantia e condições de manutenção]`
  6. `Sinto muito medo de dentista. Como vocês lidam com isso?` — `[CONFIRMAR: recursos disponíveis para pacientes ansiosos — sedação, anestesia, condução do atendimento]`
  7. `Preciso de encaminhamento de outro dentista?` — `Não. Você pode agendar diretamente, tanto para avaliação inicial quanto para uma segunda opinião sobre um plano já existente.`

### 12. Footer com CTA final
- Bloco de CTA no topo do footer, destacado em `--surface` com borda: H2 `Comece pela avaliação.` + parágrafo `Uma consulta define o diagnóstico, o plano e o orçamento. Sem compromisso de fechamento.` + CTA primário `Agendar pelo WhatsApp`
- Abaixo, footer em 4 colunas:
  - Coluna 1: logo/wordmark da clínica + endereço + horário
  - Coluna 2 `Áreas de atuação`: as 8 especialidades, como âncoras
  - Coluna 3 `Clínica`: `Diferenciais`, `Como conduzimos`, `Responsável técnico`, `Perguntas frequentes`
  - Coluna 4 `Contato`: telefone, WhatsApp, e os links `facebook.com/suzukiodontologia` e `instagram.com/suzukiodontologiaoficial` com ícones lucide
- Barra inferior: `© 2026 [NOME DA CLÍNICA]` · `Responsável técnico: Dr. Dalton Suzuki — CRO-PR 9112` · `[CNPJ]`
- Header fixo no topo da página, translúcido com `backdrop-blur`, borda inferior em `--border`, com wordmark à esquerda, âncoras no centro (escondidas no mobile) e CTA `Agendar` à direita.

## Entregável

Ao final, garanta que: `src/content/clinica.ts` contém 100% do conteúdo acima; `src/content/types.ts` tipa tudo sem `any`; existem 12 arquivos em `src/components/sections/`; nenhum componente tem string em português ou cor literal; o tema está inteiro em CSS variables no `index.css` mapeadas no `tailwind.config.ts`; e o projeto compila sem erro de TypeScript.

---

## Notas para o operador (não colar no Lovable)

**Decisões de adaptação embutidas no prompt:**

1. **Pricing → "Tratamentos" sem valor.** O site antigo não tem nenhuma informação de preço e a clínica não divulga tabela. Em vez de descartar a seção 9 da referência ou inventar valores, ela virou 3 eixos de cuidado com `Valor sob avaliação` no lugar do preço. Preserva o formato de 3 cards com o do meio destacado.
2. **Depoimentos ficaram como placeholder nomeado.** Os 3 nomes são de pacientes reais e o verbatim não foi obtido. Fabricar depoimento atribuído a pessoa real está fora de cogitação — os cards renderizam com o marcador visível até o texto chegar.
3. **Descrições das 8 especialidades são rascunho de Claude**, não a copy do site (as 8 páginas não foram raspadas). São descrições factualmente corretas da especialidade, escritas sem promessa de resultado, para o render não sair vazio. Substituir pela copy real quando disponível — é edição em `clinica.ts`, custo zero de crédito.
4. **Instância base = Suzuki / Dr. Dalton**, porque é o único conteúdo real que existe. Rogério e Décio saem daqui trocando `clinica.ts` + accent.
5. Tudo que depende de dado que só a clínica tem virou `[CONFIRMAR: ...]` ou `[... — a confirmar]` visível no render: telefone, WhatsApp, convênio, parcelamento, garantia, sedação, CNPJ, nome da clínica, retratos.

---

## Correções obrigatórias antes de reusar este prompt

Aprendido na geração da base (24/07). **Aplicar antes de rodar para Rogério ou Décio.**

1. **A stack não é Vite + `tailwind.config.ts`.** O scaffold do Lovable é TanStack Start +
   Tailwind v4 + bun. Não existe `tailwind.config.ts` (config é CSS-first via `@theme`) nem
   `src/index.css` (é `src/styles.css`). Pedir `tailwind.config.ts` faz o agente criar um
   arquivo inerte.

2. **Não mandar tudo numa mensagem só.** A primeira tentativa com o prompt inteiro como
   `initial_message` **falhou silenciosamente**: `agentFinished: true`, `error: null`,
   zero arquivo criado. O que funcionou: arquitetura + design + compliance no
   **project knowledge**, e só o conteúdo das seções na mensagem.

3. **`text-muted` não é texto secundário.** No `@theme` o Lovable segue a convenção shadcn e
   mapeia `--color-muted` para a cor de *fundo*. Texto secundário é `text-muted-foreground`.
   Escrever "use `text-muted`" no prompt induz ao erro.

4. **Reforçar o campo único de telefone.** Mesmo com instrução explícita, o agente recriou
   `telefone: { display, href }`. Pedir desde o início `telefone: string` + um módulo
   `src/lib/contato.ts` com `telHref()`/`whatsappHref()` derivando o link do próprio número.

5. **Uma tarefa por mensagem nas correções.** Mensagem com 3 itens teve 2 ignorados.

6. **Verificar, não confiar.** Commit message do Lovable ("Ajustes finais de landing") não
   descreve o que foi feito. Conferir com `list_edits` + `list_files` + `read_file`.
