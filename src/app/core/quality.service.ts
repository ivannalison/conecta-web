import { Injectable } from '@angular/core';

/** Níveis de qualidade da experiência (doc. mestre, seção 8.7). */
export type Quality = 'completo' | 'medio' | 'simplificado' | 'reduzido';

const NIVEIS: readonly Quality[] = ['completo', 'medio', 'simplificado', 'reduzido'];

interface NavigatorExtra {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/** Escolhe o nível a partir da capacidade do dispositivo e das preferências do visitante. */
export function detectQuality(win: Window = window): Quality {
  // Para testes: ?q=medio força um nível.
  const forced = new URLSearchParams(win.location.search).get('q') as Quality | null;
  if (forced && NIVEIS.includes(forced)) return forced;

  if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduzido';

  const nav = win.navigator as Navigator & NavigatorExtra;
  if (nav.connection?.saveData || !hasWebGL(win)) return 'simplificado';

  const toque = win.matchMedia('(pointer: coarse)').matches;
  const poucaMemoria = (nav.deviceMemory ?? 8) <= 4;
  const poucosNucleos = (nav.hardwareConcurrency ?? 8) <= 4;
  if (toque && (poucaMemoria || poucosNucleos)) return 'medio';
  if (win.innerWidth < 768) return 'medio';

  return 'completo';
}

function hasWebGL(win: Window): boolean {
  try {
    const canvas = win.document.createElement('canvas');
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class QualityService {
  readonly level: Quality = detectQuality();
  /** A cena 3D só roda nos níveis completo e médio. */
  readonly has3d = this.level === 'completo' || this.level === 'medio';
  /** Sem animações contínuas nem transições longas. */
  readonly reduced = this.level === 'reduzido';
}
