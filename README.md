# Vitrine Local

Catálogo virtual multiempresa para negócios locais.

## Versão oficial

A fonte de verdade do projeto é a branch `main`.

A versão publicada mais recente é gerada automaticamente pelo GitHub Pages:

https://jpavan77.github.io/scale-smart-boost/

Rotas principais:

- `/auth` — login
- `/admin` — super admin
- `/painel` — painel do dono
- `/barbearia-do-ze` — catálogo de demonstração

## Fluxo de trabalho

1. Lovable pode ser usado para ajustes visuais e prototipação.
2. Alterações válidas precisam chegar à `main` no GitHub.
3. O GitHub Actions executa build, testes de interface e testes E2E.
4. A cada push na `main`, o GitHub Pages publica automaticamente a versão nova.
5. O Supabase é o backend oficial para autenticação, banco, storage e Edge Functions.

O preview do Lovable não é considerado fonte de verdade do projeto.

## Backend

Projeto Supabase configurado com:

- autenticação email/senha
- RLS multiempresa
- bucket público `catalog-images`
- Edge Function `invite-business-owner`
- Edge Function `bootstrap-admin`

## Desenvolvimento

```bash
npm install
npm run dev
```

Validação:

```bash
npm run build
npm run test:ui
npm run test:e2e
```

## GitHub Pages

O projeto usa o domínio padrão do GitHub Pages, sem custom domain.
