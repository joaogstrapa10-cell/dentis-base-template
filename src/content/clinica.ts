import type { Clinica } from "./types";
import { whatsappHref } from "@/lib/contato";

// Fonte de verdade única para o número exibido. O href é derivado
// via whatsappHref() — nunca escreva um wa.me literal aqui.
const TELEFONE_NUMERO = "[TELEFONE-PRINCIPAL — a confirmar]";
const WHATSAPP_NUMERO = "[WHATSAPP — a confirmar]";
const WHATSAPP_HREF = whatsappHref(WHATSAPP_NUMERO);

export const clinica: Clinica = {
  brand: {
    nome: "[NOME DA CLÍNICA]",
    wordmark: "Suzuki Odontologia",
    ghostWord: "Suzuki",
    responsavelTecnico: "Dr. Dalton Suzuki",
    croResponsavel: "CRO-PR 9112",
    cnpj: "[CNPJ]",
    copyright: "© 2026 [NOME DA CLÍNICA] · Responsável técnico: Dr. Dalton Suzuki — CRO-PR 9112 · [CNPJ]",
  },
  contato: {
    endereco: "Rua Atílio Bório, 547 — Alto da XV",
    cep: "CEP 80045-120",
    cidadeUf: "Curitiba/PR",
    horario: "Segunda a sexta, 8h–12h e 13h30–18h",
    telefone: TELEFONE_NUMERO,
    whatsapp: WHATSAPP_NUMERO,
    mapaEmbedSrc:
      "https://www.google.com/maps?q=Rua+At%C3%ADlio+B%C3%B3rio+547+Alto+da+XV+Curitiba+PR&output=embed",
    mapaTitle: "Mapa da localização da clínica na Rua Atílio Bório, 547 — Alto da XV, Curitiba/PR",
  },
  header: {
    wordmark: "Suzuki Odontologia",
    nav: [
      { label: "Diferenciais", href: "#diferenciais" },
      { label: "Como conduzimos", href: "#acompanhamento" },
      { label: "Estrutura", href: "#estrutura" },
      { label: "Áreas", href: "#areas" },
      { label: "Tratamentos", href: "#tratamentos" },
      { label: "Responsável técnico", href: "#responsavel" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: { label: "Agendar", href: WHATSAPP_HREF },
    ariaAbrirMenu: "Abrir menu",
    ariaFecharMenu: "Fechar menu",
  },
  hero: {
    eyebrow: "Curitiba · Alto da XV",
    headline: [
      "Odontologia de alta",
      "complexidade, conduzida",
      "por especialistas.",
    ],
    subheadline:
      "Saúde, função mastigatória e estética em harmonização com a face. Um corpo clínico reunido para tratar o que exige critério técnico — não volume de atendimento.",
    ctaPrimario: { label: "Agendar avaliação", href: WHATSAPP_HREF },
    ctaSecundario: { label: "Conhecer a clínica", href: "#diferenciais" },
    responsavelLinha: "Responsável técnico: Dr. Dalton Suzuki — CRO-PR 9112",
  },
  selos: {
    label: "Formação e titulação do corpo clínico",
    itens: [
      "ILAPEO — Mestrado em Implantodontia",
      "ABO-PR — Especialização em Implantodontia",
      "APCD Bauru — Especialização em Periodontia",
      "PUC-PR — Graduação",
      "CRO-PR",
      "[SELO ADICIONAL 1]",
      "[SELO ADICIONAL 2]",
    ],
  },
  diferenciais: {
    eyebrow: "Por que aqui",
    titulo: "Experiência aplicada caso a caso.",
    descricao:
      "Nosso corpo clínico é formado por mestres e especialistas em diversas áreas da Odontologia. A proposta é unir conhecimento, experiência, ética e alta tecnologia em benefício de cada paciente.",
    itens: [
      {
        icon: "stethoscope",
        titulo: "Corpo clínico de especialistas",
        descricao:
          "Cada área conduzida por quem se especializou nela. O caso não muda de mãos por conveniência de agenda.",
      },
      {
        icon: "layers",
        titulo: "Casos de alta complexidade",
        descricao:
          "Reabilitações extensas e situações que exigem planejamento multidisciplinar são o centro da nossa rotina, não a exceção.",
      },
      {
        icon: "clipboard-check",
        titulo: "Planejamento antes de execução",
        descricao:
          "Nenhum procedimento começa sem diagnóstico fechado e plano apresentado ao paciente, com etapas e critérios definidos.",
      },
      {
        icon: "scan-face",
        titulo: "Harmonização com a face",
        descricao:
          "Função mastigatória e estética tratadas em conjunto, considerando a face como um todo — não o dente isolado.",
      },
    ],
  },
  acompanhamento: {
    eyebrow: "Como conduzimos",
    titulo: "Cada etapa, acompanhada.",
    descricao: "",
    painelTitulo: "Acompanhamento do tratamento",
    painelSubtitulo: "Paciente · Caso clínico #0000",
    etapas: [
      {
        numero: "01",
        titulo: "Avaliação e diagnóstico",
        descricao: "Exame clínico, imagens e histórico. O caso é fechado antes de qualquer proposta.",
        estado: "concluido",
        estadoLabel: "Concluído",
      },
      {
        numero: "02",
        titulo: "Plano de tratamento",
        descricao: "Etapas, prazos e critérios técnicos apresentados a você por escrito.",
        estado: "concluido",
        estadoLabel: "Concluído",
      },
      {
        numero: "03",
        titulo: "Execução",
        descricao: "Cada fase conduzida pelo especialista da área, com registro do que foi feito.",
        estado: "em-andamento",
        estadoLabel: "Em andamento",
      },
      {
        numero: "04",
        titulo: "Manutenção",
        descricao: "Acompanhamento periódico para preservar o que foi reabilitado.",
        estado: "previsto",
        estadoLabel: "Previsto",
      },
    ],
  },
  localizacao: {
    eyebrow: "Onde estamos",
    titulo: "Alto da XV, Curitiba.",
    descricao: "",
    enderecoLabel: "Endereço",
    horarioLabel: "Horário",
    telefoneLabel: "Telefone",
    whatsappLabel: "WhatsApp",
  },
  estrutura: {
    eyebrow: "Nossa estrutura",
    titulo: "O ambiente do tratamento.",
    descricao:
      "Consultórios, equipamentos de diagnóstico por imagem e áreas de apoio. Arraste para comparar os ambientes.",
    ariaLabelComparador: "Comparar os dois ambientes",
    comparadorLadoALabel: "[LADO A — ambiente]",
    comparadorLadoBLabel: "[LADO B — ambiente]",
    imagens: [
      { src: null, rotulo: "[ESTRUTURA 01]", alt: "[ESTRUTURA 01 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 02]", alt: "[ESTRUTURA 02 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 03]", alt: "[ESTRUTURA 03 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 04]", alt: "[ESTRUTURA 04 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 05]", alt: "[ESTRUTURA 05 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 06]", alt: "[ESTRUTURA 06 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 07]", alt: "[ESTRUTURA 07 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 08]", alt: "[ESTRUTURA 08 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 09]", alt: "[ESTRUTURA 09 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 10]", alt: "[ESTRUTURA 10 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 11]", alt: "[ESTRUTURA 11 — imagem a confirmar]" },
      { src: null, rotulo: "[ESTRUTURA 12]", alt: "[ESTRUTURA 12 — imagem a confirmar]" },
    ],
  },
  areas: {
    eyebrow: "Áreas de atuação",
    titulo: "Oito especialidades, um critério.",
    descricao: "",
    itens: [
      {
        titulo: "Implantodontia e Cirurgia",
        descricao:
          "Reposição de dentes ausentes com implantes e procedimentos cirúrgicos, do caso unitário à reabilitação total.",
        tags: ["Implantes", "Cirurgia", "Alta complexidade"],
      },
      {
        titulo: "Estética Dental",
        descricao:
          "Facetas, coroas em cerâmica e clareamento, planejados a partir da proporção da face.",
        tags: ["Facetas", "Cerâmica", "Clareamento"],
      },
      {
        titulo: "Endodontia",
        descricao:
          "Tratamento de canal com foco em preservar o dente natural sempre que houver condição para isso.",
        tags: ["Canal", "Preservação"],
      },
      {
        titulo: "Harmonização Facial",
        descricao:
          "Procedimentos faciais conduzidos em conjunto com o plano odontológico, respeitando as proporções individuais.",
        tags: ["Face", "Proporção"],
      },
      {
        titulo: "Ortodontia",
        descricao:
          "Correção de posicionamento dentário e de mordida, com aparelhos fixos e alinhadores.",
        tags: ["Aparelho", "Alinhadores", "Mordida"],
      },
      {
        titulo: "Odontopediatria",
        descricao:
          "Atendimento infantil com condução adequada à idade e acompanhamento do desenvolvimento.",
        tags: ["Infantil", "Prevenção"],
      },
      {
        titulo: "Periodontia",
        descricao:
          "Tratamento dos tecidos de suporte do dente — gengiva e osso — base de qualquer reabilitação duradoura.",
        tags: ["Gengiva", "Suporte"],
      },
      {
        titulo: "Reabilitação Oral",
        descricao:
          "Reconstrução da função mastigatória em casos extensos, integrando as demais especialidades.",
        tags: ["Função", "Multidisciplinar"],
      },
    ],
  },
  depoimentos: {
    eyebrow: "Pacientes",
    titulo: "Quem já passou por aqui.",
    itens: [
      {
        texto: "[DEPOIMENTO VERBATIM — Adriane Cardoso]",
        autor: "Adriane Cardoso",
        foto: null,
        fotoAlt: "[RETRATO — Adriane Cardoso]",
      },
      {
        texto: "[DEPOIMENTO VERBATIM — Josélia Bellegard]",
        autor: "Josélia Bellegard",
        foto: null,
        fotoAlt: "[RETRATO — Josélia Bellegard]",
      },
      {
        texto: "[DEPOIMENTO VERBATIM — Adília Miguel]",
        autor: "Adília Miguel",
        foto: null,
        fotoAlt: "[RETRATO — Adília Miguel]",
      },
    ],
  },
  comparativo: {
    eyebrow: "Diferença de método",
    titulo: "Nosso método vs. o convencional.",
    descricao: "",
    colunaCriterio: "Critério",
    colunaClinica: "Nossa clínica",
    colunaConvencional: "Atendimento convencional",
    linhas: [
      { criterio: "Diagnóstico antes da proposta comercial", clinica: true, convencional: false },
      { criterio: "Especialista dedicado por área", clinica: true, convencional: false },
      { criterio: "Plano de tratamento entregue por escrito", clinica: true, convencional: false },
      { criterio: "Casos de alta complexidade conduzidos internamente", clinica: true, convencional: false },
      { criterio: "Função e estética planejadas em conjunto", clinica: true, convencional: false },
      { criterio: "Acompanhamento de manutenção após a alta", clinica: true, convencional: false },
    ],
    rodape: "Comparativo de processo de atendimento. Não constitui promessa de resultado clínico.",
  },
  tratamentos: {
    eyebrow: "Tratamentos",
    titulo: "Orçamento após avaliação.",
    descricao:
      "Não trabalhamos com tabela fechada: o valor depende do diagnóstico, da extensão do caso e das etapas envolvidas. A avaliação inicial define o plano e o orçamento.",
    cards: [
      {
        titulo: "Avaliação e prevenção",
        descricao: "Consulta de avaliação, diagnóstico, limpeza e plano de acompanhamento.",
        inclui: ["Exame clínico completo", "Diagnóstico por imagem", "Plano de tratamento por escrito"],
        valorLabel: "Valor sob avaliação",
        cta: { label: "Agendar avaliação", href: WHATSAPP_HREF },
      },
      {
        titulo: "Reabilitação",
        descricao: "Implantes, próteses e reabilitação da função mastigatória em casos extensos.",
        inclui: [
          "Planejamento multidisciplinar",
          "Cirurgia e implantes",
          "Prótese sobre implante",
          "Manutenção periódica",
        ],
        valorLabel: "Valor sob avaliação",
        cta: { label: "Agendar avaliação", href: WHATSAPP_HREF },
        destaque: true,
        badge: "Mais procurado",
      },
      {
        titulo: "Estética e harmonização",
        descricao: "Facetas, cerâmicas, clareamento e harmonização facial integrados ao plano.",
        inclui: [
          "Planejamento a partir da face",
          "Facetas e coroas em cerâmica",
          "Clareamento",
          "Harmonização facial",
        ],
        valorLabel: "Valor sob avaliação",
        cta: { label: "Agendar avaliação", href: WHATSAPP_HREF },
      },
    ],
  },
  bio: {
    eyebrow: "Responsável técnico",
    nome: "Dr. Dalton Suzuki",
    credencial: "CRO-PR 9112",
    retrato: null,
    retratoAlt: "[RETRATO — Dr. Dalton Suzuki]",
    corpo:
      "Graduado em Odontologia pela PUC-PR e mestre em Implantodontia pelo ILAPEO, com especialização em Periodontia pela APCD Bauru e em Implantodontia pela ABO-PR. Atua especialmente em pacientes de alta complexidade e coordena o corpo clínico da clínica, com foco em ética, compromisso e qualidade dos serviços. Em docência e pesquisa, tem trabalhos publicados, participação em livros didáticos e ministra aulas em cursos de pós-graduação em Implantodontia.",
    titulacao: [
      "Mestre em Implantodontia — ILAPEO",
      "Especialista em Implantodontia — ABO-PR",
      "Especialista em Periodontia — APCD Bauru",
      "Graduação — PUC-PR",
    ],
    corpoClinicoLabel: "Corpo clínico",
    corpoClinicoMembros: [
      {
        nomePlaceholder: "[NOME COMPLETO — CRO — ESPECIALIDADE]",
        retrato: null,
        retratoAlt: "[RETRATO — profissional do corpo clínico]",
      },
      {
        nomePlaceholder: "[NOME COMPLETO — CRO — ESPECIALIDADE]",
        retrato: null,
        retratoAlt: "[RETRATO — profissional do corpo clínico]",
      },
      {
        nomePlaceholder: "[NOME COMPLETO — CRO — ESPECIALIDADE]",
        retrato: null,
        retratoAlt: "[RETRATO — profissional do corpo clínico]",
      },
    ],
  },
  faq: {
    eyebrow: "Dúvidas",
    titulo: "Perguntas frequentes.",
    itens: [
      {
        pergunta: "Como funciona a primeira consulta?",
        resposta:
          "É uma consulta de avaliação: exame clínico, imagens quando necessário e levantamento do histórico. Ao final você recebe o diagnóstico e o plano de tratamento com as etapas previstas.",
      },
      {
        pergunta: "Vocês atendem convênio?",
        resposta:
          "[CONFIRMAR: lista de convênios atendidos, ou informar atendimento exclusivamente particular]",
      },
      {
        pergunta: "É possível parcelar o tratamento?",
        resposta: "[CONFIRMAR: formas de pagamento e condições de parcelamento]",
      },
      {
        pergunta: "Quanto tempo leva um tratamento com implantes?",
        resposta:
          "Depende da condição óssea e da extensão do caso. O prazo estimado é definido no plano de tratamento, após a avaliação — não antes.",
      },
      {
        pergunta: "Existe garantia sobre os procedimentos?",
        resposta: "[CONFIRMAR: política de garantia e condições de manutenção]",
      },
      {
        pergunta: "Sinto muito medo de dentista. Como vocês lidam com isso?",
        resposta:
          "[CONFIRMAR: recursos disponíveis para pacientes ansiosos — sedação, anestesia, condução do atendimento]",
      },
      {
        pergunta: "Preciso de encaminhamento de outro dentista?",
        resposta:
          "Não. Você pode agendar diretamente, tanto para avaliação inicial quanto para uma segunda opinião sobre um plano já existente.",
      },
    ],
  },
  footer: {
    ctaTitulo: "Comece pela avaliação.",
    ctaDescricao:
      "Uma consulta define o diagnóstico, o plano e o orçamento. Sem compromisso de fechamento.",
    ctaBotao: { label: "Agendar pelo WhatsApp", href: WHATSAPP_HREF },
    colunaContatoLabel: "Contato",
    colunaAreasLabel: "Áreas de atuação",
    colunaClinicaLabel: "Clínica",
    colunaAreas: [
      { label: "Implantodontia e Cirurgia", href: "#areas" },
      { label: "Estética Dental", href: "#areas" },
      { label: "Endodontia", href: "#areas" },
      { label: "Harmonização Facial", href: "#areas" },
      { label: "Ortodontia", href: "#areas" },
      { label: "Odontopediatria", href: "#areas" },
      { label: "Periodontia", href: "#areas" },
      { label: "Reabilitação Oral", href: "#areas" },
    ],
    colunaClinica: [
      { label: "Diferenciais", href: "#diferenciais" },
      { label: "Como conduzimos", href: "#acompanhamento" },
      { label: "Estrutura", href: "#estrutura" },
      { label: "Responsável técnico", href: "#responsavel" },
      { label: "Perguntas frequentes", href: "#faq" },
    ],
    telefoneLabel: "Telefone",
    whatsappLabel: "WhatsApp",
    socials: [
      { label: "Facebook — Suzuki Odontologia", href: "https://facebook.com/suzukiodontologia", icon: "facebook" },
      { label: "Instagram — Suzuki Odontologia", href: "https://instagram.com/suzukiodontologiaoficial", icon: "instagram" },
    ],
  },
};
