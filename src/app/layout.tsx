import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { getSiteConfig } from '@/lib/site';
import 'highlight.js/styles/github-dark.css';
import './globals.css';

const site = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: site.url,
    types: { 'application/rss+xml': `${site.url}/feed.xml` },
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <nav className="container site-nav" aria-label="Navegacao principal">
            <Link href="/" className="site-nav__brand">
              {site.name}
            </Link>
            <div className="site-nav__links">
              <Link href="/">Posts</Link>
              <Link href="/busca">Busca</Link>
              <Link href="/sobre">Sobre</Link>
              <a href="/feed.xml">RSS</a>
            </div>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              Gerado estaticamente com Next.js e MDX · <a href="/feed.xml">Assinar RSS</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
