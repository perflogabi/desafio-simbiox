# Card Explorer

Aplicação para consultar e explorar cartas de Magic: The Gathering usando a API pública do Scryfall.

O projeto usa Next.js, TypeScript strict, ESLint, Prettier, Vitest e Playwright. A busca consulta a API pública do Scryfall pelo TanStack Query, com debounce, filtros de raridade e tipo na URL, paginação em lotes e um modal de detalhes carregado só quando uma carta é aberta. As ilustrações usam o tamanho real da carta e entram sob demanda. O teclado percorre as cartas, fecha os diálogos e devolve o foco ao controle que abriu. Os favoritos ficam salvos neste navegador e aparecem em `/favoritos`.

## Getting Started

```bash
npm install
npm run dev
```

A aplicação fica disponível em [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run format
npm run format:check
```

## Docker

```bash
docker compose up --build
```

A aplicação fica disponível em [http://localhost:3000](http://localhost:3000).

## CI

O workflow em `.github/workflows/ci.yml` roda lint, typecheck, testes e build em cada push e pull request.
