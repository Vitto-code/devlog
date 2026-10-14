import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="stack">
      <h1>Pagina nao encontrada</h1>
      <p>O endereco que voce acessou nao existe ou foi movido.</p>
      <p>
        <Link href="/">Voltar para a pagina inicial</Link>
      </p>
    </div>
  );
}
