import type { Clinica } from "./types";
import { whatsappHref } from "@/lib/contato";

// Fonte de verdade única para o número exibido. O href é derivado
// via whatsappHref() — nunca escreva um wa.me literal aqui.
const TELEFONE_NUMERO = "[TELEFONE-PRINCIPAL: a confirmar]";
const WHATSAPP_NUMERO = "[WHATSAPP: a confirmar]";
const WHATSAPP_HREF = whatsappHref(WHATSAPP_NUMERO);

export const clinica: Clinica = {
  brand: {
    nome: "[NOME DA CLÍNICA]",
    wordmark: "Suzuki Odontologia",
    logo: "/imagens/marca/logo-horizontal-branco.svg",
    // Mesma arte do logo branco, recolorida no traço para a cor de texto da
    // página (`--foreground`, #1b222c). Gerada em 30/07 porque a clínica só
    // tinha a versão branca, e o cartão de avaliações fica em fundo claro.
    logoEscuro: "/imagens/marca/logo-horizontal-escuro.svg",
    logoAlt: "Suzuki Odontologia",
    responsavelTecnico: "Dr. Dalton Suzuki",
    croResponsavel: "CRO-PR 9112",
    cnpj: "[CNPJ]",
    copyright: "© 2026 [NOME DA CLÍNICA] · Responsável técnico: Dr. Dalton Suzuki, CRO-PR 9112 · [CNPJ]",
  },
  contato: {
    endereco: "Rua Atílio Bório, 547, Alto da XV",
    cep: "CEP 80045-120",
    cidadeUf: "Curitiba/PR",
    horario: "Segunda a sexta, 8h–12h e 13h30–18h",
    telefone: TELEFONE_NUMERO,
    whatsapp: WHATSAPP_NUMERO,
    mapaEmbedSrc:
      "https://www.google.com/maps?q=Rua+At%C3%ADlio+B%C3%B3rio+547+Alto+da+XV+Curitiba+PR&output=embed",
    mapaTitle: "Mapa da localização da clínica na Rua Atílio Bório, 547, Alto da XV, Curitiba/PR",
  },
  header: {
    wordmark: "Suzuki Odontologia",
    // Enxuta de propósito: o header é uma pílula flutuante e sete itens não
    // cabem sem quebrar. A navegação completa fica no footer.
    nav: [
      { label: "Estrutura", href: "#estrutura" },
      { label: "Áreas", href: "#areas" },
      { label: "Tratamentos", href: "#tratamentos" },
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
      "Saúde, função mastigatória e estética em harmonização com a face. Um corpo clínico reunido para tratar o que exige critério técnico, não volume de atendimento.",
    ctaPrimario: { label: "Agendar avaliação", href: WHATSAPP_HREF },
    ctaSecundario: { label: "Conhecer a clínica", href: "#diferenciais" },
    responsavelLinha: "Responsável técnico: Dr. Dalton Suzuki, CRO-PR 9112",
    // Mesmo retrato que o site antigo usa na home e em "sobre nós". O fundo
    // verde dele é do próprio consultório e encosta no petróleo do bloco.
    retrato: "/imagens/hero/dalton-suzuki.webp",
    retratoAlt: "Dr. Dalton Suzuki, responsável técnico da clínica, de braços cruzados",
  },
  selos: {
    label: "Formação e titulação do corpo clínico",
    itens: [
      "Mestrado em Implantodontia, ILAPEO",
      "Especialização em Implantodontia, ABO-PR",
      "Especialização em Periodontia, APCD Bauru",
      "Graduação, PUC-PR",
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
          "Função mastigatória e estética tratadas em conjunto, considerando a face como um todo, não o dente isolado.",
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
      "Recepção, consultórios, equipamentos de diagnóstico por imagem e áreas de apoio. Arraste o divisor para comparar os ambientes.",
    ariaLabelComparador: "Comparar os dois ambientes",
    comparadorLadoALabel: "Área externa",
    comparadorLadoBLabel: "Recepção",
    imagens: [
      {
        src: "/imagens/estrutura/01-area-externa.webp",
        rotulo: "01",
        alt: "Caminho externo de pedra entre canteiro aparado e a fachada lateral da clínica",
      },
      {
        src: "/imagens/estrutura/02-recepcao.webp",
        rotulo: "02",
        alt: "Recepção da clínica, com balcão curvo de madeira, orquídeas e piso escuro polido",
      },
      {
        src: "/imagens/estrutura/03-sala-espera.webp",
        rotulo: "03",
        alt: "Sala de espera com sofá escuro, mesa de centro de vidro e televisão na parede",
      },
      {
        src: "/imagens/estrutura/04-sala-espera-angulo.webp",
        rotulo: "04",
        alt: "Sala de espera vista de outro ângulo, com sanca iluminada e recepção ao fundo",
      },
      {
        src: "/imagens/estrutura/05-consultorio-vermelho.webp",
        rotulo: "05",
        alt: "Consultório com cadeira odontológica vermelha, bancada de apoio e monitor na parede",
      },
      {
        src: "/imagens/estrutura/06-consultorio-corredor.webp",
        rotulo: "06",
        alt: "Consultório com cadeira vermelha visto a partir do corredor, pelo vão da porta",
      },
      {
        src: "/imagens/estrutura/07-consultorio-claro.webp",
        rotulo: "07",
        alt: "Consultório claro com cadeira marrom, refletor de teto e armários brancos",
      },
      {
        src: "/imagens/estrutura/08-atendimento.webp",
        rotulo: "08",
        alt: "Atendimento em andamento: dentista e auxiliar com máscara e touca junto à cadeira",
      },
      {
        src: "/imagens/estrutura/09-consultorio-digital.webp",
        rotulo: "09",
        alt: "Consultório com equipamento digital: monitor exibindo modelo 3D da arcada e impressora 3D na bancada",
      },
      {
        src: "/imagens/estrutura/10-consultorio-verde.jpg",
        rotulo: "10",
        alt: "Consultório claro com cadeira odontológica verde-água, armários brancos e janela de vidro",
      },
      {
        src: "/imagens/estrutura/11-area-administrativa.webp",
        rotulo: "11",
        alt: "Área administrativa com mesas de atendimento em madeira, computadores e plantas nas prateleiras",
      },
      {
        src: "/imagens/estrutura/12-jardim.webp",
        rotulo: "12",
        alt: "Jardim externo com arbustos aparados, pedras e lanterna japonesa, com a fachada térrea ao fundo",
      },
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
          "Tratamento da gengiva e do osso que sustentam o dente, base de qualquer reabilitação duradoura.",
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
    // O cartão mostra logo + estrelas + nota, e nada mais. A contagem de
    // avaliações e o botão "Escreva sua avaliação" saíram por decisão de layout
    // em 30/07 — não por falta de dado. Se voltarem:
    //   place_id  ChIJzSb5vkjk3JQREHbgq6qWPhA  (confirmado pelo Google: abre com
    //             o nome e o endereço certos, que conferem com `localizacao`)
    //   avaliar   https://search.google.com/local/writereview?placeid=<place_id>
    // Proveniência e o que não deu para ler: public/imagens/originais/AVALIACOES-GOOGLE.json
    resumo: {
      // Não aparece na tela: é o alt do logo. O nome literal do perfil é
      // "Suzuki Odontologia | Dentista I Clínica Odontológica" — o sufixo é
      // palavra-chave de busca, não nome do negócio.
      nomeNegocio: "Suzuki Odontologia, Curitiba",
      // Verificado no perfil do Google. Alimenta o número e o preenchimento das
      // estrelas. É o único dado que o cartão afirma; não estimar.
      nota: "5,0",
    },
    // Ainda são os três depoimentos do site anterior, e por isso `fonte: "site"`
    // — renderizam sem estrela e sem a marca do Google. A decisão de 30/07 é que
    // eles saem quando as avaliações do Google entrarem; nenhuma entrou (0 de 12
    // extraídas, ver `falhas` no JSON), então continuam aqui. Trocar por texto
    // inventado com `fonte: "google"` seria atribuir a pacientes reais uma
    // avaliação que eles não escreveram.
    itens: [
      {
        texto:
          "Querido Dr. Dalton, nesta semana encerrei meu tratamento em sua clínica e gostaria de agradecer imensamente por toda atenção, carinho, dedicação e trabalho de toda a equipe de profissionais que me acompanharam durante este período. Na sua clínica descobri que o dentista não é um bicho-de-sete-cabeças e que a anestesia nem é assim tão ruim… Fui acolhida como parte da família que compõe sua equipe e não apenas como um paciente qualquer. Acredito que este é o diferencial que torna esse ambiente tão especial e acolhedor. Agradeço especialmente a você, que certamente foi abençoado com o dom da humildade, do respeito pelo próximo, e é claro, com a excelência do seu trabalho perfeito! Graças a tudo isso, consegui realizar um sonho: um sorriso incrível. Muito obrigada!",
        autor: "Adriane Cardoso",
        foto: "/imagens/depoimentos/adriane-cardoso.jpg",
        fotoAlt: "Retrato de Adriane Cardoso, paciente da clínica",
        // Veio do site anterior da clínica, não do Google. Por isso a marca
        // do Google não é exibida neste cartão.
        fonte: "site",
        nota: 5,
        quando: "",
      },
      {
        texto:
          "Recomendo a Suzuki Odontologia a todos que necessitam de atendimento dentário. Há muitos anos sou paciente da clínica, não somente do Dr. Dalton, mas de todos os profissionais que me atenderam. A clínica conta com excelente atendimento, profissionalismo e eficiência, além de transmitir muita confiança, credibilidade, respeito e o principal: muita paciência, pois ninguém pode negar que não tenha o famoso medo quando se tem que ir ao dentista.",
        autor: "Josélia Bellegard",
        foto: "/imagens/depoimentos/joselia-bellegard.jpg",
        fotoAlt: "Retrato de Josélia Bellegard, paciente da clínica",
        // Veio do site anterior da clínica, não do Google. Por isso a marca
        // do Google não é exibida neste cartão.
        fonte: "site",
        nota: 5,
        quando: "",
      },
      {
        texto:
          "Fui indicada por familiares para conhecer o trabalho do Dr. Dalton, isso faz mais ou menos uns 20 anos. A partir daí nunca mais mudei de dentista. Fiz todo o meu tratamento com o Dr. e hoje estou muito satisfeita com os meus dentes. Hoje posso comer, beber, sorrir sem problema algum. E sem contar que a minha saúde é totalmente outra depois que fiz meus implantes. No dia que finalizei meu tratamento, saí da clínica muito feliz e muito satisfeita. Meus dentes novos foram a maior alegria que o Dr. Dalton poderia ter feito pra mim. Sou muito grata por tudo o que ele fez por mim.",
        autor: "Adília Miguel",
        foto: "/imagens/depoimentos/adilia-miguel.jpg",
        fotoAlt: "Retrato de Adília Miguel, paciente da clínica",
        // Veio do site anterior da clínica, não do Google. Por isso a marca
        // do Google não é exibida neste cartão.
        fonte: "site",
        nota: 5,
        quando: "",
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
    retrato: "/imagens/equipe/dalton-suzuki.webp",
    retratoAlt: "Retrato do Dr. Dalton Suzuki, de jaleco, sorrindo",
    corpo:
      "Graduado em Odontologia pela PUC-PR e mestre em Implantodontia pelo ILAPEO, com especialização em Periodontia pela APCD Bauru e em Implantodontia pela ABO-PR. Atua especialmente em pacientes de alta complexidade e coordena o corpo clínico da clínica, com foco em ética, compromisso e qualidade dos serviços. Em docência e pesquisa, tem trabalhos publicados, participação em livros didáticos e ministra aulas em cursos de pós-graduação em Implantodontia.",
    titulacao: [
      "Mestre em Implantodontia, ILAPEO",
      "Especialista em Implantodontia, ABO-PR",
      "Especialista em Periodontia, APCD Bauru",
      "Graduação, PUC-PR",
    ],
    corpoClinicoLabel: "Corpo clínico",
    corpoClinicoMembros: [
      {
        nome: "Ana Lúcia",
        credencial: "[CRO e ESPECIALIDADE]",
        retrato: "/imagens/equipe/ana-lucia.webp",
        retratoAlt: "Retrato de Ana Lúcia, do corpo clínico",
      },
      {
        nome: "Carolina Cabral",
        credencial: "[CRO e ESPECIALIDADE]",
        retrato: "/imagens/equipe/carolina-cabral.webp",
        retratoAlt: "Retrato de Carolina Cabral, do corpo clínico",
      },
      {
        nome: "Cláudio Kleinhans",
        credencial: "[CRO e ESPECIALIDADE]",
        retrato: "/imagens/equipe/claudio-kleinhans.webp",
        retratoAlt: "Retrato de Cláudio Kleinhans, do corpo clínico",
      },
      {
        nome: "Denise Karpen",
        credencial: "[CRO e ESPECIALIDADE]",
        retrato: "/imagens/equipe/denise-karpen.webp",
        retratoAlt: "Retrato de Denise Karpen, do corpo clínico",
      },
      {
        nome: "Fabrício Leite",
        credencial: "[CRO e ESPECIALIDADE]",
        retrato: "/imagens/equipe/fabricio-leite.webp",
        retratoAlt: "Retrato de Fabrício Leite, do corpo clínico",
      },
      {
        nome: "Michele",
        credencial: "[CRO e ESPECIALIDADE]",
        retrato: "/imagens/equipe/michele.webp",
        retratoAlt: "Retrato de Michele, do corpo clínico",
      },
      {
        nome: "Patrícia",
        credencial: "[CRO e ESPECIALIDADE]",
        retrato: "/imagens/equipe/patricia.webp",
        retratoAlt: "Retrato de Patrícia, do corpo clínico",
      },
      {
        nome: "Vitor Coró",
        credencial: "[CRO e ESPECIALIDADE]",
        retrato: "/imagens/equipe/vitor-coro.webp",
        retratoAlt: "Retrato de Vitor Coró, do corpo clínico",
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
          "Depende da condição óssea e da extensão do caso. O prazo estimado é definido no plano de tratamento, após a avaliação, não antes.",
      },
      {
        pergunta: "Existe garantia sobre os procedimentos?",
        resposta: "[CONFIRMAR: política de garantia e condições de manutenção]",
      },
      {
        pergunta: "Sinto muito medo de dentista. Como vocês lidam com isso?",
        resposta:
          "[CONFIRMAR: recursos para pacientes ansiosos, como sedação, anestesia e condução do atendimento]",
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
      { label: "Suzuki Odontologia no Facebook", href: "https://facebook.com/suzukiodontologia", icon: "facebook" },
      { label: "Suzuki Odontologia no Instagram", href: "https://instagram.com/suzukiodontologiaoficial", icon: "instagram" },
    ],
  },
};
