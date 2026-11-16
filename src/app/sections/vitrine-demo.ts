import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Tela ilustrativa de um projeto conceito (v4.0, seção 4): desenhada em HTML e CSS,
 * com as cores do próprio projeto (variáveis --c-* definidas no cartão da vitrine).
 * É decorativa: nomes, preços e números são só de exemplo, e fica oculta para leitores de tela.
 * A animação roda uma vez, quando o cartão entra na tela (classe .is-in da diretiva appReveal).
 */
@Component({
  selector: 'app-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="tela">
      <div class="tela__barra"><i></i><i></i><i></i></div>

      @switch (tipo()) {
        @case ('carrinho') {
          <div class="loja">
            <div class="loja__topo">
              <span class="busca">Buscar produtos</span>
              <span class="sacola">3</span>
            </div>
            <ul class="produtos">
              @for (p of produtos; track p.nome) {
                <li>
                  @if (p.oferta) {
                    <em>Oferta</em>
                  }
                  <svg class="foto" viewBox="0 0 48 48">
                    @switch (p.nome) {
                      @case ('Banana') {
                        <path d="M9 14c2 14 12 24 28 22 3-.4 5-2 5-4-12 3-24-4-27-19-.3-1.6-1.6-2.4-3.2-2.200C10 11 8.8 12.2 9 14Z" fill="#f6c92f" />
                        <path d="M15 13c3 15 15 22 27 19" fill="none" stroke="#d9a514" stroke-width="1.5" stroke-linecap="round" />
                        <path d="M10 11.5 9 7.500l3.5-.8 1 4Z" fill="#7a5a1e" />
                      }
                      @case ('Tomate') {
                        <ellipse cx="24" cy="28" rx="17" ry="15" fill="#e5483a" />
                        <ellipse cx="16" cy="24" rx="4" ry="2.5" fill="#fff" opacity="0.3" transform="rotate(-30 16 24)" />
                        <path d="M24 15c-2-3-6-4-9-3 2 1 3 3 4 4-3 0-5 2-6 4 3-1 6-1 8 0l3 3 3-3c2-1 5-1 8 0-1-2-3-4-6-4 1-1 2-3 4-4-3-1-7 0-9 3Z" fill="#3f9a3c" />
                        <path d="M24 15V9.5" fill="none" stroke="#2f7a2d" stroke-width="2.5" stroke-linecap="round" />
                      }
                      @default {
                        <path d="M24 6c5 0 8 3 9 6 4 0 8 4 8 9 0 2-.6 4-1.6 5.4 1.6 2.6 2.6 5.1 1.6 8.6-1.5 5-8 8-17 8S8.5 40 7 35c-1-3.5 0-6 1.6-8.600C7.6 25 7 23 7 21c0-5 4-9 8-9 1-3 4-6 9-6Z" fill="#5fae40" />
                        <path d="M24 12c3 0 5 2 5.5 4.5 3 .2 5.5 3 5.5 6.5 0 1.5-.5 3-1.3 4 .8 1.5 1.3 3.5.6 5.500C33 36 29 38 24 38s-9-2-10.3-5.500c-.7-2-.2-4 .6-5.5-.8-1-1.3-2.5-1.3-4 0-3.5 2.5-6.3 5.5-6.5.5-2.5 2.5-4.5 5.5-4.500Z" fill="#8fd365" />
                        <path d="M24 17v19M24 25l-6-5M24 29l6-6M24 33l-5-3" fill="none" stroke="#4f9a34" stroke-width="1.5" stroke-linecap="round" />
                      }
                    }
                  </svg>
                  <b>{{ p.nome }}</b>
                  <small>{{ p.preco }}</small>
                  <span class="mais">+</span>
                </li>
              }
            </ul>
            <div class="fechar">
              <span>3 itens no carrinho</span>
              <strong>Finalizar pedido</strong>
            </div>
          </div>
        }
        @case ('matricula') {
          <div class="gym">
            <p class="rotulo">Escolha seu plano</p>
            <ul class="planos">
              <li>Mensal</li>
              <li class="on">Trimestral</li>
              <li>Anual</li>
            </ul>
            <p class="rotulo">Aulas de hoje</p>
            <ul class="aulas">
              @for (a of aulas; track a.hora) {
                <li>
                  <span>{{ a.hora }}</span>
                  <b>{{ a.nome }}</b>
                  <i><u [style.--w]="a.ocupacao + '%'"></u></i>
                </li>
              }
            </ul>
            <strong class="botao">Fazer matrícula</strong>
          </div>
        }
        @case ('conversa-whatsapp') {
          <div class="chat">
            @for (m of conversa; track m.texto; let i = $index) {
              <p class="msg" [class.msg--robo]="m.robo" [style.--n]="i">{{ m.texto }}</p>
            }
            <p class="digitando" [style.--n]="conversa.length"><i></i><i></i><i></i></p>
          </div>
        }
        @case ('graficos') {
          <div class="painel">
            <ul class="kpis">
              @for (k of kpis; track k.nome) {
                <li>
                  <small>{{ k.nome }}</small>
                  <b>{{ k.valor }}</b>
                </li>
              }
            </ul>
            <div class="grafico">
              <ul class="barras">
                @for (b of barras; track $index) {
                  <li [style.--h]="b + '%'" [style.--n]="$index"></li>
                }
              </ul>
              <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                <polyline points="0,82 43,64 86,70 129,44 172,52 215,26 258,34 300,10" />
              </svg>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      --d-texto: var(--c-text, #fff);
      --d-fundo: var(--c-bg, #141a2e);
      --d-cor: var(--c-pri, #97d138);
      --d-sobre-cor: var(--c-on-pri, #12172b);
      --d-cor2: var(--c-sec, var(--d-cor));
      --d-painel: color-mix(in srgb, var(--d-texto) 7%, var(--d-fundo));
      --d-linha: color-mix(in srgb, var(--d-texto) 14%, transparent);
      --d-suave: color-mix(in srgb, var(--d-texto) 68%, transparent);
      font-size: 1.08rem;
      line-height: 1.3;
    }
    ul,
    p {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    i,
    em,
    u {
      font-style: normal;
      text-decoration: none;
    }
    .tela {
      border: 1px solid var(--d-linha);
      border-radius: 1rem;
      background: var(--d-painel);
      box-shadow: 0 1.5rem 2.5rem -1.5rem rgba(0, 0, 0, 0.45);
      overflow: hidden;
    }
    .tela__barra {
      display: flex;
      gap: 0.4rem;
      padding: 0.7rem 0.9rem;
      border-bottom: 1px solid var(--d-linha);
    }
    .tela__barra i {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background: var(--d-linha);
    }
    .loja,
    .gym,
    .chat,
    .painel {
      display: grid;
      gap: 0.9rem;
      padding: 1.1rem;
    }
    .rotulo,
    small {
      font-size: 1rem;
      color: var(--d-suave);
    }
    .botao,
    .fechar strong {
      padding: 0.7rem 1.1rem;
      border-radius: 999px;
      background: var(--d-cor);
      color: var(--d-sobre-cor);
      font-weight: 700;
      text-align: center;
    }

    // ── Supermercado: catálogo e carrinho ──────────────────────
    .loja__topo {
      display: flex;
      align-items: center;
      gap: 0.7rem;
    }
    .busca {
      flex: 1;
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      background: var(--d-fundo);
      border: 1px solid var(--d-linha);
      font-size: 1rem;
      color: var(--d-suave);
    }
    .sacola {
      display: grid;
      place-items: center;
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      background: var(--d-cor);
      color: var(--d-sobre-cor);
      font-weight: 800;
    }
    .produtos {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.6rem;
    }
    .produtos li {
      position: relative;
      display: grid;
      gap: 0.15rem;
      padding: 0.7rem;
      border-radius: 0.8rem;
      background: var(--d-fundo);
      border: 1px solid var(--d-linha);
    }
    .foto {
      width: 3.4rem;
      height: 3.4rem;
      margin-bottom: 0.4rem;
    }
    .produtos em {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
      background: var(--d-cor2);
      color: #171a1f;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .mais {
      position: absolute;
      right: 0.5rem;
      bottom: 0.5rem;
      display: grid;
      place-items: center;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
      background: var(--d-cor);
      color: var(--d-sobre-cor);
      font-weight: 800;
      line-height: 1;
    }
    .fechar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 1.05rem;
      font-weight: 600;
    }

    // ── Academia: planos e horários ────────────────────────────
    .planos {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
    .planos li {
      padding: 0.65rem 0.4rem;
      border: 1px solid var(--d-linha);
      border-radius: 0.8rem;
      text-align: center;
      font-weight: 600;
    }
    .planos .on {
      background: var(--d-cor);
      border-color: var(--d-cor);
      color: var(--d-sobre-cor);
    }
    .aulas {
      display: grid;
      gap: 0.5rem;
    }
    .aulas li {
      display: grid;
      grid-template-columns: 3.4rem 1fr 32%;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.05rem;
    }
    .aulas span {
      color: var(--d-suave);
      font-variant-numeric: tabular-nums;
    }
    .aulas i {
      display: block;
      height: 0.45rem;
      border-radius: 999px;
      background: var(--d-linha);
      overflow: hidden;
    }
    .aulas u {
      display: block;
      width: var(--w);
      height: 100%;
      border-radius: inherit;
      background: var(--d-cor);
      transform-origin: left;
    }

    // ── Agente de IA: conversa ─────────────────────────────────
    .chat {
      gap: 0.55rem;
    }
    .msg {
      justify-self: end;
      max-width: 82%;
      padding: 0.6rem 0.9rem;
      border-radius: 1rem 1rem 0.25rem 1rem;
      background: var(--d-cor);
      color: var(--d-sobre-cor);
      font-size: 1.08rem;
    }
    .msg--robo {
      justify-self: start;
      border-radius: 1rem 1rem 1rem 0.25rem;
      background: var(--d-fundo);
      border: 1px solid var(--d-linha);
      color: var(--d-texto);
    }
    .digitando {
      display: flex;
      gap: 0.3rem;
      justify-self: end;
      padding: 0.7rem 0.9rem;
      border-radius: 1rem 1rem 0.25rem 1rem;
      background: color-mix(in srgb, var(--d-cor) 30%, transparent);
    }
    .digitando i {
      width: 0.42rem;
      height: 0.42rem;
      border-radius: 50%;
      background: var(--d-texto);
      animation: pisca 1.2s infinite;
    }
    .digitando i:nth-child(2) {
      animation-delay: 0.2s;
    }
    .digitando i:nth-child(3) {
      animation-delay: 0.4s;
    }

    // ── Dashboard: indicadores e gráfico ───────────────────────
    .kpis {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.6rem;
    }
    .kpis li {
      display: grid;
      gap: 0.2rem;
      padding: 0.7rem;
      border-radius: 0.8rem;
      background: var(--d-fundo);
      border: 1px solid var(--d-linha);
    }
    .kpis b {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 800;
    }
    .grafico {
      position: relative;
      height: 8.5rem;
      padding: 0.7rem;
      border-radius: 0.8rem;
      background: var(--d-fundo);
      border: 1px solid var(--d-linha);
    }
    .barras {
      display: flex;
      align-items: flex-end;
      gap: 6%;
      height: 100%;
    }
    .barras li {
      flex: 1;
      height: var(--h);
      border-radius: 0.3rem 0.3rem 0 0;
      background: color-mix(in srgb, var(--d-cor) 75%, transparent);
      transform-origin: bottom;
    }
    .grafico svg {
      position: absolute;
      inset: 0.7rem;
      width: calc(100% - 1.4rem);
      height: calc(100% - 1.4rem);
      overflow: visible;
    }
    polyline {
      fill: none;
      stroke: var(--d-cor2);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }

    // ── Animações: uma vez, quando o cartão aparece ────────────
    :host-context(.reveal) .msg,
    :host-context(.reveal) .digitando {
      opacity: 0;
    }
    :host-context(.is-in) .msg,
    :host-context(.is-in) .digitando {
      animation: surge 0.45s var(--ease) both;
      animation-delay: calc(0.5s + var(--n) * 0.9s);
    }
    :host-context(.is-in) .barras li {
      animation: cresce 0.7s var(--ease) both;
      animation-delay: calc(0.3s + var(--n) * 0.07s);
    }
    // A linha é revelada da esquerda para a direita.
    :host-context(.is-in) .grafico svg {
      animation: traca 1.4s 0.7s var(--ease) both;
    }
    :host-context(.is-in) .aulas u {
      animation: estica 0.9s 0.4s var(--ease) both;
    }
    :host-context(.is-in) .sacola {
      animation: pulo 0.6s 0.8s var(--ease) both;
    }
    @keyframes surge {
      from {
        opacity: 0;
        transform: translateY(0.5rem);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes cresce {
      from {
        transform: scaleY(0);
      }
    }
    @keyframes estica {
      from {
        transform: scaleX(0);
      }
    }
    @keyframes traca {
      from {
        clip-path: inset(-10% 100% -10% 0);
      }
      to {
        clip-path: inset(-10% -2% -10% 0);
      }
    }
    @keyframes pulo {
      50% {
        transform: scale(1.25);
      }
    }
    // Movimento reduzido: as telas já aparecem completas, sem animação.
    @media (prefers-reduced-motion: reduce) {
      .msg,
      .digitando,
      .digitando i,
      .barras li,
      .grafico svg,
      .aulas u,
      .sacola {
        opacity: 1 !important;
        animation: none !important;
      }
    }
    @keyframes pisca {
      0%,
      60%,
      100% {
        opacity: 1;
      }
      30% {
        opacity: 0.25;
      }
    }
  `,
})
export class VitrineDemo {
  /** Tipo de demonstração cadastrado no projeto: carrinho, matricula, conversa-whatsapp ou graficos. */
  readonly tipo = input<string | null | undefined>(null);

  // Conteúdo de exemplo das telas (não são dados de clientes).
  protected readonly produtos = [
    { nome: 'Banana', preco: 'R$ 5,90', oferta: true },
    { nome: 'Tomate', preco: 'R$ 7,50', oferta: false },
    { nome: 'Alface', preco: 'R$ 3,20', oferta: false },
  ];
  protected readonly aulas = [
    { hora: '06:00', nome: 'Musculação', ocupacao: 45 },
    { hora: '18:30', nome: 'Funcional', ocupacao: 85 },
    { hora: '20:00', nome: 'Spinning', ocupacao: 65 },
  ];
  protected readonly conversa = [
    { robo: false, texto: 'Vocês abrem no sábado?' },
    { robo: true, texto: 'Abrimos, das 8h às 14h. Quer agendar um horário?' },
    { robo: false, texto: 'Quero, às 10h.' },
    { robo: true, texto: 'Pronto! Agendado para sábado, às 10h.' },
  ];
  protected readonly kpis = [
    { nome: 'Vendas', valor: '1.284' },
    { nome: 'Pedidos', valor: '312' },
    { nome: 'Ticket médio', valor: 'R$ 86' },
  ];
  protected readonly barras = [38, 52, 46, 68, 60, 84, 74];
}
