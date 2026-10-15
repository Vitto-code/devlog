/** Configuracao global do site, derivada de variaveis de ambiente. */
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  author: string;
  locale: string;
}

export function getSiteConfig(env: Record<string, string | undefined> = process.env): SiteConfig {
  return {
    name: 'devlog',
    title: 'devlog — engenharia de software na pratica',
    description:
      'Blog sobre engenharia de software, front-end e backend, com posts tecnicos escritos em MDX e gerados estaticamente.',
    url: (env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
    author: 'Vitto',
    locale: 'pt-BR',
  };
}
