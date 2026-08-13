// Deriva links de contato a partir do próprio número exibido.
// Uma única string por canal é a fonte de verdade — display e href
// não podem divergir porque saem do mesmo valor.

function digitos(numero: string): string {
  return numero.replace(/\D+/g, "");
}

function comCodigoPais(numero: string, digs: string): string {
  // Se o usuário já digitou com "+55" ou começou com "55" + DDD (12+ dígitos),
  // não duplica o código do país.
  if (numero.trim().startsWith("+")) return digs;
  if (digs.length >= 12 && digs.startsWith("55")) return digs;
  return `55${digs}`;
}

export function telHref(numero: string): string {
  const digs = digitos(numero);
  if (!digs) return "#";
  return `tel:+${comCodigoPais(numero, digs)}`;
}

export function whatsappHref(numero: string, mensagem?: string): string {
  const digs = digitos(numero);
  if (!digs) return "#";
  const base = `https://wa.me/${comCodigoPais(numero, digs)}`;
  if (!mensagem) return base;
  return `${base}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Link para o endereço no Google Maps, derivado do endereço EXIBIDO — mesma regra
 * do telefone: uma string é a fonte, e o link não pode divergir do que está na
 * tela. Usa a URL de busca documentada do Maps (`?api=1&query=`), que funciona em
 * navegador e abre o app no celular.
 *
 * Existe porque o mapa da seção é uma imagem: sem este link, quem quer traçar
 * rota não tem para onde clicar. Um mapa que não leva a lugar nenhum é decoração.
 */
export function mapaHref(endereco: string, cidadeUf: string): string {
  const consulta = [endereco, cidadeUf].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}
