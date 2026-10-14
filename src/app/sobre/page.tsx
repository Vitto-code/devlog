import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Sobre o devlog e como ele e construido.',
};

export default function AboutPage() {
  return (
    <div className="stack prose">
      <h1>Sobre</h1>
      <p>
        O devlog e um blog estatico sobre engenharia de software. Cada post e um
        arquivo MDX versionado no mesmo repositorio do codigo: revisao de texto
        passa por pull request, como qualquer mudanca de codigo.
      </p>
      <p>
        O site e gerado com Next.js (App Router, SSG), o feed RSS e o sitemap sao
        emitidos no build, e a busca full-text roda no navegador sobre um indice
        invertido gerado em tempo de build — sem nenhum servico externo.
      </p>
      <p>
        O codigo completo, os testes e as decisoes de arquitetura estao
        documentados no repositorio.
      </p>
    </div>
  );
}
