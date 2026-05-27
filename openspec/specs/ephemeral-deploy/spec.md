# Ephemeral Deploy Specification

## Purpose

Automatically deploy an isolated full-stack AWS environment for any worktree branch that has an open pull request. Each environment is fully independent — no shared resources with staging or production.

## Requirements

### Requirement: Push-triggered isolated deployment

On every push to a branch that is NOT `development` or `main` AND has an open PR, the system MUST deploy a CloudFormation stack whose resources are fully isolated from staging and production.

#### Scenario: First push deploys new stack

- GIVEN a branch `change-footer-secciones` with an open PR and no previous ephemeral deployment
- WHEN code is pushed to that branch
- THEN CloudFormation creates stack `FrecuenciaColectivaStack-change-footer-secciones`
- AND the frontend is built and uploaded to the ephemeral S3 bucket
- AND the ephemeral DynamoDB table is seeded

#### Scenario: Subsequent push updates existing stack

- GIVEN stack `FrecuenciaColectivaStack-change-footer-secciones` already exists from a previous push
- WHEN new code is pushed to the same branch
- THEN CloudFormation updates the existing stack
- AND the frontend rebuilds against the same API endpoint
- AND no duplicate stack is created

### Requirement: Stack naming and isolation

Each ephemeral stack MUST be named `FrecuenciaColectivaStack-{sanitized-branch}` where the branch name is lowercased, `/` replaced with `-`, and truncated to 40 characters. The stack MUST NOT share DynamoDB tables, S3 buckets, API Gateways, CloudFront distributions, or Lambda functions with any other stack.

#### Scenario: Branch name sanitization

- GIVEN a branch `fix/Contact-Email`
- WHEN the stack suffix is derived
- THEN the stack name MUST be `FrecuenciaColectivaStack-fix-contact-email`

#### Scenario: Long branch name truncation

- GIVEN a branch name longer than 40 characters after sanitization
- WHEN the stack suffix is derived
- THEN the suffix MUST be truncated to 40 characters

### Requirement: PR notification with ephemeral URLs

The system MUST leave a comment on the open PR with the ephemeral frontend URL and the API Gateway endpoint after the deployment completes.

#### Scenario: Happy path PR comment

- GIVEN a successful ephemeral deployment
- WHEN the frontend URL and API endpoint are available
- THEN the system posts a PR comment containing both URLs

#### Scenario: Non-PR branch skipped

- GIVEN a push to a branch that does NOT have an open PR
- WHEN the deploy workflow runs
- THEN the system MUST skip the deployment and exit cleanly
- AND no stack is created
