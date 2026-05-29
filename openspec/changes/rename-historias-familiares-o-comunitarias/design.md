# Design: Rename "historias-familiares" → "historias-familiares-o-comunitarias"

## Technical Approach

Pure string replacement: every occurrence of the category slug `historias-familiares` is replaced
with `historias-familiares-o-comunitarias` across the codebase. The change is a label-correctness
rename — the Navbar and README already display "Historias familiares o comunitarias", but internal
identifiers still use the shorter name. The rename only affects slug references; display labels in
`getCategoryLabel` (`helpers.ts`) are out of scope per the proposal.

## Architecture Decisions

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| URL redirect for old slug | No redirect | Add a redirect route in react-router | User confirmed shared links breaking is acceptable. Zero complexity. |
| DynamoDB migration | None needed | Run a scan-update script | Seed script uses `PutRequest` (overwrites by `articleId`). Article "Ojos de la ciudad" updated on next deploy. |
| Test approach | Update hardcoded slugs only | Add parameterized test helpers | No new tests: existing tests already cover category validation. |
| Commit strategy | Single commit | Chained PRs | Under 400-line budget. All changes are self-validating (tsc + tests). |

## Data Flow

No flow changes. Category slug flows through the same paths:

```
Article type (ArticleCategory union)
   └─→ helpers (getCategoryColor / getCategoryHex / getCategoryLabel) ──→ ArticleCard, Footer
   └─→ SectionPage (validCategories guard + description map)
   └─→ Navbar (section path array)
   └─→ Footer (SECTION_SLUGS → links)

Backend:
   filterByCategoryHandler (validCategories guard) ──→ DynamoDB QueryCommand
   seedData.ts (article.category field) ──→ BatchWriteCommand
```

## File Changes

| File | Action | Refs | Description |
|------|--------|------|-------------|
| `frontend/src/types/article.ts` | Modify | 1 | Union type `ArticleCategory`: rename literal |
| `frontend/src/utils/helpers.ts` | Modify | 3 | Slug keys in `getCategoryColor`, `getCategoryHex`, `getCategoryLabel` |
| `frontend/src/components/Footer.tsx` | Modify | 1 | Slug in `SECTION_SLUGS` array |
| `frontend/src/components/Navbar.tsx` | Modify | 1 | Path `/section/historias-familiares` → `/section/historias-familiares-o-comunitarias` |
| `frontend/src/pages/SectionPage.tsx` | Modify | 2 | Key in `categoryDescriptions`, slug in `validCategories` array |
| `frontend/src/test/Footer.test.tsx` | Modify | 1 | Slug in `CULTURAL_SLUGS` test fixture |
| `backend/src/handlers/filterByCategoryHandler.ts` | Modify | 1 | Slug in `validCategories` array |
| `backend/test/types.test.ts` | Modify | 1 | Slug in test `validCategories` array |
| `scripts/seedData.ts` | Modify | 2 | Article category field + log message |

**Total**: 9 files, 13 references.

## Interfaces / Contracts

No API contract changes. The `ArticleCategory` union type is the single source of truth:

```typescript
// Before
export type ArticleCategory = '...' | 'historias-familiares' | '...';

// After
export type ArticleCategory = '...' | 'historias-familiares-o-comunitarias' | '...';
```

All other references are derived from this type. `getCategoryLabel` map key changes from
`'historias-familiares'` to `'historias-familiares-o-comunitarias'` but the display value
`'Historias familiares'` stays (label changes out of scope).

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Frontend (vitest) | Footer renders all 9 sections with correct labels and hrefs | Existing `Footer.test.tsx` — update `CULTURAL_SLUGS` slug |
| Backend (jest) | Category validation accepts the new slug | Existing `types.test.ts` — update `validCategories` array |
| TypeScript | No type errors across the codebase | `tsc --noEmit` in both `frontend/` and `backend/` |

No new tests: the rename does not change behavior. Updating existing test fixtures ensures they
pass with the new slug.

## Migration / Rollout

No migration required. Seed runs on every deploy via `BatchWriteCommand` with `PutRequest`,
which overwrites by `articleId`.

Rollback: revert the commit. No database side effects or irreversible changes.

## Open Questions

None — all decisions confirmed with user during exploration.
