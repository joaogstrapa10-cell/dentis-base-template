export type NavLink = { label: string; href: string };

export type Cta = { label: string; href: string };

export type BrandContent = {
  nome: string;
  wordmark: string;
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
  rotulo: string;
  alt: string;
};

export type EstruturaContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  ariaLabelComparador: string;
  comparadorLadoALabel: string;
  comparadorLadoBLabel: string;
  imagens: EstruturaSlot[];
};

export type HeroContent = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaPrimario: Cta;
  ctaSecundario: Cta;
  responsavelLinha: string;
};

export type SelosContent = {
  label: string;
  itens: string[];
};

export type DiferencialItem = {
  icon: "stethoscope" | "layers" | "clipboard-check" | "scan-face";
  titulo: string;
  descricao: string;
};

export type DiferenciaisContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  itens: DiferencialItem[];
};

export type EtapaAcompanhamento = {
  numero: string;
  titulo: string;
  descricao: string;
  estado: "concluido" | "em-andamento" | "previsto";
  estadoLabel: string;
};

export type AcompanhamentoContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  etapas: EtapaAcompanhamento[];
  painelTitulo: string;
  painelSubtitulo: string;
};

export type LocalizacaoContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  enderecoLabel: string;
  horarioLabel: string;
  telefoneLabel: string;
  whatsappLabel: string;
};

export type AreaAtuacao = {
  titulo: string;
  descricao: string;
  tags: string[];
};

export type AreasContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  itens: AreaAtuacao[];
};

export type Depoimento = {
  texto: string;
  autor: string;
};

export type DepoimentosContent = {
  eyebrow: string;
  titulo: string;
  itens: Depoimento[];
};

export type ComparativoLinha = {
  criterio: string;
  clinica: boolean;
  convencional: boolean;
};

export type ComparativoContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  colunaCriterio: string;
  colunaClinica: string;
  colunaConvencional: string;
  linhas: ComparativoLinha[];
  rodape: string;
};

export type TratamentoCard = {
  titulo: string;
  descricao: string;
  inclui: string[];
  valorLabel: string;
  cta: Cta;
  destaque?: boolean;
  badge?: string;
};

export type TratamentosContent = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  cards: TratamentoCard[];
};

export type BioMembro = {
  nomePlaceholder: string;
  retratoAlt: string;
};

export type BioContent = {
  eyebrow: string;
  nome: string;
  credencial: string;
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
  selos: SelosContent;
  diferenciais: DiferenciaisContent;
  acompanhamento: AcompanhamentoContent;
  localizacao: LocalizacaoContent;
  estrutura: EstruturaContent;
  areas: AreasContent;
  depoimentos: DepoimentosContent;
  comparativo: ComparativoContent;
  tratamentos: TratamentosContent;
  bio: BioContent;
  faq: FaqContent;
  footer: FooterContent;
};
