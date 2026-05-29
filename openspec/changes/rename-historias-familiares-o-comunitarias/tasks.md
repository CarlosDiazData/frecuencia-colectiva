# Tasks: Rename "historias-familiares" → "historias-familiares-o-comunitarias"

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~13 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Rename slug in 9 files | PR 1 | Single commit, base=development |

## Phase 1: Foundation — Types and Helpers

- [x] 1.1 Update `ArticleCategory` union literal in `frontend/src/types/article.ts`
- [x] 1.2 Update slug keys in `getCategoryColor`, `getCategoryHex`, `getCategoryLabel` in `frontend/src/utils/helpers.ts`

## Phase 2: Frontend Components and Pages

- [x] 2.1 Update slug in `SECTION_SLUGS` array in `frontend/src/components/Footer.tsx`
- [x] 2.2 Update NavLink path in `frontend/src/components/Navbar.tsx`
- [x] 2.3 Update `validCategories` and `categoryDescriptions` key in `frontend/src/pages/SectionPage.tsx`

## Phase 3: Backend and Seed Data

- [x] 3.1 Update `validCategories` array in `backend/src/handlers/filterByCategoryHandler.ts`
- [x] 3.2 Update article category field and log message in `scripts/seedData.ts`

## Phase 4: Tests

- [x] 4.1 Update `CULTURAL_SLUGS` test fixture in `frontend/src/test/Footer.test.tsx`
- [x] 4.2 Update `validCategories` array in `backend/test/types.test.ts`

## Phase 5: Verification

- [x] 5.1 Run `npx tsc --noEmit` on frontend (no type errors)
- [x] 5.2 Run `npx tsc --noEmit` on backend (no type errors)
- [x] 5.3 Run `cd frontend && npx vitest --run` (all pass)
- [x] 5.4 Run `cd backend && npx jest` (all pass)
