# Proposal: Rename "historias-familiares" → "historias-familiares-o-comunitarias"

## Intent

The category `historias-familiares` has a misleading name — it covers family AND community
stories, but the slug and internal references only say "familiares". The Navbar and README
already display "Historias familiares o comunitarias", creating a mismatch between the visual
label and the underlying category identifier. We rename the slug to match the actual scope.

## Scope

### In Scope
- Rename the category slug: `historias-familiares` → `historias-familiares-o-comunitarias`
- Update all 13 files with references (types, helpers, components, pages, backend handler, tests, seed data)
- Run frontend tests (vitest) and backend tests (jest) after changes

### Out of Scope
- URL redirect for `/section/historias-familiares` (shared links break — noted in Risks)
- Data migration (seed runs on deploy, overwrites by articleId)
- Changes to the display label (already correct: "Historias familiares o comunitarias")
- New features or behavior changes — this is a pure rename

## Capabilities

### New Capabilities
None — this is a rename, not a new feature.

### Modified Capabilities
None — no spec-level requirements change. The category slug is an implementation detail.

## Approach

Single-commit rename: replace every occurrence of `historias-familiares` with
`historias-familiares-o-comunitarias` across the codebase. Categories are referenced by
exact slug in JSX props (`category=`, `slug=`), TypeScript union types, test fixtures,
and the seed data map.

No DynamoDB migration needed: seed runs on every deploy via `BatchWriteCommand` with
`PutRequest`, which overwrites by `articleId`. The single article using this category
("Ojos de la ciudad") will have its slug rewritten on the next deploy.

## Affected Areas

| Area | Impact | File count |
|------|--------|------------|
| `frontend/src/types/` | Modified | 1 (category union type) |
| `frontend/src/helpers/` | Modified | 2 (category utilities) |
| `frontend/src/components/ArticleCard/` | Modified | 2 (component + tests) |
| `frontend/src/pages/SectionPage/` | Modified | 1 |
| `frontend/src/tests/` | Modified | 1 (integration tests) |
| `backend/src/handlers/` | Modified | 1 (section handler) |
| `backend/src/__tests__/` | Modified | 1 (handler tests) |
| `scripts/` | Modified | 1 (seedData.ts) |
| `frontend/src/components/Navbar/` | Modified | 1 (Navbar reference) |
| Root | Modified | 1 (README.md) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Shared links to `/section/historias-familiares` return 404 | Medium | Add a redirect route in frontend router mapping old slug → new slug. Document as known limitation if deferred. |
| Missing a reference causes runtime mismatch | Low | Full test suite (frontend + backend) catches broken references. |
| Seed data inconsistency after deploy | Low | Seed overwrites by articleId — no stale data possible. |

## Rollback Plan

Revert the commit. Rename is entirely in code with no database side effects.
Frontend-only fallback: add a redirect from old slug to new if deployed without it.

## Dependencies

None — self-contained rename.

## Success Criteria

- [ ] All references to `historias-familiares` replaced with `historias-familiares-o-comunitarias`
- [ ] Frontend tests pass (`cd frontend && npx vitest --run`)
- [ ] Backend tests pass (`cd backend && npx jest`)
- [ ] TypeScript compiles both sides (`npx tsc --noEmit`)
- [ ] `/section/historias-familiares-o-comunitarias` resolves correctly
