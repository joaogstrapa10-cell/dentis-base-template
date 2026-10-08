"""Gera o selo "30 anos de experiência" em SVG editável no Figma.

    pip install fonttools brotli uharfbuzz && python3 scripts/gerar-selo-svg.py


O "30" é o MESMO path/ellipse do componente, mantido como TRAÇO: no Figma isso
continua sendo vetor com espessura editável, e "outline stroke" é um clique se
ele quiser contornos. O script ("anos" e "de experiência") vira CONTORNO, porque
<text> com a Qwitcher Grypen só renderiza certo em quem tem a fonte instalada.

A forma do contorno sai da MESMA fonte do repo, moldada por HarfBuzz, que é o
mesmo moldador que o Chromium usa: ligaduras, alternantes contextuais e kerning
saem iguais aos do site. Conferido depois por diferença de pixel.
"""
import io, json, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
import uharfbuzz as hb

# caminhos relativos ao repo, para o script rodar de qualquer contêiner
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTE = f"{RAIZ}/public/fontes/qwitcher-grypen-700-latin.woff2"
SAIDA = f"{RAIZ}/docs/marca"

# ---- geometria, a MESMA do SeloAnos.tsx ------------------------------------
VIEWBOX = (29.5, -4.5, 457.0, 278.5)
TRACO_TRES = (
    "M 44 40 C 44 18 70 10 100 10 C 136 10 152 30 152 54 C 152 76 134 88 108 88 "
    "C 138 88 158 102 158 128 C 158 154 134 168 100 168 C 66 168 44 156 44 136"
)
ZERO = dict(cx=236, cy=89, rx=78, ry=79)
ESPESSURA = 21
TEXTOS = [
    dict(id="palavra-anos", texto="anos", x=326.0, y=150.0, tam=132.0, ancora="start"),
    dict(id="linha-de-experiencia", texto="de experiência", x=258.0, y=241.0, tam=96.0, ancora="middle"),
]

# ---- woff2 -> ttf (o HarfBuzz não descomprime woff2) -----------------------
tt = TTFont(FONTE)
tt.flavor = None
buf_ttf = io.BytesIO()
tt.save(buf_ttf)
dados_ttf = buf_ttf.getvalue()
upem = tt["head"].unitsPerEm
glifos = tt.getGlyphSet()
nomes = tt.getGlyphOrder()

face = hb.Face(dados_ttf)
hbfont = hb.Font(face)

def contorno(spec):
    """Molda o texto e devolve (d do path, avanço total em unidades do viewBox)."""
    buf = hb.Buffer()
    buf.add_str(spec["texto"])
    buf.guess_segment_properties()
    hb.shape(hbfont, buf)                      # features padrão: as mesmas do navegador
    infos, poss = buf.glyph_infos, buf.glyph_positions
    s = spec["tam"] / upem
    avanco = sum(p.x_advance for p in poss) * s
    x0 = spec["x"] - (avanco / 2 if spec["ancora"] == "middle" else 0)
    y0 = spec["y"]

    pen_x = pen_y = 0
    partes = []
    for info, pos in zip(infos, poss):
        nome = nomes[info.codepoint]           # codepoint aqui é GLYPH ID depois do shape
        # eixo y da fonte é para CIMA, o do SVG é para BAIXO -> escala negativa em y
        t = Transform(s, 0, 0, -s,
                      x0 + (pen_x + pos.x_offset) * s,
                      y0 - (pen_y + pos.y_offset) * s)
        caneta = SVGPathPen(glifos, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
        glifos[nome].draw(TransformPen(caneta, t))
        d = caneta.getCommands()
        if d:
            partes.append(d)
        pen_x += pos.x_advance
        pen_y += pos.y_advance
    return " ".join(partes), avanco

saida = {}
for spec in TEXTOS:
    d, avanco = contorno(spec)
    saida[spec["id"]] = dict(d=d, avanco=round(avanco, 2), glifos=len(d.split("M")) - 1)

# ---- montagem do arquivo ---------------------------------------------------
CABECA = """<?xml version="1.0" encoding="UTF-8"?>
<!--
  Suzuki Odontologia · selo "30 anos de experiência"
  Lettering desenhado para a tela de entrada do site. Monocromático de propósito:
  trocar a cor no Figma é um clique.

  O "30" é TRAÇO vetorial (espessura {esp}), então a espessura continua editável.
  Para transformá-lo em contorno no Figma: selecionar e Object > Outline stroke.
  "anos" e "de experiência" JÁ SÃO contornos da Qwitcher Grypen (OFL), para não
  dependerem da fonte estar instalada.
-->
"""

def arquivo(cor, rotulo):
    L = []
    L.append(CABECA.format(esp=ESPESSURA))
    L.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEWBOX[0]} {VIEWBOX[1]} {VIEWBOX[2]} {VIEWBOX[3]}"'
        f' width="{VIEWBOX[2]:g}" height="{VIEWBOX[3]:g}"'
        f' role="img" aria-label="30 anos de experiência">'
    )
    L.append(f'  <title>30 anos de experiência · Suzuki Odontologia ({rotulo})</title>')
    L.append(f'  <g id="selo-30-anos">')
    L.append(f'    <g id="numero-30">')
    L.append(
        f'      <path id="algarismo-3" d="{TRACO_TRES}" fill="none" stroke="{cor}" stroke-width="{ESPESSURA}"'
        f' stroke-linecap="round" stroke-linejoin="round"/>'
    )
    L.append(
        f'      <ellipse id="algarismo-0" cx="{ZERO["cx"]}" cy="{ZERO["cy"]}" rx="{ZERO["rx"]}"'
        f' ry="{ZERO["ry"]}" fill="none" stroke="{cor}" stroke-width="{ESPESSURA}"/>'
    )
    L.append(f'    </g>')
    for spec in TEXTOS:
        L.append(f'    <path id="{spec["id"]}" d="{saida[spec["id"]]["d"]}" fill="{cor}"/>')
    L.append(f'  </g>')
    L.append("</svg>")
    return "\n".join(L) + "\n"

os.makedirs(SAIDA, exist_ok=True)
for nome, cor, rotulo in [
    ("selo-30-anos-claro.svg", "#F7F9F9", "arte clara, para fundo escuro"),
    ("selo-30-anos-escuro.svg", "#101515", "arte escura, para fundo claro"),
]:
    open(f"{SAIDA}/{nome}", "w", encoding="utf-8").write(arquivo(cor, rotulo))


# ---- versão com TEXTO VIVO -------------------------------------------------
# Só renderiza certo em quem tem a Qwitcher Grypen instalada (Google Fonts, OFL).
# Serve para reescrever o número nas variantes do Rogério e do Décio.
def arquivo_texto(cor):
    L = [CABECA.format(esp=ESPESSURA).replace(
        '"anos" e "de experiência" JÁ SÃO contornos da Qwitcher Grypen (OFL), para não\n  dependerem da fonte estar instalada.',
        '⚠️ ESTA VERSÃO USA TEXTO VIVO: precisa da Qwitcher Grypen 700 instalada\n  (Google Fonts, licença OFL). Sem ela o Figma troca por outra e a peça muda.')]
    L.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEWBOX[0]} {VIEWBOX[1]} {VIEWBOX[2]} {VIEWBOX[3]}"'
        f' width="{VIEWBOX[2]:g}" height="{VIEWBOX[3]:g}" role="img" aria-label="30 anos de experiência">')
    L.append('  <title>30 anos de experiência · Suzuki Odontologia (texto vivo)</title>')
    L.append('  <g id="selo-30-anos">')
    L.append('    <g id="numero-30">')
    L.append(f'      <path id="algarismo-3" d="{TRACO_TRES}" fill="none" stroke="{cor}" stroke-width="{ESPESSURA}" stroke-linecap="round" stroke-linejoin="round"/>')
    L.append(f'      <ellipse id="algarismo-0" cx="{ZERO["cx"]}" cy="{ZERO["cy"]}" rx="{ZERO["rx"]}" ry="{ZERO["ry"]}" fill="none" stroke="{cor}" stroke-width="{ESPESSURA}"/>')
    L.append('    </g>')
    for spec in TEXTOS:
        anc = f' text-anchor="middle"' if spec["ancora"] == "middle" else ""
        L.append(f'    <text id="{spec["id"]}" x="{spec["x"]:g}" y="{spec["y"]:g}"{anc} fill="{cor}"'
                 f' font-family="Qwitcher Grypen" font-weight="700" font-size="{spec["tam"]:g}">{spec["texto"]}</text>')
    L.append('  </g>')
    L.append("</svg>")
    return "\n".join(L) + "\n"

open(f"{SAIDA}/selo-30-anos-texto-vivo.svg", "w", encoding="utf-8").write(arquivo_texto("#F7F9F9"))

print(json.dumps({k: {"avanco": v["avanco"], "glifos": v["glifos"], "bytes_d": len(v["d"])}
                  for k, v in saida.items()}, indent=1, ensure_ascii=False))
print("upem", upem, "| arquivos em", SAIDA)
