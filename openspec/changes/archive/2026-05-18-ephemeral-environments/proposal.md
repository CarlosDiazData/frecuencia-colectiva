# Proposal: Ephemeral Environments for Worktree Branches

## Intent

CD locks deploy to `development`→staging and `main`→production. Worktree branches run CI but can't deploy — no way to test infra/API/frontend changes in isolation before merging. This adds automated ephemeral full-stack environments per branch, destroyed on PR close.

## Scope

### In Scope
- `.github/workflows/cd-ephemeral.yml` — deploy on push to non-protected branch with open PR
- `.github/workflows/cd-ephemeral-destroy.yml` — destroy on PR close
- GitHub Environment `ephemeral` — manual repo settings setup (one-time)

### Out of Scope
- CDK stack changes (`backend/app.py`, `backend/infrastructure/` — unchanged)
- `ci.yml` and `cd.yml` modifications
- E2E/integration testing of ephemeral environments
- Multi-region deployments

## Capabilities

### New Capabilities
- `ephemeral-deploy`: automatic CloudFormation deployment for worktree branches with open PRs, push-triggered
- `ephemeral-destroy`: automatic stack teardown on PR close, pull_request closed-triggered

### Modified Capabilities
None — `openspec/specs/` is empty, no existing capabilities to modify.

## Approach

Two new workflows following `cd.yml` pattern. Branch name → sanitized suffix (lowercase, `/`→`-`, max 40 chars). `STACK_SUFFIX` via `$GITHUB_ENV` — same mechanism as `cd.yml`. Deploy gates on open PR; destroy uses `cdk destroy --force` with missing-stack as clean no-op. Zero CDK changes — `STACK_SUFFIX` in `backend/app.py` is the single variable point.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `.github/workflows/cd-ephemeral.yml` | New | Deploy on branch push with open PR |
| `.github/workflows/cd-ephemeral-destroy.yml` | New | Destroy on PR close |
| GitHub Environment `ephemeral` | Config | One-time repo settings |
| `.github/workflows/cd.yml` | None | Unchanged |
| `.github/workflows/ci.yml` | None | Unchanged |
| `backend/` (app.py, infrastructure/) | None | Already suffix-aware |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CloudFront delay (~5 min) on first deploy | Medium | PR comment warns of propagation wait |
| `ephemeral` Environment not configured | Medium | Pre-req doc; deploy fails clearly |
| Stack limit (200/account) | Low | Auto-destroy on merge; ~2-3 active |
| `cdk destroy` failure | Low | `--force`; CF handles deps |
| Branch name collision | Low | Deterministic sanitization |

## Rollback Plan

Delete `cd-ephemeral.yml` and `cd-ephemeral-destroy.yml`. Optionally `cdk destroy` remaining ephemeral stacks. `cd.yml` and CDK code are untouched — no infra rollback needed.

## Dependencies

- GitHub Environment `ephemeral` with same AWS secrets as staging/prod
- Existing `cdk.json` + Python CDK deps at `backend/` (already present)

## Success Criteria

- [ ] Push to worktree branch deploys isolated stack: `FrecuenciaColectivaStack-{branch}`
- [ ] PR receives comment with ephemeral frontend + API URLs
- [ ] Second push to same branch updates existing stack
- [ ] Merging PR destroys the ephemeral stack
- [ ] `cd.yml` (staging/prod) continues working unchanged
