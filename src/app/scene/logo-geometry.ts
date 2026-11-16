/**
 * Geometria oficial do símbolo dos sete cubos.
 *
 * Medida UMA única vez a partir de `docs/Sete Cubos Azuis Isométricos.png`
 * (doc. mestre, seção 2.1) e usada tanto pelo SVG do cabeçalho quanto pela
 * versão 3D. Não redesenhar: qualquer uso do símbolo parte deste arquivo.
 *
 * Unidade: pixels da imagem de referência, com origem no centro do cubo central.
 */

/** Metade da largura do cubo na referência. */
export const CUBE_HALF_W = 129.5;
/** Metade da altura do losango do topo. */
export const CUBE_TOP_HALF_H = 70;
/** Altura das arestas verticais. */
export const CUBE_EDGE_H = 126;

/** Centros dos sete cubos (x para a direita, y para baixo). */
export const CUBE_CENTERS: readonly (readonly [number, number])[] = [
  [0, -278], // topo
  [-268.5, -141], // superior esquerdo
  [268.5, -141], // superior direito
  [0, 0], // centro
  [-268.5, 141], // inferior esquerdo
  [268.5, 141], // inferior direito
  [0, 278], // base
];

/**
 * Cores do símbolo (identidade v5, aprovada pelo responsável em 16/11/2026).
 * O azul original deu lugar ao degradê do site: verde-lima no cubo superior esquerdo,
 * menta no inferior direito, com os outros cubos nos tons do caminho.
 * Só a cor mudou: a geometria continua a da referência.
 */
const LIMA = [0x97, 0xd1, 0x38] as const; // --lime
const MENTA = [0x5e, 0xe2, 0xb9] as const; // --mint

/** Luz de cada face visível (em espaço linear), igual no SVG e no 3D. */
export const CUBE_SHADE = { top: 1, left: 0.8, right: 0.62 } as const;

const toLinear = (c: number): number => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const toSrgb = (v: number): number => Math.round(255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055));
const toHex = (rgb: number[]): string => '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');

/** Cores das três faces de cada um dos sete cubos, na mesma ordem de CUBE_CENTERS. */
export const CUBE_COLORS: readonly { top: string; left: string; right: string }[] = CUBE_CENTERS.map(([x, y]) => {
  // Posição do cubo na diagonal: 0 = superior esquerdo, 1 = inferior direito.
  const k = Math.min(1, Math.max(0, (x / 268.5 + y / 282 + 1.5) / 3));
  const base = LIMA.map((c, i) => toLinear(c) + (toLinear(MENTA[i]) - toLinear(c)) * k);
  const face = (luz: number): string => toHex(base.map((v) => toSrgb(v * luz)));
  return { top: face(CUBE_SHADE.top), left: face(CUBE_SHADE.left), right: face(CUBE_SHADE.right) };
});

const w = CUBE_HALF_W;
const t = CUBE_TOP_HALF_H;
const e = CUBE_EDGE_H;
// O cubo é centrado na vertical: vai de -(t + e/2) até +(t + e/2).
const y0 = -(t + e / 2);

/** Polígonos (pontos SVG) das três faces de um cubo centrado na origem. */
export const CUBE_FACES = {
  top: `0,${y0} ${w},${y0 + t} 0,${y0 + 2 * t} ${-w},${y0 + t}`,
  left: `${-w},${y0 + t} 0,${y0 + 2 * t} 0,${y0 + 2 * t + e} ${-w},${y0 + t + e}`,
  right: `${w},${y0 + t} 0,${y0 + 2 * t} 0,${y0 + 2 * t + e} ${w},${y0 + t + e}`,
} as const;

/** Caixa que envolve o símbolo inteiro (para o viewBox do SVG). */
export const LOGO_HALF_W = 268.5 + CUBE_HALF_W; // 398
export const LOGO_HALF_H = 278 + CUBE_TOP_HALF_H + CUBE_EDGE_H / 2; // 411
export const LOGO_VIEWBOX = `${-LOGO_HALF_W} ${-LOGO_HALF_H} ${2 * LOGO_HALF_W} ${2 * LOGO_HALF_H}`;

// ── Equivalente 3D ───────────────────────────────────────────
// Na referência o cubo é uma caixa girada 45° e inclinada para a câmera.
// Os valores abaixo reproduzem exatamente as proporções medidas.

/** Inclinação em direção à câmera (rad): sen(θ) = meia-altura / meia-largura do losango. */
export const ISO_TILT = Math.asin(CUBE_TOP_HALF_H / CUBE_HALF_W);
/** Lado da base da caixa, em pixels da referência. */
export const BOX_SIDE = CUBE_HALF_W * Math.SQRT2;
/** Altura da caixa em relação ao lado da base. */
export const BOX_HEIGHT_RATIO = CUBE_EDGE_H / Math.cos(ISO_TILT) / BOX_SIDE;
/** Centros dos cubos em "lados de caixa" (y para cima, como no 3D). */
export const CUBE_CENTERS_3D: readonly (readonly [number, number])[] = CUBE_CENTERS.map(
  ([x, y]) => [x / BOX_SIDE, -y / BOX_SIDE] as const,
);
/** Altura total do símbolo em "lados de caixa". */
export const LOGO_HEIGHT_3D = (2 * LOGO_HALF_H) / BOX_SIDE;
