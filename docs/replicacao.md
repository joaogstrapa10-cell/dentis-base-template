# Replicação da base para Dalton, Rogério e Décio

Operacional. A base é a instância **Suzuki / Dr. Dalton**. Cada sócio é uma cópia com
`clinica.ts` e accent trocados.

**Regra de ouro:** se você precisou abrir um arquivo em `src/components/sections/` para
replicar, a base está errada. Corrija a base, não a cópia.

---

## 1. O que duplicar

Remix do projeto no Lovable (ou fork do repo no GitHub). Nada de copiar arquivo à mão.

Depois do remix, só estes arquivos mudam:

| Arquivo | O que muda |
|---|---|
| `src/content/clinica.ts` | **Todo** o conteúdo — o arquivo inteiro é reescrito por sócio |
| `src/styles.css` | Apenas o valor de `--color-accent` (e `--color-accent-foreground` se o contraste exigir) |
| `public/` | Retratos, logo e imagens de estrutura da clínica |
| `index.html` / metadata da rota | `<title>`, description, OG image |

**Nada mais.** Se um quinto arquivo entrou na lista, virou dívida técnica: o dado estava
hardcoded em componente e precisa subir para `clinica.ts`.

---

## 2. Accent por sócio

Um token, três valores. O esqueleto escuro é o mesmo — o accent é o que separa as marcas.

| Sócio | Accent | Observação |
|---|---|---|
| Dalton | `hsl(35 45% 62%)` — bronze/champanhe | Valor da base |
| Rogério | `[DEFINIR]` | Manter dessaturado e no mesmo range de luminosidade (58–66% L) |
| Décio | `[DEFINIR]` | Idem |

Ao escolher: rodar contraste do texto sobre o accent (mínimo **4.5:1**) antes de fechar.
Não usar azul-claro de consultório nem ciano/verde-tech em nenhuma das três.

---

## 3. Checklist de dados obrigatórios por sócio

Não começar a replicação sem ter tudo. Item faltando entra como placeholder nomeado
visível — nunca como texto genérico, nunca como dado de outro sócio.

**Identidade**
- [ ] Nome da clínica (razão social e nome de exibição)
- [ ] CNPJ
- [ ] Logo / wordmark
- [ ] Domínio

**Responsável técnico**
- [ ] Nome completo
- [ ] **CRO** (obrigatório em publicidade odontológica — não publicar sem)
- [ ] Titulações com instituição (para a barra de formações e as pills da bio)
- [ ] Bio em prosa, sem promessa de resultado
- [ ] Retrato

**Corpo clínico** — por profissional: nome completo, CRO, especialidade, retrato

**Contato e localização**
- [ ] Endereço completo com CEP
- [ ] Horário de funcionamento
- [ ] Telefone — **um único campo**, usado no display e no `href`
- [ ] WhatsApp — idem
- [ ] Redes sociais

**Conteúdo**
- [ ] Especialidades atendidas, com descrição por especialidade
- [ ] Eixos de tratamento dos 3 cards da seção 9
- [ ] Depoimentos — **verbatim, e do próprio sócio**
- [ ] Respostas do FAQ, incluindo convênio, parcelamento, garantia e sedação
- [ ] Imagens de estrutura da clínica

---

## 4. Armadilhas conhecidas

**Depoimentos não são reaproveitáveis.** Os três da base (Adriane Cardoso, Josélia Bellegard,
Adília Miguel) citam o Dr. Dalton nominalmente. Reusar em Rogério ou Décio seria atribuir a um
paciente uma fala que ele não disse sobre um profissional que não atendeu. Cada sócio traz os
seus, verbatim e autorizados.

**CRO é obrigatório.** Publicidade odontológica sem CRO do responsável técnico é irregular.
Se o CRO não chegou, o site não publica — o placeholder `[CRO-PR 00000]` existe para
desenvolvimento, não para produção.

**Não migrar o bug do site antigo.** No site original o botão exibia o celular e apontava para
o fixo. Display e `href` saem do mesmo campo. Se alguém criar `telefoneDisplay` e `telefoneLink`
separados, o bug volta.

**Especialidade que o sócio não atende sai do array**, não fica como card vazio. A seção 6
renderiza o que existe em `clinica.ts` — se são 6 especialidades em vez de 8, o grid se ajusta.

**Preço continua fora.** A regra "valor sob avaliação" vale para os três, salvo decisão
explícita em contrário de cada clínica.

---

## 5. O que NÃO tocar

- `src/components/sections/*` — qualquer um dos 12 componentes de seção
- `src/components/sections/Section.tsx` — o wrapper de ritmo vertical
- `src/content/types.ts` — só muda se a **estrutura** mudar para todos os três
- `src/hooks/useReveal.ts`
- `src/components/ui/*` — shadcn, comportamento padrão
- A escala tipográfica, o ritmo vertical e os tokens de superfície em `@theme`
- `src/router.tsx`, `src/routeTree.gen.ts`, `src/server.ts`, `src/start.ts`

Mudança em qualquer um destes é mudança **na base**: aplicar na base e propagar para as três
variantes, nunca só numa cópia.

---

## 6. Ordem de execução

1. Remix do projeto base no Lovable
2. Reescrever `src/content/clinica.ts` com os dados do sócio
3. Trocar `--color-accent` no `src/styles.css`
4. Subir imagens em `public/` e apontar os caminhos em `clinica.ts`
5. Atualizar `<title>`, description e OG
6. `bun install && npx tsc --noEmit` — zero erro antes de seguir
7. Varredura de placeholder: buscar `[` no render e resolver todo marcador remanescente
8. Conferir CRO visível no hero e no footer
9. Revisar copy contra CFO-196/2019: nenhuma promessa de resultado, nenhum antes/depois
10. Publicar

---

## 7. Verificação de que a base continua replicável

Rodar de tempo em tempo na base. Qualquer retorno positivo é dívida a pagar:

- Texto em português dentro de `src/components/sections/` → conteúdo hardcoded escapou
- Cor literal (`#`, `bg-zinc-`, `text-white`, `bg-[`) em componente → token furado
- `import { clinica }` dentro de um componente de seção → deveria receber por props
- `any` em `src/content/types.ts` → tipagem furada
