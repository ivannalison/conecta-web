import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { whatsappLink } from '../core/contact';
import { SiteService } from '../core/site.service';
import { VITRINE } from '../core/textos';
import { inkOn } from '../core/color';
import { themeFrom } from '../core/theme.service';
import { Icon } from '../ui/brand';
import { Reveal } from '../ui/reveal';
import { Status } from '../ui/status';
import { VitrineDemo } from './vitrine-demo';

/**
 * Vitrine: quatro projetos conceito (v4.0, seção 4).
 * Cada cartão veste as cores do próprio projeto, com contraste AA garantido pelo themeFrom.
 */
@Component({
  selector: 'app-vitrine',
  imports: [Icon, Reveal, Status, VitrineDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'vitrine', class: 'section' },
  template: `
    <div class="wrap">
      <header class="topo" appReveal>
        <p class="label">Vitrine</p>
        <h2 class="title">{{ t.titulo[0] }} {{ t.titulo[1] }}</h2>
      </header>

      @if (projetos().length) {
        <ul class="grade">
          @for (p of projetos(); track p.slug; let i = $index) {
            <li [appReveal]="i + 1">
              <article
                class="conceito"
                [attr.aria-labelledby]="'vitrine-' + p.slug"
                [style.--c-bg]="p.cores?.bg"
                [style.--c-text]="p.cores?.text"
                [style.--c-accent]="p.cores?.accentText"
                [style.--c-cta]="p.cores?.cta"
                [style.--c-cta-text]="p.cores?.ctaText"
                [style.--c-pri]="p.tema?.primaria"
                [style.--c-on-pri]="p.sobrePrimaria"
                [style.--c-sec]="p.tema?.secundaria"
              >
                <div class="conceito__grade">
                  <div class="conceito__texto">
                    <p class="conceito__meta">
                      <span class="selo">{{ t.selo }}</span>
                      <span class="paleta" aria-hidden="true">
                        @for (cor of p.paleta; track cor) {
                          <i [style.background]="cor"></i>
                        }
                      </span>
                    </p>
                    <h3 [id]="'vitrine-' + p.slug">{{ p.titulo }}</h3>
                    @if (p.subtitulo) {
                      <p class="conceito__tipo">{{ p.subtitulo }}</p>
                    }
                    <p class="conceito__descricao">{{ p.descricao }}</p>
                    @if (p.whatsapp) {
                      <a
                        class="btn btn--pequeno"
                        [href]="p.whatsapp"
                        target="_blank"
                        rel="noopener"
                      >
                        {{ t.botao }} <app-icon name="seta" />
                      </a>
                    }
                  </div>
                  @if (p.demo) {
                    <app-demo class="conceito__demo" [tipo]="p.demo" />
                  }
                </div>
              </article>
            </li>
          }
        </ul>
      } @else {
        <app-status class="status" />
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
    .grade {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(1rem, 2vw, 1.75rem);
      margin-top: clamp(2.5rem, 6vh, 4rem);
    }
    .grade > li {
      display: flex;
    }
    .conceito {
      flex: 1;
      min-width: 0;
      container-type: inline-size;
      padding: clamp(1.75rem, 3vw, 2.75rem);
      border-radius: 1.25rem;
      background: var(--c-bg, var(--navy));
      color: var(--c-text, #fff);
      box-shadow: var(--sombra);
      transition:
        transform 0.35s var(--ease),
        box-shadow 0.35s var(--ease);
    }
    .conceito:hover {
      transform: translateY(-4px);
      box-shadow: var(--sombra-forte);
    }
    // Texto de um lado e a tela do projeto do outro; em cartão estreito, um embaixo do outro.
    .conceito__grade {
      display: grid;
      gap: 2rem;
      height: 100%;
    }
    @container (min-width: 46rem) {
      .conceito__grade {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        align-items: center;
        gap: clamp(1.5rem, 4cqw, 3rem);
      }
    }
    .conceito__texto {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      height: 100%;
    }
    .conceito__meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
    }
    .selo {
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--c-text, #fff) 28%, transparent);
      font-size: 1.22rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .paleta {
      display: flex;
    }
    .paleta i {
      width: 1.35rem;
      height: 1.35rem;
      margin-left: -0.35rem;
      border-radius: 50%;
      border: 2px solid var(--c-bg, var(--navy));
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--c-text, #fff) 22%, transparent);
    }
    h3 {
      margin-top: 1.75rem;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: clamp(1.8rem, 3vw, 2.9rem);
      line-height: 1.08;
      letter-spacing: -0.02em;
      text-wrap: balance;
    }
    .conceito__tipo {
      margin-top: 0.4rem;
      font-size: 1.48rem;
      font-weight: 600;
      color: var(--c-accent, var(--lime));
    }
    .conceito__descricao {
      max-width: 38rem;
      margin-top: 1rem;
      margin-bottom: 1.75rem;
      color: color-mix(in srgb, var(--c-text, #fff) 80%, transparent);
    }
    .btn {
      margin-top: auto;
      background: var(--c-cta, var(--lime));
      color: var(--c-cta-text, var(--ink));
    }
    @media (max-width: 52rem) {
      .grade {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Vitrine {
  private readonly site = inject(SiteService);
  protected readonly t = VITRINE;

  /** Projetos conceito prontos para a tela: título separado do tipo, link de WhatsApp e cores. */
  protected readonly projetos = computed(() => {
    const numero = this.site.company()?.whatsapp;
    return this.site.conceitos().map((p) => {
      const [titulo, ...resto] = p.nome.split(' — ');
      return {
        ...p,
        titulo,
        subtitulo: resto.join(' — '),
        whatsapp: whatsappLink(numero, p.mensagemWhatsapp),
        cores: p.tema ? themeFrom(p.tema) : null,
        sobrePrimaria: p.tema ? inkOn(p.tema.primaria) : null,
        // Paleta do projeto, como cadastrada.
        paleta: [p.tema?.primaria, p.tema?.secundaria].filter((cor): cor is string => !!cor),
      };
    });
  });
}
