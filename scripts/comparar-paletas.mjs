/**
 * Aplica cada paleta de docs/paletas/ no SITE REAL e devolve:
 *   1. screenshots de quatro telas por paleta (não amostras de cor);
 *   2. uma tira com os três estados do botão, no componente real da página;
 *   3. contact sheets — as quatro variantes lado a lado, por tela;
 *   4. a tabela de contraste, medida por RASTERIZAÇÃO.
 *
 * ⚠️ Por que rasterizar: os tokens são `oklch(...)`, e `getComputedStyle`
 * devolve a string. Ler os três números dela como se fossem RGB dá cor
 * inventada (custou uma rodada em 21/08), e `ctx.fillStyle = "oklch(...)"`
 * PRESERVA a string em vez de converter. O único jeito que funciona é pintar
 * num canvas e ler o pixel com `getImageData` — e, para cor com alfa, pintar o
 * fundo ANTES, senão o canvas transparente lê quase-preto.
 *
 * Uso:  node scripts/comparar-paletas.mjs            (espera o dev em :4182)
 */
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:4182";
const EXEC = process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const SAIDA = process.env.SAIDA ?? "./snapshots/paletas";
mkdirSync(SAIDA, { recursive: true });

const PALETAS = [
  { id: "atual", nome: "ATUAL — verde + branco", css: "" },
  { id: "a", nome: "A — grafite + um sinal", css: readFileSync("docs/paletas/a-grafite.css", "utf8") },
  { id: "b", nome: "B — areia + bronze", css: readFileSync("docs/paletas/b-areia.css", "utf8") },
  { id: "c", nome: "C — noturno", css: readFileSync("docs/paletas/c-noturno.css", "utf8") },
];

/* As quatro telas cobrem os quatro contextos de cor do site: bloco escuro
   sangrado, página clara com foto, painel escuro dentro de seção clara, e
   faixa escura com retratos. Uma paleta que funciona nos quatro funciona. */
const TELAS = [
  { id: "hero", ancora: "#top", alt: 900 },
  { id: "casos", ancora: "#casos", alt: 1000 },
  { id: "areas", ancora: "#areas", alt: 900 },
  { id: "bio", ancora: "#responsavel", alt: 950 },
];

const PARES = (t) => [
  ["Texto na página", t.foreground, t.background, 4.5],
  ["Texto secundário na página", t.muted, t.background, 4.5],
  ["Texto no cartão", t.foreground, t.surface, 4.5],
  ["Texto no bloco escuro", t["ink-foreground"], t.ink, 4.5],
  ["Texto secundário no bloco", t["ink-muted"], t.ink, 4.5],
  ["Accent como ícone na página", t.accent, t.background, 3],
  ["Texto sobre o accent", t["accent-foreground"], t.accent, 4.5],
  ["Dourado sobre o bloco escuro", t.gold, t.ink, 3],
  /* Sobre a PÁGINA o dourado só pode passar numa paleta de campo escuro. Numa
     de campo claro ele TEM de reprovar — é a regra de 30/07, e o teste existe
     para flagrar o dia em que alguém puser dourado como texto no claro. */
  ["Dourado sobre a página", t.gold, t.background, 3],
  ["Botão escuro: rótulo", t["ink-foreground"], t.ink, 4.5],
  ["Botão escuro: rótulo no hover", t["ink-foreground"], t["ink-elevated"], 4.5],
  ["Botão claro: rótulo", t.foreground, t.surface, 4.5],
  ["Botão claro: rótulo no hover", t.foreground, t["surface-raised"], 4.5],
  ["Botão desabilitado: rótulo", t["disabled-foreground"], t["disabled-surface"], 4.5],
  /* ⚠️ `--border` e `--ink-border` são DIVISOR decorativo, e a WCAG 1.4.11
     isenta decoração: o número sai no relatório para comparar as paletas entre
     si, não como aprovação. Alvo 0 = "medir, não julgar".
     `--border-strong` é outra coisa: é o contorno das SETAS da galeria, que
     são botão sem fundo. Ali o fio é a única fronteira do controle, então
     valem os 3:1 de não-texto. */
  ["Divisor na página (informativo)", t.border, t.background, 0],
  ["Contorno de botão sem fundo", t["border-strong"], t.background, 3],
  ["Divisor no bloco escuro (informativo)", t["ink-border"], t.ink, 0],
];

const b = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const relatorio = [];

for (const p of PALETAS) {
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  // AFIRMA que carregou por uma condição do conteúdo, nunca por cronômetro
  await page.waitForFunction(() => !!document.querySelector("#casos"));
  await page.waitForTimeout(3600);            // restauração de rolagem do TanStack
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  if (p.css) {
    await page.addStyleTag({ content: p.css });
    await page.evaluate((id) => document.documentElement.classList.add("paleta-" + id), p.id);
  }

  // --- confirma que o CSS NOVO chegou, antes de acreditar em qualquer leitura
  const servido = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--background").trim());

  // --- telas reais
  for (const tela of TELAS) {
    const y = await page.evaluate((a) => {
      const el = document.querySelector(a);
      return el ? el.getBoundingClientRect().top + scrollY : 0;
    }, tela.ancora);
    for (let i = 0; i < 2; i++) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(700); }
    await page.screenshot({ path: join(SAIDA, `${tela.id}--${p.id}.png`), clip: { x: 0, y: 0, width: 1440, height: tela.alt } });
  }

  // --- os TRÊS ESTADOS do botão, no componente real da página
  await page.evaluate((v) => scrollTo(0, v), 0);
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const cta = [...document.querySelectorAll("#top a")].find((a) => /agendar|avalia/i.test(a.textContent));
    if (!cta) return;
    const faixa = document.createElement("div");
    faixa.id = "tira-estados";
    faixa.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;gap:28px;align-items:center;" +
      "justify-content:center;padding:34px 20px;background:var(--background);border-top:1px solid var(--border)";
    /* ⚠️ O hover DEPENDE DO TOM do botão, e errar isso pinta a pílula clara com
       o token da escura — foi o que a primeira rodada mostrou. O CTA do hero é
       `tone="light"` (pílula branca sobre o bloco), então o hover dele é
       `--surface-raised`; o `tone="ink"` é que usa `--ink-elevated`. Descobre
       por medição, não por suposição: compara o fundo computado com --surface. */
    const raiz = getComputedStyle(document.documentElement);
    const pinta = (v) => { const cv = document.createElement("canvas"); cv.width = cv.height = 4;
      const g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0,0,4,4);
      g.fillStyle = v; g.fillRect(0,0,4,4); return g.getImageData(2,2,1,1).data.join(","); };
    const claro = pinta(getComputedStyle(cta).backgroundColor) === pinta(raiz.getPropertyValue("--surface").trim());
    const temDesabilitado = raiz.getPropertyValue("--disabled-surface").trim() !== "";

    const rotulos = ["normal", "hover", temDesabilitado ? "desabilitado" : "desabilitado (não existe hoje)"];
    rotulos.forEach((r, i) => {
      const cel = document.createElement("div");
      cel.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:10px";
      const c = cta.cloneNode(true);
      c.removeAttribute("href");
      if (i === 1) { c.style.background = claro ? "var(--surface-raised)" : "var(--ink-elevated)"; }
      if (i === 2 && !temDesabilitado) { c.style.opacity = "0.35"; c.style.filter = "grayscale(1)"; }
      if (i === 2 && temDesabilitado) {
        c.style.background = "var(--disabled-surface)";
        c.style.color = "var(--disabled-foreground)";
        c.style.borderColor = "var(--disabled-border)";
        c.style.cursor = "not-allowed";
        c.setAttribute("aria-disabled", "true");
        c.querySelectorAll("svg, span > span").forEach((n) => (n.style.opacity = "0.55"));
      }
      const t = document.createElement("span");
      t.textContent = r;
      t.style.cssText = "font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)";
      cel.append(c, t);
      faixa.append(cel);
    });
    document.body.append(faixa);
  });
  await page.waitForTimeout(400);
  const caixa = await page.evaluate(() => {
    const r = document.querySelector("#tira-estados").getBoundingClientRect();
    return { x: 0, y: Math.round(r.top), width: 1440, height: Math.ceil(r.height) };
  });
  await page.screenshot({ path: join(SAIDA, `estados--${p.id}.png`), clip: caixa });

  // --- contraste, por rasterização
  const medidas = await page.evaluate(({ pares }) => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 8;
    const g = cv.getContext("2d", { willReadFrequently: true });
    const tok = (n) => getComputedStyle(document.documentElement).getPropertyValue("--" + n).trim();
    // pinta FUNDO opaco primeiro e a cor por cima: resolve alfa e evita o
    // falso quase-preto do canvas transparente
    const rgb = (cor, fundo) => {
      g.clearRect(0, 0, 8, 8);
      g.fillStyle = fundo || "#ffffff";
      g.fillRect(0, 0, 8, 8);
      g.fillStyle = cor;
      g.fillRect(0, 0, 8, 8);
      const d = g.getImageData(4, 4, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lum = ([r, gg, bb]) =>
      [r, gg, bb].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
        .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    return pares.map(([nome, corTok, fundoTok, alvo]) => {
      const fundoHex = rgb(tok(fundoTok));           // fundo resolvido sobre branco
      const fundoCss = `rgb(${fundoHex.join(",")})`;
      const c = rgb(tok(corTok), fundoCss);           // cor composta SOBRE o fundo
      const l1 = lum(c), l2 = lum(fundoHex);
      const r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return { nome, alvo, razao: Math.round(r * 100) / 100, passa: r >= alvo };
    });
  }, { pares: PARES(Object.fromEntries(
        ["background","foreground","surface","surface-raised","muted","border","border-strong",
         "ink","ink-elevated","ink-foreground","ink-muted","ink-border","accent","accent-foreground",
         "gold","disabled-surface","disabled-foreground"].map((k) => [k, k]))) });

  relatorio.push({ paleta: p.nome, id: p.id, servido, medidas });
  await page.close();
}

/* --- contact sheets: as quatro variantes da MESMA tela, lado a lado --------- */
const folha = await ctx.newPage();
await folha.setViewportSize({ width: 1200, height: 800 });
for (const tela of [...TELAS.map((t) => t.id), "estados"]) {
  const imgs = PALETAS.map((p) => ({
    rotulo: p.nome,
    b64: readFileSync(join(SAIDA, `${tela.id ?? tela}--${p.id}.png`)).toString("base64"),
  }));
  const fora = await folha.evaluate(async ({ imgs }) => {
    const carregadas = await Promise.all(imgs.map((i) => new Promise((res) => {
      const im = new Image(); im.onload = () => res(im); im.src = "data:image/png;base64," + i.b64;
    })));
    const L = 720, R = 46;
    const esc = L / carregadas[0].width;
    const alt = Math.round(carregadas[0].height * esc);
    const cv = document.createElement("canvas");
    cv.width = L * 2; cv.height = (alt + R) * 2;
    const g = cv.getContext("2d");
    g.fillStyle = "#101418"; g.fillRect(0, 0, cv.width, cv.height);
    carregadas.forEach((im, i) => {
      const x = (i % 2) * L, y = Math.floor(i / 2) * (alt + R);
      g.fillStyle = "#101418"; g.fillRect(x, y, L, R);
      g.fillStyle = "#e8eef2"; g.font = "600 19px system-ui, sans-serif";
      g.fillText(imgs[i].rotulo, x + 16, y + 30);
      g.drawImage(im, x, y + R, L, alt);
      g.strokeStyle = "#2a3238"; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, L - 2, alt + R - 2);
    });
    return cv.toDataURL("image/png").split(",")[1];
  }, { imgs });
  writeFileSync(join(SAIDA, `COMPARA-${tela.id ?? tela}.png`), Buffer.from(fora, "base64"));
}
await b.close();

/* --- relatório em texto ---------------------------------------------------- */
let out = "";
for (const r of relatorio) {
  out += `\n=== ${r.paleta}  (--background servido: ${r.servido}) ===\n`;
  const campoEscuro = r.id === "c";
  for (const m of r.medidas) {
    if (m.alvo === 0) { out += `  --   ${String(m.razao).padStart(6)}:1  (informativo)   ${m.nome}\n`; continue; }
    // dourado sobre a página: numa paleta clara TEM de reprovar, numa escura TEM de passar
    const esperado = /Dourado sobre a página/.test(m.nome) ? (campoEscuro ? m.passa : !m.passa) : m.passa;
    out += `${esperado ? "  ok  " : "  !!  "} ${String(m.razao).padStart(6)}:1  (alvo ${m.alvo}:1)  ${m.nome}\n`;
  }
}
writeFileSync(join(SAIDA, "contraste.txt"), out);
console.log(out);
console.log("\nArquivos em", SAIDA, "\n" + readdirSync(SAIDA).filter(f => f.startsWith("COMPARA")).join("\n"));
