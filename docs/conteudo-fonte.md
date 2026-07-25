# Conteúdo-fonte consolidado — Suzuki Odontologia

**Fonte:** `https://suzukiodontologia.com.br/` (WordPress/Elementor, Curitiba/PR)
**Status:** ⚠️ **raspagem não realizada** — host bloqueado pela network policy (403 no CONNECT).
Ver `CLAUDE.md` §7. Este arquivo consolida o que é verificável hoje.

Legenda de proveniência:
- `[HOME]` = levantado da home e repassado pelo usuário → **usar direto**
- `[WS]` = obtido por busca indexada (WebSearch), **não** confirmado na página → **verificar**
- `[FALTA]` = não obtido; depende de desbloqueio de rede ou de envio manual
- `[CONFLITO]` = existe mais de uma versão do dado

---

## 1. Posicionamento atual `[HOME]`

Frase-âncora: **"Experiência e credibilidade — a serviço de nossos clientes"**
Tom conservador/institucional. A base nova deve **elevar** isso sem perder a autoridade.

---

## 2. Sobre Nós

`[HOME]` — **paráfrase disponível, verbatim pendente.** Eixos do texto:
- corpo clínico de mestres e especialistas
- saúde, função mastigatória e estética em harmonização com a face
- autoestima e qualidade de vida

`[WS]` Missão: *"unir conhecimento, experiência, ética e alta tecnologia em benefício dos
clientes"* — corpo clínico de "renomados mestres e especialistas em diversas áreas da
Odontologia".

`[FALTA]` **Texto verbatim de `/sobre-nos/`.** Necessário para a Fase 1 (o prompt exige zero
lorem ipsum). Não será inventado.

---

## 3. Equipe / corpo clínico

> **Página mais importante e a maior lacuna.** A home só menciona o Dr. Dalton.
> Os 3 sócios da replicação são **Dalton, Rogério e Décio**.

### Dr. Dalton Suzuki
- `[WS]` Responsável técnico, **CRO-PR 9112**
- `[WS]` Formado pela **PUC/PR** (~25 anos de formação, referência não datada — recalcular)
- `[WS]` **Mestre em Implantodontia** (ILAPEO — Curitiba/PR)
- `[WS]` Especialização em **Periodontia** (APCD — Bauru)
- `[WS]` Especialização em **Implantodontia** (ABO — Curitiba)
- `[WS]` Atua especialmente em **pacientes de alta complexidade**; coordena a equipe
- `[WS]` Docência e pesquisa: trabalhos publicados, participação em livros didáticos,
  ministra pós-graduação em Implantodontia
- `[HOME]` Retrato: `/wp-content/uploads/.../dalton.1620766963.webp`

### Dr. Rogério `[FALTA]`
Nome completo, CRO, especialidades, formação, foto — **nada obtido**.

### Dr. Décio `[FALTA]`
Nome completo, CRO, especialidades, formação, foto — **nada obtido**.

### Restante do corpo clínico `[FALTA]`
Roster completo de `/equipe/` (nomes, CRO, especialidades, fotos) não obtido.

`[HOME]` Retratos/equipe identificados por arquivo, sem vínculo nome↔foto:
`1.1620766982.webp`, `13.1620766984.webp`, `4.1620766985.webp`

---

## 4. Áreas de atuação `[HOME]`

Ordem exata do site antigo — preservar:

1. Implantodontia e Cirurgia
2. Estética Dental
3. Endodontia
4. Harmonização Facial
5. Ortodontia
6. Odontopediatria
7. Periodontia
8. Reabilitação Oral

`[FALTA]` **Copy das 8 páginas de especialidade** (`/implantodontia-e-cirurgia/`,
`/estetica-dental/`, `/endodontia/`, `/harmonizacao-facial/`, `/ortodontia/`,
`/odontopediatria/`, `/periodontia/`, `/reabilitacao-oral/`). Sem isso, as seções 6 (cases)
e 9 (planos/tratamentos) da referência ficam sem descrição real.

`[WS]` Procedimentos citados em diretórios externos (**não** são a copy do site, servem só como
pista): primeira consulta odontológica, clareamento dental, coroas em cerâmica, coroas
provisórias, implantes dentários, prótese sobre implantes, facetas em cerâmica, extração de
siso, placa miorrelaxante.

---

## 5. Depoimentos

`[HOME]` Três depoentes, nominais, **todos citando o Dr. Dalton pelo nome**:
1. **Adriane Cardoso**
2. **Josélia Bellegard** — o original tem **um parágrafo duplicado**; deduplicar
3. **Adília Miguel**

`[FALTA]` **Texto verbatim dos 3 depoimentos.** Só os nomes foram repassados.

⚠️ Os 3 citam "Dr. Dalton" nominalmente → **não são reaproveitáveis** nas variantes de Rogério
e Décio. Cada sócio precisa dos seus próprios depoimentos. Registrado em `docs/replicacao.md`.

---

## 6. Estrutura / galeria `[HOME]`

- Seção **"Nossa Estrutura"**: **12 imagens**
  em `/wp-content/uploads/2022/04/asset-*.webp` + `img001.webp`
- Logo: `logo-horizontal-branco.1620766974.svg`

`[FALTA]` Os **nomes exatos** dos 12 arquivos e os **binários**. Host bloqueado → não é possível
baixar. Estas 12 imagens são o conteúdo inicial seguro previsto para popular a galeria de
comparação da Fase 4 → **dependência direta**.

`[FALTA]` Conteúdo de `/galeria/`.

---

## 7. Contato e localização

**Endereço** `[HOME]` — confirmado por múltiplos diretórios `[WS]`:
Rua Atílio Bório, 547 — Alto da XV, Curitiba/PR, CEP 80045-120

**Telefone — `[CONFLITO]`, decisão do usuário:**

| Origem | Valor |
|---|---|
| Display no site | (41) 9206-1073 |
| Display no site | (41) 99206-1073 |
| Display no site | (41) 92061-1073 |
| Fixo | (41) 3363-3040 |
| Fixo | (41) 3026-4030 |
| Link WhatsApp | 554192061073 |
| Link WhatsApp | 5541998478025 |
| Diretórios externos `[WS]` | (41) 3363-3040 |

Nenhum dos celulares fecha o padrão brasileiro de 9 dígitos de forma consistente.
→ **Consolidar em um único campo** `telefone` + um único `whatsapp` no `clinica.ts`.
**Aguardando o número correto.**

**Bug do site antigo** `[HOME]`: botões "Ligue para Agendar" exibem o celular mas apontam para
`tel:4133633040`. Não replicar — no template, display e `href` saem do **mesmo** campo.

**Horário — `[CONFLITO]`:**
- `[HOME]` seg. a sex., **8h–12h e 13h30–18h**
- `[WS]` diretórios externos: seg. a sex. 9h–18h, sáb. 9h–12h

→ Usar a versão `[HOME]` (é a do próprio site) e confirmar com o usuário.

**Redes** `[HOME]`:
- `facebook.com/suzukiodontologia`
- `instagram.com/suzukiodontologiaoficial`

---

## 8. Seções existentes na home antiga `[HOME]`

hero → áreas de atuação → sobre → CTA intermediário → equipe → estrutura → depoimentos →
CTA final + mapa → footer

---

## 9. Lacunas da referência sem conteúdo-fonte

| Seção da referência | Situação no site antigo | Proposta |
|---|---|---|
| 2. Barra de logos / selos | Não existe | Bloco mantido com placeholders nomeados: `[ILAPEO — Mestrado em Implantodontia]`, `[ABO-PR]`, `[APCD-Bauru]`, `[PUC-PR]`, `[CFO/CRO-PR]`. Formações reais do Dalton já cobrem 4 slots. |
| 4. Acompanhamento do tratamento | Não existe | Construir do zero: 4 etapas (avaliação → plano → execução → manutenção). Sem promessa de resultado (CFO-196/2019). |
| 6. Grid de cases | Não existe como "case" | Derivar das 8 áreas de atuação. Card = área + descrição da página de especialidade + tags. **Depende de §4 `[FALTA]`.** |
| 8. Tabela comparativa | Não existe | Construir do zero a partir dos diferenciais reais (mestres/especialistas, alta complexidade, tecnologia, harmonização com a face). Comparar processo, nunca resultado. |
| 9. Planos / pricing | **Não existe nenhuma informação de preço** | Não inventar preço. Proposta: converter em "Tratamentos" — 3 cards por eixo de cuidado, com `[valor sob avaliação]` no lugar do preço e CTA de agendamento. Decisão do usuário. |
| 11. FAQ | **Não existe** | Redigir 6–8 perguntas do zero a partir de dúvidas reais do nicho (primeira consulta, convênio, parcelamento, duração de implante, garantia, anestesia/sedação). Precisa de validação do usuário — respostas erradas são risco clínico e comercial. |

---

## 10. Ordem de prioridade para desbloquear

1. `/equipe/` — sem isso não há base replicável para Rogério e Décio
2. As 8 páginas de especialidade — alimentam cases e tratamentos
3. Verbatim dos 3 depoimentos + `/sobre-nos/`
4. Os 12 binários de "Nossa Estrutura" — dependência da Fase 4
5. Telefone/WhatsApp correto
6. Decisão sobre pricing e FAQ
