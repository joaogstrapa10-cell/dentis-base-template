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
