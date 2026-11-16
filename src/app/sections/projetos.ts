import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SiteService } from '../core/site.service';
import { PROJETOS } from '../core/textos';
import { Icon } from '../ui/brand';
import { Reveal } from '../ui/reveal';
import { Status } from '../ui/status';

/** Projetos reais do GitHub: só o que está cadastrado e publicado na API (v4.0, seção 5). */
@Component({
  selector: 'app-projetos',
  imports: [Icon, Reveal, Status],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'projetos', class: 'section' },
  template: `
    <div class="wrap">
      <header class="topo" appReveal>
        <p class="label">Projetos reais</p>
        <h2 class="title">{{ t.titulo[0] }} {{ t.titulo[1] }}</h2>
        <p class="lead">{{ t.apoio }}</p>
      </header>

      @if (site.reais().length) {
        <ol class="lista">
          @for (p of site.reais(); track p.slug; let i = $index) {
            <li class="card card--sobe projeto" [class.projeto--destaque]="p.destaque" [appReveal]="i + 1">
              <h3>{{ p.nome }}</h3>
              <p>{{ p.descricao }}</p>
              @if (p.tecnologias?.length) {
                <ul class="tecnologias" aria-label="Tecnologias">
                  @for (tec of p.tecnologias; track tec) {
                    <li class="chip">{{ tec }}</li>
                  }
                </ul>
              }
              @if (p.links?.length) {
                <ul class="links">
                  @for (link of p.links; track link.url) {
                    <li>
                      <a [href]="link.url" target="_blank" rel="noopener">
                        {{ link.rotulo }} <app-icon name="externo" />
                        <span class="sr-only">(abre em nova aba)</span>
                      </a>
                    </li>
                  }
                </ul>
              }
            </li>
          }
        </ol>
      } @else {
        <app-status class="status" [empty]="t.vazio" />
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .status {
      display: block;
      margin-top: 3rem;
    }
    .lista {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(1rem, 2vw, 1.75rem);
      margin-top: clamp(2.5rem, 6vh, 4rem);
    }
    .projeto {
      display: flex;
      flex-direction: column;
      padding: clamp(1.5rem, 2.6vw, 2.25rem);
    }
    // O projeto em destaque ocupa a linha inteira e ganha uma borda verde à esquerda.
    .projeto--destaque {
      grid-column: 1 / -1;
      border-left: 4px solid var(--lime);
    }
    h3 {
      font-family: var(--font-display);
      font-size: clamp(1.4rem, 2.1vw, 1.9rem);
      font-weight: 700;
      line-height: 1.15;
    }
    .projeto--destaque h3 {
      font-size: clamp(1.6rem, 2.7vw, 2.5rem);
      font-weight: 800;
    }
    .projeto > p {
      max-width: 58rem;
      margin-top: 0.7rem;
      color: var(--muted);
    }
    .tecnologias {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-block: 1.25rem 1.5rem;
    }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      margin-top: auto;
      padding-top: 1.1rem;
      border-top: 1px solid var(--line);
    }
    .links a {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 1.42rem;
      font-weight: 600;
      color: var(--accent-text);
    }
    .links app-icon {
      width: 1.05rem;
      height: 1.05rem;
      transition: transform 0.3s var(--ease);
    }
    .links a:hover {
      text-decoration: underline;
      text-underline-offset: 0.25em;
    }
    .links a:hover app-icon {
      transform: translate(2px, -2px);
    }
    @media (max-width: 52rem) {
      .lista {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Projetos {
  protected readonly site = inject(SiteService);
  protected readonly t = PROJETOS;
}
