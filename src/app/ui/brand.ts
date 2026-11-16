import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CUBE_CENTERS, CUBE_COLORS, CUBE_FACES, LOGO_VIEWBOX } from '../scene/logo-geometry';

/** Símbolo oficial dos sete cubos. A geometria vem de logo-geometry.ts (não redesenhar). */
@Component({
  selector: 'app-symbol',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="viewBox" aria-hidden="true" focusable="false">
      @for (c of centers; track $index; let i = $index) {
        <g [attr.transform]="'translate(' + c[0] + ' ' + c[1] + ')'">
          <polygon [attr.points]="faces.top" [attr.fill]="colors[i].top" />
          <polygon [attr.points]="faces.left" [attr.fill]="colors[i].left" />
          <polygon [attr.points]="faces.right" [attr.fill]="colors[i].right" />
        </g>
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
      aspect-ratio: 796 / 822;
    }
    svg {
      width: 100%;
      height: 100%;
      // Sobre fundo claro o verde fica um pouco mais fechado (ver --simbolo-filtro).
      filter: var(--simbolo-filtro, none);
      transition: filter 0.3s;
    }
  `,
})
export class SymbolMark {
  protected readonly viewBox = LOGO_VIEWBOX;
  protected readonly centers = CUBE_CENTERS;
  protected readonly faces = CUBE_FACES;
  protected readonly colors = CUBE_COLORS;
}

/** Marca horizontal: símbolo + CONECTA. */
@Component({
  selector: 'app-logo',
  imports: [SymbolMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-symbol class="logo__symbol" />
    <span class="logo__conecta">Conecta</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.7em;
      font-size: 1rem;
      color: var(--mono);
    }
    .logo__symbol {
      height: 2.5em;
      flex: none;
    }
    .logo__conecta {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.6em;
      line-height: 1;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
  `,
})
export class Logo {}

/**
 * Assinatura IN. Geometria de referência em public/brand/in-assinatura.svg (não redesenhar).
 * Sempre monocromática: usa --mono (branco no escuro, Graphite no claro).
 */
@Component({
  selector: 'app-in',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="105 94 1023 818" role="img" [attr.aria-label]="label()">
      <path d="M105 94H270V236H228V136H147V236H105Z" />
      <path d="M105 302H147V870H228V302H270V912H105Z" />
      <path d="M360 94H487L811 466L1128 102V169L811 533L465 136H402V682L360 724Z" />
      <path d="M1114 284V345L914 580L960 633V591L999 552V741L861 583Z" />
      <path d="M485 286L998 875H1085V456L1124 420V912H980L528 393V556L485 599Z" />
      <path d="M603 550L362 791V912H526V766L485 807V870H401V796L623 574Z" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      aspect-ratio: 1023 / 818;
      color: var(--mono);
    }
    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `,
})
export class InSignature {
  readonly label = input('IN');
}

type IconName = 'sistemas' | 'nuvem' | 'dados' | 'seguranca' | 'servidores' | 'seta' | 'externo';

/** Ícones de linha desenhados para o site (grade de 24 px, traço de 1,5). */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      @switch (name()) {
        @case ('sistemas') {
          <path d="M8.5 7l-5 5 5 5M15.5 7l5 5-5 5M13.6 4.5l-3.2 15" />
        }
        @case ('nuvem') {
          <path d="M7 18.5h9.6a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6.5 9.6 4.5 4.5 0 0 0 7 18.5Z" />
          <path d="M12 16v-5m-2.1 2 2.1-2.1 2.1 2.1" />
        }
        @case ('dados') {
          <path d="M3.5 20.5h17M6.5 20.5V16M11 20.5v-7M15.5 20.5v-5M20 20.5V11" />
          <path d="M4.5 10 9.5 6l3.5 2.5 6.5-5" />
        }
        @case ('seguranca') {
          <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />
          <path d="m8.8 12 2.3 2.3 4.3-4.7" />
        }
        @case ('servidores') {
          <!-- unidades de servidor empilhadas (diretriz da seção 9.5: não é um monitor) -->
          <rect x="3.5" y="3.5" width="17" height="4.6" rx="1" />
          <rect x="3.5" y="9.7" width="17" height="4.6" rx="1" />
          <rect x="3.5" y="15.9" width="17" height="4.6" rx="1" />
          <path d="M6.6 5.8h.01M6.6 12h.01M6.6 18.2h.01M13.5 5.8h4M13.5 12h4M13.5 18.2h4" />
        }
        @case ('externo') {
          <path d="M7 17 17 7M8.5 7H17v8.5" />
        }
        @default {
          <path d="M4 12h15.5M13.5 6l6 6-6 6" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      flex: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class Icon {
  readonly name = input<IconName | string | null | undefined>('seta');
}
