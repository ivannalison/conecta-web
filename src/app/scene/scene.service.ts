import { Injectable, inject, signal } from '@angular/core';
import { QualityService } from '../core/quality.service';
import type { IntroOptions, SceneEngine } from './scene-engine';

/**
 * Porta de entrada da abertura 3D para o resto do site.
 * O motor (Three.js) é baixado sob demanda e só nos níveis completo e médio.
 * O projeto é zoneless: o laço de animação não dispara detecção de mudanças do Angular.
 */
@Injectable({ providedIn: 'root' })
export class SceneService {
  private readonly quality = inject(QualityService);
  private engine: SceneEngine | null = null;

  /** Quadros por segundo (só com ?fps na URL, para o teste de desempenho). */
  readonly fps = signal<number | null>(null);
  readonly showFps = new URLSearchParams(window.location.search).has('fps');

  /** Cria a cena. Devolve false quando o dispositivo fica sem 3D. */
  async init(canvas: HTMLCanvasElement): Promise<boolean> {
    if (!this.quality.has3d) return false;
    try {
      const { SceneEngine } = await import('./scene-engine');
      this.engine = new SceneEngine(canvas, {
        quality: this.quality.level === 'completo' ? 'completo' : 'medio',
        onFps: this.showFps ? (fps) => this.fps.set(fps) : undefined,
      });
      return true;
    } catch {
      // WebGL falhou ao iniciar: o site segue funcionando sem a abertura.
      this.engine = null;
      return false;
    }
  }

  playIntro(options: IntroOptions): void {
    if (this.engine) this.engine.playIntro(options);
    else {
      options.onHandoff();
      options.onDone();
    }
  }

  skipIntro(): void {
    this.engine?.skipIntro();
  }

  /** Terminada a abertura, o motor é descartado: nada fica rodando em segundo plano. */
  destroy(): void {
    this.engine?.dispose();
    this.engine = null;
  }
}
