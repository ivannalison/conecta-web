import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PARA_QUEM } from '../core/textos';
import { Reveal } from '../ui/reveal';

/** Para quem: três portes de empresa e o tipo de solução mais indicado (v4.0, seção 6.1). */
@Component({
  selector: 'app-para-quem',
  imports: [Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'para-quem', class: 'section section--cinza' },
  template: `
    <div class="wrap">
      <header class="topo" appReveal>
        <p class="label">Para quem</p>
        <h2 class="title">{{ t.titulo[0] }} {{ t.titulo[1] }}</h2>
        <p class="lead">{{ t.apoio }}</p>
      </header>

      <ol class="blocos">
        @for (b of t.blocos; track b.porte; let i = $index) {
          <li class="card" [appReveal]="i + 1">
            <span class="escala" aria-hidden="true">
              @for (n of [0, 1, 2]; track n) {
                <i [class.on]="n <= i"></i>
              }
            </span>
            <h3>{{ b.porte }}</h3>
            <p>{{ b.texto }}</p>
            <ul>
              @for (item of b.indicado; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </li>
        }
      </ol>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .blocos {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: clamp(1rem, 2vw, 1.75rem);
      margin-top: clamp(2.5rem, 6vh, 4rem);
    }
    .blocos > li {
      padding: clamp(1.5rem, 2.4vw, 2.1rem);
    }
    // Três barras que "enchem" conforme o porte: pequeno, médio, grande.
    .escala {
      display: flex;
      align-items: flex-end;
      gap: 5px;
      height: 1.6rem;
    }
    .escala i {
      width: 0.55rem;
      border-radius: 3px;
      background: #dfe3ea;
    }
    .escala i:nth-child(1) {
      height: 45%;
    }
    .escala i:nth-child(2) {
      height: 72%;
    }
    .escala i:nth-child(3) {
      height: 100%;
    }
    .escala i.on {
      background: var(--lime);
    }
    h3 {
      margin-top: 1.25rem;
      font-family: var(--font-display);
      font-size: 1.6rem;
      font-weight: 700;
    }
    .blocos p {
      margin-top: 0.6rem;
      font-size: 1.48rem;
      color: var(--muted);
    }
    .blocos ul {
      display: grid;
      gap: 0.7rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--line);
    }
    .blocos ul li {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      font-size: 1.42rem;
      font-weight: 500;
    }
    .blocos ul li::before {
      content: '';
      flex: none;
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background: var(--lime);
    }
    @media (max-width: 56rem) {
      .blocos {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ParaQuem {
  protected readonly t = PARA_QUEM;
}
