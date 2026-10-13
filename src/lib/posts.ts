import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** Data ISO 8601 (YYYY-MM-DD). */
  date: string;
  tags: string[];
  draft: boolean;
  readingTimeMinutes: number;
}

export interface Post extends PostMeta {
  /** Conteudo MDX bruto, sem o frontmatter. */
  content: string;
}

const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Converte o nome do arquivo em slug: `2026-10-01-meu-post.mdx` -> `meu-post`. */
export function filenameToSlug(filename: string): string {
  return filename
    .replace(/\.mdx$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .toLowerCase();
}

function parsePost(filename: string, raw: string): Post {
  const slug = filenameToSlug(filename);
  const { data, content } = matter(raw);

  const missing = ['title', 'description', 'date'].filter((field) => !(field in data));
  if (missing.length > 0) {
    throw new Error(`Post "${filename}" sem frontmatter obrigatorio: ${missing.join(', ')}`);
  }

  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Post "${filename}" com data invalida (esperado YYYY-MM-DD): ${date}`);
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    date,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    readingTimeMinutes: calculateReadingTime(content),
    content,
  };
}

/**
 * Le todos os posts de um diretorio. Rascunhos (draft: true) sao excluidos
 * por padrao para nunca vazarem para o build de producao.
 */
export function getPosts(dir: string, options: { includeDrafts?: boolean } = {}): Post[] {
  const files = readdirSync(dir).filter((file) => file.endsWith('.mdx'));
  const posts = files.map((file) => parsePost(file, readFileSync(join(dir, file), 'utf8')));
  return posts
    .filter((post) => options.includeDrafts === true || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string, dir: string): Post | null {
  return getPosts(dir).find((post) => post.slug === slug) ?? null;
}

export function getAllTags(posts: PostMeta[]): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
