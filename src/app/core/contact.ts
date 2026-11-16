/** Links de contato (doc. mestre, seção 12): mailto e wa.me, sem formulário. */

export const ASSUNTO_EMAIL = 'Contato pelo site — Conecta';
export const MENSAGEM_WHATSAPP =
  'Olá! Vim pelo site da Conecta e quero conversar sobre um projeto.';

export function mailtoLink(email: string | null | undefined, assunto = ASSUNTO_EMAIL): string | null {
  const endereco = email?.trim();
  if (!endereco || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(endereco)) return null;
  return `mailto:${endereco}?subject=${encodeURIComponent(assunto)}`;
}

/** Aceita o número em qualquer formato ("+55 97 98440-5148") e deixa só os dígitos. */
export function whatsappLink(
  numero: string | null | undefined,
  mensagem: string | null | undefined = MENSAGEM_WHATSAPP,
): string | null {
  const digitos = numero?.replace(/\D/g, '') ?? '';
  if (digitos.length < 10) return null;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem || MENSAGEM_WHATSAPP)}`;
}

/** Mostra o número de forma legível: +55 97 98440-5148. */
export function formatarWhatsapp(numero: string | null | undefined): string | null {
  const d = numero?.replace(/\D/g, '') ?? '';
  if (d.length < 10) return null;
  if (d.startsWith('55') && d.length >= 12) {
    const ddd = d.slice(2, 4);
    const resto = d.slice(4);
    return `+55 ${ddd} ${resto.slice(0, -4)}-${resto.slice(-4)}`;
  }
  return `+${d}`;
}
