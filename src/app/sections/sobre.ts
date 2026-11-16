import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SiteService } from '../core/site.service';
import { SOBRE } from '../core/textos';
import { InSignature } from '../ui/brand';
import { Reveal } from '../ui/reveal';

/** Sobre: apresentação da Conecta + cartão com a assinatura IN e o nome do fundador (v4.0, seção 6.3). */
@Component({
  selector: 'app-sobre',
  imports: [InSignature, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'sobre', class: 'section' },
  template: `
    <div class="wrap grade">
      <div class="topo" appReveal>
        <p class="label">Sobre</p>
        <h2 class="title">{{ t.titulo[0] }} {{ t.titulo[1] }}</h2>
        <p class="lead">{{ apresentacao() }}</p>
      </div>

      <figure class="card fundador" [appReveal]="2">
        <app-in class="fundador__in" label="IN — assinatura de Ivan Nalison" />
        <figcaption>
          <span>{{ t.fundadorRotulo }}</span>
          <strong>{{ fundador() }}</strong>
        </figcaption>
      </figure>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .grade {
      display: grid;
      grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
      gap: clamp(2rem, 6vw, 6rem);
      align-items: center;
    }
    .lead {
      max-width: 50rem;
    }
    .fundador {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: clamp(1.5rem, 2.6vw, 2.25rem);
    }
    .fundador__in {
      flex: none;
      width: 5.5rem;
    }
    figcaption {
      display: grid;
      gap: 0.25rem;
    }
    figcaption span {
      font-size: 1.28rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--accent-text);
    }
    figcaption strong {
      font-family: var(--font-display);
      font-size: 1.45rem;
      font-weight: 700;
      line-height: 1.25;
    }
    @media (max-width: 56rem) {
      .grade {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Sobre {
  private readonly site = inject(SiteService);
  protected readonly t = SOBRE;
  /** Usa o texto da API quando existir; senão, o texto fixo. */
  protected readonly apresentacao = computed(() => this.site.company()?.apresentacao || SOBRE.texto);
  protected readonly fundador = computed(() => this.site.company()?.fundador || SOBRE.fundador);
}
