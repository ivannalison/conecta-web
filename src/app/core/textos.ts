/**
 * Textos fixos do site (os que não vêm da API).
 *
 * Todos os textos deste arquivo foram revisados e APROVADOS pelo responsável em 16/11/2026.
 * Nenhum texto aqui cita cliente, número ou resultado: nada foi inventado.
 */

// ── Hero (doc. mestre, seção 7) ──────────────────────────────
export const HERO = {
  slogan: 'Inovação. Conexão. Futuro.',
  apoio:
    'Desenvolvemos soluções digitais que transformam ideias em negócios reais, unindo tecnologia e inovação para gerar resultados.',
  botaoProjetos: 'Conheça nossos projetos',
  botaoContato: 'Fale conosco',
};

/**
 * Mídia do hero (doc. mestre, seção 7): vídeo curto da Amazônia + imagem de reserva.
 * PENDENTE: o responsável precisa fornecer os arquivos com licença de uso comercial.
 * Quando existirem, colocar em public/media/ e preencher os caminhos abaixo.
 */
export const HERO_MEDIA: { poster: string | null; video: string | null } = {
  poster: null, // ex.: 'media/hero-amazonia.jpg'
  video: null, // ex.: 'media/hero-amazonia.mp4'
};

// ── Para quem (v4.0, seção 6.1) ──────────────────────────────
export const PARA_QUEM = {
  titulo: ['Do primeiro site', 'até o sistema que roda a operação sozinho.'],
  apoio: 'O tamanho da empresa muda o problema. A forma de resolver acompanha.',
  blocos: [
    {
      porte: 'Pequenas empresas',
      texto: 'Presença digital e venda online para quem ainda resolve tudo por planilha e mensagem.',
      indicado: ['Site institucional', 'Loja online', 'Atendimento automático no WhatsApp'],
    },
    {
      porte: 'Médias empresas',
      texto: 'Sistemas que ligam os setores, tiram tarefas repetitivas da equipe e organizam os dados.',
      indicado: ['Sistemas web sob medida', 'Integrações e APIs', 'Painéis de indicadores'],
    },
    {
      porte: 'Grandes empresas',
      texto: 'Reforço técnico em frentes específicas, seguindo os padrões e processos que a empresa já tem.',
      indicado: ['Cloud & DevOps', 'Segurança de aplicações', 'Monitoramento e observabilidade'],
    },
  ],
};

// ── Serviços ─────────────────────────────────────────────────
export const SERVICOS = {
  titulo: 'Nossos serviços',
  apoio: 'Do código à operação, tecnologia para gerar resultados.',
  // Cartão escuro no fim da grade
  chamadaTitulo: 'Pronto para dar o próximo passo?',
  chamadaTexto: 'Converse com um especialista e descubra como a tecnologia pode impulsionar o seu negócio.',
  chamadaBotao: 'Fale agora',
};

// ── Frase de efeito (faixa escura entre a vitrine e os projetos) ─
// Só a frase: sem botão, sem link e sem números.
export const FRASE = {
  linha1: 'Você cuida do seu negócio.',
  linha2: 'A tecnologia cuida do resto.',
};

// ── Vitrine (v4.0, seção 4) ──────────────────────────────────
export const VITRINE = {
  titulo: ['Imagine o seu negócio', 'funcionando assim.'],
  // Sem texto de apoio: cada cartão já leva o selo "Projeto conceito" (regra 4.1).
  selo: 'Projeto conceito',
  botao: 'Quero algo parecido',
};

// ── Projetos reais (v4.0, seção 5) ───────────────────────────
export const PROJETOS = {
  titulo: ['Projetos reais,', 'código aberto.'],
  apoio: 'Trabalhos publicados no GitHub, com o código disponível para consulta.',
  vazio: 'Em breve, novos projetos.', // doc. mestre 11.1
};

// ── Como trabalhamos (etapas: v4.0, seção 6.2) ───────────────
export const PROCESSO = {
  titulo: ['Como', 'trabalhamos.'],
  etapas: [
    { nome: 'Conversa inicial', texto: 'Entendemos o problema, o contexto e o que já existe hoje.' },
    { nome: 'Proposta', texto: 'Escopo, prazo e valor definidos por escrito, antes de qualquer código.' },
    { nome: 'Desenvolvimento', texto: 'Entregas parciais, para você acompanhar e ajustar no caminho.' },
    { nome: 'Entrega e suporte', texto: 'Publicação, documentação e acompanhamento depois que entra no ar.' },
  ],
};

// ── Sobre ────────────────────────────────────────────────────
export const SOBRE = {
  titulo: ['Transformando ideias', 'em soluções.'],
  // Usado só enquanto a API não devolver company.apresentacao.
  texto:
    'A Conecta desenvolve sistemas, sites, soluções de automação com IA e análise de dados. Oferecemos suporte completo e contínuo em cada etapa, acompanhando você de perto para garantir soluções eficientes e resultados consistentes. Seguimos ao seu lado.',
  fundadorRotulo: 'Fundador',
  fundador: 'Ivan Nalison Cassimiro Xavier', // v4.0, seção 2.2
};

// ── Contato (faixa de chamada da referência visual) ──────────
export const CONTATO = {
  titulo: ['Vamos construir juntos', 'o próximo passo do seu negócio?'],
  apoio: 'Entre em contato e descubra como a Conecta pode impulsionar suas ideias.',
  semCanais: 'Os canais de contato serão divulgados em breve.',
};

// ── Avisos de carregamento e falha (doc. mestre 18.2) ────────
export const AVISOS = {
  carregando: 'Carregando…',
  erro: 'Não foi possível carregar este conteúdo agora.',
  tentar: 'Tentar de novo',
};

export const MENU = [
  { rotulo: 'Serviços', alvo: 'servicos' },
  { rotulo: 'Vitrine', alvo: 'vitrine' },
  { rotulo: 'Projetos', alvo: 'projetos' },
  { rotulo: 'Sobre', alvo: 'sobre' },
  { rotulo: 'Contato', alvo: 'contato' },
] as const;
