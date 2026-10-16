# Decisoes tecnicas

## 1. Next.js App Router com SSG puro em vez de CMS headless ou SSR

**Contexto.** Um blog pessoal tecnico precisa de performance, SEO e custo minimo de operacao. Conteudo muda por deploy, nao por minuto.

**Opcoes consideradas.**
- CMS headless (Contentful, Sanity): otimo para equipes de conteudo, mas adiciona servico externo, custo e latencia de API no build.
- SSR/ISR: flexivel, mas paga servidor por requisicao (ou complexidade de revalidacao) para conteudo que muda por deploy.
- SSG puro: HTML pronto no build, servido de qualquer lugar.

**Decisao.** SSG puro, incluindo RSS, sitemap e robots via `force-static`.

**Consequencias.** Latencia minima e hospedagem gratuita em qualquer CDN. Publicar exige rebuild — aceitavel num blog pessoal e desejavel quando o fluxo de publicacao e o proprio git.

## 2. MDX local com next-mdx-remote em vez de Contentlayer

**Contexto.** Posts em MDX precisam de frontmatter tipado, syntax highlighting e componentes customizados.

**Opcoes consideradas.**
- Contentlayer: DX excelente, mas o projeto esta sem manutencao ativa e com problemas conhecidos em versoes novas do Next.
- @next/mdx: compila MDX como paginas, mas mistura conteudo com rota e complica metadados derivados de frontmatter.
- next-mdx-remote/rsc: renderiza MDX sob demanda em Server Components, com conteudo desacoplado das rotas.

**Decisao.** `next-mdx-remote/rsc` + `gray-matter` + `remark-gfm` + `rehype-highlight`.

**Consequencias.** Conteudo vive fora de `src/app` e passa pela validacao da camada de dados antes de virar pagina. Custo: renderizacao MDX acontece em cada build de pagina (irrelevante em SSG).

## 3. Busca full-text propria em vez de servico externo

**Contexto.** O blog precisa de busca instantanea sem backend.

**Opcoes consideradas.**
- Algolia/Typesense: otimos, mas exigem conta, chave, envio do indice para terceiros e JS externo.
- Pagefind: estatico e maduro, mas e um binario externo ao pipeline npm e menos didatico.
- Indice invertido proprio: ~100 linhas de TS isomorfo, testavel, zero dependencias.

**Decisao.** Indice invertido proprio gerado no build, consulta no navegador.

**Consequencias.** Busca privada (consultas nao saem do cliente), instantanea e coberta por testes de ranking. Limite conhecido: nao escala para milhares de documentos — a migracao natural seria Pagefind, mantendo o modelo estatico.

## 4. Frontmatter validado com falha de build em vez de tolerancia a erros

**Contexto.** Conteudo escrito a mao quebra: falta campo, data em formato errado, rascunho publicado sem querer.

**Opcoes consideradas.**
- Tolerar e usar defaults: site sobe, mas com titulo "undefined" e datas quebradas.
- Validar e falhar o build: erro descritivo no CI, nada quebrado vai ao ar.

**Decisao.** Validacao estrita em `src/lib/posts.ts`: campos obrigatorios, data em ISO e drafts filtrados na fonte.

**Consequencias.** Erros de conteudo aparecem como falha de CI com mensagem clara, nunca como pagina quebrada em producao. O preco e um build menos permissivo — intencional.

## 5. Testes de unidade na camada de dados em vez de testes de UI

**Contexto.** O comportamento critico do blog (parse, busca, RSS) e logica pura, nao renderizacao.

**Opcoes consideradas.**
- Testing Library + jsdom: cobre componentes, mas e lento e testa pouca logica real num blog majoritariamente estatico.
- Vitest sobre `src/lib` e `scripts`: rapido, deterministico, cobre exatamente onde bugs vivem.

**Decisao.** Vitest com limiar de 70% (atingindo ~94%) sobre a camada de dados; componentes sao finos o bastante para serem verificados pelo build e pelas capturas de tela.

**Consequencias.** Suite roda em ~2s e pega regressoes reais (contrato de posts, ranking da busca, escape de XML). Nao ha teste de UI automatizado — trade-off aceito e documentado.
