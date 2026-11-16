import { contrast, ensureContrast, inkOn } from './color';
import { Tema } from './site.models';

/** Cores de um bloco (v4.0, seção 4.4). */
export interface ThemeVars {
  bg: string;
  text: string;
  mutedBase: string;
  accent: string;
  accentText: string;
  cta: string;
  ctaText: string;
  mono: string;
}

/** Tema dos blocos escuros da Conecta (hero, números, chamada final e rodapé). */
export const CONECTA: ThemeVars = {
  bg: '#141a2e',
  text: '#ffffff',
  mutedBase: '#c5ccdb',
  accent: '#97d138',
  accentText: '#97d138',
  cta: '#97d138',
  ctaText: '#12172b',
  mono: '#ffffff',
};

/**
 * Monta as cores de um projeto conceito garantindo contraste mínimo WCAG AA:
 * 4,5:1 para textos e 3:1 para botões em relação ao fundo.
 * Cada cartão da vitrine usa o resultado só dentro dele (o resto do site não muda).
 */
export function themeFrom(tema: Tema): ThemeVars {
  const bg = tema.fundo.toLowerCase();
  const text = tema.texto && contrast(tema.texto, bg) >= 4.5 ? tema.texto.toLowerCase() : inkOn(bg);
  const accent = tema.primaria.toLowerCase();
  const secundaria = tema.secundaria?.toLowerCase();
  // O botão usa a cor secundária quando ela se destaca do fundo; senão, a primária.
  const candidata = secundaria && contrast(secundaria, bg) >= 3 ? secundaria : accent;
  const cta = ensureContrast(candidata, bg, 3);
  return {
    bg,
    text,
    mutedBase: text,
    accent,
    accentText: ensureContrast(accent, bg, 4.5),
    cta,
    ctaText: inkOn(cta),
    // Marca e assinatura IN: sempre branco ou Graphite, nunca a cor do projeto.
    mono: inkOn(bg),
  };
}
