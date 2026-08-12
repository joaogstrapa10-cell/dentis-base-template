import type { Clinica } from "./types";
import { whatsappHref } from "@/lib/contato";

// Fonte de verdade única para o número exibido. O href é derivado
// via whatsappHref() — nunca escreva um wa.me literal aqui.
// Confirmado pelo usuário em 03/08. Veio do perfil do Google Business da
// clínica; é celular, então serve de telefone e de WhatsApp.
// O formato exibido é o que vale: telHref() e whatsappHref() derivam o link
// dele, então "(41) 99206-1073" vira tel:+5541992061073 e wa.me/5541992061073.
const TELEFONE_NUMERO = "(41) 99206-1073";
const WHATSAPP_NUMERO = "(41) 99206-1073";
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
    // Versão AMPLA: 2560×703 contra os 500×482 do arquivo anterior. Foi trocada
    // em 12/08 porque o retrato passou a sangrar na borda do bloco em desktop, e
    // ampliar o arquivo pequeno o deixaria mole. O antigo segue em
    // public/imagens/hero/dalton-suzuki.webp e em originais/.
    retrato: "/imagens/hero/dalton-suzuki-amplo.webp",
    retratoAlt: "Dr. Dalton Suzuki, responsável técnico da clínica, de braços cruzados",
  },
  diferenciais: {
    eyebrow: "Por que aqui",
    titulo: "Experiência aplicada caso a caso.",
    descricao:
      "Nosso corpo clínico é formado por mestres e especialistas em diversas áreas da Odontologia. A proposta é unir conhecimento, experiência, ética e alta tecnologia em benefício de cada paciente.",
    // Scanner intraoral ligado ao notebook com o modelo 3D da arcada. Entra aqui
    // porque "alta tecnologia" está escrito na própria descrição da seção, e
    // porque é equipamento da clínica — veio da página de implantodontia do site
    // antigo. Proveniência e as candidatas descartadas em
    // public/imagens/metodo/LEIA-ME.txt.
    imagem: "/imagens/metodo/scanner-intraoral.jpeg",
    imagemAlt:
      "Scanner intraoral em seu suporte, ligado a um notebook que exibe o modelo digital em três dimensões de uma arcada",
    itens: [
      {
        titulo: "Corpo clínico de especialistas",
        descricao:
          "Cada área conduzida por quem se especializou nela. O caso não muda de mãos por conveniência de agenda.",
      },
      {
        titulo: "Casos de alta complexidade",
        descricao:
          "Reabilitações extensas e situações que exigem planejamento multidisciplinar são o centro da nossa rotina, não a exceção.",
      },
      {
        titulo: "Planejamento antes de execução",
        descricao:
          "Nenhum procedimento começa sem diagnóstico fechado e plano apresentado ao paciente, com etapas e critérios definidos.",
      },
      {
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
    // Atendimento real da clínica, em friso largo e baixo fechando a seção.
    // A mesma foto aparece na galeria de /estrutura, com outro propósito: lá é
    // ambiente, aqui é o trabalho em curso.
    imagem: "/imagens/estrutura/08-atendimento.webp",
    imagemAlt:
      "Dentista e auxiliar, de máscara e touca, durante um atendimento, com o monitor de imagens ao fundo",
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
  // Os 12 ambientes reais da clínica. O carrossel da home passa por todos; a
  // página /estrutura mostra todos de uma vez, com o rótulo de cada ambiente.
  //
  // `rotulo` deixou de ser "01".."12" e passou a dizer O QUE é o ambiente: é ele
  // que aparece na legenda da página. Os textos de `alt` são descrições reais
  // das fotos, escritas quando elas foram baixadas do site antigo em 29/07 —
  // não reescrever de cabeça.
  estrutura: {
    eyebrow: "Nossa estrutura",
    titulo: "O ambiente do tratamento.",
    descricao:
      "Recepção, consultórios e áreas de apoio na unidade do Alto da XV, em Curitiba.",
    verTodas: { label: "Ver todas as fotos da clínica", href: "/estrutura" },
    pagina: {
      titulo: "A clínica, ambiente por ambiente.",
      descricao:
        "Todas as fotos da unidade do Alto da XV, com a identificação de cada ambiente.",
      voltarLabel: "Voltar para a home",
    },
    imagens: [
      {
        src: "/imagens/estrutura/02-recepcao.webp",
        rotulo: "Recepção",
        alt: "Recepção da clínica, com balcão curvo de madeira, orquídeas e piso escuro polido",
      },
      {
        src: "/imagens/estrutura/03-sala-espera.webp",
        rotulo: "Sala de espera",
        alt: "Sala de espera com sofá escuro, mesa de centro de vidro e televisão na parede",
      },
      {
        src: "/imagens/estrutura/04-sala-espera-angulo.webp",
        rotulo: "Sala de espera, outro ângulo",
        alt: "Sala de espera vista de outro ângulo, com sanca iluminada e recepção ao fundo",
      },
      {
        src: "/imagens/estrutura/09-consultorio-digital.webp",
        rotulo: "Consultório digital",
        alt: "Consultório com equipamento digital: monitor exibindo modelo 3D da arcada e impressora 3D na bancada",
      },
      {
        src: "/imagens/estrutura/05-consultorio-vermelho.webp",
        rotulo: "Consultório",
        alt: "Consultório com cadeira odontológica vermelha, bancada de apoio e monitor na parede",
      },
      {
        src: "/imagens/estrutura/06-consultorio-corredor.webp",
        rotulo: "Consultório, vista do corredor",
        alt: "Consultório com cadeira vermelha visto a partir do corredor, pelo vão da porta",
      },
      {
        src: "/imagens/estrutura/07-consultorio-claro.webp",
        rotulo: "Consultório claro",
        alt: "Consultório claro com cadeira marrom, refletor de teto e armários brancos",
      },
      {
        src: "/imagens/estrutura/10-consultorio-verde.jpg",
        rotulo: "Consultório",
        alt: "Consultório claro com cadeira odontológica verde-água, armários brancos e janela de vidro",
      },
      {
        src: "/imagens/estrutura/08-atendimento.webp",
        rotulo: "Atendimento",
        alt: "Atendimento em andamento: dentista e auxiliar com máscara e touca junto à cadeira",
      },
      {
        src: "/imagens/estrutura/11-area-administrativa.webp",
        rotulo: "Área administrativa",
        alt: "Área administrativa com mesas de atendimento em madeira, computadores e plantas nas prateleiras",
      },
      {
        src: "/imagens/estrutura/01-area-externa.webp",
        rotulo: "Área externa",
        alt: "Caminho externo de pedra entre canteiro aparado e a fachada lateral da clínica",
      },
      {
        src: "/imagens/estrutura/12-jardim.webp",
        rotulo: "Jardim",
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
      },
      {
        titulo: "Estética Dental",
        descricao:
          "Facetas, coroas em cerâmica e clareamento, planejados a partir da proporção da face.",
      },
      {
        titulo: "Endodontia",
        descricao:
          "Tratamento de canal com foco em preservar o dente natural sempre que houver condição para isso.",
      },
      {
        titulo: "Harmonização Facial",
        descricao:
          "Procedimentos faciais conduzidos em conjunto com o plano odontológico, respeitando as proporções individuais.",
      },
      {
        titulo: "Ortodontia",
        descricao:
          "Correção de posicionamento dentário e de mordida, com aparelhos fixos e alinhadores.",
      },
      {
        titulo: "Odontopediatria",
        descricao:
          "Atendimento infantil com condução adequada à idade e acompanhamento do desenvolvimento.",
      },
      {
        titulo: "Periodontia",
        descricao:
          "Tratamento da gengiva e do osso que sustentam o dente, base de qualquer reabilitação duradoura.",
      },
      {
        titulo: "Reabilitação Oral",
        descricao:
          "Reconstrução da função mastigatória em casos extensos, integrando as demais especialidades.",
      },
    ],
  },
  // ⚠️ Seção com exposição direta à CFO-196/2019, que restringe divulgação de
  // antes e depois em publicidade odontológica. Por isso ela documenta PROCESSO:
  // situação de partida, conduta, especialidades envolvidas e duração. Nenhum
  // caso tem par de imagens, e nenhuma linha de copy afirma resultado.
  //
  // Os títulos das categorias são reais — saem das especialidades da clínica,
  // em `areas`. O que é específico de cada caso (situação, conduta, duração e o
  // registro clínico) só a clínica tem, e fica como placeholder nomeado, visível
  // na tela. Preencher inventando caso clínico é fabricar prontuário.
  casos: {
    eyebrow: "Casos conduzidos",
    titulo: "Como um caso complexo é conduzido.",
    descricao:
      "Cada caso é documentado por etapa: a situação clínica de partida, o plano, quem conduziu cada fase e o tempo de tratamento. O que segue é descrição de processo.",
    situacaoLabel: "Situação clínica",
    condutaLabel: "Conduta",
    especialidadesLabel: "Especialidades envolvidas",
    duracaoLabel: "Duração",
    aviso:
      "Descrição de processo clínico conduzido nesta clínica. Não constitui promessa de resultado. Cada caso é único e depende de diagnóstico individual. Em conformidade com a Resolução CFO-196/2019, esta seção não divulga imagens comparativas de antes e depois.",
    verTodos: { label: "Ver todos os casos", href: "/casos" },
    limiteNaHome: 2,
    pagina: {
      titulo: "Casos conduzidos.",
      descricao:
        "Cada caso documentado por etapa: a situação clínica de partida, a conduta, as especialidades envolvidas e o tempo de tratamento.",
      voltarLabel: "Voltar para a home",
    },
    itens: [
      {
        numero: "01",
        titulo: "Reabilitação total sobre implantes",
        situacao: "[CASO 01 — SITUAÇÃO CLÍNICA DE PARTIDA]",
        conduta: "[CASO 01 — CONDUTA, ETAPA POR ETAPA]",
        especialidades: ["Implantodontia e Cirurgia", "Reabilitação Oral", "Periodontia"],
        duracao: "[CASO 01 — DURAÇÃO]",
        imagem: null,
        imagemAlt: "Registro clínico do caso 01, ainda não fornecido pela clínica",
        rotuloSlot: "Registro 01",
      },
      {
        numero: "02",
        titulo: "Reabilitação estética com harmonização facial",
        situacao: "[CASO 02 — SITUAÇÃO CLÍNICA DE PARTIDA]",
        conduta: "[CASO 02 — CONDUTA, ETAPA POR ETAPA]",
        especialidades: ["Estética Dental", "Harmonização Facial"],
        duracao: "[CASO 02 — DURAÇÃO]",
        imagem: null,
        imagemAlt: "Registro clínico do caso 02, ainda não fornecido pela clínica",
        rotuloSlot: "Registro 02",
      },
      {
        numero: "03",
        titulo: "Tratamento ortodôntico em adulto",
        situacao: "[CASO 03 — SITUAÇÃO CLÍNICA DE PARTIDA]",
        conduta: "[CASO 03 — CONDUTA, ETAPA POR ETAPA]",
        especialidades: ["Ortodontia", "Periodontia"],
        duracao: "[CASO 03 — DURAÇÃO]",
        imagem: null,
        imagemAlt: "Registro clínico do caso 03, ainda não fornecido pela clínica",
        rotuloSlot: "Registro 03",
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
      // "Avaliações" no plural, e agora está correto: desde 03/08 TODOS os
      // itens têm `fonte: "google"` — os 3 depoimentos do site antigo saíram.
      // Se algum item com `fonte: "site"` voltar para a faixa, este rótulo
      // volta para "Nota no Google": plural colado no logo do Google
      // sugeriria que todo cartão veio de lá.
      fonteLabel: "Avaliações no Google",
    },
    // AVALIAÇÕES REAIS DO GOOGLE, transcritas em 03/08 de prints do perfil
    // enviados pelo usuário. Foi o caminho que funcionou depois de quatro
    // tentativas de raspagem falharem (ver AVALIACOES-GOOGLE.json): o Google não
    // entrega a aba de avaliações para IP de datacenter, e os hosts do Maps são
    // bloqueados neste ambiente — mas print é imagem, e imagem se lê.
    //
    // Os três depoimentos do site anterior SAÍRAM aqui, cumprindo a decisão de
    // 30/07: eles existiam só enquanto não havia avaliação do Google, e agora há.
    //
    // Texto VERBATIM, com os desvios de digitação dos autores preservados
    // ("A clinica" sem acento, "desejada.Parabéns!" sem espaço, vírgulas
    // espaçadas, o emoji). São palavras de pacientes reais; normalizar quote é
    // reescrever o que a pessoa disse.
    //
    // `quando: ""` em todas, por pedido do usuário — as quatro são de "8 meses
    // atrás" e ele não quis exibir a recência. O componente omite a linha quando
    // o campo é vazio.
    //
    // `foto: null` porque as fotos de perfil não podem ser baixadas (host
    // bloqueado, e o print não tem resolução para recorte). Cai no avatar de
    // inicial, que é o comportamento correto — melhor inicial que foto errada.
    itens: [
      {
        texto:
          "A clinica oferece ambiente agradável e acolhedor, por intermédio de todos os funcionários e dos profissionais que possuem grande capacitação técnica que inspiram confiança e segurança nos serviços prestados.",
        autor: "Lucia Feitoza Caversan",
        foto: null,
        fotoAlt: "Foto de perfil de Lucia Feitoza Caversan",
        fonte: "google",
        nota: 5,
        quando: "",
      },
      {
        texto:
          "A clínica é excelente. Atendimento personalizado. Equipe muito atenciosa e comprometida em entregar o melhor aos seus pacientes. Desde a recepção, doutores, protético e financeiro, todos são eficientes e respeitam os pacientes trabalhando em sintonia para entregar a qualidade de vida tão desejada.Parabéns!",
        autor: "EDI STEIN",
        foto: null,
        fotoAlt: "Foto de perfil de EDI STEIN",
        fonte: "google",
        nota: 5,
        quando: "",
      },
      {
        texto:
          "Experiência muito boa , ótima localização, atendimento muito bom , desde a secretária jéssica que é muito atenciosa e competente , e a dra Ana que faz um excelente atendimento 👏🏻👏🏻",
        autor: "Mauricio Roberto",
        foto: null,
        fotoAlt: "Foto de perfil de Mauricio Roberto",
        fonte: "google",
        nota: 5,
        quando: "",
      },
      {
        texto:
          "Atendimento excelente, desde a recepção aos exames e a Dra Ana Carolina sempre muito atenciosa e competente. Recomendo!",
        autor: "Guilherme Rocha",
        foto: null,
        fotoAlt: "Foto de perfil de Guilherme Rocha",
        fonte: "google",
        nota: 5,
        quando: "",
      },
    ],
  },
  tratamentos: {
    eyebrow: "Tratamentos",
    titulo: "Orçamento após avaliação.",
    descricao:
      "Não trabalhamos com tabela fechada: o valor depende do diagnóstico, da extensão do caso e das etapas envolvidas. A avaliação inicial define o plano e o orçamento.",
    eixos: [
      {
        titulo: "Avaliação e prevenção",
        descricao: "Consulta de avaliação, diagnóstico, limpeza e plano de acompanhamento.",
        inclui: ["Exame clínico completo", "Diagnóstico por imagem", "Plano de tratamento por escrito"],
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
      },
    ],
    // Uma vez, no fim da seção. Estava repetida em cada um dos três cartões,
    // que é como tabela de preço mostra preço — e a frase toda existe para
    // dizer que não há tabela de preço.
    notaValor: "Valor sob avaliação, em todos os eixos.",
    cta: { label: "Agendar avaliação", href: WHATSAPP_HREF },
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
    // Fecha a coluna do título, que de outro modo é 400px de vazio ao lado das
    // perguntas. É link de texto, não pílula: a seção não precisa de mais um
    // botão alto, precisa de uma saída para a dúvida que a lista não cobre.
    nota: "Sua dúvida não está aqui? A recepção responde diretamente.",
    notaCta: { label: "Falar com a recepção", href: WHATSAPP_HREF },
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
