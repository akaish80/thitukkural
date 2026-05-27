# Thirukkural (Vite + React + TypeScript)

Thirukkural learning app built with Vite, React, TypeScript, Redux Toolkit, and SCSS.

## Prerequisites

- Node.js 22.12.0 or later
- npm 10 or later

Vite 8 requires Node.js 20.19+ or 22.12+. Using Node 18 in CI will fail.

## Local Development

### Install dependencies

```bash
npm install
```

### Run frontend

```bash
npm run dev
```

App runs at http://localhost:5173.

### Run frontend + API server together

```bash
npm run dev:all
```

## Build and Run

### Build frontend

```bash
npm run build
```

To regenerate sitemap before build:

```bash
npm run seo:sitemap
```

To run sitemap generation + build together:

```bash
npm run seo:build
```

Frontend output is generated in dist/.

### Preview frontend build

```bash
npm run preview
```

### Build backend server

```bash
npm run build:server
```

Server output is generated in build/server.js.

### Run backend in development

```bash
npm run server
```

### Run backend in production mode

```bash
npm run start:prod
```

## Deployment (Vercel via GitHub Actions)

Workflow file: .github/workflows/deploy-vercel.yml

Current deployment flow:

1. Uses Node.js 22.12.0 in GitHub Actions.
2. Installs latest Vercel CLI.
3. Runs vercel pull, vercel build, and vercel deploy --prebuilt --prod.

Required GitHub repository secrets:

- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID

## Common CI Errors

### Error: Your Vercel CLI version is outdated

Cause: old CLI from third-party deploy action.

Fix: install and use latest Vercel CLI in workflow.

### Error: Vite requires Node.js 20.19+ or 22.12+

Cause: workflow running on Node 18.

Fix: set workflow Node version to 22.12.0 (or newer).

## Tech Stack

- Vite
- React 19
- TypeScript
- Redux Toolkit
- SCSS
- Express (server.ts)

## Architecture

### High-level Overview

```text
Browser (React + Vite)
	-> Frontend routes and components
	-> API calls (/api/*)

Express API (server.ts)
	-> Loads thirukkural_complete_nested.json
	-> Builds flat lookup/search indexes
	-> Exposes REST endpoints

Vercel deployment
	-> Frontend static build
	-> Serverless API entry (api/index.ts -> server.js)
```

### Frontend

- Entry point: src/main.tsx
- Route config: src/Routes.tsx
- Pages: src/pages/*
- Shared UI: src/components/*
- App state: src/redux/*

Routes are lazy-loaded with React Suspense to reduce initial bundle size.

### Backend API

- Express app entry: server.ts
- Vercel function bridge: api/index.ts
- Primary data source: src/Common/thirukkural_complete_nested.json

Server responsibilities:

- Load and validate nested Thirukkural data.
- Build flattened arrays for faster lookup.
- Create Fuse.js search index for Tamil/English/transliteration queries.
- Serve structured endpoints for paal/adikaram/kurral navigation.

### Request and Data Flow

1. User opens a route in the React app.
2. Page/component requests content from /api/* endpoints.
3. Express handler reads from in-memory loaded JSON/indexes.
4. API response is rendered by page and component tree.

### Build Outputs

- Frontend build output: dist/
- Backend build output: build/server.js

### Deployment Model

- GitHub Actions builds and deploys with Node.js 22.12.0.
- Vercel CLI pulls project config, builds artifacts, and deploys production.
- api/index.ts re-exports compiled server.js for serverless runtime.
