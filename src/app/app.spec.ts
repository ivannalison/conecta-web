import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { contrast, ensureContrast, inkOn } from './core/color';
import { formatarWhatsapp, mailtoLink, whatsappLink } from './core/contact';
import { detectQuality } from './core/quality.service';
import { Site } from './core/site.models';
import { SiteService, isSite } from './core/site.service';
import { CONECTA, themeFrom } from './core/theme.service';
import { BOX_HEIGHT_RATIO, CUBE_CENTERS, CUBE_CENTERS_3D, ISO_TILT } from './scene/logo-geometry';
import { environment } from '../environments/environment';

const SITE: Site = {
  company: { nome: 'Conecta Tecnologia', email: 'contato@exemplo.com', whatsapp: '+55 11 90000-0000' },
  services: [{ slug: 'sistemas', nome: 'Sistemas', descricao: 'Texto' }],
  projects: { conceito: [], real: [] },
};

describe('Símbolo dos sete cubos', () => {
  it('tem exatamente sete cubos, simétricos em relação ao centro', () => {
    expect(CUBE_CENTERS).toHaveLength(7);
    expect(CUBE_CENTERS_3D).toHaveLength(7);
    for (const [x, y] of CUBE_CENTERS) {
      expect(CUBE_CENTERS.some(([ox, oy]) => ox === -x && oy === -y)).toBe(true);
    }
  });

  it('reproduz no 3D as proporções medidas na referência', () => {
    expect(Math.sin(ISO_TILT)).toBeCloseTo(70 / 129.5, 5);
    expect(BOX_HEIGHT_RATIO).toBeGreaterThan(0.7);
    expect(BOX_HEIGHT_RATIO).toBeLessThan(0.9);
  });
});

describe('Contraste das paletas (WCAG AA)', () => {
  // Paletas dos quatro projetos conceito (v4.0, seção 4.2).
  const paletas = [
    { nome: 'Supermercado', primaria: '#2E9E4F', secundaria: '#FFC93C', fundo: '#FFF8E7' },
    { nome: 'Academia', primaria: '#C6F432', secundaria: '#2A2A2A', fundo: '#0B0B0B' },
    { nome: 'Agente de IA', primaria: '#10B981', secundaria: null, fundo: '#0B1F1A', texto: '#FFFFFF' },
    { nome: 'Dashboard', primaria: '#7C3AED', secundaria: '#22D3EE', fundo: '#0F0B1E' },
  ];

  it.each(paletas)('$nome: textos com 4,5:1 e botão com 3:1', (tema) => {
    const t = themeFrom(tema);
    expect(contrast(t.text, t.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.accentText, t.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.ctaText, t.cta)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.cta, t.bg)).toBeGreaterThanOrEqual(3);
    // Marca e assinatura IN: só branco ou Graphite.
    expect(['#ffffff', '#171a1f']).toContain(t.mono);
  });

  it('a paleta da Conecta também passa', () => {
    expect(contrast(CONECTA.text, CONECTA.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(CONECTA.accentText, CONECTA.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(CONECTA.ctaText, CONECTA.cta)).toBeGreaterThanOrEqual(4.5);
  });

  it('ajusta uma cor fraca até ficar legível e mantém a que já é', () => {
    expect(contrast(ensureContrast('#2E9E4F', '#FFF8E7'), '#FFF8E7')).toBeGreaterThanOrEqual(4.5);
    expect(ensureContrast('#FFFFFF', '#000000')).toBe('#ffffff');
    expect(inkOn('#FFF8E7')).toBe('#171a1f');
    expect(inkOn('#07111D')).toBe('#ffffff');
  });
});

describe('Links de contato', () => {
  it('monta o mailto e recusa e-mail vazio ou inválido', () => {
    expect(mailtoLink('contato@exemplo.com')).toMatch(/^mailto:contato@exemplo\.com\?subject=/);
    expect(mailtoLink(null)).toBeNull();
    expect(mailtoLink('sem-arroba')).toBeNull();
  });

  it('monta o wa.me só com dígitos e com a mensagem pronta', () => {
    expect(whatsappLink('+55 11 90000-0000', 'Olá!')).toBe('https://wa.me/5511900000000?text=Ol%C3%A1!');
    expect(whatsappLink(null)).toBeNull();
    expect(whatsappLink('123')).toBeNull();
  });

  it('formata o número para leitura', () => {
    expect(formatarWhatsapp('5511900000000')).toBe('+55 11 90000-0000');
    expect(formatarWhatsapp(undefined)).toBeNull();
  });
});

describe('Níveis de qualidade', () => {
  const janela = (search: string, reduzido = false) =>
    ({
      location: { search },
      matchMedia: (query: string) => ({ matches: reduzido && query.includes('reduced-motion') }),
      navigator: {},
      innerWidth: 1280,
      document,
    }) as unknown as Window;

  it('respeita a preferência de movimento reduzido', () => {
    expect(detectQuality(janela('', true))).toBe('reduzido');
  });

  it('aceita forçar um nível pela URL e ignora valor desconhecido', () => {
    expect(detectQuality(janela('?q=medio', true))).toBe('medio');
    expect(detectQuality(janela('?q=turbo', true))).toBe('reduzido');
  });

  it('sem WebGL cai para o nível simplificado', () => {
    // O jsdom dos testes não tem WebGL.
    expect(detectQuality(janela(''))).toBe('simplificado');
  });
});

describe('SiteService', () => {
  let service: SiteService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(SiteService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('carrega o conteúdo e distribui para as seções', () => {
    service.load();
    expect(service.state()).toBe('carregando');
    http.expectOne(`${environment.apiUrl}/site`).flush(SITE);
    expect(service.state()).toBe('ok');
    expect(service.services()).toHaveLength(1);
    expect(service.company()?.nome).toBe('Conecta Tecnologia');
  });

  it('resposta em formato inesperado vira estado de erro, sem quebrar a tela', () => {
    service.load();
    http.expectOne(`${environment.apiUrl}/site`).flush({ qualquer: 'coisa' });
    expect(service.state()).toBe('erro');
    expect(service.services()).toEqual([]);
  });

  it('valida o formato mínimo da resposta', () => {
    expect(isSite(SITE)).toBe(true);
    expect(isSite(null)).toBe(false);
    expect(isSite({ services: [] })).toBe(false);
  });
});
