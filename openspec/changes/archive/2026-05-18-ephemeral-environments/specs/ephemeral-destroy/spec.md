# Ephemeral Destroy Specification

## Purpose

Automatically tear down an ephemeral AWS environment when its pull request is closed (merged). Missing stacks are handled as a clean no-op — no errors emitted.

## Requirements

### Requirement: PR-close triggered stack destruction

When a pull_request for a non-`development`, non-`main` branch is closed, the system MUST destroy the corresponding ephemeral CloudFormation stack if one exists.

#### Scenario: Merged PR destroys stack

- GIVEN an ephemeral stack `FrecuenciaColectivaStack-change-footer-secciones` exists
- WHEN the associated PR is merged (closed)
- THEN the system destroys the stack with `cdk destroy --force`
- AND posts a comment on the PR confirming cleanup

#### Scenario: PR closed without merge

- GIVEN an ephemeral stack exists for the branch
- WHEN the PR is closed without merging
- THEN the system destroys the ephemeral stack
- AND posts a comment confirming cleanup

### Requirement: Missing stack is a clean no-op

If no ephemeral stack exists for the branch at PR close, the system MUST exit with a zero status code. It MUST NOT produce an error or fail the workflow run.

#### Scenario: No stack to destroy

- GIVEN no ephemeral stack exists for the branch
- WHEN the associated PR is closed
- THEN the system exits cleanly with success
- AND the PR receives a comment that no environment was found to destroy

### Requirement: Stack existence check before destruction

The system MUST verify stack existence before attempting `cdk destroy`. This prevents errors from attempting to destroy a non-existent stack.

#### Scenario: Stack existence probe

- GIVEN a closed PR
- WHEN the system checks for the corresponding stack via CloudFormation describe-stacks
- THEN it proceeds to destroy only if the stack exists
- AND skips destruction with a clean exit if it does not
