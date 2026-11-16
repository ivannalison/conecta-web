import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FRASE } from '../core/textos';
import { SymbolMark } from '../ui/brand';
import { Reveal } from '../ui/reveal';

/**
 * Faixa escura com uma frase de efeito. Não tem botão nem link: é só a frase,
 * com o símbolo dos sete cubos bem apagado ao fundo.
 */
@Component({
  selector: 'app-frase',
  imports: [Reveal, SymbolMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'escuro' },
  template: `
    <app-symbol class="marca" aria-hidden="true" />
    <div class="wrap">
      <p class="frase" appReveal>
        {{ t.linha1 }}
        <em class="destaque">{{ t.linha2 }}</em>
      </p>
    </div>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      overflow: hidden;
      padding-block: clamp(4.5rem, 14vh, 8.5rem);
      background: var(--grad-escuro);
    }
    .wrap {
      position: relative;
    }
    .frase {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: clamp(2.3rem, 5.6vw, 5.25rem);
      line-height: 1.04;
      letter-spacing: -0.025em;
    }
    .frase em {
      display: block;
    }
    .marca {
      position: absolute;
      top: 50%;
      right: clamp(-3rem, 5vw, 9rem);
      width: clamp(15rem, 27vw, 28rem);
      transform: translateY(-50%);
      opacity: 0.2;
    }
    @media (max-width: 60rem) {
      .marca {
        right: -5rem;
        opacity: 0.1;
      }
    }
  `,
})
export class Frase {
  protected readonly t = FRASE;
}
