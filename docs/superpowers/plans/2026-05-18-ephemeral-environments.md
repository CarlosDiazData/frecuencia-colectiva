# Ephemeral Environments for Worktree Branches — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ephemeral (per-branch) full-stack environments so any worktree branch pushed to GitHub automatically deploys an isolated AWS stack, and destroys it on PR merge.

**Architecture:** Two new GitHub Actions workflows (`cd-ephemeral.yml` for deploy, `cd-ephemeral-destroy.yml` for cleanup). No CDK code changes — `STACK_SUFFIX` is made dynamic via branch name sanitization. `ci.yml` and `cd.yml` remain untouched.

**Tech Stack:** GitHub Actions, AWS CDK (Python), AWS CLI, `gh` CLI

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/cd-ephemeral.yml` | **Create** | Deploy ephemeral stack on push to worktree branch |
| `.github/workflows/cd-ephemeral-destroy.yml` | **Create** | Destroy ephemeral stack on PR close |
| `backend/app.py` | No change | Already reads `STACK_SUFFIX` from env |
| `backend/infrastructure/frecuencia_colectiva_stack.py` | No change | Stack id includes suffix |
| `.github/workflows/cd.yml` | No change | Staging/prod deploys unchanged |
| `.github/workflows/ci.yml` | No change | CI unchanged |

## Pre-requisite (manual)

Before the workflows work, create a GitHub Environment called `ephemeral` in the repo settings:

- **Settings → Environments → New environment → `ephemeral`**
- No required reviewers
- No wait timer
- No deployment branches restriction
- Add secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ACCOUNT_ID`, `CONTACT_EMAIL` (same values as staging)

---

### Task 1: Create `cd-ephemeral.yml` — Deploy Workflow

**Files:**
- Create: `.github/workflows/cd-ephemeral.yml`

- [ ] **Step 1: Write the complete workflow file**

```yaml
name: CD Ephemeral

on:
  push:
    branches-ignore: [development, main]

jobs:
  check-pr:
    name: Check PR exists
    runs-on: ubuntu-latest
    outputs:
      pr_number: ${{ steps.check.outputs.pr_number }}
    steps:
      - name: Find open PR for this branch
        id: check
        run: |
          PR_NUMBER=$(gh pr list --head "${{ github.ref_name }}" --state open --json number -q '.[0].number')
          echo "pr_number=$PR_NUMBER" >> $GITHUB_OUTPUT
          if [ -z "$PR_NUMBER" ]; then
            echo "No open PR found for branch ${{ github.ref_name }} — skipping ephemeral deploy"
          else
            echo "PR #$PR_NUMBER found — will deploy ephemeral environment"
          fi
        env:
          GH_TOKEN: ${{ github.token }}

  deploy-ephemeral:
    name: Deploy Ephemeral (${{ github.ref_name }})
    runs-on: ubuntu-latest
    needs: check-pr
    if: needs.check-pr.outputs.pr_number != ''
    environment:
      name: ephemeral

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Sanitize branch name for stack suffix
        id: suffix
        run: |
          SANITIZED=$(echo "${{ github.ref_name }}" | tr '/' '-' | tr '[:upper:]' '[:lower:]' | cut -c1-40)
          echo "stack_suffix=-$SANITIZED" >> $GITHUB_ENV
          echo "suffix=$SANITIZED" >> $GITHUB_OUTPUT
          echo "Stack suffix: -$SANITIZED"

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install CDK dependencies
        run: pip install -r backend/requirements.txt

      - name: Setup Node.js for backend
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Build backend TypeScript
        run: |
          cd backend
          npm ci
          npm run build

      - name: Ensure frontend dist folder exists for CDK
        run: mkdir -p frontend/dist

      - name: Deploy CDK stack
        run: |
          cd backend
          npx cdk deploy --all --require-approval never --ci
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          STACK_SUFFIX: ${{ env.stack_suffix }}
          AWS_ACCOUNT: ${{ secrets.AWS_ACCOUNT_ID }}
          CONTACT_EMAIL: ${{ secrets.CONTACT_EMAIL }}

      - name: Get CDK outputs
        id: cdk-outputs
        run: |
          STACK_NAME="FrecuenciaColectivaStack${{ env.stack_suffix }}"
          API_URL=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "${{ secrets.AWS_REGION }}" \
            --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
            --output text)
          FRONTEND_URL=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "${{ secrets.AWS_REGION }}" \
            --query 'Stacks[0].Outputs[?OutputKey==`FrontendURL`].OutputValue' \
            --output text)
          FRONTEND_BUCKET=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "${{ secrets.AWS_REGION }}" \
            --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
            --output text)
          DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "${{ secrets.AWS_REGION }}" \
            --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
            --output text)
          TABLE_NAME=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "${{ secrets.AWS_REGION }}" \
            --query 'Stacks[0].Outputs[?OutputKey==`DynamoDBTableName`].OutputValue' \
            --output text)
          echo "api_url=$API_URL" >> $GITHUB_OUTPUT
          echo "frontend_url=$FRONTEND_URL" >> $GITHUB_OUTPUT
          echo "frontend_bucket=$FRONTEND_BUCKET" >> $GITHUB_OUTPUT
          echo "distribution_id=$DISTRIBUTION_ID" >> $GITHUB_OUTPUT
          echo "table_name=$TABLE_NAME" >> $GITHUB_OUTPUT
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}

      - name: Setup Node.js for frontend
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Build frontend
        run: |
          cd frontend
          npm ci
          npm run build
        env:
          VITE_API_BASE_URL: ${{ steps.cdk-outputs.outputs.api_url }}

      - name: Upload frontend files to S3
        run: |
          aws s3 sync ./frontend/dist s3://${{ steps.cdk-outputs.outputs.frontend_bucket }} --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ steps.cdk-outputs.outputs.distribution_id }} --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}

      - name: Setup Node.js for seed scripts
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: scripts/package-lock.json

      - name: Seed DynamoDB with sample articles
        run: |
          cd scripts
          npm ci
          npm run seed
        env:
          TABLE_NAME: ${{ steps.cdk-outputs.outputs.table_name }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}

      - name: Comment on PR with ephemeral URLs
        run: |
          gh pr comment ${{ needs.check-pr.outputs.pr_number }} --body "🚀 **Ephemeral environment ready**

          | | |
          |---|---|
          | **Frontend** | ${{ steps.cdk-outputs.outputs.frontend_url }} |
          | **API** | ${{ steps.cdk-outputs.outputs.api_url }} |
          | **Stack** | \`FrecuenciaColectivaStack${{ env.stack_suffix }}\` |

          ⏱️ Destroyed when this PR is merged.
          ⚠️ CloudFront may take a few minutes to propagate on first deploy."
        env:
          GH_TOKEN: ${{ github.token }}
```

- [ ] **Step 2: Verify the file syntax**

Run: `cd /home/carlos-diaz/Projects/frecuencia-colectiva/.worktrees/change-footer-secciones && python3 -c "import yaml; yaml.safe_load(open('.github/workflows/cd-ephemeral.yml'))" 2>&1 || echo "yaml not available — verify manually"`
Expected: No YAML parse errors.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/cd-ephemeral.yml
git commit -m "ci: add ephemeral environment deploy workflow for worktree branches"
```

---

### Task 2: Create `cd-ephemeral-destroy.yml` — Destroy Workflow

**Files:**
- Create: `.github/workflows/cd-ephemeral-destroy.yml`

- [ ] **Step 1: Write the complete workflow file**

```yaml
name: CD Ephemeral Destroy

on:
  pull_request:
    types: [closed]
    branches-ignore: [development, main]

jobs:
  destroy-ephemeral:
    name: Destroy Ephemeral (${{ github.head_ref }})
    runs-on: ubuntu-latest
    environment:
      name: ephemeral

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Sanitize branch name
        id: suffix
        run: |
          SANITIZED=$(echo "${{ github.head_ref }}" | tr '/' '-' | tr '[:upper:]' '[:lower:]' | cut -c1-40)
          echo "stack_suffix=-$SANITIZED" >> $GITHUB_ENV
          echo "Stack name: FrecuenciaColectivaStack-$SANITIZED"

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install CDK dependencies
        run: pip install -r backend/requirements.txt

      - name: Setup Node.js for backend
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Build backend TypeScript
        run: |
          cd backend
          npm ci
          npm run build

      - name: Check if stack exists
        id: check-stack
        continue-on-error: true
        run: |
          STACK_NAME="FrecuenciaColectivaStack${{ env.stack_suffix }}"
          aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "${{ secrets.AWS_REGION }}" \
            --query 'Stacks[0].StackName' \
            --output text
          echo "stack_exists=true" >> $GITHUB_OUTPUT
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}

      - name: Destroy ephemeral stack
        if: steps.check-stack.outputs.stack_exists == 'true'
        run: |
          cd backend
          npx cdk destroy --all --force --ci
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          STACK_SUFFIX: ${{ env.stack_suffix }}
          AWS_ACCOUNT: ${{ secrets.AWS_ACCOUNT_ID }}
          CONTACT_EMAIL: ${{ secrets.CONTACT_EMAIL }}

      - name: Comment on PR with destroy confirmation
        if: steps.check-stack.outputs.stack_exists == 'true'
        run: |
          gh pr comment ${{ github.event.pull_request.number }} --body "🗑️ **Ephemeral environment destroyed**

          Stack \`FrecuenciaColectivaStack${{ env.stack_suffix }}\` has been removed."
        env:
          GH_TOKEN: ${{ github.token }}

      - name: Skip — no stack found
        if: steps.check-stack.outputs.stack_exists != 'true'
        run: echo "No ephemeral stack found for branch ${{ github.head_ref }} — nothing to destroy"
```

- [ ] **Step 2: Verify the file syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/cd-ephemeral-destroy.yml'))" 2>&1 || echo "Verify manually"`
Expected: No YAML parse errors.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/cd-ephemeral-destroy.yml
git commit -m "ci: add ephemeral environment destroy workflow on PR close"
```

---

### Task 3: Verify `cd.yml` and `ci.yml` are untouched

**Files:**
- Verify: `.github/workflows/cd.yml` (no changes)
- Verify: `.github/workflows/ci.yml` (no changes)

- [ ] **Step 1: Diff against the base to confirm only new files were added**

```bash
git diff development -- .github/workflows/
```
Expected: Only shows the two new files (`cd-ephemeral.yml`, `cd-ephemeral-destroy.yml`). `cd.yml` and `ci.yml` must not appear.

- [ ] **Step 2: Verify `backend/app.py` is unchanged**

```bash
git diff development -- backend/app.py
```
Expected: No output (no changes).

- [ ] **Step 3: Verify CDK stack is unchanged**

```bash
git diff development -- backend/infrastructure/frecuencia_colectiva_stack.py
```
Expected: No output (no changes).

---

### Task 4: Final review and push

- [ ] **Step 1: Show the complete diff**

```bash
git diff development --stat
```
Expected: 2 new files only, ~250 lines total.

- [ ] **Step 2: Push to trigger the first ephemeral deploy**

```bash
git push origin change-footer-secciones
```

- [ ] **Step 3: Monitor the GitHub Actions run**

Open `https://github.com/<owner>/frecuencia-colectiva/actions` and watch the `CD Ephemeral` workflow.
Expected: `check-pr` job finds PR #N, `deploy-ephemeral` creates `FrecuenciaColectivaStack-change-footer-secciones`, comments on PR with URLs.

---

## Rollback

If the ephemeral deploy fails or creates issues:

```bash
# Manually destroy the ephemeral stack
cd backend
STACK_SUFFIX="-change-footer-secciones" npx cdk destroy --all --force

# Revert the workflow files
git revert <commit-hash>
git push
```
