import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { formatarWhatsapp, mailtoLink, whatsappLink } from '../core/contact';
import { SiteService } from '../core/site.service';
import { CONTATO, MENU } from '../core/textos';
import { InSignature, Logo } from '../ui/brand';
import { Reveal } from '../ui/reveal';

/** Canais de contato montados a partir dos dados da API. Sem dado, sem link (nada é inventado). */
function canais(site: SiteService) {
  return computed(() => {
    const company = site.company();
    const lista = [
      { nome: 'WhatsApp', valor: formatarWhatsapp(company?.whatsapp), link: whatsappLink(company?.whatsapp), externo: true },
      { nome: 'E-mail', valor: company?.email ?? null, link: mailtoLink(company?.email), externo: false },
    ];
    return lista.filter((canal) => canal.link && canal.valor);
  });
}

/** Contato: cartão escuro com WhatsApp (wa.me) e e-mail (mailto), sem formulário (doc. mestre, seção 12). */
@Component({
  selector: 'app-contato',
  imports: [Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'contato', class: 'section' },
  template: `
    <div class="wrap">
      <div class="cartao escuro" appReveal>
        <h2>{{ t.titulo[0] }} {{ t.titulo[1] }}</h2>
        <p>{{ t.apoio }}</p>

        @if (canais().length) {
          <ul class="canais">
            @for (canal of canais(); track canal.nome; let i = $index) {
              <li>
                <a
                  class="btn"
                  [class.btn--cta]="i === 0"
                  [class.btn--line]="i > 0"
                  [href]="canal.link"
                  [attr.target]="canal.externo ? '_blank' : null"
                  [attr.rel]="canal.externo ? 'noopener' : null"
                >
                  <span class="sr-only">{{ canal.nome }}:</span>
                  <span class="canal__valor">{{ canal.valor }}</span>
                </a>
              </li>
            }
          </ul>
        } @else if (site.state() !== 'carregando') {
          <p class="sem">{{ t.semCanais }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .cartao {
      padding: clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 5vw, 4rem);
      border-radius: 1.75rem;
      background: var(--grad-escuro);
      box-shadow: var(--sombra-forte);
      text-align: center;
    }
    h2 {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: clamp(1.9rem, 3.9vw, 3.6rem);
      line-height: 1.1;
      letter-spacing: -0.02em;
      text-wrap: balance;
    }
    .cartao > p {
      max-width: 44rem;
      margin: 1rem auto 0;
      font-size: clamp(1.5rem, 1.8vw, 1.88rem);
      color: #dfe4ee;
    }
    .canais {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.9rem;
      margin-top: 2.25rem;
    }
    .canal__valor {
      overflow-wrap: anywhere;
    }
    .cartao > .sem {
      margin-top: 2rem;
      color: var(--muted);
    }
    @media (max-width: 34rem) {
      .canais li,
      .canais .btn {
        width: 100%;
      }
    }
  `,
})
export class Contato {
  protected readonly site = inject(SiteService);
  protected readonly t = CONTATO;
  protected readonly canais = canais(this.site);
}

/** Rodapé escuro: marca, slogan, navegação, contatos e assinatura IN (doc. mestre 13 + v4.0 2.2). */
@Component({
  selector: 'app-rodape',
  imports: [Logo, InSignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'escuro' },
  template: `
    <footer class="wrap">
      <div class="linha">
        <div class="marca">
          <app-logo />
          <p class="slogan">{{ slogan() }}</p>
        </div>

        <nav aria-label="Rodapé">
          <h2>Navegação</h2>
          <ul>
            @for (item of menu; track item.alvo) {
              <li><a [href]="'#' + item.alvo">{{ item.rotulo }}</a></li>
            }
          </ul>
        </nav>

        @if (canais().length) {
          <div>
            <h2>Contato</h2>
            <ul>
              @for (canal of canais(); track canal.nome) {
                <li>
                  <a [href]="canal.link" [attr.target]="canal.externo ? '_blank' : null" [attr.rel]="canal.externo ? 'noopener' : null">
                    <span class="sr-only">{{ canal.nome }}:</span> {{ canal.valor }}
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </div>

      <div class="base">
        <p>© {{ ano }} Conecta. Todos os direitos reservados.</p>
        <app-in class="in" />
      </div>
    </footer>
  `,
  styles: `
    :host {
      display: block;
      background: var(--navy);
    }
    .linha {
      display: grid;
      grid-template-columns: minmax(0, 5fr) minmax(0, 3fr) minmax(0, 4fr);
      gap: 2.5rem clamp(2rem, 5vw, 5rem);
      padding-block: clamp(3rem, 8vh, 4.5rem);
    }
    .slogan {
      max-width: 24rem;
      margin-top: 1.25rem;
      font-size: 1.42rem;
      color: var(--muted);
    }
    h2 {
      margin-bottom: 1rem;
      font-size: 1.42rem;
      font-weight: 700;
    }
    ul {
      display: grid;
      gap: 0.55rem;
    }
    li a {
      font-size: 1.42rem;
      color: var(--muted);
      overflow-wrap: anywhere;
      transition: color 0.2s;
    }
    li a:hover {
      color: var(--lime);
    }
    .base {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding-block: 1.4rem;
      border-top: 1px solid var(--line);
      font-size: 1.28rem;
      color: var(--muted);
    }
    .in {
      width: 2.4rem;
      flex: none;
    }
    @media (max-width: 56rem) {
      .linha {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Rodape {
  private readonly site = inject(SiteService);
  protected readonly menu = MENU;
  protected readonly canais = canais(this.site);
  protected readonly slogan = computed(() => this.site.company()?.slogan || 'Inovação. Conexão. Futuro.');
  protected readonly ano = new Date().getFullYear();
}
