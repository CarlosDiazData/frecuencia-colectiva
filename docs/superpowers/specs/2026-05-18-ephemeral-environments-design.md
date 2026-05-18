# Ephemeral Environments for Worktree Branches

**Date**: 2026-05-18
**Status**: Design approved — pending implementation
**Author**: Carlos Diaz

## Problem

The CI/CD pipeline is coupled to exactly two branches:

| Branch | Environment | Stack Suffix |
|--------|-------------|--------------|
| `development` | staging | `-staging` |
| `main` | production | `-prod` |

Worktree branches (e.g., `change-footer-secciones`, `fix/contact-email`) run CI but **cannot deploy**. There is no way to test infrastructure, API, or frontend changes in isolation before merging. Every feature must be tested by merging into `development` first — losing the isolation that worktrees provide.

## Solution

Ephemeral environments: any branch pushed to GitHub (that is not `development` or `main`) automatically deploys its own isolated full-stack environment. The environment shares no resources with staging or production. It is destroyed when the corresponding PR is merged.

## Architecture

### Workflow Triggers

```
push to * (not development/main)
  └─ if PR is open
        └─ CI passes (ci.yml, unchanged)
              └─ cd-ephemeral.yml → cdk deploy ephemeral stack

pull_request closed (merged)
  └─ cd-ephemeral-destroy.yml → cdk destroy ephemeral stack
```

`ci.yml` and `cd.yml` remain unchanged. Two new workflow files are added.

### Branch → Stack Suffix Mapping

Branch names are sanitized into CloudFormation-compatible stack suffixes:

```
change-footer-secciones  →  -change-footer-secciones
fix/contact-email        →  -fix-contact-email
feat/new-section         →  -feat-new-section
```

Sanitization rules: lowercase, `/` → `-`, max 40 characters. No underscores, no special characters.

### Stack Naming

```
FrecuenciaColectivaStack-staging                    (development — unchanged)
FrecuenciaColectivaStack-prod                       (main — unchanged)
FrecuenciaColectivaStack-change-footer-secciones    (ephemeral, new)
FrecuenciaColectivaStack-fix-contact-email          (ephemeral, new)
```

Each is a fully independent CloudFormation stack with its own resources. `cdk deploy` with the same stack name updates the existing stack rather than creating a new one — multiple pushes to the same branch are safe.

### Full Isolation Per Environment

| Resource | Ephemeral | Staging | Production |
|----------|-----------|---------|------------|
| DynamoDB Table | Own table | Own table | Own table |
| API Gateway + Lambda | Own stack | Own stack | Own stack |
| S3 Bucket (frontend) | Own bucket | Own bucket | Own bucket |
| CloudFront Distribution | Own distribution | Own distribution | Own distribution |
| SES Identity | Uses staging identity | Own identity | Own identity |
| Seed Data | Auto-seeded | Auto-seeded | Auto-seeded |

### No CDK Changes Required

`backend/app.py` already reads `STACK_SUFFIX` from the environment:

```python
stack_suffix = os.getenv("STACK_SUFFIX", "")
stack = FrecuenciaColectivaStack(app, f"FrecuenciaColectivaStack{stack_suffix}", ...)
```

The CDK stack class `FrecuenciaColectivaStack` takes an `id` parameter that includes the suffix. CloudFormation treats each `id` as a separate stack. No CDK code changes needed.

## New Workflow: `cd-ephemeral.yml`

### Trigger

```yaml
on:
  push:
    branches-ignore: [development, main]
```

Only runs when a PR is open for the branch (checked in a conditional step to avoid deploying branches without PRs).

### Jobs

| Step | Action |
|------|--------|
| 1. Checkout | `actions/checkout@v4` |
| 2. Sanitize branch name | Derive `STACK_SUFFIX` from `github.ref_name`: lowercase, `/` → `-`, max 40 chars |
| 3. Setup Python | Python 3.11, install CDK deps |
| 4. Build backend TS | `cd backend && npm ci && npm run build` |
| 5. Ensure frontend dist | `mkdir -p frontend/dist` (placeholder for CDK) |
| 6. Deploy CDK stack | `cd backend && npx cdk deploy --all --require-approval never --ci` with `STACK_SUFFIX=${{ env.STACK_SUFFIX }}` |
| 7. Get CDK outputs | Extract API URL, bucket, distribution ID, table name from CloudFormation |
| 8. Build frontend | `cd frontend && npm ci && npm run build` with `VITE_API_BASE_URL` |
| 9. Upload to S3 | `aws s3 sync` + CloudFront invalidation |
| 10. Seed DynamoDB | Run seed script with ephemeral table name |
| 11. Comment on PR | `gh pr comment` with ephemeral URLs (frontend, API endpoint) |

### Environment

```yaml
environment: ephemeral
```

A new GitHub Environment configured in repo settings:
- No required reviewers
- No wait timer
- No deployment branches restriction
- Uses the same AWS secrets as staging (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ACCOUNT_ID`)

## New Workflow: `cd-ephemeral-destroy.yml`

### Trigger

```yaml
on:
  pull_request:
    types: [closed]
    branches-ignore: [development, main]
```

### Jobs

| Step | Action |
|------|--------|
| 1. Sanitize branch name | Same sanitization as deploy |
| 2. Check stack exists | `aws cloudformation describe-stacks --stack-name "FrecuenciaColectivaStack-$SUFFIX"` |
| 3. Destroy if exists | `cd backend && npx cdk destroy --force` |
| 4. Skip if not found | Exit clean (no-op) |

Uses `--force` to skip approval prompts — ephemeral environments are disposable by design.

### PR Comment on Destroy

```markdown
🗑️ **Ephemeral environment destroyed**

Stack `FrecuenciaColectivaStack-change-footer-secciones` has been removed.
```

## Branch Sanitization Details

```bash
STACK_SUFFIX="-$(echo '${{ github.ref_name }}' | tr '/' '-' | tr '[:upper:]' '[:lower:]' | cut -c1-40)"
```

| Input | Output |
|-------|--------|
| `change-footer-secciones` | `-change-footer-secciones` |
| `fix/contact-email` | `-fix-contact-email` |
| `feat/VERY_LONG_BRANCH_NAME_THAT_EXCEEDS` | `-feat-very-long-branch-name-that-exce` |
| `development` | (never triggers — excluded) |
| `main` | (never triggers — excluded) |

## Cost Estimate

Each ephemeral environment creates:
- 1 DynamoDB table (pay-per-request, ~$0 if idle)
- 2 Lambda functions (pay-per-invocation, ~$0 if idle)
- 1 API Gateway (~$0 if idle, $1/month minimum for REST API)
- 1 S3 bucket (~$0.02/month for a few KB)
- 1 CloudFront distribution (~$1/month minimum)

**Rough estimate: ~$2-3/month per ephemeral environment.**

With 2-3 active PRs at a time: ~$6-9/month total additional cost.

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Stack limit exceeded (200 per account) | Low | Stacks are destroyed on PR close; max active = open PRs |
| CloudFront propagation delay (~5 min) on first deploy | Medium | Document in PR comment that URL may take a few minutes |
| SES EmailIdentity creation per ephemeral stack requires domain verification | High | Ephemeral stacks should skip SES identity creation (contact form can use staging SES endpoint). Implemented via CDK context flag or env var. |
| Naming collision between branches | Low | Sanitization is deterministic; only one worktree per branch |
| `cdk destroy` fails (resources in use) | Low | `--force` flag; CloudFormation handles dependency ordering |
| AWS credentials insufficient scope | Low | Use same secrets as staging deploy, which already works |

## Success Criteria

- [ ] Push to `change-footer-secciones` creates `FrecuenciaColectivaStack-change-footer-secciones`
- [ ] PR receives comment with ephemeral frontend URL and API endpoint
- [ ] Second push to same branch updates the existing stack (not creates a new one)
- [ ] Frontend at ephemeral URL displays articles from its own DynamoDB table
- [ ] Merging the PR destroys the ephemeral stack
- [ ] `cd.yml` (staging/prod deploys) continues to work unchanged
- [ ] No changes to `backend/app.py` or CDK stack code required
