# Arquitetura

## Visao geral

O devlog e um site 100% estatico: todo o trabalho acontece em tempo de build. Em producao, qualquer servidor de arquivos estaticos (ou o `next start` standalone) entrega HTML, XML e JSON prontos.

```mermaid
flowchart LR
    subgraph Conteudo
        MDX[content/posts/*.mdx]
    end

    subgraph Lib["src/lib (TS puro, testado)"]
        P[posts.ts<br/>gray-matter + validacao]
        SE[search.ts<br/>indice invertido]
        RS[rss.ts<br/>feed RSS 2.0]
        SI[site.ts<br/>config por env]
    end

    subgraph Build["next build (SSG)"]
        PRE[prebuild:<br/>search-index.json]
        STAT[paginas estaticas:<br/>/ /posts/* /tags/* /busca /sobre]
        META[/feed.xml /sitemap.xml /robots.txt<br/>force-static/]
    end

    subgraph Runtime
        HTML[HTML estatico]
        JSON[search-index.json]
        CLIENT[SearchBox:<br/>busca local no navegador]
    end

    MDX --> P
    P --> PRE --> JSON --> CLIENT
    P --> STAT --> HTML
    P --> RS --> META --> HTML
    SI --> STAT
    SI --> META
```

## Fluxo de publicacao de um post

```mermaid
sequenceDiagram
    participant A as Autor
    participant R as Repositorio
    participant B as Build (CI)
    participant S as Site estatico
    A->>R: commit de posts/AAAA-MM-DD-slug.mdx
    R->>B: push dispara workflow
    B->>B: lint + testes (posts, busca, RSS)
    B->>B: gera search-index.json
    B->>B: next build: HTML, feed.xml, sitemap
    B->>S: artefatos estaticos
    Note over S: draft: true nunca chega aqui
```

## Decisoes estruturais

- **Camada de dados isolada em `src/lib/`**: nenhum codigo de pagina acessa `fs` diretamente; paginas consomem `src/lib/content.ts`, que resolve o diretorio de posts. Isso permite testar toda a logica com diretorios-temporarios de fixture.
- **Rascunhos filtrados na fonte**: `getPosts` exclui `draft: true` por padrao, entao home, sitemap, RSS e busca herdam o filtro sem codigo extra — impossivel vazar rascunho por esquecimento.
- **Busca dividida em dois tempos**: indice construido no build (`scripts/build-search-index.ts`), consulta no cliente (`src/lib/search.ts` e isomorfo — o mesmo modulo roda no Node e no navegador e e o alvo dos testes).
- **Erros em tempo de build**: frontmatter invalido lanca excecao descritiva; o `next build` falha e o CI bloqueia o merge.
