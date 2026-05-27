## Exploration: Ephemeral Environments for Worktree Branches

### Current State

The CI/CD pipeline is coupled to exactly two branches:

| Branch | Environment | Stack Suffix | Workflow |
|--------|-------------|--------------|----------|
| `development` | staging | `-staging` | `cd.yml` |
| `main` | production | `-prod` | `cd.yml` |
| Any other branch | — | — | CI only (`ci.yml`), no deploy |

`ci.yml` already runs on all branches (`branches: ['**']`), so CI coverage for worktree branches exists. But there is no CD path for branches other than `development` and `main`. Worktree branches (e.g., `change-footer-secciones`, `fix/contact-email`) run CI but cannot deploy infrastructure.

`backend/app.py` reads `STACK_SUFFIX` from the environment and passes it to the CDK stack ID:

```python
stack_suffix = os.getenv("STACK_SUFFIX", "")
stack = FrecuenciaColectivaStack(app, f"FrecuenciaColectivaStack{stack_suffix}", ...)
```

CloudFormation treats each unique stack ID as a separate, fully isolated stack with its own DynamoDB, Lambda, API Gateway, S3, and CloudFront resources. This means any arbitrary `STACK_SUFFIX` produces an independent environment with zero resource sharing.

### Affected Areas

| File | Status | Why |
|------|--------|-----|
| `.github/workflows/cd-ephemeral.yml` | **Create** | New deploy workflow for ephemeral branches |
| `.github/workflows/cd-ephemeral-destroy.yml` | **Create** | New destroy workflow on PR close |
| `.github/workflows/cd.yml` | Unchanged | Staging/prod deploys untouched |
| `.github/workflows/ci.yml` | Unchanged | CI already covers all branches |
| `backend/app.py` | Unchanged | Already reads `STACK_SUFFIX` from env — no changes needed |
| `backend/infrastructure/frecuencia_colectiva_stack.py` | Unchanged | Stack id includes suffix — no changes needed |

### Verification Results

1. **`backend/app.py` (line 12)**: Confirmed — `stack_suffix = os.getenv("STACK_SUFFIX", "")` reads from env. Passing `STACK_SUFFIX=-change-footer-secciones` creates `FrecuenciaColectivaStack-change-footer-secciones`. **No changes required.**

2. **CDK stack (line 18)**: Confirmed — `f"FrecuenciaColectivaStack{stack_suffix}"` is used as the stack construct ID. CloudFormation treats distinct IDs as separate stacks. **No changes required.**

3. **`EmailIdentity` import**: Line 57 of `frecuencia_colectiva_stack.py` has `from aws_cdk.aws_ses import EmailIdentity` — this is **unused dead code** left from commit e59d540 (which added SES EmailIdentity) reverted by 52962c9. It does NOT create any SES resource. It is harmless and does not block ephemeral environments. The ephemeral workflows will naturally skip SES identity creation since the CDK stack no longer creates one.

4. **`cd.yml` pattern**: Confirmed — `STACK_SUFFIX` is set via `echo "STACK_SUFFIX=-staging" >> $GITHUB_ENV`. The ephemeral workflow follows the exact same pattern with a dynamic suffix derived from the branch name.

5. **`ci.yml` trigger**: Confirmed — `branches: ['**']` on push means CI already runs on all branches including worktree branches. No changes needed.

6. **EmailIdentity is not instantiated**: The `EmailIdentity` class is imported but never called in the `__init__` method. The revert commit 52962c9 cleanly removed all SES resource creation. Ephemeral stacks will have no SES identity — the contact form handler will use the `CONTACT_EMAIL` env var (passed from secrets) and SES permissions via the Lambda role's IAM policy, relying on the verified staging/prod identities already configured in the AWS account.

### Approaches

1. **Two new workflow files (design doc approach) — RECOMMENDED**
   - `cd-ephemeral.yml`: Trigger on push to any branch except `development`/`main`, check for open PR, deploy stack with sanitized branch name suffix
   - `cd-ephemeral-destroy.yml`: Trigger on PR close for branches not `development`/`main`, destroy the ephemeral stack
   - Pros: Isolated from existing workflows, clean separation of concerns, matches existing `cd.yml` patterns, zero CDK changes
   - Cons: Requires manual GitHub Environment setup (`ephemeral`)
   - Effort: Low

2. **Modify `cd.yml` with conditionals**
   - Add ephemeral job to existing `cd.yml` with branch condition
   - Pros: Single workflow file
   - Cons: Messy conditionals, harder to read, risk of breaking staging/prod deploy, violates separation of concerns
   - Effort: Low but discouraged

3. **Terraform/Tofu-based approach**
   - Replace CDK with Terraform for ephemeral stacks
   - Pros: More mature workspace management
   - Cons: Complete rearchitecture, unreasonable scope, team doesn't use Terraform
   - Effort: Very High (rejected)

### Recommendation

**Approach 1** — two new workflow files, no CDK changes, reusing the `STACK_SUFFIX` pattern already in place. The design doc and plan are thorough and correct. Implementation is straightforward: copy the `cd.yml` pattern, inject dynamic branch sanitization, add a PR existence check for the deploy workflow, and a PR close trigger for destroy.

### Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Stack limit exceeded (200/account) | Low | Stacks auto-destroy on PR merge; max active = open PRs (~2-3) |
| CloudFront propagation delay (~5 min) | Medium | Document in PR comment that URLs take a few minutes |
| Unused `EmailIdentity` import confuses developers | Low | Harmless dead code — no resource created. Recommend cleaning as tech debt |
| `cdk destroy` failure on resources in use | Low | `--force` flag; CloudFormation handles dependency ordering |
| Branch name collision after sanitization | Low | Deterministic; only one stack per branch at a time |
| `ephemeral` GitHub Environment not configured | Medium | Document as pre-requisite; first deploy will fail with clear error |

### Ready for Proposal

**Yes.** Analysis confirms the design doc is correct. The existing `STACK_SUFFIX` pattern in `app.py` and the CDK stack makes this a workflow-only change. No application code, no CDK infrastructure changes needed. Two new YAML files and a one-time manual GitHub Environment setup.
