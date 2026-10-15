import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { calculateReadingTime, filenameToSlug, getAllTags, getPost, getPosts } from '../src/lib/posts';

let dir: string;

const VALID_POST = `---
title: "Post valido"
description: "Descricao do post valido"
date: "2026-10-01"
tags: ["testes", "qualidade"]
---

Conteudo do post valido com algumas palavras para leitura.
`;

const OLDER_POST = `---
title: "Post antigo"
description: "Descricao do post antigo"
date: "2026-09-15"
tags: ["testes"]
---

Conteudo antigo.
`;

const DRAFT_POST = `---
title: "Rascunho"
description: "Nao pode vazar"
date: "2026-10-05"
draft: true
---

Segredo.
`;

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'devlog-posts-'));
  writeFileSync(join(dir, '2026-10-01-post-valido.mdx'), VALID_POST);
  writeFileSync(join(dir, '2026-09-15-post-antigo.mdx'), OLDER_POST);
  writeFileSync(join(dir, '2026-10-05-rascunho.mdx'), DRAFT_POST);
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('getPosts', () => {
  it('retorna posts publicados ordenados do mais recente ao mais antigo', () => {
    const posts = getPosts(dir);
    expect(posts.map((p) => p.slug)).toEqual(['post-valido', 'post-antigo']);
  });

  it('exclui rascunhos por padrao e os inclui quando pedido', () => {
    expect(getPosts(dir).some((p) => p.slug === 'rascunho')).toBe(false);
    expect(getPosts(dir, { includeDrafts: true })).toHaveLength(3);
  });

  it('lanca erro descritivo quando falta frontmatter obrigatorio', () => {
    const badDir = mkdtempSync(join(tmpdir(), 'devlog-bad-'));
    writeFileSync(join(badDir, '2026-10-01-sem-titulo.mdx'), '---\ndescription: "x"\ndate: "2026-10-01"\n---\n\nTexto.\n');
    expect(() => getPosts(badDir)).toThrow('sem frontmatter obrigatorio: title');
    rmSync(badDir, { recursive: true, force: true });
  });

  it('lanca erro para data fora do formato YYYY-MM-DD', () => {
    const badDir = mkdtempSync(join(tmpdir(), 'devlog-bad-date-'));
    writeFileSync(join(badDir, 'post.mdx'), '---\ntitle: "t"\ndescription: "d"\ndate: "01/10/2026"\n---\n\nTexto.\n');
    expect(() => getPosts(badDir)).toThrow('data invalida');
    rmSync(badDir, { recursive: true, force: true });
  });

  it('trata tags ausentes como lista vazia', () => {
    const noTagsDir = mkdtempSync(join(tmpdir(), 'devlog-notags-'));
    writeFileSync(join(noTagsDir, 'post.mdx'), '---\ntitle: "t"\ndescription: "d"\ndate: "2026-10-01"\n---\n\nTexto.\n');
    expect(getPosts(noTagsDir)[0].tags).toEqual([]);
    rmSync(noTagsDir, { recursive: true, force: true });
  });
});

describe('getPost', () => {
  it('encontra post por slug e retorna null para slug inexistente', () => {
    expect(getPost('post-valido', dir)?.title).toBe('Post valido');
    expect(getPost('nao-existe', dir)).toBeNull();
  });
});

describe('getAllTags', () => {
  it('conta tags ordenando por frequencia e nome', () => {
    const tags = getAllTags(getPosts(dir));
    expect(tags).toEqual([
      { tag: 'testes', count: 2 },
      { tag: 'qualidade', count: 1 },
    ]);
  });
});

describe('filenameToSlug', () => {
  it('remove extensao e prefixo de data', () => {
    expect(filenameToSlug('2026-10-01-meu-post.mdx')).toBe('meu-post');
    expect(filenameToSlug('sem-data.mdx')).toBe('sem-data');
  });
});

describe('calculateReadingTime', () => {
  it('arredonda para cima e nunca retorna zero', () => {
    expect(calculateReadingTime('curto')).toBe(1);
    expect(calculateReadingTime(new Array(450).fill('palavra').join(' '))).toBe(3);
  });
});
