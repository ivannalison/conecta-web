import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { QualityService } from './core/quality.service';
import { SiteService } from './core/site.service';
import { SceneService } from './scene/scene.service';
import { Contato, Rodape } from './sections/contato';
import { Header } from './sections/header';
import { Faixa, Hero } from './sections/hero';
import { Frase } from './sections/frase';
import { ParaQuem } from './sections/para-quem';
import { Processo } from './sections/processo';
import { Projetos } from './sections/projetos';
import { Servicos } from './sections/servicos';
import { Sobre } from './sections/sobre';
import { Vitrine } from './sections/vitrine';

/** Etapas da abertura: cubos formando o símbolo → marca no cabeçalho → site revelado. */
type Intro = 'cubos' | 'marca' | 'pronto';

/** Se o motor 3D demorar mais que isso para carregar, o site abre sem esperar a abertura. */
const ESPERA_MAXIMA_MS = 2000;

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Faixa, ParaQuem, Servicos, Vitrine, Frase, Projetos, Processo, Sobre, Contato, Rodape],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-intro]': "intro() !== 'pronto'",
    '(document:keydown)': 'skip()',
    '(document:pointerdown)': 'skip()',
  },
  template: `
    <a class="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>

    <!-- Abertura 3D, decorativa: oculta para leitores de tela e removida quando termina -->
    @if (cena()) {
      <canvas #canvas class="cena" aria-hidden="true"></canvas>
    }

    <app-header [brandVisible]="intro() !== 'cubos'" [navVisible]="intro() === 'pronto'" />

    <main id="conteudo">
      <app-hero />
      <app-faixa />
      <app-servicos />
      <app-para-quem />
      <app-vitrine />
      <app-frase />
      <app-projetos />
      <app-processo />
      <app-sobre />
      <app-contato />
    </main>
    <app-rodape />

    @if (intro() === 'cubos') {
      <button type="button" class="pular-abertura" (click)="skip()">Pular abertura</button>
    }

    @if (scene.showFps) {
      <output class="fps">{{ scene.fps() ?? '–' }} fps · {{ quality.level }}</output>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .cena {
      position: fixed;
      inset: 0;
      z-index: 25;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    main,
    app-rodape {
      display: block;
      transition: opacity 0.5s;
    }
    // Durante a abertura só os cubos aparecem; o conteúdo entra em seguida.
    :host(.is-intro) main,
    :host(.is-intro) app-rodape {
      opacity: 0;
    }
    .pular-conteudo {
      position: fixed;
      top: 0.5rem;
      left: 0.5rem;
      z-index: 40;
      padding: 0.6rem 1rem;
      border-radius: 0.5rem;
      background: #fff;
      color: var(--ink);
      font-weight: 600;
      transform: translateY(-200%);
    }
    .pular-conteudo:focus {
      transform: none;
    }
    .pular-abertura {
      position: fixed;
      right: var(--gutter);
      bottom: 1.5rem;
      z-index: 30;
      padding: 0.5rem 0;
      font-size: 1.22rem;
      font-weight: 600;
      color: #c5ccdb;
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    }
    .fps {
      position: fixed;
      left: 0.5rem;
      bottom: 0.5rem;
      z-index: 50;
      padding: 0.3rem 0.6rem;
      background: #000;
      color: #7dff9b;
      font: 12px/1.4 ui-monospace, Consolas, monospace;
    }
  `,
})
export class App implements OnDestroy {
  protected readonly scene = inject(SceneService);
  protected readonly quality = inject(QualityService);
  private readonly site = inject(SiteService);

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly header = viewChild.required(Header);

  // Sem 3D ou com ?nointro, o site já abre pronto, com a marca no cabeçalho.
  private readonly semAbertura = !this.quality.has3d || new URLSearchParams(location.search).has('nointro');
  protected readonly intro = signal<Intro>(this.semAbertura ? 'pronto' : 'cubos');
  /** O canvas só existe enquanto a abertura roda. */
  protected readonly cena = signal(!this.semAbertura);

  constructor() {
    // A API é consultada em paralelo com a abertura.
    this.site.load();

    // Enquanto os cubos formam o símbolo, a página não rola.
    effect(() => document.documentElement.classList.toggle('intro-lock', this.intro() === 'cubos'));

    afterNextRender(() => void this.start());
  }

  private async start(): Promise<void> {
    const canvas = this.canvas()?.nativeElement;
    if (this.semAbertura || !canvas) return;

    // A abertura sempre começa do topo da página.
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const espera = window.setTimeout(() => this.finish(), ESPERA_MAXIMA_MS);
    const ok = await this.scene.init(canvas);
    clearTimeout(espera);

    if (!ok || this.intro() === 'pronto') {
      this.finish();
      return;
    }

    this.scene.playIntro({
      target: this.header().symbolElement(),
      onHandoff: () => this.intro.set('marca'),
      onDone: () => this.finish(),
    });
  }

  /** Revela o site e desliga o 3D: a abertura é a única animação da cena. */
  private finish(): void {
    this.intro.set('pronto');
    this.scene.destroy();
    this.cena.set(false);
  }

  /** Qualquer clique ou tecla pula a abertura. */
  protected skip(): void {
    if (this.intro() !== 'pronto') this.scene.skipIntro();
  }

  ngOnDestroy(): void {
    this.scene.destroy();
  }
}
