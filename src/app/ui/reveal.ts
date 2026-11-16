import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Faz o bloco entrar suavemente quando aparece na tela.
 * Uso: <div appReveal> ou <li [appReveal]="i"> (o número vira um pequeno atraso em cascata).
 * Sem JavaScript de animação: só uma classe CSS, então funciona igual sem a cena 3D.
 */
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class Reveal implements OnDestroy {
  readonly appReveal = input<number | ''>('');
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const order = Number(this.appReveal()) || 0;
      if (order) this.el.style.setProperty('--reveal-delay', `${Math.min(order, 8) * 0.07}s`);
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.el.classList.add('is-in');
            this.observer?.disconnect();
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      this.observer.observe(this.el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
