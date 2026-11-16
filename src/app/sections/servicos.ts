import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SiteService } from '../core/site.service';
import { SERVICOS } from '../core/textos';
import { Icon } from '../ui/brand';
import { Reveal } from '../ui/reveal';
import { Status } from '../ui/status';

/** Serviços: as áreas de atuação (da API) em cartões, fechando com um cartão escuro de chamada. */
@Component({
  selector: 'app-servicos',
  imports: [Icon, Reveal, Status],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'servicos', class: 'section' },
  template: `
    <div class="wrap">
      <header class="topo" appReveal>
        <p class="label">Serviços</p>
        <h2 class="title">{{ t.titulo }}</h2>
        <p class="lead">{{ t.apoio }}</p>
      </header>

      @if (site.services().length) {
        <ul class="grade">
          @for (s of site.services(); track s.slug; let i = $index) {
            <li [appReveal]="i + 1">
              <article class="card card--sobe servico">
                <span class="servico__icone" [attr.data-cor]="i % 5"><app-icon [name]="s.icone" /></span>
                <h3>{{ s.nome }}</h3>
                <p>{{ s.descricao }}</p>
                @if (s.topicos?.length) {
                  <ul class="servico__topicos">
                    @for (topico of s.topicos; track topico) {
                      <li class="chip">{{ topico }}</li>
                    }
                  </ul>
                }
              </article>
            </li>
          }
          <li [appReveal]="site.services().length + 1">
            <a class="chamada escuro" href="#contato">
              <strong>{{ t.chamadaTitulo }}</strong>
              <span>{{ t.chamadaTexto }}</span>
              <em>{{ t.chamadaBotao }} <app-icon name="seta" /></em>
            </a>
          </li>
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
      grid-template-columns: repeat(3, 1fr);
      gap: clamp(1rem, 2vw, 1.75rem);
      margin-top: clamp(2.5rem, 6vh, 4rem);
    }
    .grade > li {
      display: flex;
    }
    .servico,
    .chamada {
      flex: 1;
      padding: clamp(1.5rem, 2.4vw, 2.1rem);
    }
    .servico__icone {
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      border-radius: 0.8rem;
    }
    .servico__icone app-icon {
      width: 1.45rem;
      height: 1.45rem;
    }
    // Cada cartão ganha um tom suave diferente no ícone
    [data-cor='0'] {
      background: #edf7dd;
      color: #4a7a0c;
    }
    [data-cor='1'] {
      background: #dcf7ee;
      color: #0d7a5c;
    }
    [data-cor='2'] {
      background: #fdeedd;
      color: #a8540a;
    }
    [data-cor='3'] {
      background: #e8e7f8;
      color: #47409b;
    }
    [data-cor='4'] {
      background: #dff1fc;
      color: #0a6aa6;
    }
    h3 {
      margin-top: 1.4rem;
      font-family: var(--font-display);
      font-size: 1.55rem;
      font-weight: 700;
      line-height: 1.2;
    }
    .servico p {
      margin-top: 0.7rem;
      font-size: 1.48rem;
      color: var(--muted);
    }
    .servico__topicos {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 1.25rem;
    }
    .chamada {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border-radius: var(--raio);
      background: linear-gradient(160deg, #141a2e, #1c2540);
      box-shadow: var(--sombra-forte);
      transition: transform 0.35s var(--ease);
    }
    .chamada:hover {
      transform: translateY(-4px);
    }
    .chamada strong {
      font-family: var(--font-display);
      font-size: 1.7rem;
      font-weight: 800;
      line-height: 1.15;
    }
    .chamada span {
      color: var(--muted);
      font-size: 1.48rem;
    }
    .chamada em {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: auto;
      padding-top: 1.5rem;
      font-style: normal;
      font-weight: 700;
      color: var(--lime);
    }
    .chamada em app-icon {
      width: 1.1rem;
      height: 1.1rem;
      transition: transform 0.3s var(--ease);
    }
    .chamada:hover em app-icon {
      transform: translateX(4px);
    }
    @media (max-width: 64rem) {
      .grade {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 40rem) {
      .grade {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Servicos {
  protected readonly site = inject(SiteService);
  protected readonly t = SERVICOS;
}
