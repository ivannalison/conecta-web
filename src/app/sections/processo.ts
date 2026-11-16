import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROCESSO } from '../core/textos';
import { Reveal } from '../ui/reveal';

/** Como trabalhamos: quatro etapas numeradas, ligadas por uma linha (v4.0, seção 6.2). */
@Component({
  selector: 'app-processo',
  imports: [Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'como-trabalhamos', class: 'section section--cinza' },
  template: `
    <div class="wrap">
      <header class="topo" appReveal>
        <p class="label">Como trabalhamos</p>
        <h2 class="title">{{ t.titulo[0] }} {{ t.titulo[1] }}</h2>
      </header>

      <ol class="etapas">
        @for (etapa of t.etapas; track etapa.nome; let i = $index) {
          <li [appReveal]="i + 1">
            <span class="etapa__n">{{ i + 1 }}</span>
            <div class="card etapa">
              <h3>{{ etapa.nome }}</h3>
              <p>{{ etapa.texto }}</p>
            </div>
          </li>
        }
      </ol>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .etapas {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: clamp(1rem, 2vw, 1.75rem);
      margin-top: clamp(2.5rem, 6vh, 4rem);
    }
    .etapas > li {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    // Linha que liga uma etapa à seguinte
    .etapas > li:not(:last-child)::before {
      content: '';
      position: absolute;
      top: 1.35rem;
      left: 3.4rem;
      right: calc(-1 * clamp(1rem, 2vw, 1.75rem));
      height: 2px;
      background: repeating-linear-gradient(90deg, #cfd5df 0 6px, transparent 6px 12px);
    }
    .etapa__n {
      display: grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: var(--lime);
      color: var(--ink);
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 800;
    }
    .etapa {
      flex: 1;
      padding: 1.5rem;
    }
    h3 {
      font-family: var(--font-display);
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1.2;
    }
    .etapa p {
      margin-top: 0.6rem;
      font-size: 1.45rem;
      color: var(--muted);
    }
    @media (max-width: 64rem) {
      .etapas {
        grid-template-columns: repeat(2, 1fr);
      }
      .etapas > li::before {
        display: none;
      }
    }
    @media (max-width: 36rem) {
      .etapas {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Processo {
  protected readonly t = PROCESSO;
}
