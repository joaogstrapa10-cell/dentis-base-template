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
  /**
   * Coordenadas do endereço, para o mosaico de tiles do mapa desenhar o pino.
   *
   * `null` nas duas faz a seção cair no embed do Google, que resolve o endereço em
   * texto. É a única forma segura de tratar a ausência: NÃO se estima coordenada
   * de clínica — no zoom em uso, 300m de erro apontam outra quadra, e quem publica
   * não tem como notar. Preencher as duas liga o mapa em tiles.
   */
  latitude: number | null;
  longitude: number | null;
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
  /** COLAGEM do hero: três imagens sobrepostas em passe-partout claro, na
   *  anatomia do template que o usuário trouxe em 13/08. A ordem importa e não é
   *  estética — é hierarquia de tamanho: [0] é a maior, ao centro e no topo; [1]
   *  a média, à direita; [2] a menor, embaixo à esquerda.
   *
   *  Lista vazia faz o hero voltar a duas colunas de texto, sem buraco no
   *  layout. Cada imagem exige autorização de uso, ver docs/imagens.md. */
  colagem: HeroImagem[];
  /** Os três números ao pé do texto. Ver a nota em `clinica.ts`: só entra aqui
   *  dado VERIFICÁVEL. Lista vazia não renderiza a fileira. */
  stats: HeroStat[];
};

export type HeroImagem = {
  src: string;
  alt: string;
  /** Dimensões REAIS do arquivo. Ficam no conteúdo, e não cravadas no
   *  componente, porque é delas que sai a proporção do cartão: proporção que não
   *  bate com o arquivo faz `object-cover` recortar, e foi exatamente esse o
   *  defeito de 12/08 (arquivo 3,6:1 numa faixa 0,83:1 mostrava 22% da largura). */
  largura: number;
  altura: number;
  /** `true` quando o arquivo já vem RECORTADO, com fundo transparente — como a
   *  foto da equipe. Decide se o cartão recebe passe-partout CLARO (a figura
   *  recortada precisa de fundo para não flutuar no vazio, e a dela era branco de
   *  estúdio) ou se a foto preenche o cartão inteiro. */
  semFundo: boolean;
  /** De que lado o recorte quadrado do cartão deve ficar. Só importa nas fotos de
   *  ambiente, que são 3:2 e perdem ~33% da largura no quadrado: se o assunto não
   *  está no meio do arquivo, o recorte centralizado mostra parede. A recepção é o
   *  caso — o balcão curvo e as orquídeas estão no terço ESQUERDO, e centralizada
   *  ela virava um corredor vazio. Omitido, é `centro`. */
  foco?: "centro" | "esquerda" | "direita";
};

/** Qual ícone o número usa. União fechada como as outras: ícone é desenho, e um
 *  nome livre renderizaria vazio em silêncio. Nenhum destes se repete em outra
 *  seção — ícone que significa duas coisas na mesma página informa menos que
 *  nenhum. */
export type HeroStatIcone = "nota" | "especialidades" | "corpoClinico";

export type HeroStat = {
  valor: string;
  rotulo: string;
  icone: HeroStatIcone;
};

/**
 * Qual ícone o diferencial usa. União fechada pelo mesmo motivo de `AreaIcone`:
 * ícone é desenho, não conteúdo, e um nome errado renderizaria vazio em silêncio.
 *
 * Estes vêm do `lucide-react`, não dos ícones dentais desenhados no projeto — e a
 * separação é deliberada. Diferencial não é especialidade: usar o ícone de
 * implante aqui diria "implantodontia" onde o texto diz "corpo clínico de
 * especialistas". Cada seção mantém um conjunto internamente coerente, e os dois
 * conjuntos compartilham traço de 1.5 e caixa de 28px para lerem como um sistema.
 */
export type DiferencialIcone = "corpo" | "complexidade" | "planejamento" | "face";

export type DiferencialItem = {
  titulo: string;
  descricao: string;
  icone: DiferencialIcone;
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
  /** Rótulo do link que abre o endereço no Google Maps. O mapa da seção é uma
   *  imagem; este link é o que permite traçar rota. */
  rotaLabel: string;
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
  /** Rótulos dos botões do carrossel. Existem como conteúdo porque são o
   *  `aria-label` deles: botão de ícone sem rótulo não é anunciado. */
  anteriorLabel: string;
  proximoLabel: string;
  /**
   * Quantos casos a galeria da home mostra. A página /casos mostra todos.
   *
   * Saiu do tipo em 12/08 e VOLTOU no mesmo dia, e a razão mudou: antes ele
   * existia para a home não crescer com o acervo, o que o carrossel resolve
   * sozinho por ter altura fixa. Agora é EDITORIAL — o cliente pediu "os cinco
   * principais" na home e a lista inteira na página. Ou seja, o limite não
   * protege o layout, define uma curadoria.
   */
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
/** Ícone do eixo de tratamento. Do `lucide-react`, como os diferenciais — e
 *  distinto dos dois conjuntos já em uso, para nenhum ícone significar duas
 *  coisas em seções diferentes da mesma página. */
export type TratamentoIcone = "avaliacao" | "reabilitacao" | "estetica";

export type TratamentoEixo = {
  titulo: string;
  descricao: string;
  /** O que o eixo envolve. Renderiza em linha, separado por ponto médio. */
  inclui: string[];
  icone: TratamentoIcone;
};

export type TratamentosContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  eixos: TratamentoEixo[];
  /*
   * SEM `notaValor` e SEM `cta`, os dois removidos em 13/08 a pedido do cliente.
   * Não deixei os campos como opcionais: campo morto no tipo é convite a
   * reintroduzir o padrão, e neste tipo especificamente já foi assim uma vez —
   * `valorLabel`, `destaque` e `badge` existiam e sustentavam a tabela de preços
   * que a seção era. A política de orçamento vive em `descricao`.
   */
};

/**
 * Uma etapa da reabilitação, com o quadro que a mostra.
 *
 * A animação é uma SEQUÊNCIA DE QUADROS trocada pela rolagem, não um vídeo. Foi
 * decisão de 17/08 e tem três motivos, nenhum de gosto:
 *
 * - a ordem passa a ser CÓDIGO. O usuário pediu "um dente após o outro,
 *   começando de um lado, sem aparecer aleatoriamente", e ordenar objeto um a um
 *   é exatamente o que modelo de vídeo não faz — ele acende vários juntos ou fora
 *   de ordem. Aqui a ordem é o índice do array;
 * - peso: cinco imagens em WebP custam uma fração de um mp4 de 10s em 1080p, num
 *   bloco que abre no meio da home;
 * - custo de crédito: os quadros são o início e o fim de qualquer clipe, então
 *   existem de todo jeito. Os clipes seriam gasto adicional para entregar menos
 *   controle.
 */
export type ArcadaEtapa = {
  /** Nome da etapa. Aparece na régua ao lado da mídia. */
  rotulo: string;
  /** Uma linha dizendo o que acontece. Descreve PROCEDIMENTO, nunca resultado. */
  descricao: string;
  /**
   * O quadro desta etapa. `null` enquanto o arquivo não estiver no repo, e a
   * etapa cai no slot nomeado — mesmo padrão da Estrutura. Caixa cinza lisa lê
   * como site quebrado; slot com textura e rótulo lê como deliberado.
   */
  src: string | null;
  /** O que a imagem É. Nunca afirmar que é caso de paciente. */
  alt: string;
};

export type ArcadaContent = {
  titulo: string;
  descricao: string;
  /** Rótulo do slot enquanto faltam os arquivos. Nome, não número. */
  slotRotulo: string;
  /** As etapas na ordem da rolagem. O primeiro quadro é o estado de repouso. */
  etapas: ArcadaEtapa[];
  /**
   * ⚠️ Obrigatório na tela, não é rodapé de cortesia. A peça é um modelo
   * anatômico em 3D e o aviso é o que impede que ela seja lida como registro de
   * paciente — mesmo tratamento dado às cinco imagens de Casos em 13/08.
   */
  aviso: string;
};

export type BioMembro = {
  nome: string;
  /**
   * ⚠️ O CRO ESTÁ NO CONTEÚDO MAS NÃO É EXIBIDO desde 13/08, por pedido do
   * usuário: "tirar o CRO de cada um deles, manter apenas a especialidade".
   *
   * O campo FICA, e é de propósito: a Resolução CFO-196/2019 exige nome e número
   * de inscrição no CRO na divulgação de cirurgião-dentista, e o site só mostra
   * CRO do responsável técnico (no hero e no título desta seção). Voltar a exibir
   * é uma linha no cartão de `CorpoClinicoEsteira.tsx` — apagar o dado do
   * conteúdo tornaria isso uma coleta nova.
   *
   * Enquanto a clínica não fornecer, os dois seguem em placeholder nomeado.
   */
  cro: string;
  /** Especialidade registrada. É o que aparece embaixo do nome. */
  especialidade: string;
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
  /** Linha curta abaixo do `corpoClinicoLabel`, acima da esteira de retratos.
   *  Descreve o que a seção mostra — não é chamada nem promessa. */
  corpoClinicoNota: string;
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

/**
 * Convite à avaliação, em faixa escura depois da Localização.
 *
 * Era `ctaTitulo`/`ctaDescricao`/`ctaBotao` dentro de `FooterContent`, e saiu de
 * lá em 12/08 junto com o bloco: seção própria tem conteúdo próprio, senão o
 * rodapé continua dono do texto de uma seção que não é ele.
 */
export type ChamadaFinalContent = {
  titulo: string;
  descricao: string;
  cta: Cta;
};

export type FooterContent = {
  colunaContatoLabel: string;
  /** Rótulo único, para quando `telefone` e `whatsapp` são o mesmo número. Mesma
   *  regra da Localização, e existe aqui também porque cada seção guarda os
   *  próprios rótulos — o rodapé não lê os da outra. */
  telefoneWhatsappLabel: string;
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
  arcada: ArcadaContent;
  bio: BioContent;
  faq: FaqContent;
  chamadaFinal: ChamadaFinalContent;
  footer: FooterContent;
};
