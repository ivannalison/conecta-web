/** Contratos da API (GET /api/v1/site e /projects/:slug). Espelham conecta-api/src/schemas/responses.ts. */

export interface Link {
  tipo: string;
  rotulo: string;
  url: string;
}

export interface Tema {
  primaria: string;
  secundaria?: string | null;
  fundo: string;
  texto?: string | null;
}

export interface Company {
  nome: string;
  slogan?: string | null;
  frasePrincipal?: string | null;
  descricao?: string | null;
  apresentacao?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  redesSociais?: Link[];
  fundador?: string | null;
}

export interface Service {
  slug: string;
  nome: string;
  descricao: string;
  descricaoDetalhada?: string | null;
  icone?: string | null;
  topicos?: string[];
}

export interface Project {
  slug: string;
  nome: string;
  tipo: 'conceito' | 'real';
  descricao: string;
  imagem?: string | null;
  tecnologias?: string[];
  links?: Link[];
  destaque?: boolean;
  tema?: Tema | null;
  demo?: string | null;
  mensagemWhatsapp?: string | null;
}

export interface ProjectDetail extends Project {
  descricaoCompleta?: string | null;
  problema?: string | null;
  objetivo?: string | null;
  solucao?: string | null;
  funcionalidades?: string[];
}

export interface Site {
  company: Company | null;
  services: Service[];
  projects: { conceito: Project[]; real: Project[] };
}
