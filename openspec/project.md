# Frecuencia Colectiva — SDD Project Context

**Last init**: 2026-05-18
**Persistence**: hybrid (OpenSpec files + Engram)

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | React | ^18.2.0 |
| Frontend language | TypeScript | ^5.3.0 |
| Bundler | Vite | ^5.1.0 |
| CSS | TailwindCSS | ^3.4.0 |
| Routing | react-router-dom | ^6.22.0 |
| Backend runtime | AWS Lambda (Node 20) | — |
| Backend language | TypeScript | ^5.3.0 |
| AWS SDK | @aws-sdk v3 | ^3.500.0 |
| Infra as Code | AWS CDK v2 (Python) | — |
| CI/CD | GitHub Actions | — |

## Testing

| Tool | Layer | Status |
|------|-------|--------|
| Vitest 1.6 + @testing-library/react 14.2 | Frontend unit/integration | ✅ 18 tests passing |
| Jest 29.7 + ts-jest | Backend unit | ✅ 8 tests passing |
| E2E | — | ❌ Not available |
| Coverage (frontend) | — | ❌ @vitest/coverage-v8 not installed |
| Coverage (backend) | Jest --coverage | ⚠️ Configured but path mismatch (0% reported) |

## Strict TDD

**Status**: Enabled. Both test runners available and working. No explicit marker found, but default is `true` per SDD convention.

## Architecture

```
frecuencia-colectiva/
├── frontend/           # React SPA (Vite)
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Route pages
│   │   ├── test/       # Test files + setup
│   │   ├── types/      # TypeScript type definitions
│   │   └── utils/      # Utility functions
│   └── vite.config.ts
├── backend/            # Lambda functions + CDK
│   ├── src/
│   │   └── handlers/   # Lambda handlers
│   ├── infrastructure/ # CDK constructs
│   ├── test/           # Jest tests
│   ├── app.py          # CDK app entry
│   └── cdk.json
└── scripts/            # Seed/build scripts
```

## Conventions

- React Router v6 with future flags (`v7_startTransition`, `v7_relativeSplatPath`)
- Editorial design: Merriweather fonts, red #c50907 accent, white background
- No state management library — Context + hooks only
- Backend: commonjs modules, esbuild for Lambda bundling
- CI runs lint → test → build for frontend, build → test for backend
