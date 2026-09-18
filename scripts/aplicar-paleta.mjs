/**
 * Aplica uma das paletas de docs/paletas/ no SITE, e desfaz.
 *
 * O bloco entra no FIM de src/styles.css, delimitado por marcas, e redefine os
 * tokens do `:root` original — que fica INTACTO logo acima, com todos os
 * comentários de proveniência da medição de 30/07. Voltar é apagar o bloco.
 *
 * Por que funciona: o `@theme inline` mapeia `--color-accent: var(--accent)`,
 * ou seja guarda a REFERÊNCIA e não o valor. Redefinir `--accent` num `:root`
 * posterior chega em todo utilitário do Tailwind, em runtime.
 *
 * As regras de tratamento de imagem vêm prefixadas por `.paleta-x` no arquivo
 * de origem (é assim que o comparador injeta as quatro na mesma página); aqui
 * o prefixo é removido, porque no site a paleta não é uma variante, é a única.
 *
 *   node scripts/aplicar-paleta.mjs a       aplica a paleta A
 *   node scripts/aplicar-paleta.mjs d       troca para a D
 *   node scripts/aplicar-paleta.mjs --sair  volta para a paleta em vigor
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const ALVO = "src/styles.css";
const ABRE = "/* ===== PALETA EM TESTE — INÍCIO (gerado por scripts/aplicar-paleta.mjs) ===== */";
const FECHA = "/* ===== PALETA EM TESTE — FIM ===== */";

const arg = (process.argv[2] ?? "").toLowerCase();
const css = readFileSync(ALVO, "utf8");

// remove um bloco anterior, se houver — trocar de paleta nunca empilha duas
const i = css.indexOf(ABRE);
const j = css.indexOf(FECHA);
const limpo = i >= 0 && j > i ? (css.slice(0, i) + css.slice(j + FECHA.length)).replace(/\n{3,}$/, "\n") : css;

if (arg === "--sair" || arg === "") {
  writeFileSync(ALVO, limpo);
  console.log(arg ? "Paleta em teste removida. O site voltou à paleta em vigor." : "Uso: node scripts/aplicar-paleta.mjs <letra|--sair>");
  process.exit(0);
}

const arquivos = readdirSync("docs/paletas").filter((f) => f.endsWith(".css"));
const arquivo = arquivos.find((f) => f.startsWith(arg + "-"));
if (!arquivo) {
  console.error(`Não achei paleta "${arg}". Disponíveis: ${arquivos.map((f) => f[0]).join(", ")}`);
  process.exit(1);
}

const bruto = readFileSync(`docs/paletas/${arquivo}`, "utf8");
const nome = (bruto.match(/PALETA [A-Z] — (.+)/) || [, arquivo])[1].trim();
// `.paleta-x .bg-ink` -> `.bg-ink`, `.paleta-x img` -> `img`
const corpo = bruto.replace(new RegExp(`\\.paleta-${arg}\\s+`, "g"), "");

const bloco = `
${ABRE}
/* Paleta ${arg.toUpperCase()} (${nome}) em teste no site, a pedido do usuário.
   O \`:root\` original continua acima, inteiro — este bloco só o sobrescreve.
   Desfazer: node scripts/aplicar-paleta.mjs --sair
   Trocar:   node scripts/aplicar-paleta.mjs <outra letra> */

${corpo.trim()}
${FECHA}
`;

writeFileSync(ALVO, limpo.replace(/\n*$/, "\n") + bloco);
console.log(`Paleta ${arg.toUpperCase()} (${nome}) aplicada em ${ALVO}.`);
