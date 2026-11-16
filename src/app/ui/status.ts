import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SiteService } from '../core/site.service';
import { AVISOS } from '../core/textos';

/**
 * Aviso discreto de carregamento, falha ou lista vazia (doc. mestre 18.2).
 * Não mostra detalhe técnico: só uma mensagem neutra e o botão de tentar de novo.
 */
@Component({
  selector: 'app-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (site.state()) {
      @case ('carregando') {
        <p class="status" role="status"><span class="status__dot"></span>{{ avisos.carregando }}</p>
      }
      @case ('erro') {
        <p class="status" role="alert">
          {{ avisos.erro }}
          <button type="button" class="status__retry" (click)="site.load()">{{ avisos.tentar }}</button>
        </p>
      }
      @default {
        @if (empty()) {
          <p class="status">{{ empty() }}</p>
        }
      }
    }
  `,
  styles: `
    .status {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem 1.25rem;
      padding-block: 2rem;
      border-block: 1px solid var(--line);
      color: var(--muted);
    }
    .status__dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: var(--accent);
      animation: pulse 1.2s ease-in-out infinite;
    }
    .status__retry {
      color: var(--text);
      text-decoration: underline;
      text-underline-offset: 0.25em;
    }
    @keyframes pulse {
      50% {
        opacity: 0.25;
      }
    }
  `,
})
export class Status {
  protected readonly site = inject(SiteService);
  protected readonly avisos = AVISOS;
  /** Mensagem para quando a API respondeu, mas a lista veio vazia. */
  readonly empty = input<string>('');
}
