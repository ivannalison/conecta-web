import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SiteService } from '../core/site.service';
import { HERO } from '../core/textos';
import { Icon, SymbolMark } from '../ui/brand';

/** Hero escuro: slogan em etiqueta, frase principal, dois botões e o símbolo dos sete cubos. */
@Component({
  selector: 'app-hero',
  imports: [Icon, SymbolMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'inicio', class: 'escuro' },
  template: `
    <div class="wrap grade">
      <div class="texto">
        <p class="etiqueta">{{ t.slogan }}</p>
        <h1>Tecnologia que <em class="destaque">conecta possibilidades.</em></h1>
        <p class="apoio">{{ t.apoio }}</p>
        <div class="acoes">
          <a class="btn btn--cta" href="#vitrine">{{ t.botaoProjetos }} <app-icon name="seta" /></a>
          <a class="btn btn--line" href="#contato">{{ t.botaoContato }}</a>
        </div>
      </div>

      <!-- Composição decorativa: o símbolo oficial e duas áreas de atuação -->
      <div class="palco" aria-hidden="true">
        <span class="anel anel--1"></span>
        <span class="anel anel--2"></span>
        <app-symbol class="simbolo" />
        @if (tags().length === 2) {
          <span class="tag tag--a">{{ tags()[0] }}</span>
          <span class="tag tag--b">{{ tags()[1] }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background: var(--grad-escuro);
      padding-top: var(--header-h);
      overflow: hidden;
    }
    .grade {
      display: grid;
      grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
      align-items: center;
      gap: clamp(2rem, 5vw, 5rem);
      min-height: calc(min(100svh, 58rem) - var(--header-h));
      padding-block: clamp(3rem, 8vh, 6rem);
    }
    .etiqueta {
      display: inline-flex;
      padding: 0.5rem 1.15rem;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.07);
      font-size: 1.26rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--mint);
    }
    h1 {
      margin-top: 1.5rem;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: clamp(2.6rem, 6vw, 6.25rem);
      line-height: 1.04;
      letter-spacing: -0.025em;
      text-wrap: balance;
    }
    .apoio {
      max-width: 42rem;
      margin-top: 1.75rem;
      font-size: clamp(1.5rem, 1.95vw, 2rem);
      line-height: 1.55;
      color: #dfe4ee;
      text-wrap: pretty;
    }
    .acoes {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 2.5rem;
    }
    .acoes .btn {
      min-height: 3.75rem;
      padding-inline: 2.1rem;
      font-size: 1.4rem;
    }

    .palco {
      position: relative;
      display: grid;
      place-items: center;
      aspect-ratio: 1;
      width: min(100%, 36rem);
      margin-inline: auto;
    }
    .simbolo {
      width: 52%;
      filter: drop-shadow(0 2.5rem 2.5rem rgba(4, 10, 24, 0.55));
      animation: flutua 7s ease-in-out infinite;
    }
    .anel {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .anel--1 {
      inset: 6%;
      background: radial-gradient(circle, rgba(94, 226, 185, 0.12), transparent 65%);
    }
    .anel--2 {
      inset: -8%;
      border-style: dashed;
      border-color: rgba(255, 255, 255, 0.07);
    }
    .tag {
      position: absolute;
      padding: 0.7rem 1.2rem;
      border-radius: 1rem;
      background: #fff;
      color: var(--ink);
      font-size: 1.34rem;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 1rem 2rem -0.6rem rgba(4, 10, 24, 0.6);
    }
    .tag--a {
      top: 12%;
      right: -2%;
    }
    .tag--b {
      bottom: 12%;
      left: -2%;
    }
    @keyframes flutua {
      50% {
        transform: translateY(-0.9rem);
      }
    }

    @media (max-width: 60rem) {
      .grade {
        grid-template-columns: 1fr;
        min-height: 0;
      }
      .palco {
        width: min(78%, 22rem);
      }
      .tag--a {
        right: -8%;
      }
      .tag--b {
        left: -8%;
      }
    }
    @media (max-width: 30rem) {
      .acoes .btn {
        width: 100%;
      }
    }
  `,
})
export class Hero {
  private readonly site = inject(SiteService);
  protected readonly t = HERO;
  /** Duas áreas de atuação (da API) viram as etiquetas ao lado do símbolo. */
  protected readonly tags = computed(() => {
    const nomes = this.site.services().map((s) => s.nome);
    return nomes.length >= 2 ? [nomes[0], nomes[nomes.length - 1]] : [];
  });
}

/** Faixa branca logo abaixo do hero, com as áreas de atuação vindas da API. */
@Component({
  selector: 'app-faixa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (site.services().length) {
      <ul class="wrap" aria-label="Áreas de atuação">
        @for (s of site.services(); track s.slug) {
          <li>{{ s.nome }}</li>
        }
      </ul>
    }
  `,
  styles: `
    :host {
      display: block;
      background: #fff;
      border-bottom: 1px solid var(--line);
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem 0;
      padding-block: 1.6rem;
    }
    li {
      font-size: 1.3rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      color: #8d97ad;
    }
    li:not(:last-child)::after {
      content: '•';
      margin-inline: clamp(0.75rem, 1.6vw, 1.6rem);
      color: #d3d8e2;
    }
    @media (max-width: 40rem) {
      ul {
        padding-block: 1.1rem;
      }
      li {
        font-size: 1.18rem;
      }
    }
  `,
})
export class Faixa {
  protected readonly site = inject(SiteService);
}
