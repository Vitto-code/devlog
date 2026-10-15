import type { Metadata } from 'next';
import { SearchBox } from '@/components/SearchBox';

export const metadata: Metadata = {
  title: 'Busca',
  description: 'Busca full-text nos posts do blog.',
};

export default function SearchPage() {
  return (
    <div className="stack">
      <h1>Busca</h1>
      <p>
        Busca full-text rodando no navegador sobre um indice gerado no build —
        sem servico externo e sem enviar suas consultas para lugar nenhum.
      </p>
      <SearchBox />
    </div>
  );
}
