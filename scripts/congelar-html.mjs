/**
 * Congela uma rota do site num ÚNICO arquivo .html, para abrir sem servidor e sem
 * link — pedido do usuário em 13/08 ("consegue gerar uma página html do layout ao
 * invés de link?").
 *
 * COMO RODAR
 *
 *   bun run build                                     # gera o CSS compilado
 *   bunx vite dev --host 127.0.0.1 --port 4176 &      # o --host é obrigatório
 *   node scripts/congelar-html.mjs [pasta-de-saida]   # padrão: ./snapshots
 *
 * Precisa de `playwright-core` e do Chromium do ambiente (o caminho está em
 * CHROMIUM abaixo). Não é dependência do app — é ferramenta de mão, roda avulsa.
 * A pasta de saída está no .gitignore: o HTML congelado tem alguns MB de imagens
 * embutidas e não deve entrar no repo (nem ir para o sync do Lovable).
 *
 * Receita, e cada passo existe por um motivo medido:
 *
 * 1. Renderiza no Chromium e rola até o fim DEVAGAR (~320ms por passo), para os
 *    IntersectionObserver do `Reveal` dispararem. Sem isso o snapshot sai com
 *    metade da página em opacity 0 — já custou dois falsos positivos nesta sessão.
 * 2. O CSS NÃO vem do DOM. Em dev o TanStack Start emite
 *    `<link rel="stylesheet" href="/src/styles.css">`, que num arquivo local dá
 *    404: a primeira versão deste script gerou um HTML sem uma regra de estilo,
 *    fonte Times New Roman e fundo transparente. O CSS entra do BUILD
 *    (`.output/public/assets/styles-*.css`, já compilado pelo Tailwind), inline
 *    num <style>.
 * 3. Cada imagem é embutida UMA vez num mapa de data URIs aplicado por um script
 *    inline — não por ocorrência: a esteira de estrutura duplica as 12 fotos e
 *    embutir por ocorrência dobraria o arquivo.
 * 4. `loading="lazy"` sai. Num arquivo local não há o que economizar, e imagem
 *    lazy fora da viewport nem decodifica — foi o que deixou 5 das 7 imagens de
 *    /casos "quebradas" na primeira tentativa.
 * 5. Todo <link href="/..."> sai (preload de imagem, modulepreload, favicon):
 *    aponta para caminho de servidor e só gera erro no console.
 *
 * Fica de fora de propósito, e não é defeito:
 * - os scripts do app. É SSR, o HTML já vem pronto e o layout não depende deles.
 *   Consequência: o arraste da galeria de casos, o accordion do FAQ e o menu do
 *   mobile não respondem no arquivo. É um snapshot de layout, não o site.
 * - a fonte: o <link> do Google Fonts FICA, com URL absoluta. Aqui é bloqueado
 *   pela egress policy, então o screenshot de verificação sai com fonte de
 *   sistema; na máquina do usuário carrega a Instrument Sans.
 * - o iframe do mapa: mesma coisa, URL absoluta do Google, funciona lá.
 */
import { readFileSync, writeFileSync, statSync, readdirSync, mkdirSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const CHROMIUM = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const SERVIDOR = "http://127.0.0.1:4176";

/* `playwright-core` NÃO é dependência deste projeto, e não deve virar uma: ela
   baixa navegador na instalação e o Lovable roda `install` a cada sync. Então o
   import é dinâmico, e o caminho pode vir por env:
     PLAYWRIGHT_CORE=/algum/lugar/node_modules/playwright-core node scripts/... */
const { chromium } = await (async () => {
  const alvo = process.env.PLAYWRIGHT_CORE;
  try {
    if (!alvo) return await import("playwright-core");
    /* `import()` de um DIRETÓRIO não resolve em ESM — precisa do arquivo de
       entrada. `createRequire` resolve pelo package.json, e playwright-core é
       CJS, então isto funciona para os dois formatos. */
    const { createRequire } = await import("node:module");
    return createRequire(join(alvo, "package.json"))(alvo);
  } catch {
    throw new Error(
      "playwright-core não resolvido. Instale numa pasta avulsa (`bun add playwright-core`) e aponte com PLAYWRIGHT_CORE=/caminho/node_modules/playwright-core",
    );
  }
})();

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const RAIZ = join(REPO, "public");
const OUT = process.argv[2] ?? join(REPO, "snapshots");
mkdirSync(OUT, { recursive: true });

const TIPOS = {
  ".webp": "image/webp",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

// CSS compilado do build.
const dirAssets = join(REPO, ".output/public/assets");
const nomeCss = readdirSync(dirAssets).filter((f) => f.startsWith("styles-") && f.endsWith(".css"))[0];
if (!nomeCss) throw new Error("CSS do build não encontrado — rodar `vite build` antes");
let css = readFileSync(join(dirAssets, nomeCss), "utf8");
console.log(`CSS do build: ${nomeCss} (${Math.round(css.length / 1024)} KB)`);

/* ⚠️ As fontes SERVIDAS DO REPO viram data URI, senão o @font-face aponta para
   `file:///fontes/...` num arquivo local e o navegador devolve 404 — SEM ERRO
   VISÍVEL, só a fonte de reserva no lugar. Hoje é a Qwitcher Grypen, que é a
   assinatura do Dr. Dalton na tela de entrada: é justamente a peça em que a
   troca de fonte salta aos olhos.
   O <link> do Google Fonts continua com URL absoluta, e isso é de propósito —
   embutir a Instrument Sans inteira engordaria o arquivo em centenas de KB, e
   na máquina de quem abre o snapshot o Google Fonts carrega. */
for (const arq of readdirSync(join(RAIZ, "fontes")).filter((f) => f.endsWith(".woff2"))) {
  const b64 = readFileSync(join(RAIZ, "fontes", arq)).toString("base64");
  const antes = css.length;
  css = css.replaceAll(`url("/fontes/${arq}")`, `url("data:font/woff2;base64,${b64}")`)
           .replaceAll(`url(/fontes/${arq})`, `url("data:font/woff2;base64,${b64}")`);
  console.log(`  fonte embutida: ${arq}` + (css.length === antes ? "  ⚠️ NENHUMA ocorrência no CSS" : ""));
}

const b = await chromium.launch({
  executablePath: CHROMIUM,
  args: ["--no-sandbox"],
});

async function congelar(rota, arquivo, titulo) {
  const p = await b.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1 });
  await p.goto(`${SERVIDOR}${rota}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1600);

  const passos = await p.evaluate(() => Math.ceil(document.documentElement.scrollHeight / 600));
  for (let i = 0; i < passos + 4; i++) {
    await p.mouse.wheel(0, 600);
    await p.waitForTimeout(320);
  }
  await p.waitForTimeout(900);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);

  /* A ÓRBITA do corpo clínico tem a abertura comandada pela rolagem, e o estado
     dela vive em estilo inline escrito pelo React. Voltando ao topo, ela é
     serializada FECHADA — um aglomerado de retratos, que não é o que a seção
     mostra. Aqui a página é levada até o ponto em que a órbita está aberta e
     serializada ali: a posição de rolagem não vai para o arquivo, mas o estilo
     inline vai. Sem JS no arquivo congelado, é este estado que fica. */
  await p.evaluate(() => {
    const palco = document.querySelector("#responsavel .sticky");
    if (!palco) return;
    const trilho = palco.parentElement;
    const r = trilho.getBoundingClientRect();
    window.scrollTo(0, r.top + window.scrollY + (r.height - window.innerHeight));
  });
  await p.waitForTimeout(900);

  const presos = await p.evaluate(
    () =>
      [...document.querySelectorAll("main *, footer *")].filter((el) => {
        const s = getComputedStyle(el);
        return +s.opacity === 0 && el.getBoundingClientRect().height > 0 && !el.className?.toString?.().includes("opacity-0") && !el.className?.toString?.().includes("carta-pilha");
      }).length,
  );

  const srcs = await p.evaluate(() =>
    [...new Set([...document.querySelectorAll("img[src]")].map((i) => i.getAttribute("src")))],
  );

  const mapa = {};
  let bytes = 0;
  for (const src of srcs) {
    if (!src.startsWith("/")) continue;
    const tipo = TIPOS[extname(src).toLowerCase()];
    if (!tipo) { console.log("  tipo desconhecido:", src); continue; }
    const buf = readFileSync(join(RAIZ, decodeURIComponent(src)));
    bytes += buf.length;
    mapa[src] = `data:${tipo};base64,${buf.toString("base64")}`;
  }

  const html = await p.evaluate(({ tit, folha }) => {
    document.querySelectorAll("script").forEach((s) => s.remove());
    // Todo link de caminho de servidor: stylesheet de dev, modulepreload,
    // preload de imagem, favicon.
    document.querySelectorAll("link[href^='/']").forEach((l) => l.remove());
    document.querySelectorAll("img[loading]").forEach((i) => i.removeAttribute("loading"));

    /* O src original sai do atributo `src` e vira `data-congelado`, com um GIF
       transparente de 1px no lugar. Sem isso o navegador dispara uma requisição
       para cada `/imagens/...` no momento em que lê a tag — antes de o script do
       fim do body trocar pelo data URI. O resultado final ficava certo, mas com
       29 erros no console e um piscar de ícone de imagem quebrada. */
    document.querySelectorAll("img[src^='/']").forEach((i) => {
      i.setAttribute("data-congelado", i.getAttribute("src"));
      i.setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
    });

    /* A MARCA é `fixed` no site e se apaga nos primeiros 180px de rolagem, por
       JS. Sem JS ela ficaria fixa e opaca por cima das seções CLARAS, e o logo é
       branco — vira um borrão branco no branco, que lê como defeito. No arquivo
       congelado ela volta a ser `absolute`, que é o comportamento que o
       desaparecimento imita: fica no bloco escuro do hero e sai de cena com ele. */
    const marca = document.querySelector("a[href='#top'].fixed, header a[href='#top']");
    if (marca) {
      marca.style.position = "absolute";
      marca.style.opacity = "1";
    }

    const t = document.querySelector("title");
    if (t) t.textContent = tit;
    const st = document.createElement("style");
    st.textContent = folha;
    document.head.appendChild(st);
    return document.documentElement.outerHTML;
  }, { tit: titulo, folha: css });

  const injecao = `<script>
/* Imagens embutidas: um data URI por ARQUIVO, não por ocorrência — a esteira de
   estrutura repete as 12 fotos, e embutir duas vezes dobraria o arquivo. */
(function () {
  var M = ${JSON.stringify(mapa)};
  document.querySelectorAll("img[data-congelado]").forEach(function (i) {
    var d = M[i.getAttribute("data-congelado")];
    if (d) i.setAttribute("src", d);
  });
})();
</script>`;

  const final = `<!doctype html>\n${html.replace("</body>", `${injecao}\n</body>`)}`;
  const destino = join(OUT, arquivo);
  writeFileSync(destino, final, "utf8");
  console.log(
    `${arquivo}  ${Math.round(statSync(destino).size / 1024)} KB  (${srcs.length} imagens, ${Math.round(bytes / 1024)} KB de binário)  presos_em_opacidade=${presos}`,
  );
  await p.close();
}

/* Se há paleta em teste, ela entra no NOME e no TÍTULO dos dois arquivos.
   Sem isso, testar duas paletas seguidas produz dois pares de arquivos com
   nomes idênticos: o segundo sobrescreve o primeiro, ou os dois se confundem
   na pasta de quem recebeu. */
const emTeste = (readFileSync("src/styles.css", "utf8")
  .match(/Paleta ([A-Z]) \(([^)]+)\) em teste/) || []);
const sufixoArq = emTeste[1] ? `-paleta-${emTeste[1]}` : "";
const sufixoTit = emTeste[1] ? ` · paleta ${emTeste[1]} (${emTeste[2].toLowerCase()})` : "";
if (emTeste[1]) console.log(`Paleta em teste detectada: ${emTeste[1]} — ${emTeste[2]}`);

await congelar("/", `suzuki-layout${sufixoArq}-home.html`, `Suzuki Odontologia — layout (home)${sufixoTit}`);
await congelar("/casos", `suzuki-layout${sufixoArq}-casos.html`, `Suzuki Odontologia — layout (casos clínicos)${sufixoTit}`);
await b.close();
