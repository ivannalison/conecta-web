/** Utilidades de cor para os temas da vitrine (contraste WCAG AA — v4.0, seção 4.4). */

export type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const n = Number.parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: Rgb): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

export function mix(a: string, b: string, t: number): string {
  const [ra, ga, ba] = hexToRgb(a);
  const [rb, gb, bb] = hexToRgb(b);
  return rgbToHex([ra + (rb - ra) * t, ga + (gb - ga) * t, ba + (bb - ba) * t]);
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste WCAG entre duas cores (1 a 21). */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export const isDark = (hex: string): boolean => luminance(hex) < 0.4;

/** Graphite ou branco: o que der mais contraste sobre a cor de fundo. */
export function inkOn(bg: string, dark = '#171a1f', light = '#ffffff'): string {
  return contrast(dark, bg) >= contrast(light, bg) ? dark : light;
}

/**
 * Ajusta a cor (clareando ou escurecendo aos poucos) até ela atingir o contraste
 * mínimo sobre o fundo. Usada para textos coloridos de cada paleta.
 */
export function ensureContrast(color: string, bg: string, min = 4.5): string {
  if (contrast(color, bg) >= min) return color.toLowerCase();
  const alvo = isDark(bg) ? '#ffffff' : '#000000';
  for (let t = 0.05; t <= 1; t += 0.05) {
    const ajustada = mix(color, alvo, t);
    if (contrast(ajustada, bg) >= min) return ajustada;
  }
  return alvo;
}
