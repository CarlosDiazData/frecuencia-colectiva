## Verification Report

**Change**: ephemeral-environments
**Version**: 1.0.0
**Mode**: Standard (pipeline/infrastructure — YAML syntax + file structure + diff verification)

### Completeness

| Metric | Value |
|--------|-------|
| Tasks total | 11 |
| Tasks complete | 8 |
| Tasks incomplete | 3 |

**Incomplete tasks:**
- [ ] 1.1 — Create GitHub Environment `ephemeral` in repo Settings (manual, one-time)
- [ ] 5.2 — Push to trigger the first ephemeral deploy run
- [ ] 5.3 — Verify runtime: check-pr finds PR, deploy creates stack, PR comment posted

### Build & Tests Execution

**YAML Syntax**: ✅ Both workflows valid
```text
cd-ephemeral.yml: YAML valid
cd-ephemeral-destroy.yml: YAML valid
```

**Regression — cd.yml byte-identical**: ✅ Passed
```text
SHA256: 9202ddc11a3b59...  (matches development base)
```

**Regression — ci.yml byte-identical**: ✅ Passed
```text
SHA256: f94cc30f0ea783a3...  (matches development base)
```

**Regression — backend/app.py**: ✅ Unchanged (git diff development -- backend/app.py → no output)

**Regression — backend/infrastructure/**: ✅ Unchanged (git diff development -- backend/infrastructure/ → no output)

**Coverage**: ➖ Not available (GitHub Actions workflows have no code-coverage tooling)

### Spec Compliance Matrix

| Requirement | Scenario | Evidence | Result |
|-------------|----------|----------|--------|
| **Push-triggered isolated deployment** | First push deploys new stack | `on: push: branches-ignore: [development, main]` + `check-pr` gate + CDK deploy with `STACK_SUFFIX` → idempotent CloudFormation | ✅ COMPLIANT (Static) |
| **Push-triggered isolated deployment** | Subsequent push updates existing stack | CDK deploy is idempotent; concurrency group per branch prevents parallel runs | ✅ COMPLIANT (Static) |
| **Stack naming and isolation** | Branch name sanitization (`fix/Contact-Email` → `fix-contact-email`) | `tr '/' '-' | tr '[:upper:]' '[:lower:]'` on `ref_name` produces correct suffix | ✅ COMPLIANT (Static) |
| **Stack naming and isolation** | Long branch name truncation to 40 chars | `cut -c1-40` in sanitize step | ✅ COMPLIANT (Static) |
| **PR notification with ephemeral URLs** | Happy path PR comment with frontend URL + API endpoint | `gh pr comment` step posts table with `FRONTEND_URL` and `API_BASE_URL` | ✅ COMPLIANT (Static) |
| **PR notification with ephemeral URLs** | Non-PR branch skipped | `check-pr` outputs empty `pr_number` → `deploy-ephemeral` skipped via `if: != ''` | ✅ COMPLIANT (Static) |
| **PR-close triggered stack destruction** | Merged PR destroys stack | `npx cdk destroy --all --force --ci` guarded by `if: env.STACK_EXISTS == 'true'` | ❌ CRITICAL — see Issue #1 |
| **PR-close triggered stack destruction** | PR closed without merge destroys stack | Same trigger and destroy logic covers `types: [closed]` | ❌ CRITICAL — see Issue #1 |
| **Missing stack is a clean no-op** | No stack to destroy | `if aws ... describe-stacks ...; then STACK_EXISTS=true; else STACK_EXISTS=false` → exits 0, posts "nothing to destroy" comment | ✅ COMPLIANT (Static) |
| **Stack existence check before destruction** | Stack existence probe via describe-stacks | `aws cloudformation describe-stacks --stack-name "$STACK_NAME"` with conditional, all destroy steps guarded by `if: env.STACK_EXISTS == 'true'` | ✅ COMPLIANT (Static) |

**Compliance summary**: 8/10 scenarios compliant, 2/10 blocked by critical bug

### Correctness (Static Evidence)

| Requirement | Status | Notes |
|------------|--------|-------|
| Deploy trigger: push to non-development/non-main branches | ✅ Correct | `branches-ignore: [development, main]` on push |
| PR gate: only deploy when open PR exists | ✅ Correct | `gh pr list --head` check in separate `check-pr` job |
| Branch sanitization: lowercase, / → -, truncate 40 | ✅ Correct | Single pipe: `tr '/' '-' | tr '[:upper:]' '[:lower:]' | cut -c1-40` |
| Stack suffix format: `-{sanitized}` | ✅ Correct | `STACK_SUFFIX=-$SANITIZED` in GITHUB_ENV |
| CDK deploy with suffix isolation | ✅ Correct | `STACK_SUFFIX` env var passed to `cdk deploy` |
| CDK outputs extraction: ApiEndpoint, FrontendBucketName, DistributionId, DynamoDBTableName, FrontendURL | ✅ Correct | 5 outputs extracted from `describe-stacks` |
| Frontend build with API URL | ✅ Correct | `VITE_API_BASE_URL` set to extracted `API_BASE_URL` |
| S3 upload with --delete | ✅ Correct | `aws s3 sync ./frontend/dist s3://$FRONTEND_BUCKET --delete` |
| CloudFront invalidation | ✅ Correct | `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"` |
| DynamoDB seed | ✅ Correct | `npm run seed` with `TABLE_NAME` env |
| PR comment with URLs | ✅ Correct | `gh pr comment` with table containing Frontend URL and API endpoint |
| Destroy trigger: PR close event | ❌ Broken | `branches-ignore: [development, main]` on `pull_request` filters by BASE branch — all normal PRs target development, so destroy NEVER fires |
| Destroy branch source: `github.head_ref` | ✅ Correct | `head_ref` is the source branch of the PR |
| Stack existence probe before destroy | ✅ Correct | `if aws ... describe-stacks ...; then` bash conditional |
| Conditional destroy only when stack exists | ✅ Correct | All destroy steps guarded by `if: env.STACK_EXISTS == 'true'` |
| No-op on missing stack | ✅ Correct | Exits 0 when `STACK_EXISTS == 'false'`, posts info comment |
| Destroy PR comment (destroyed) | ✅ Correct | `gh pr comment` confirms cleanup with branch name |
| Destroy PR comment (nothing to destroy) | ✅ Correct | `gh pr comment` with info message |
| cd.yml regression | ✅ Verified | SHA256 byte-identical to development base |
| ci.yml regression | ✅ Verified | SHA256 byte-identical to development base |
| backend/app.py regression | ✅ Verified | `git diff` produces no output |
| backend/infrastructure/ regression | ✅ Verified | `git diff` produces no output |

### Coherence (Design)

| Decision | Followed? | Notes |
|----------|-----------|-------|
| Workflow structure: two new files (zero regression risk) | ✅ Yes | `cd-ephemeral.yml` (178 lines) + `cd-ephemeral-destroy.yml` (93 lines) |
| PR gate: `gh pr list` pre-check with `outputs.pr_number` | ✅ Yes | Separate `check-pr` job prevents expensive setup for non-PR branches |
| Branch name source (destroy): `github.head_ref` | ✅ Yes | Correct for `pull_request` events |
| Destroy safety: `describe-stacks` probe | ✅ Yes (improved) | Implementation uses bash `if/then` conditional instead of `continue-on-error: true` — more robust, zero false-failure risk |
| EmailIdentity: no action needed | ✅ Yes | No SES references in either workflow |
| `STACK_SUFFIX` via `$GITHUB_ENV` | ✅ Yes | Same mechanism as `cd.yml` |
| Stack name construction: `FrecuenciaColectivaStack{suffix}` | ✅ Yes | Matches CDK construct ID pattern |

### Issues Found

**CRITICAL**:
1. **Destroy workflow trigger filters by BASE branch, preventing execution on normal PR merges.** The `branches-ignore: [development, main]` on the `pull_request: [closed]` trigger in `cd-ephemeral-destroy.yml` (line 6) filters by the PR's **target** branch per GitHub Actions semantics. Since ephemeral environments are created for PRs that target `development`, the destroy workflow will NEVER fire when those PRs are merged or closed — the event is filtered out before any jobs run. This violates spec requirement *"PR-close triggered stack destruction: When a pull_request for a non-development, non-main branch is closed, the system MUST destroy the corresponding ephemeral CloudFormation stack."*

   **Fix**: Remove `branches-ignore: [development, main]` from the destroy workflow trigger entirely. The stack existence check already handles the "nothing to destroy" case gracefully. The workflow should fire on ALL `pull_request: [closed]` events.

**WARNING**: None

**SUGGESTION**:
1. **Design deviation (positive): bash conditional vs `continue-on-error`.** The design specified `continue-on-error: true` on the describe-stacks step, but the implementation uses a bash `if/then/else` conditional instead. This is actually **better** — it avoids marking the step as "failed but continue" in the GitHub Actions UI, producing cleaner run logs. No action needed; consider updating the design doc to reflect the improved approach.

### Verdict

**FAIL**

The destroy workflow contains a critical trigger configuration bug (`branches-ignore` semantics mismatch on `pull_request` events) that prevents ephemeral environment cleanup on normal PR merges. The bug is a one-line fix (removing `branches-ignore` on the destroy trigger) and does not affect the deploy workflow. Once fixed, the implementation is structurally complete and matches the spec, design, and tasks.
