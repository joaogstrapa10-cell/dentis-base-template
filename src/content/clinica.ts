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
    // ⚠️ A PREENCHER, e é o que falta para o mapa em tiles ligar. Com `null` a
    // seção usa o embed do Google, que acha o endereço pelo texto e aponta certo.
    // Não estimei os valores de propósito: no zoom 16 um erro de 300m manda o
    // paciente para outra quadra, e o erro é invisível para quem publica.
    // Como obter, em 10 segundos: abrir o endereço no Google Maps, clicar com o
    // botão direito no ponto exato da clínica e copiar o par que aparece no menu.
    latitude: null,
    longitude: null,
  },
  header: {
    wordmark: "Suzuki Odontologia",
    // Enxuta de propósito: o header é uma pílula flutuante e sete itens não
    // cabem sem quebrar. A navegação completa fica no footer.
    //
    // "Home" aponta para `#top`, que é o id da seção do hero. Não é "/": âncora
    // interna rola suave até o topo, e "/" recarregaria a página inteira para
    // chegar ao mesmo lugar.
    // A ordem segue a da PÁGINA (ver o comentário em src/routes/index.tsx). Áreas
    // passou à frente de Estrutura em 13/08 porque as seções trocaram de lugar:
    // link que sobe a página quando o de baixo desce lê como link errado, e o
    // menu é a única pista de ordem que o visitante tem antes de rolar.
    nav: [
      // Aponta para `#arcada`, e não mais para `#top`: desde 17/08 a página abre
      // pela arcada, e o hero de colagem (`#top`) é a SEGUNDA seção. "Home"
      // levando para a segunda seção pularia a abertura sem avisar.
      { label: "Home", href: "#arcada" },
      { label: "Áreas", href: "#areas" },
      { label: "Estrutura", href: "#estrutura" },
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
    // COLAGEM de três imagens, na anatomia do template que o usuário trouxe em
    // 13/08. A ordem é hierarquia de tamanho, não gosto: a primeira é a maior.
    //
    // [0] é a EQUIPE, pedida por ele na mensagem anterior ("coloque essa foto no
    // lugar da do dalton") e recortada a pedido ("sem fundo"). O arquivo veio
    // 2000×2000 sobre branco; o recorte foi feito nesta máquina — método e
    // proveniência em public/imagens/hero/LEIA-ME.txt. Ela é a única com
    // `semFundo: true`, e é o que lhe dá o passe-partout claro: figura recortada
    // precisa de fundo para não flutuar no vazio, e o dela era branco de estúdio.
    //
    // [1] e [2] são fotos reais da clínica, as mesmas do acervo da seção de
    // estrutura. Escolhidas por LEGIBILIDADE em cartão pequeno: a recepção tem um
    // assunto central (o balcão curvo) e o consultório digital tem o monitor com a
    // arcada 3D, que ainda se lê a 160px. Ambientes vazios e corredores viram
    // mancha nesse tamanho.
    //
    // O retrato do Dr. Dalton segue em public/imagens/hero/dalton-suzuki.webp
    // (500×482, `semFundo: false`) para quando a colagem mudar.
    /* SEM COLAGEM DE FOTOS desde 17/08: "tire essas fotos". As três imagens
       (equipe recortada, sorriso e atendimento) saíram do hero e a ARCADA ficou no
       lugar delas — é onde a animação da abertura vai aterrissar depois de girar.

       Os arquivos continuam em public/imagens/hero/ e o campo `colagem` continua no
       tipo: é o caminho para as variantes de Rogério e Décio, que podem querer fotos
       aqui. Para trazer as três de volta, é repovoar esta lista e pôr
       `arcada: null` — nenhum componente muda. A proveniência e as marcas de IA da
       foto da equipe estão em public/imagens/hero/LEIA-ME.txt. */
    colagem: [],
    /* O sorriso do hero é EXATAMENTE a mesma imagem em que a descida da abertura
       termina, e isso não é economia de asset: é o que faz a aterrissagem ler como o
       mesmo objeto tendo vindo de lá. Trocar por uma imagem parecida quebra o efeito,
       porque o olho percebe a substituição.
       É o ÚLTIMO QUADRO DO CLIPE, extraído do próprio arquivo, e é a mesma URL de
       `arcada.etapas[1].src`. Não duplicar por descuido de cópia: se as duas
       divergirem, a arcada muda de imagem no instante em que aterrissa.
       Renderizada com a máscara `.video-fundido`, porque o fundo do arquivo (`#001518`,
       medido) é mais ESCURO que o `--ink` do bloco e sem ela desenharia um retângulo —
       a borda que foi reprovada duas vezes na abertura. */
    arcada: {
      src: "/imagens/arcada/arcada-fim.webp",
      alt: "Modelo 3D das duas arcadas restauradas e fechadas em oclusão, formando um sorriso completo. Ilustração técnica, não é registro de paciente.",
      largura: 1920,
      altura: 1080,
      semFundo: false,
    },
    // ⚠️ TRÊS NÚMEROS, TODOS VERIFICÁVEIS, e é essa a regra desta fileira.
    //   5,0  — nota real do perfil da clínica no Google, a mesma que alimenta a
    //          seção de avaliações (`depoimentos.resumo.nota`).
    //     8  — as oito especialidades de `areas.itens`, uma a uma.
    //     9  — os nove retratos de `bio.equipe`, contados.
    // O rótulo do terceiro diz "no corpo clínico", e não "especialistas": o CRO e
    // a especialidade de oito deles ainda são placeholder, então afirmar a
    // titulação de todos seria afirmar o que não se sabe.
    // NÃO acrescentar "anos de clínica" nem "pacientes atendidos" sem a clínica
    // fornecer o número — é a métrica mais fácil de inventar e a mais fácil de
    // desmentir, e publicidade odontológica não é lugar para número redondo.
    stats: [
      { valor: "5,0", rotulo: "Nota no Google", icone: "nota" },
      { valor: "8", rotulo: "Especialidades", icone: "especialidades" },
      { valor: "9", rotulo: "No corpo clínico", icone: "corpoClinico" },
    ],
  },
  diferenciais: {
    eyebrow: "Por que aqui",
    titulo: "Experiência aplicada caso a caso.",
    descricao:
      "Nosso corpo clínico é formado por mestres e especialistas em diversas áreas da Odontologia. A proposta é unir conhecimento, experiência, ética e alta tecnologia em benefício de cada paciente.",
    // SEM imagem, por decisão do usuário em 12/08. Era a foto do scanner
    // intraoral, que ficava num retângulo pequeno ao lado do texto de abertura.
    // O arquivo continua em public/imagens/metodo/, com a proveniência no
    // LEIA-ME.txt de lá — `null` colapsa a coluna e o texto ocupa a largura
    // toda, sem buraco no layout.
    imagem: null,
    imagemAlt: "",
    itens: [
      {
        titulo: "Corpo clínico de especialistas",
        icone: "corpo",
        descricao:
          "Cada área conduzida por quem se especializou nela. O caso não muda de mãos por conveniência de agenda.",
      },
      {
        titulo: "Casos de alta complexidade",
        icone: "complexidade",
        descricao:
          "Reabilitações extensas e situações que exigem planejamento multidisciplinar são o centro da nossa rotina, não a exceção.",
      },
      {
        titulo: "Planejamento antes de execução",
        icone: "planejamento",
        descricao:
          "Nenhum procedimento começa sem diagnóstico fechado e plano apresentado ao paciente, com etapas e critérios definidos.",
      },
      {
        titulo: "Harmonização com a face",
        icone: "face",
        descricao:
          "Função mastigatória e estética tratadas em conjunto, considerando a face como um todo, não o dente isolado.",
      },
    ],
  },
  localizacao: {
    eyebrow: "Onde estamos",
    // "Onde ficamos." a pedido do cliente em 12/08, no lugar de "Alto da XV,
    // Curitiba." — o bairro e a cidade já aparecem no endereço logo abaixo, e o
    // título repetia o dado em vez de nomear a seção.
    titulo: "Onde ficamos.",
    descricao: "",
    enderecoLabel: "Endereço",
    horarioLabel: "Horário",
    telefoneLabel: "Telefone",
    whatsappLabel: "WhatsApp",
    // Usado só quando os dois números são iguais, que é o caso aqui.
    telefoneWhatsappLabel: "Telefone e WhatsApp",
    rotaLabel: "Ver rota no Google Maps",
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
        icone: "implante",
        descricao:
          "Reposição de dentes ausentes com implantes e procedimentos cirúrgicos, do caso unitário à reabilitação total.",
      },
      {
        titulo: "Estética Dental",
        icone: "faceta",
        descricao:
          "Facetas, coroas em cerâmica e clareamento, planejados a partir da proporção da face.",
      },
      {
        titulo: "Endodontia",
        icone: "canal",
        descricao:
          "Tratamento de canal com foco em preservar o dente natural sempre que houver condição para isso.",
      },
      {
        titulo: "Harmonização Facial",
        icone: "face",
        descricao:
          "Procedimentos faciais conduzidos em conjunto com o plano odontológico, respeitando as proporções individuais.",
      },
      {
        titulo: "Ortodontia",
        icone: "aparelho",
        descricao:
          "Correção de posicionamento dentário e de mordida, com aparelhos fixos e alinhadores.",
      },
      {
        titulo: "Odontopediatria",
        icone: "infantil",
        descricao:
          "Atendimento infantil com condução adequada à idade e acompanhamento do desenvolvimento.",
      },
      {
        titulo: "Periodontia",
        icone: "gengiva",
        descricao:
          "Tratamento da gengiva e do osso que sustentam o dente, base de qualquer reabilitação duradoura.",
      },
      {
        titulo: "Reabilitação Oral",
        icone: "arcada",
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
  // ⚠️ A seção deixou de ser sobre CASOS COMPLEXOS em 12/08, por pedido do
  // usuário: "tira a parte complexos, seria casos clínicos ali no geral". O
  // recorte anterior ("Como um caso complexo é conduzido") descrevia um subgrupo
  // e a clínica atende o espectro inteiro — o que a seção tem de único não é a
  // complexidade dos casos, é o MÉTODO de documentar todos do mesmo jeito.
  casos: {
    eyebrow: "Casos clínicos",
    titulo: "Casos clínicos conduzidos aqui.",
    descricao:
      "Casos reais conduzidos pelo corpo clínico, em diferentes especialidades e diferentes níveis de complexidade. Todos são documentados do mesmo modo: a situação clínica de partida, a conduta adotada em cada etapa, as especialidades envolvidas e o tempo de tratamento. É descrição de processo, não de resultado — cada caso depende de diagnóstico individual.",
    situacaoLabel: "Situação clínica",
    condutaLabel: "Conduta",
    especialidadesLabel: "Especialidades envolvidas",
    duracaoLabel: "Duração",
    // ⚠️ A última frase entrou em 13/08, junto com as imagens, e não é rodapé de
    // cortesia: as cinco imagens ILUSTRAM a especialidade de cada caso e não são
    // registro do paciente descrito. Sem essa frase, uma foto ao lado de um caso
    // afirma ser daquele caso. Ver public/imagens/casos/LEIA-ME.txt.
    aviso:
      "Descrição de processo clínico conduzido nesta clínica. Não constitui promessa de resultado. Cada caso é único e depende de diagnóstico individual. Em conformidade com a Resolução CFO-196/2019, esta seção não divulga imagens comparativas de antes e depois. As imagens ilustram a especialidade de cada caso e não são registro clínico do paciente descrito.",
    verTodos: { label: "Ver todos os casos", href: "/casos" },
    anteriorLabel: "Caso anterior",
    proximoLabel: "Próximo caso",
    // Cinco na home, todos na página — pedido do usuário. É curadoria, não
    // limite de layout: o carrossel tem altura fixa e caberia a lista inteira.
    limiteNaHome: 5,
    pagina: {
      titulo: "Casos clínicos.",
      descricao:
        "Todos os casos documentados, do mais recente ao mais antigo. De cada um: a situação clínica de partida, a conduta por etapa, as especialidades envolvidas e o tempo de tratamento. A home mostra uma seleção; aqui está a lista inteira.",
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
        // ⚠️ IMAGEM ILUSTRATIVA DA ESPECIALIDADE, NÃO REGISTRO DESTE CASO.
        // O alt descreve o que a imagem é, e é isso que impede a página de
        // afirmar que a foto é do paciente descrito acima. Proveniência e o
        // critério de escolha das cinco: public/imagens/casos/LEIA-ME.txt.
        // `rotuloSlot` fica: é o rótulo do slot vazio, que volta a aparecer se
        // a imagem sair, e as variantes das outras clínicas nascem sem imagem.
        imagem: "/imagens/casos/01-implante-titanio.jpeg",
        imagemAlt:
          "Ilustração 3D de implante de titânio rosqueado instalado entre dentes naturais",
        rotuloSlot: "Registro 01",
      },
      {
        numero: "02",
        titulo: "Reabilitação estética com harmonização facial",
        situacao: "[CASO 02 — SITUAÇÃO CLÍNICA DE PARTIDA]",
        conduta: "[CASO 02 — CONDUTA, ETAPA POR ETAPA]",
        especialidades: ["Estética Dental", "Harmonização Facial"],
        duracao: "[CASO 02 — DURAÇÃO]",
        imagem: "/imagens/casos/02-facetas-ceramica.jpeg",
        imagemAlt:
          "Facetas de cerâmica finíssimas apoiadas sobre uma folha verde, em fundo escuro",
        rotuloSlot: "Registro 02",
      },
      {
        numero: "03",
        titulo: "Tratamento ortodôntico em adulto",
        situacao: "[CASO 03 — SITUAÇÃO CLÍNICA DE PARTIDA]",
        conduta: "[CASO 03 — CONDUTA, ETAPA POR ETAPA]",
        especialidades: ["Ortodontia", "Periodontia"],
        duracao: "[CASO 03 — DURAÇÃO]",
        imagem: "/imagens/casos/03-aparelho-fixo.jpeg",
        imagemAlt: "Detalhe de aparelho ortodôntico fixo, com bráquetes e fio",
        rotuloSlot: "Registro 03",
      },
      // Casos 04 e 05 entraram em 12/08 para a galeria da home ter os cinco
      // slots que o usuário pediu. Os TÍTULOS são categorias de tratamento reais,
      // tiradas das especialidades que a clínica já lista — não são casos
      // inventados: todo dado do caso (situação, conduta, duração) segue em
      // placeholder nomeado, esperando a clínica. Se ela tiver outras cinco
      // categorias em mente, trocar o título é uma linha.
      {
        numero: "04",
        titulo: "Preservação de dente natural com tratamento de canal",
        situacao: "[CASO 04 — SITUAÇÃO CLÍNICA DE PARTIDA]",
        conduta: "[CASO 04 — CONDUTA, ETAPA POR ETAPA]",
        especialidades: ["Endodontia", "Estética Dental"],
        duracao: "[CASO 04 — DURAÇÃO]",
        imagem: "/imagens/casos/04-canais-radiculares.jpeg",
        imagemAlt:
          "Ilustração 3D de dente translúcido mostrando os canais radiculares e o feixe nervoso",
        rotuloSlot: "Registro 04",
      },
      {
        numero: "05",
        titulo: "Tratamento periodontal e manutenção",
        situacao: "[CASO 05 — SITUAÇÃO CLÍNICA DE PARTIDA]",
        conduta: "[CASO 05 — CONDUTA, ETAPA POR ETAPA]",
        especialidades: ["Periodontia", "Reabilitação Oral"],
        duracao: "[CASO 05 — DURAÇÃO]",
        imagem: "/imagens/casos/05-raspagem-periodontal.jpeg",
        imagemAlt:
          "Raspagem periodontal em andamento, com instrumento sob afastador",
        rotuloSlot: "Registro 05",
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
        icone: "avaliacao",
        descricao: "Consulta de avaliação, diagnóstico, limpeza e plano de acompanhamento.",
        inclui: ["Exame clínico completo", "Diagnóstico por imagem", "Plano de tratamento por escrito"],
      },
      {
        titulo: "Reabilitação",
        icone: "reabilitacao",
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
        icone: "estetica",
        descricao: "Facetas, cerâmicas, clareamento e harmonização facial integrados ao plano.",
        inclui: [
          "Planejamento a partir da face",
          "Facetas e coroas em cerâmica",
          "Clareamento",
          "Harmonização facial",
        ],
      },
    ],
  },
  arcada: {
    /* UM clipe só, 8,04s, 1920×1080, 24fps, E DENTRO DO REPO. É o `currentTime` dele
       que a rolagem controla, e ele é o conteúdo inteiro da abertura.

       ✅ ACABOU A DEPENDÊNCIA DE URL EXTERNA. Até 17/08 o vídeo e os dois quadros
       vinham do CDN do gerador, com token vencendo em 20/08, porque o CDN é 403 nesta
       rede e o Lovable ficou sem crédito. O usuário mandou os arquivos pelo chat
       ("faca tudo voce, eu nao consigo subir nada" virou ele subindo), e com arquivo em
       disco a ponte deixou de ser necessária. Não voltar a apontar para URL assinada.

       O clipe veio do Higgsfield, um de quatro que ele mandou. Os outros TRÊS ficaram
       fora, e não por descuido — são redundantes com este:
         · 4,04s, as duas gengivas só com implantes → é o quadro 0 deste clipe;
         · 5,04s, sorriso completo de frente        → é o quadro final deste clipe;
         · 6,04s, sorriso completo girando          → o giro foi trocado pela DESCIDA
           em CSS, que aterrissa no sorriso do hero. Somar 6s aqui dobraria o scroll.
       Proveniência dos quatro em public/imagens/arcada/LEIA-ME.txt.

       ⚠️ QUEM COLOCA OS DENTES É O VÍDEO, e isso foi uma correção do usuário: "quero
       você colocando os dentes ao scrollar, você apenas colocou uma imagem em cima".
       Houve uma tentativa de empilhar um quadro com dentes sobre o quadro com
       implantes e descobrir por `clip-path`; entregava a ordem certa e foi reprovada na
       hora, porque é sobreposição e não animação. Não reintroduzir.

       CONFERIDO quadro a quadro no arquivo, a 2 amostras por segundo, e é a primeira
       vez que este clipe atende o pedido inteiro sem ressalva:
         · a arcada de CIMA enche da esquerda para a direita, um dente por vez, e só
           quando fecha é que a de BAIXO começa, também da esquerda;
         · os implantes são o pino achatado da foto de referência que ele mandou, sem
           cabeça e sem fenda, e nenhum aparece depois que a coroa assenta;
         · a câmera não mexe: o enquadramento é o mesmo do primeiro ao último quadro.

       PESO: 1354KB no WebM e 2395KB no mp4. O WebM é o que Chrome, Firefox e Edge
       baixam; o mp4 existe para o Safari, que não decodifica VP9 em toda versão.

       ⚠️ FICOU EM 1080p, A RESOLUÇÃO NATIVA DO MASTER, e a versão 720p que existiu aqui
       foi um ERRO MEU. Ela pesava 597KB a 594 kbps e o usuário reclamou com razão:
       "está apagando o detalhe da gengiva e do esmalte". Medido com libvmaf contra o
       master, e a tabela é o que fecha o assunto:

         720p CRF33   582KB   VMAF 89,8   ← o que estava no site
         720p CRF26   880KB   VMAF 92,1
         720p CRF22  1078KB   VMAF 92,5
        1080p CRF28  1354KB   VMAF 95,4   ← este
        1080p CRF24  1796KB   VMAF 95,8

       A 720p a qualidade SATURA em ~92,5 por mais bits que se jogue: a resolução é o
       teto, não o bitrate. Não voltar para 720p tentando economizar peso — o caminho,
       se o peso incomodar, é servir 720p só para tela estreita por `<source media>`,
       onde a caixa exibe 343px e 1080p é três vezes mais do que cabe.

       ⚠️ E NÃO FAZER UPSCALE POR IA. Foi cogitado em 18/08 e recusado por três motivos:
       o master já é 1080p e a caixa exibe 950px, que num retina são 1900px reais, ou
       seja encaixe 1:1; custaria ~3.500 créditos do Magnific por clipe para resolver um
       déficit de 1,32× que só existe em monitor grande a 2×; e num render 3D de
       gradiente liso o Topaz inventa micro-textura na gengiva e serrilha a borda do
       dente — numa peça apresentada como ilustração técnica, isso é inventar detalhe
       anatômico. O gargalo era o encode, não a fonte.

       ⚠️ `-g 24`, KEYFRAME POR SEGUNDO, nos dois arquivos — 9 cada. Não é ajuste fino:
       o arquivo que o usuário mandou tinha UM keyframe em 8s, e procurar um instante
       longe do keyframe obriga o navegador a decodificar tudo desde o começo. Animação
       comandada por rolagem com um keyframe só anda aos pulos. Ao trocar o clipe,
       reencodar com `-g` igual ao fps. */
    video: "/imagens/arcada/arcada.mp4",
    videoWebm: "/imagens/arcada/arcada.webm",
    slotRotulo: "[QUADRO DA ARCADA — 3D]",
    /* DOIS quadros, e eles não são ilustração à parte: são o primeiro e o último
       quadro EXTRAÍDOS do próprio clipe. O primeiro é o `poster` do vídeo e o último é
       o estado exibido sob `prefers-reduced-motion` — só esses dois chegam à tela como
       imagem, o resto do tempo quem aparece é o vídeo.

       Vindo do próprio arquivo, a troca de poster para vídeo não salta um pixel. Antes
       eram gerações separadas, e é de lá que vinha o pulo no primeiro quadro.

       ⚠️ A ordem dos dois É o conteúdo: trocá-los inverte a ordem de um procedimento
       clínico na tela. */
    etapas: [
      {
        rotulo: "Gengivas com os implantes",
        src: "/imagens/arcada/arcada-inicio.webp",
        alt: "Modelo 3D das duas arcadas sem dentes, a de cima espelhada acima da de baixo, ambas com os implantes de titânio assentados na crista da gengiva.",
      },
      {
        rotulo: "Dentes instalados",
        src: "/imagens/arcada/arcada-fim.webp",
        alt: "Modelo 3D das duas arcadas com as coroas de cerâmica instaladas sobre todos os implantes, sem nenhuma peça metálica aparente.",
      },
    ],
    aviso:
      "Ilustração técnica em 3D de um modelo anatômico, produzida para explicar a sequência do procedimento. Não é registro clínico de paciente, não representa um caso real e não constitui promessa de resultado. Cada caso depende de diagnóstico individual.",
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
    // Abre a esteira de retratos. Descreve o que a seção mostra, sem prometer
    // nada: são oito profissionais e as especialidades que a clínica lista. Não
    // inventar "os melhores" nem número de anos aqui.
    corpoClinicoNota:
      "Oito profissionais, cada especialidade conduzida por quem se especializou nela.",
    corpoClinicoMembros: [
      {
        nome: "Ana Lúcia",
        cro: "[CRO]",
        especialidade: "[ESPECIALIDADE]",
        retrato: "/imagens/equipe/ana-lucia.webp",
        retratoAlt: "Retrato de Ana Lúcia, do corpo clínico",
      },
      {
        nome: "Carolina Cabral",
        cro: "[CRO]",
        especialidade: "[ESPECIALIDADE]",
        retrato: "/imagens/equipe/carolina-cabral.webp",
        retratoAlt: "Retrato de Carolina Cabral, do corpo clínico",
      },
      {
        nome: "Cláudio Kleinhans",
        cro: "[CRO]",
        especialidade: "[ESPECIALIDADE]",
        retrato: "/imagens/equipe/claudio-kleinhans.webp",
        retratoAlt: "Retrato de Cláudio Kleinhans, do corpo clínico",
      },
      {
        nome: "Denise Karpen",
        cro: "[CRO]",
        especialidade: "[ESPECIALIDADE]",
        retrato: "/imagens/equipe/denise-karpen.webp",
        retratoAlt: "Retrato de Denise Karpen, do corpo clínico",
      },
      {
        nome: "Fabrício Leite",
        cro: "[CRO]",
        especialidade: "[ESPECIALIDADE]",
        retrato: "/imagens/equipe/fabricio-leite.webp",
        retratoAlt: "Retrato de Fabrício Leite, do corpo clínico",
      },
      {
        nome: "Michele",
        cro: "[CRO]",
        especialidade: "[ESPECIALIDADE]",
        retrato: "/imagens/equipe/michele.webp",
        retratoAlt: "Retrato de Michele, do corpo clínico",
      },
      {
        nome: "Patrícia",
        cro: "[CRO]",
        especialidade: "[ESPECIALIDADE]",
        retrato: "/imagens/equipe/patricia.webp",
        retratoAlt: "Retrato de Patrícia, do corpo clínico",
      },
      {
        nome: "Vitor Coró",
        cro: "[CRO]",
        especialidade: "[ESPECIALIDADE]",
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
    // SEM imagem, por decisão do usuário em 12/08 — a foto do atendimento entrou
    // e saiu no mesmo dia. Sem ela a seção volta a ser título à esquerda e
    // perguntas à direita: com a coluna da esquerda carregando só a nota, ela
    // ficaria com a altura das sete perguntas e quase nada dentro.
    // A foto segue na galeria de /estrutura, como ambiente.
    imagem: null,
    imagemAlt: "",
    // Sob a foto. É link de texto, não pílula: a seção não precisa de mais um
    // botão alto, precisa de uma saída para a dúvida que a lista não cobre.
    nota: "Sua dúvida não está aqui? A recepção responde diretamente.",
    notaCta: { label: "Falar com a recepção", href: WHATSAPP_HREF },
  },
  // Saiu do rodapé em 12/08 e virou seção, depois da Localização.
  chamadaFinal: {
    titulo: "Comece pela avaliação.",
    descricao:
      "Uma consulta define o diagnóstico, o plano e o orçamento. Sem compromisso de fechamento.",
    cta: { label: "Agendar pelo WhatsApp", href: WHATSAPP_HREF },
  },
  footer: {
    colunaContatoLabel: "Contato",
    telefoneWhatsappLabel: "Telefone e WhatsApp",
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
    // Na ordem da página, como o menu. "Como conduzimos" saiu junto com a seção
    // de Acompanhamento em 12/08: link de rodapé para âncora que não existe mais
    // rola para o topo sem avisar, e não há como o visitante saber que o destino
    // sumiu.
    colunaClinica: [
      // Rota interna, não âncora: é a página com a lista inteira. O header não
      // recebe este item — a pílula já está em cinco e um sexto recria a colisão
      // com a marca em 1024px, medida duas vezes nesta sessão.
      { label: "Casos clínicos", href: "/casos" },
      { label: "Responsável técnico", href: "#responsavel" },
      { label: "Diferenciais", href: "#diferenciais" },
      { label: "Estrutura", href: "#estrutura" },
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
