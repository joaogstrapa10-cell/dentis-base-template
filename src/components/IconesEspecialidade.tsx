import type { AreaIcone } from "@/content/types";

/**
 * Os oito ícones das especialidades, desenhados aqui e não importados.
 *
 * Motivo: o `lucide-react`, única biblioteca de ícones do projeto, não tem
 * nenhum ícone dental — e o `@tabler/icons-react` tem três (`dental`,
 * `dental-broken`, `dental-off`), o que resolveria três das oito e deixaria
 * cinco especialidades com ícone genérico. Ícone genérico em especialidade
 * clínica não informa nada: é enfeite ocupando o lugar de informação.
 *
 * Todos seguem o mesmo sistema, e é ele que faz os oito lerem como um conjunto:
 * caixa 24×24, traço de 1.5 em `currentColor`, ponta e junta arredondadas,
 * nenhum preenchimento. Sem preenchimento é o que os mantém leves ao lado de
 * texto — ícone sólido pesa mais que a linha do título que ele acompanha.
 *
 * Renderizam a 28px, não a 24: desenhados e postos na página a 24px, os quatro
 * que usam a silhueta de dente viravam rabisco, porque a silhueta tem coroa,
 * duas raízes e uma marca interna. 28px é o menor tamanho em que a marca interna
 * ainda se distingue da raiz.
 *
 * A restrição de conteúdo do projeto também vale para desenho: nada de dente
 * brilhando nem de sorriso genérico. Os quatro ícones que usam `DENTE` usam a
 * MESMA silhueta, o que evita oito interpretações diferentes do mesmo objeto na
 * mesma tela; o que muda entre eles é só a marca clínica por dentro — lâmina,
 * canal, linha de gengiva.
 *
 * Harmonização Facial e Reabilitação Oral são diagramas, não pictogramas: um é o
 * contorno do rosto com o eixo de proporção, o outro é a arcada em banda.
 * Desenhar rosto de perfil em 28px vira caricatura, e caricatura é o clichê que
 * a §4 do CLAUDE.md proíbe.
 *
 * ⚠️ Ao mexer em `DENTE`, conferir que o path FECHA em (12,3), simétrico. A
 * primeira versão fechava em x≈6,8: o lado direito nunca era desenhado, a
 * silhueta virava um blob torto, e o defeito só apareceu ao renderizar os
 * ícones a 64px num quadro isolado — a 24px, na página, passava por "ícone
 * pequeno". Renderizar grande antes de aprovar desenho.
 */

const TRACO = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Silhueta de dente compartilhada: coroa larga (x de 6 a 18), duas raízes e o
 * entalhe entre elas. Simétrica em torno de x=12.
 */
const DENTE =
  "M6 9C6 5.4 8.6 3 12 3s6 2.4 6 6c0 1.9-.7 3.3-1.2 4.8-.6 1.9-1 4-1.3 5.9-.2 1-.6 1.7-1.2 1.7-.7 0-1.1-.9-1.2-2-.2-1.7-.4-3.2-1.1-3.2s-.9 1.5-1.1 3.2c-.1 1.1-.5 2-1.2 2-.6 0-1-.7-1.2-1.7-.3-1.9-.7-4-1.3-5.9C6.7 12.3 6 10.9 6 9Z";

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      aria-hidden="true"
      focusable="false"
      {...TRACO}
    >
      {children}
    </svg>
  );
}

/** Implantodontia e Cirurgia: coroa sobre pino rosqueado. */
function Implante() {
  return (
    <Base>
      <path d="M6.9 4.4c0-.6.5-1.1 1.1-1.1h8c.6 0 1.1.5 1.1 1.1l-.7 4.6c-.1.6-.6 1-1.2 1H8.8c-.6 0-1.1-.4-1.2-1L6.9 4.4Z" />
      <path d="M9.4 10.4 11.4 20.9M14.6 10.4 12.6 20.9" />
      <path d="M9.9 13.6h4.2M10.4 16.8h3.2" />
    </Base>
  );
}

/** Estética Dental: a lâmina sobre a face vestibular do dente. */
function Faceta() {
  return (
    <Base>
      <path d={DENTE} />
      <path d="M8.1 8c2.3-1.7 5.5-1.7 7.8 0" />
    </Base>
  );
}

/** Endodontia: o canal central até a raiz. Um canal, não dois — dois fios a 1px
 *  de distância viram borrão no tamanho de uso. */
function Canal() {
  return (
    <Base>
      <path d={DENTE} />
      <path d="M12 8.2v7.4" />
    </Base>
  );
}

/** Harmonização Facial: contorno do rosto, eixo e marcas de proporção. As marcas
 *  NÃO atravessam: atravessando, o ícone lia como globo. */
function Face() {
  return (
    <Base>
      <path d="M12 2.9c3.4 0 6.1 2.7 6.1 6.6 0 3.1-1 5.8-2.7 7.7-1 1.2-2.2 2-3.4 2s-2.4-.8-3.4-2C7 15.3 5.9 12.6 5.9 9.5c0-3.9 2.7-6.6 6.1-6.6Z" />
      <path d="M12 4v14.6" />
      <path d="M6.5 8.8h2.3M15.2 8.8h2.3" />
    </Base>
  );
}

/** Ortodontia: arco com fio e três braquetes. */
function Aparelho() {
  return (
    <Base>
      <path d="M2.9 6.9c0 6.7 4.1 11.4 9.1 11.4s9.1-4.7 9.1-11.4" />
      <path d="M4 10.9h16" />
      <path d="M6.6 9.2h2.6v3.4H6.6zM10.7 9.2h2.6v3.4h-2.6zM14.8 9.2h2.6v3.4h-2.6z" />
    </Base>
  );
}

/** Odontopediatria: dentição mista — o permanente e o de leite ao lado. */
function Infantil() {
  return (
    <Base>
      <g transform="translate(-2.2 1.6) scale(0.74)">
        <path d={DENTE} />
      </g>
      <g transform="translate(9.6 9.4) scale(0.44)">
        <path d={DENTE} />
      </g>
    </Base>
  );
}

/** Periodontia: a linha de gengiva cruzando o colo do dente. */
function Gengiva() {
  return (
    <Base>
      <path d={DENTE} />
      <path d="M3.2 14c2.7-1.9 5.5-2.4 8.8-2.4s6.1.5 8.8 2.4" />
    </Base>
  );
}

/** Reabilitação Oral: a arcada inteira, em banda. Dois arcos concêntricos, e não
 *  arco com marcas radiais — as marcas viravam sujeira no tamanho de uso. */
function Arcada() {
  return (
    <Base>
      <path d="M2.6 6.4c0 7.4 4.2 12.6 9.4 12.6s9.4-5.2 9.4-12.6" />
      <path d="M6.4 7.2c0 4.6 2.5 7.8 5.6 7.8s5.6-3.2 5.6-7.8" />
    </Base>
  );
}

const MAPA: Record<AreaIcone, () => React.ReactElement> = {
  implante: Implante,
  faceta: Faceta,
  canal: Canal,
  face: Face,
  aparelho: Aparelho,
  infantil: Infantil,
  gengiva: Gengiva,
  arcada: Arcada,
};

export function IconeEspecialidade({ nome }: { nome: AreaIcone }) {
  const Icone = MAPA[nome];
  return <Icone />;
}
