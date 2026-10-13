import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Saida standalone gera um servidor Node autocontido em .next/standalone,
  // usado pela imagem Docker de producao.
  output: 'standalone',
};

export default nextConfig;
