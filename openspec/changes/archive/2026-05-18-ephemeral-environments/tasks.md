# Tasks: Ephemeral Environments for Worktree Branches

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Deploy + destroy workflows + verification | PR 1 | Single self-contained PR, ~250 lines of YAML, zero app changes |

## Phase 1: Prerequisites (Manual — One-Time Setup)

- [ ] 1.1 Create GitHub Environment `ephemeral` in repo Settings → Environments, with same AWS secrets as `staging` (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_ACCOUNT_ID, CONTACT_EMAIL). No required reviewers, no wait timer, no deployment branch restrictions.

## Phase 2: Ephemeral Deploy Workflow

- [ ] 2.1 Create `.github/workflows/cd-ephemeral.yml` with push trigger (`branches-ignore: [development, main]`), `check-pr` job (PR gate via `gh pr list`), and `deploy-ephemeral` job (branch sanitization, CDK deploy, CDK outputs extraction, frontend build/upload/S3 sync/CloudFront invalidation, DynamoDB seed, PR comment with URLs)
- [ ] 2.2 Validate YAML: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/cd-ephemeral.yml'))"` produces no errors

## Phase 3: Ephemeral Destroy Workflow

- [ ] 3.1 Create `.github/workflows/cd-ephemeral-destroy.yml` with `pull_request: [closed]` trigger (`branches-ignore: [development, main]`), branch sanitization (`github.head_ref`), stack existence probe (`aws cloudformation describe-stacks` with `continue-on-error: true`), `cdk destroy --force`, and PR comment confirming cleanup or skip
- [ ] 3.2 Validate YAML: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/cd-ephemeral-destroy.yml'))"` produces no errors

## Phase 4: Regression Verification

- [ ] 4.1 Confirm no unintended changes: `git diff development -- .github/workflows/` shows ONLY the two new files (`cd-ephemeral.yml`, `cd-ephemeral-destroy.yml`) — `cd.yml` and `ci.yml` are absent from diff
- [ ] 4.2 Confirm no backend changes: `git diff development -- backend/app.py` and `git diff development -- backend/infrastructure/` produce no output

## Phase 5: Commit, Push & Validate

- [ ] 5.1 Commit both new workflow files with message `ci: add ephemeral environment deploy/destroy workflows for PR branches`
- [ ] 5.2 Push to trigger the first ephemeral deploy run
- [ ] 5.3 Verify in GitHub Actions: `check-pr` job finds open PR, `deploy-ephemeral` creates CloudFormation stack and comments on PR with ephemeral URLs
