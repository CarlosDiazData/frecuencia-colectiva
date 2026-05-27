# Design: Ephemeral Environments for Worktree Branches

## Technical Approach

Two new GitHub Actions workflows (`cd-ephemeral.yml`, `cd-ephemeral-destroy.yml`) that re-use the existing `STACK_SUFFIX` mechanism from `cd.yml`. Zero CDK or application code changes — `backend/app.py` already reads `STACK_SUFFIX` from the environment and the CDK stack construct ID is already suffix-aware (`FrecuenciaColectivaStack{stack_suffix}`). Each ephemeral stack is a fully isolated CloudFormation deployment with its own DynamoDB, Lambda, API Gateway, S3, and CloudFront resources.

## Architecture Decisions

| Decision | Options | Tradeoffs | Choice |
|----------|---------|-----------|--------|
| Workflow structure | Two new files vs modify cd.yml | Separate files: ±2 files but zero regression risk. Single file: fewer files but conditional bloat and risk of breaking staging/prod | **Two new files** — clean separation, zero blast radius |
| PR gate | `gh pr list` pre-check vs always deploy | Gate in separate job with `outputs.pr_number` prevents stacks for branches without PRs. Separate job runs before expensive CDK setup. | **Gated in `check-pr` job** — skips early and cleanly |
| Branch name source (destroy) | `github.head_ref` vs `github.ref_name` | On `pull_request: closed`, `ref_name` is the target (development/main); `head_ref` is the source branch. | **`github.head_ref`** — matches ephemeral stack names |
| Destroy safety | `aws cloudformation describe-stacks` with `continue-on-error: true` | Check-then-destroy avoids `cdk destroy` errors on non-existent stacks. `continue-on-error` allows the check to fail gracefully. | **describe-stacks probe** — clean no-op for missing stacks |
| EmailIdentity handling | CDK context flag vs skip entirely | The `EmailIdentity` import exists but is NEVER instantiated (removed in commit 52962c9). No runtime SES resource is created. | **No action needed** — ephemeral stacks naturally have no SES identity |

## Data Flow

```
Push to branch != {development, main}
  │
  ├─ check-pr job
  │   └─ gh pr list --head "$BRANCH" --state open
  │       ├─ No PR → exit (skip everything)
  │       └─ PR found → output pr_number
  │
  ├─ deploy-ephemeral job (needs: check-pr, if: pr_number != '')
  │   │
  │   ├─ sanitize: ref_name → lowercase, / → -, cut -c1-40 → "-{suffix}"
  │   ├─ cdk deploy --all (STACK_SUFFIX=-{suffix})
  │   │   └─ CloudFormation: FrecuenciaColectivaStack-{suffix}
  │   ├─ aws cloudformation describe-stacks → extract outputs
  │   ├─ frontend build (VITE_API_BASE_URL={ApiEndpoint})
  │   ├─ aws s3 sync → ephemeral bucket
  │   ├─ aws cloudfront create-invalidation
  │   ├─ seed DynamoDB (TABLE_NAME from outputs)
  │   └─ gh pr comment → URLs posted to PR
  │
  ▼
PR merged/closed
  │
  └─ destroy-ephemeral job
      ├─ sanitize: head_ref → same algorithm
      ├─ aws cloudformation describe-stacks (continue-on-error)
      │   ├─ Stack exists → cdk destroy --force --ci
      │   └─ Stack missing → clean exit (success)
      └─ gh pr comment → confirmation or "nothing to destroy"
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `.github/workflows/cd-ephemeral.yml` | Create | Deploy workflow: push-triggered, PR-gated, full-stack ephemeral deploy |
| `.github/workflows/cd-ephemeral-destroy.yml` | Create | Destroy workflow: pull_request closed-triggered, stack probe + teardown |
| `.github/workflows/cd.yml` | None | Staging/prod deploys untouched |
| `.github/workflows/ci.yml` | None | CI already covers all branches (`branches: ['**']`) |
| `backend/app.py` | None | `os.getenv("STACK_SUFFIX")` at line 12 — already dynamic |
| `backend/infrastructure/frecuencia_colectiva_stack.py` | None | `f"FrecuenciaColectivaStack{stack_suffix}"` at line 18 — already dynamic |

## Naming Conventions

| Variable | Mechanism | Source |
|----------|-----------|--------|
| `STACK_SUFFIX` | `$GITHUB_ENV` (same as cd.yml) | `echo "STACK_SUFFIX=-$SANITIZED" >> $GITHUB_ENV` |
| Stack name | CDK auto-names from construct ID | `FrecuenciaColectivaStack-{suffix}` |
| Output keys | CloudFormation describe-stacks | `ApiEndpoint`, `FrontendURL`, `DynamoDBTableName`, `FrontendBucketName`, `DistributionId` |

## Error Handling

| Scenario | Deploy behavior | Destroy behavior |
|----------|----------------|-----------------|
| No open PR | `check-pr` job outputs empty → deploy skipped, exit code 0 | N/A |
| Stack already exists | `cdk deploy` updates in place (idempotent) | N/A |
| Stack does not exist | N/A | `continue-on-error: true` on describe-stacks → clean no-op |
| cdk deploy fails | Workflow fails, PR receives no comment | N/A |
| cdk destroy fails | N/A | Workflow fails (CloudFormation handles dependency ordering) |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Workflow syntax | YAML validity | Manual `python -c "import yaml; yaml.safe_load(...)"` per task steps |
| Deploy trigger | Push to non-protection branch with open PR | Push to this branch after GitHub Environment setup |
| Idempotent deploy | Second push updates, not creates | Push again to same branch, verify stack count unchanged |
| Destroy trigger | PR close event | Merge PR, verify stack deleted from CloudFormation console |
| Regression | `cd.yml` continues working | Push to development, verify staging deploy unchanged |

## Rollout

1. One-time manual setup: create GitHub Environment `ephemeral` in repo Settings → Environments, with same AWS secrets as `staging`
2. Merge this branch → workflows become active on next push to any non-protected branch with an open PR
3. Rollback: delete `cd-ephemeral.yml` and `cd-ephemeral-destroy.yml`, manually `cdk destroy` remaining ephemeral stacks

## Open Questions

None — all design decisions are settled, implementation plan is detailed, and the CDK code is confirmed suffix-ready.
