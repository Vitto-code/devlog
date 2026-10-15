import { describe, expect, it } from 'vitest';
import { buildIndex, normalize, search, tokenize, type SearchDoc } from '../src/lib/search';

const docs: SearchDoc[] = [
  {
    slug: 'server-components',
    title: 'Renderizar no servidor',
    description: 'Server Components na pratica',
    tags: ['react', 'nextjs'],
    text: 'Componentes de servidor reduzem o JavaScript enviado ao navegador.',
  },
  {
    slug: 'testes-contrato',
    title: 'Testes de contrato',
    description: 'Testando contratos em vez de implementacao',
    tags: ['testes'],
    text: 'Mocks profundos tornam a suite fragil.',
  },
  {
    slug: 'acessibilidade-web',
    title: 'Acessibilidade na web',
    description: 'Contraste e foco visivel',
    tags: ['a11y'],
    text: 'Todo texto precisa de contraste suficiente.',
  },
];

const index = buildIndex(docs);

describe('normalize', () => {
  it('remove acentos e converte para minusculas', () => {
    expect(normalize('Acessibilidade É Coração')).toBe('acessibilidade e coracao');
  });
});

describe('tokenize', () => {
  it('ignora pontuacao e separa por caracteres alfanumericos', () => {
    expect(tokenize('React, Next.js! TypeScript')).toEqual(['react', 'next', 'js', 'typescript']);
  });

  it('retorna lista vazia para texto sem tokens', () => {
    expect(tokenize('--- !!!')).toEqual([]);
  });
});

describe('search', () => {
  it('encontra documento por termo do corpo', () => {
    const results = search(index, 'navegador');
    expect(results.map((r) => r.slug)).toEqual(['server-components']);
  });

  it('normaliza acentos na consulta', () => {
    const results = search(index, 'acessibilidade');
    expect(results.map((r) => r.slug)).toEqual(['acessibilidade-web']);
  });

  it('pondera titulo mais que corpo: termo no titulo vem primeiro', () => {
    const results = search(index, 'testes');
    expect(results[0].slug).toBe('testes-contrato');
  });

  it('aplica AND estrito: um termo ausente zera o resultado', () => {
    expect(search(index, 'servidor graphql')).toEqual([]);
  });

  it('retorna vazio para consulta vazia ou so com pontuacao', () => {
    expect(search(index, '')).toEqual([]);
    expect(search(index, '!!!')).toEqual([]);
  });

  it('respeita o limite de resultados', () => {
    expect(search(index, 'o', 1)).toHaveLength(1);
  });

  it('retorna metadados completos para exibicao', () => {
    const [result] = search(index, 'contrato');
    expect(result.title).toBe('Testes de contrato');
    expect(result.description).toContain('contratos');
    expect(result.tags).toEqual(['testes']);
    expect(result.score).toBeGreaterThan(0);
  });
});
