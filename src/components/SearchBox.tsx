'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { search, type SearchIndex, type SearchResult } from '@/lib/search';

type LoadState = 'loading' | 'ready' | 'error';

/** Caixa de busca client-side sobre o indice invertido gerado no build. */
export function SearchBox() {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/search-index.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<SearchIndex>;
      })
      .then((data) => {
        if (!cancelled) {
          setIndex(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results: SearchResult[] = useMemo(() => {
    if (!index || query.trim() === '') {
      return [];
    }
    return search(index, query);
  }, [index, query]);

  return (
    <div className="search-box">
      <label htmlFor="search-input" className="sr-only">
        Buscar posts
      </label>
      <input
        id="search-input"
        type="search"
        placeholder="Buscar por titulo, tag ou conteudo..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={state !== 'ready'}
      />

      {state === 'loading' && <p className="search-results__empty">Carregando indice de busca...</p>}
      {state === 'error' && (
        <p className="search-results__empty" role="alert">
          Nao foi possivel carregar o indice de busca. Rode `npm run search:index` e tente novamente.
        </p>
      )}
      {state === 'ready' && query.trim() !== '' && results.length === 0 && (
        <p className="search-results__empty">Nenhum post encontrado para &ldquo;{query}&rdquo;.</p>
      )}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result) => (
            <li key={result.slug} className="post-card">
              <h3>
                <Link href={`/posts/${result.slug}`}>{result.title}</Link>
              </h3>
              <p className="post-card__description">{result.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
