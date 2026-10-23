# Blog Next.js — Rotas dinâmicas, Server Components e SEO

Blog construído com o **App Router do Next.js**, em que a página inicial lista os artigos e cada artigo tem sua própria rota dinâmica identificada por um slug.

- **Aplicação em produção:** _cole aqui o link da Vercel_
- **Repositório:** _cole aqui o link do GitHub_

## Tecnologias

- Next.js 15 (App Router) + React 19 + TypeScript
- [slugify](https://www.npmjs.com/package/slugify) para gerar os slugs a partir dos títulos
- [CrudCrud](https://crudcrud.com) como API de dados, com `data/artigos.json` como reserva
- Deploy na Vercel

## Como os requisitos foram atendidos

| Requisito | Onde |
|---|---|
| Página inicial listando os artigos | `app/page.tsx` |
| Rota dinâmica por artigo | `app/artigos/[slug]/page.tsx` |
| Busca de dados em Server Component assíncrono (sem `useEffect`) | `async function` nas duas páginas, chamando `lib/artigos.ts` |
| Estratégia de renderização explícita | **SSG**: `generateStaticParams` + `export const dynamic = "force-static"` |
| Metadados únicos por artigo | `generateMetadata` em `app/artigos/[slug]/page.tsx` (`title` e `description`) |
| Slugs gerados a partir do título | `gerarSlug()` em `lib/artigos.ts`, usando `slugify` |

### Por que SSG?

Os artigos de um blog mudam pouco, então as páginas são geradas uma única vez no build. Isso deixa o site rápido, bom para SEO, e faz com que ele **continue funcionando mesmo depois que o endpoint gratuito do CrudCrud expirar**, já que o HTML fica pronto na Vercel.

### Fonte de dados

`lib/artigos.ts` busca os artigos na API do CrudCrud. Se a API estiver fora do ar, expirada ou vazia, o projeto usa automaticamente `data/artigos.json`.

## Estrutura

```
app/
  layout.tsx              layout geral + metadados padrão
  page.tsx                página inicial (lista de artigos)
  not-found.tsx           página 404
  globals.css             estilos
  artigos/[slug]/page.tsx página de cada artigo
data/artigos.json         artigos (reserva e fonte do seed)
lib/artigos.ts            busca de dados, slug e formatação de data
scripts/popular-api.mjs   envia os artigos do JSON para o CrudCrud
```

## Rodando localmente

```bash
npm install
npm run seed   # envia os artigos para o CrudCrud (opcional)
npm run dev    # http://localhost:3000
```

Para testar a versão de produção:

```bash
npm run build
npm start
```

## Trocando o endpoint do CrudCrud

O endpoint gratuito expira depois de um tempo. Para usar um novo:

1. Gere um endpoint em https://crudcrud.com
2. Troque a URL em `lib/artigos.ts` (`API_URL`) e em `scripts/popular-api.mjs`
3. Rode `npm run seed`
4. Faça commit e push: a Vercel publica de novo sozinha
