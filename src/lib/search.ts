/**
 * Busca full-text client-side sobre um indice invertido.
 *
 * O indice e gerado em tempo de build (scripts/build-search-index.ts) e
 * consumido no navegador sem nenhum servico externo. Termos no titulo
 * pesam 3x, nas tags 2x e no texto 1x.
 */

export interface SearchDoc {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Texto plano do post, sem marca MDX. */
  text: string;
}

export interface SearchIndexEntry {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

export interface SearchIndex {
  /** Metadados para exibicao dos resultados, indexados por slug. */
  docs: Record<string, SearchIndexEntry>;
  /** Indice invertido: termo -> slug -> score acumulado. */
  postings: Record<string, Record<string, number>>;
}

/** Normaliza texto: minusculas, sem acentos, sem pontuacao. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function tokenize(text: string): string[] {
  return normalize(text).match(/[a-z0-9]+/g) ?? [];
}

function addTerms(postings: SearchIndex['postings'], slug: string, terms: string[], weight: number) {
  const frequencies = new Map<string, number>();
  for (const term of terms) {
    frequencies.set(term, (frequencies.get(term) ?? 0) + 1);
  }
  for (const [term, count] of frequencies) {
    postings[term] ??= {};
    postings[term][slug] = (postings[term][slug] ?? 0) + count * weight;
  }
}

export function buildIndex(docs: SearchDoc[]): SearchIndex {
  const index: SearchIndex = { docs: {}, postings: {} };
  for (const doc of docs) {
    index.docs[doc.slug] = {
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      tags: doc.tags,
    };
    addTerms(index.postings, doc.slug, tokenize(doc.title), 3);
    addTerms(index.postings, doc.slug, doc.tags.flatMap(tokenize), 2);
    addTerms(index.postings, doc.slug, tokenize(doc.text), 1);
  }
  return index;
}

export interface SearchResult extends SearchIndexEntry {
  score: number;
}

/**
 * Busca por todos os termos da consulta (AND). Retorna resultados
 * ordenados por score decrescente, limitados a `limit`.
 */
export function search(index: SearchIndex, query: string, limit = 10): SearchResult[] {
  const terms = tokenize(query);
  if (terms.length === 0) {
    return [];
  }

  const scores = new Map<string, number>();
  for (const term of terms) {
    const hits = index.postings[term];
    if (!hits) {
      return []; // AND estrito: um termo ausente zera o resultado
    }
    for (const [slug, score] of Object.entries(hits)) {
      scores.set(slug, (scores.get(slug) ?? 0) + score);
    }
  }

  return [...scores.entries()]
    .map(([slug, score]) => ({ ...index.docs[slug], score }))
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, limit);
}
