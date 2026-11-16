import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, computed, inject, input, signal, viewChild } from '@angular/core';
import { formatarWhatsapp, whatsappLink } from '../core/contact';
import { SiteService } from '../core/site.service';
import { MENU } from '../core/textos';
import { Logo } from '../ui/brand';

/** Cabeçalho fixo: transparente sobre o hero escuro, branco depois que a página rola. */
@Component({
  selector: 'app-header',
  imports: [Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.escuro]': '!scrolled() && !open()',
    '[class.is-scrolled]': 'scrolled()',
    '[class.is-open]': 'open()',
    '[class.brand-hidden]': '!brandVisible()',
    '[class.nav-hidden]': '!navVisible()',
    '(document:keydown.escape)': 'open.set(false)',
  },
  template: `
    <header class="bar">
      <a class="brand" href="#inicio" aria-label="Conecta — início" (click)="open.set(false)">
        <app-logo #logo />
      </a>

      <nav class="nav" id="menu" aria-label="Principal">
        <ul>
          @for (item of menu; track item.alvo) {
            <li>
              <a [href]="'#' + item.alvo" [class.is-active]="active() === item.alvo" [attr.aria-current]="active() === item.alvo ? 'true' : null" (click)="open.set(false)">
                {{ item.rotulo }}
              </a>
            </li>
          }
        </ul>
        <div class="acoes">
          @if (whatsapp(); as w) {
            <a class="fone" [href]="w.link" target="_blank" rel="noopener">{{ w.numero }}</a>
          }
          <a class="btn btn--cta btn--pequeno" href="#contato" (click)="open.set(false)">Vamos conversar</a>
        </div>
      </nav>

      <button type="button" class="toggle" aria-controls="menu" [attr.aria-expanded]="open()" (click)="open.set(!open())">
        <span class="sr-only">{{ open() ? 'Fechar menu' : 'Abrir menu' }}</span>
        <span class="toggle__lines" aria-hidden="true"></span>
      </button>
    </header>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 20;
      display: block;
      color: var(--text);
      transition: background-color 0.3s, box-shadow 0.3s, color 0.3s;
    }
    :host(.is-scrolled),
    :host(.is-open) {
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 var(--line), 0 8px 24px -18px rgba(18, 23, 43, 0.5);
    }
    .bar {
      display: flex;
      align-items: center;
      gap: clamp(1.5rem, 4vw, 4rem);
      width: calc(100% - 2 * var(--gutter));
      height: var(--header-h);
      margin-inline: auto;
    }
    .brand {
      display: inline-flex;
      font-size: clamp(0.9rem, 1.1vw, 1.1rem);
    }
    // Abertura: o símbolo aparece na hora em que os cubos 3D chegam; o nome entra em seguida.
    app-logo {
      transition: clip-path 0.45s var(--ease);
      clip-path: inset(-20% -5% -20% 0);
    }
    :host(.brand-hidden) app-logo {
      opacity: 0;
      clip-path: inset(-20% 75% -20% 0);
      transition: none;
    }
    .nav {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 1.5rem;
      transition: opacity 0.45s 0.05s;
    }
    :host(.nav-hidden) .nav,
    :host(.nav-hidden) .toggle {
      opacity: 0;
      pointer-events: none;
    }
    .nav ul {
      display: flex;
      gap: clamp(1.1rem, 2.4vw, 2.4rem);
    }
    .nav li a {
      padding-block: 0.5rem;
      font-size: 1.38rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--text) 86%, transparent);
      transition: color 0.2s;
    }
    .nav li a:hover,
    .nav li a.is-active {
      color: var(--accent-text);
    }
    .acoes {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-left: auto;
    }
    .fone {
      font-weight: 700;
      font-size: 1.36rem;
      white-space: nowrap;
    }
    .fone:hover {
      color: var(--accent-text);
    }
    .toggle {
      display: none;
      width: 2.75rem;
      height: 2.75rem;
      margin-left: auto;
      place-items: center;
      transition: opacity 0.45s 0.05s;
    }
    .toggle__lines,
    .toggle__lines::before {
      display: block;
      width: 1.5rem;
      height: 2px;
      border-radius: 2px;
      background: var(--text);
      transition: transform 0.3s var(--ease);
    }
    .toggle__lines {
      transform: translateY(-4px);
    }
    .toggle__lines::before {
      content: '';
      transform: translateY(8px);
    }
    :host(.is-open) .toggle__lines {
      transform: rotate(45deg);
    }
    :host(.is-open) .toggle__lines::before {
      transform: rotate(-90deg);
    }

    @media (max-width: 72rem) {
      .fone {
        display: none;
      }
    }
    @media (max-width: 60rem) {
      :host {
        --header-h: 4.5rem;
      }
      .toggle {
        display: grid;
      }
      .nav {
        position: fixed;
        inset: var(--header-h) 0 0 0;
        flex-direction: column;
        align-items: stretch;
        gap: 2rem;
        padding: 1.5rem var(--gutter) 3rem;
        background: #fff;
        overflow-y: auto;
        visibility: hidden;
        opacity: 0;
        transform: translateY(-0.75rem);
        transition: opacity 0.3s, transform 0.3s var(--ease), visibility 0.3s;
      }
      :host(.is-open) .nav {
        visibility: visible;
        opacity: 1;
        transform: none;
      }
      .nav ul {
        flex-direction: column;
        gap: 0;
      }
      .nav li a {
        display: block;
        padding-block: 1rem;
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 700;
        border-bottom: 1px solid var(--line);
      }
      .acoes {
        flex-direction: column;
        align-items: stretch;
        margin: 0;
      }
      .fone {
        display: block;
        text-align: center;
      }
    }
  `,
})
export class Header implements OnDestroy {
  /** Marca visível (false só durante a abertura, antes de os cubos chegarem). */
  readonly brandVisible = input(true);
  readonly navVisible = input(true);

  private readonly site = inject(SiteService);
  protected readonly menu = MENU;
  protected readonly open = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly active = signal<string>('inicio');

  /** Número de WhatsApp vindo da API. Sem dado, o cabeçalho fica só com o botão. */
  protected readonly whatsapp = computed(() => {
    const numero = this.site.company()?.whatsapp;
    const link = whatsappLink(numero);
    const legivel = formatarWhatsapp(numero);
    return link && legivel ? { link, numero: legivel } : null;
  });

  private readonly logo = viewChild.required('logo', { read: ElementRef });
  private observer?: IntersectionObserver;
  private readonly onScroll = (): void => this.scrolled.set(window.scrollY > 24);

  constructor() {
    afterNextRender(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
      // Destaca no menu a seção que está no meio da tela.
      const ids = new Set<string>(['inicio', ...MENU.map((item) => item.alvo)]);
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.active.set(entry.target.id);
          }
        },
        { rootMargin: '-45% 0px -55% 0px' },
      );
      document.querySelectorAll<HTMLElement>('[id]').forEach((el) => {
        if (ids.has(el.id)) this.observer?.observe(el);
      });
    });
  }

  /** Elemento do símbolo dos cubos: destino da animação de abertura. */
  symbolElement(): HTMLElement {
    return (this.logo().nativeElement as HTMLElement).querySelector('app-symbol') as HTMLElement;
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    this.observer?.disconnect();
  }
}
