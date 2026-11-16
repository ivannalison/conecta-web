import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, retry, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProjectDetail, Site } from './site.models';

export type LoadState = 'carregando' | 'ok' | 'erro';

/** Tempo máximo de espera pela API antes de mostrar o aviso de indisponível. */
const TIMEOUT_MS = 10_000;

/**
 * Busca o conteúdo do site na API (doc. mestre, seção 18).
 * A primeira tela não depende desta resposta: os textos fixos ficam no front-end.
 */
@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly http = inject(HttpClient);

  private readonly data = signal<Site | null>(null);
  readonly state = signal<LoadState>('carregando');

  readonly company = computed(() => this.data()?.company ?? null);
  readonly services = computed(() => this.data()?.services ?? []);
  readonly conceitos = computed(() => this.data()?.projects.conceito ?? []);
  readonly reais = computed(() => this.data()?.projects.real ?? []);

  load(): void {
    this.state.set('carregando');
    this.http
      .get<Site>(`${environment.apiUrl}/site`)
      .pipe(timeout(TIMEOUT_MS), retry({ count: 1, delay: 800 }))
      .subscribe({
        next: (site) => {
          if (!isSite(site)) {
            this.state.set('erro');
            return;
          }
          this.data.set(site);
          this.state.set('ok');
        },
        // Nada de detalhe técnico para o visitante: só o estado "erro".
        error: () => this.state.set('erro'),
      });
  }

  project(slug: string): Observable<ProjectDetail> {
    return this.http
      .get<ProjectDetail>(`${environment.apiUrl}/projects/${encodeURIComponent(slug)}`)
      .pipe(timeout(TIMEOUT_MS));
  }
}

/** Confere o formato mínimo da resposta, para não quebrar a tela com um JSON inesperado. */
export function isSite(value: unknown): value is Site {
  const site = value as Site | null;
  return (
    !!site &&
    typeof site === 'object' &&
    Array.isArray(site.services) &&
    !!site.projects &&
    Array.isArray(site.projects.conceito) &&
    Array.isArray(site.projects.real)
  );
}
