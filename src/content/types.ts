export type NavLink = { label: string; href: string };

export type Cta = { label: string; href: string };

export type BrandContent = {
  nome: string;
  wordmark: string;
  /** Logo em /public, monocromático CLARO — para superfície escura (header,
   *  cartão do hero, footer). `null` cai no wordmark em texto. */
  logo: string | null;
  /** Mesma arte, monocromática ESCURA — para superfície clara. `null` cai no
   *  wordmark em texto. Ao trocar de clínica é preciso fornecer as duas
   *  versões: recolorir uma no navegador desbota o traço fino. */
  logoEscuro: string | null;
  logoAlt: string;
  responsavelTecnico: string;
  croResponsavel: string;
  cnpj: string;
  copyright: string;
};

export type ContatoContent = {
  endereco: string;
  cep: string;
  cidadeUf: string;
  horario: string;
  telefone: string;
  whatsapp: string;
  mapaEmbedSrc: string;
  mapaTitle: string;
};

export type SocialLink = { label: string; href: string; icon: "instagram" | "facebook" };

export type HeaderContent = {
  wordmark: string;
  nav: NavLink[];
  cta: Cta;
  ariaAbrirMenu: string;
  ariaFecharMenu: string;
};

export type EstruturaSlot = {
  src: string | null;
  /** NOME DO AMBIENTE, não um número. É a legenda exibida na página /estrutura,
   *  e é o que responde "o que é cada ambiente". Era "01".."12" até 03/08. */
  rotulo: string;
  alt: string;
};

export type EstruturaContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  /** CTA da home para a página com todas as fotos. Rota interna — nunca marcar
   *  `external`. */
  verTodas: Cta;
  /** Textos exclusivos da página /estrutura. */
  pagina: {
    titulo: string;
    descricao: string;
    voltarLabel: string;
  };
  /** Todos os ambientes. O carrossel da home passa por todos em laço; a página
   *  /estrutura mostra todos de uma vez, com legenda. Os campos do comparador
   *  arrastável saíram em 30/07 junto com ele. */
  imagens: EstruturaSlot[];
};

export type HeroContent = {
  eyebrow: string;
  /** Uma entrada por linha renderizada. A quebra de linha é decisão editorial,
   *  não do navegador — e cada linha entra revelada por máscara. */
  headline: string[];
  subheadline: string;
  ctaPrimario: Cta;
  ctaSecundario: Cta;
  responsavelLinha: string;
  /** Retrato do responsável técnico, em /public. `null` faz o hero voltar a
   *  duas colunas de texto, sem buraco no layout. Exige autorização de uso de
   *  imagem, ver docs/imagens.md. */
  retrato: string | null;
  retratoAlt: string;
};

export type DiferencialItem = {
  titulo: string;
  descricao: string;
};

export type DiferenciaisContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  /** Imagem do MÉTODO, ao lado do texto de abertura. Instrumento/tecnologia, não
   *  ambiente — as fotos de ambiente têm a seção de estrutura. Renderizada
   *  pequena de propósito: o cliente pediu "sutil e não grande". `null` colapsa
   *  a coluna e o texto ocupa a largura toda, sem buraco. */
  imagem: string | null;
  imagemAlt: string;
  itens: DiferencialItem[];
};

export type LocalizacaoContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  enderecoLabel: string;
  horarioLabel: string;
  telefoneLabel: string;
  whatsappLabel: string;
  /**
   * Rótulo único, usado quando `contato.telefone` e `contato.whatsapp` são o
   * MESMO número — que é o caso da Suzuki, cujo telefone é um celular.
   *
   * Existe porque a seção mostrava duas linhas, "Telefone" e "WhatsApp", com o
   * mesmo (41) 99206-1073 repetido embaixo das duas: lê como erro de conteúdo.
   * Os três rótulos coexistem de propósito — nas variantes em que os números
   * forem diferentes, as duas linhas separadas voltam sozinhas.
   */
  telefoneWhatsappLabel: string;
};

/**
 * Qual dos oito ícones desenhados em `IconesEspecialidade.tsx` a especialidade
 * usa. É uma união fechada, não `string`: ícone é desenho, não conteúdo, e um
 * nome errado aqui renderizaria vazio em silêncio.
 */
export type AreaIcone =
  | "implante"
  | "faceta"
  | "canal"
  | "face"
  | "aparelho"
  | "infantil"
  | "gengiva"
  | "arcada";

export type AreaAtuacao = {
  titulo: string;
  /**
   * VOLTOU a ser renderizada na home em 12/08, e a distinção com o formato
   * reprovado importa: até 30/07 ela só aparecia com o mouse em cima, e texto
   * que só existe no hover não é lido por quem rola a página. Agora é texto
   * permanente na célula — o hover só acende o fundo e a barra lateral.
   */
  descricao: string;
  icone: AreaIcone;
};

export type AreasContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  itens: AreaAtuacao[];
};

/**
 * Caso clínico da galeria.
 *
 * ⚠️ COMPLIANCE, e é o que define a forma deste tipo: a CFO-196/2019 restringe
 * divulgação de imagens de ANTES E DEPOIS em publicidade odontológica. Por isso
 * o caso tem UMA imagem (`imagem`), e não um par — o tipo não permite montar
 * comparação. E os campos são de PROCESSO (`situacao`, `conduta`, `duracao`,
 * `especialidades`), não de resultado: não existe campo de "antes", de "depois"
 * nem de ganho estético. Não acrescentar.
 */
export type CasoClinico = {
  numero: string;
  titulo: string;
  /** Situação clínica de partida, em termos técnicos. Nunca promessa. */
  situacao: string;
  /** O que foi feito, por etapa. Descreve conduta, não desfecho. */
  conduta: string;
  especialidades: string[];
  duracao: string;
  /** Registro clínico em /public. `null` renderiza o slot rotulado, como na
   *  seção de estrutura. Exige autorização do paciente, ver docs/imagens.md. */
  imagem: string | null;
  imagemAlt: string;
  /** Rótulo do slot quando `imagem` é `null`. */
  rotuloSlot: string;
};

export type CasosContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  situacaoLabel: string;
  condutaLabel: string;
  especialidadesLabel: string;
  duracaoLabel: string;
  /** CTA da home para a página dedicada. `href` é rota interna, não link
   *  externo — nunca marcar `external` nele. */
  verTodos: Cta;
  /** Quantos casos a home mostra antes do CTA. A página mostra todos, sempre.
   *  Existe para a home continuar sendo chamada quando a clínica acumular
   *  casos, em vez de crescer sem limite. */
  limiteNaHome: number;
  /** Textos exclusivos da página /casos. */
  pagina: {
    titulo: string;
    descricao: string;
    voltarLabel: string;
  };
  /** Aviso de compliance, renderizado visível no fim da seção. Obrigatório: é
   *  a seção do site com maior exposição à CFO-196/2019. */
  aviso: string;
  itens: CasoClinico[];
};

/** De onde a avaliação veio. Determina se a marca do Google pode ser exibida
 *  junto dela: exibir a marca sobre texto que não veio do Google representa a
 *  origem de forma incorreta. */
export type AvaliacaoFonte = "google" | "site";

export type Depoimento = {
  texto: string;
  autor: string;
  /** Retrato. Caminho em /public, ou `null` para cair no fallback de inicial.
   *  Exige autorização de uso de imagem, ver docs/imagens.md. */
  foto: string | null;
  fotoAlt: string;
  /** 1 a 5. Só é renderizado quando `fonte` é "google". */
  nota: number;
  /** Texto livre de recência, como aparece no Google ("há 2 anos"). */
  quando: string;
  fonte: AvaliacaoFonte;
};

/** Cartão de resumo do perfil, à esquerda do carrossel: logo, estrelas e nota,
 *  nada mais. A nota precisa vir do Google Business Profile da clínica; não pode
 *  ser estimada, é o único número que o cartão afirma. */
export type AvaliacoesResumo = {
  /** Não é exibido: vira o texto alternativo do logo, para leitor de tela. */
  nomeNegocio: string;
  nota: string;
  /** Rótulo ao lado da marca do Google. Descreve O QUE veio do Google, e a
   *  precisão aqui importa: hoje só a NOTA veio de lá — os depoimentos do
   *  carrossel são do site antigo, marcados `fonte: "site"`. Escrever
   *  "avaliações do Google" enquanto isso for verdade atribui origem falsa.
   *  Quando as avaliações do Google entrarem, este rótulo muda junto. */
  fonteLabel: string;
};

export type DepoimentosContent = {
  eyebrow: string;
  titulo: string;
  resumo: AvaliacoesResumo;
  itens: Depoimento[];
};

/**
 * Um EIXO de tratamento, não um plano. A diferença é o que o tipo permite:
 * não há `valorLabel`, `cta`, `destaque` nem `badge` por item, e a ausência é
 * proposital.
 *
 * Antes havia os quatro, e com eles a seção era literalmente uma tabela de
 * preços de software: três colunas, coluna do meio destacada, selo "Mais
 * procurado", uma linha de valor repetida três vezes e três botões apontando
 * para o MESMO link de WhatsApp. Enquanto o texto da seção diz que a clínica
 * não trabalha com tabela fechada.
 *
 * `destaque`/`badge` eram pior que redundantes: "mais procurado" é pressão de
 * demanda aplicada a decisão de saúde. O valor e a chamada passaram para o
 * nível da seção, onde acontecem uma vez.
 */
export type TratamentoEixo = {
  titulo: string;
  descricao: string;
  /** O que o eixo envolve. Renderiza em linha, separado por ponto médio. */
  inclui: string[];
};

export type TratamentosContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  eixos: TratamentoEixo[];
  /** A resposta ao "quanto custa", uma vez só, fechando a seção. */
  notaValor: string;
  cta: Cta;
};

export type BioMembro = {
  nome: string;
  /** CRO e especialidade. Enquanto não vierem da página /equipe/, fica o
   *  placeholder nomeado — CRO é obrigatório em publicidade odontológica. */
  credencial: string;
  /** Caminho em /public. `null` renderiza o slot rotulado. */
  retrato: string | null;
  retratoAlt: string;
};

export type BioContent = {
  eyebrow: string;
  nome: string;
  credencial: string;
  /** Caminho em /public. `null` renderiza o slot rotulado. */
  retrato: string | null;
  retratoAlt: string;
  corpo: string;
  titulacao: string[];
  corpoClinicoLabel: string;
  corpoClinicoMembros: BioMembro[];
};

export type FaqItem = { pergunta: string; resposta: string };

export type FaqContent = {
  eyebrow: string;
  titulo: string;
  itens: FaqItem[];
  /**
   * Foto na coluna da esquerda, ao lado das perguntas. `null` faz a seção voltar
   * a duas colunas de texto, sem buraco no layout.
   */
  imagem: string | null;
  imagemAlt: string;
  /** Sob a foto: a saída para a dúvida que a lista não cobre. */
  nota: string;
  notaCta: Cta;
};

export type FooterColuna = { titulo: string; links: NavLink[] };

export type FooterContent = {
  ctaTitulo: string;
  ctaDescricao: string;
  ctaBotao: Cta;
  colunaContatoLabel: string;
  colunaAreasLabel: string;
  colunaClinicaLabel: string;
  colunaAreas: NavLink[];
  colunaClinica: NavLink[];
  telefoneLabel: string;
  whatsappLabel: string;
  socials: SocialLink[];
};

export type Clinica = {
  brand: BrandContent;
  contato: ContatoContent;
  header: HeaderContent;
  hero: HeroContent;
  diferenciais: DiferenciaisContent;
  localizacao: LocalizacaoContent;
  estrutura: EstruturaContent;
  areas: AreasContent;
  casos: CasosContent;
  depoimentos: DepoimentosContent;
  tratamentos: TratamentosContent;
  bio: BioContent;
  faq: FaqContent;
  footer: FooterContent;
};
