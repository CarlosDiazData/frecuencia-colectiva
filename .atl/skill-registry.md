# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When user asks to commit changes, create a git commit, or mentions "/commit" | git-commit | C:\Users\angem\.config\opencode\skills\git-commit\SKILL.md |
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | C:\Users\angem\.config\opencode\skills\branch-pr\SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | C:\Users\angem\.config\opencode\skills\issue-creation\SKILL.md |
| When user says "update changelog", "log changes", "changelog", or before merging feature branches | changelog | C:\Users\angem\.config\opencode\skills\changelog\SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", etc. | judgment-day | C:\Users\angem\.config\opencode\skills\judgment-day\SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | C:\Users\angem\.config\opencode\skills\go-testing\SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | C:\Users\angem\.config\opencode\skills\skill-creator\SKILL.md |
| When creating CDK stacks, defining CDK constructs, implementing infrastructure as code, or when the user mentions CDK | aws-cdk-development | C:\Users\angem\Proyectos\frecuencia-colectiva\.agents\skills\aws-cdk-development\SKILL.md |
| When setting up AWS MCP, configuring AWS documentation tools, troubleshooting MCP connectivity | aws-mcp-setup | C:\Users\angem\Proyectos\frecuencia-colectiva\.agents\skills\aws-mcp-setup\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### git-commit
- Analyze diff to determine type (feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert)
- Scope is optional but recommended (affected module)
- Breaking changes: add `!` after type/scope OR include `BREAKING CHANGE:` footer
- Stage logically related files separately for clean commit history
- Never commit secrets, credentials, or .env files

### branch-pr
- Every PR MUST link an approved issue (status:approved label)
- Every PR MUST have exactly one `type:*` label
- Branch naming: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Automated checks must pass before merge
- Blank PRs without issue linkage are blocked by GitHub Actions

### issue-creation
- Blank issues disabled - MUST use template (bug report or feature request)
- Every issue gets `status:needs-review` automatically on creation
- A maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, not issues

### changelog
- Run before merging feature branches
- Scan git commits since last entry using `git log --oneline --date=short`
- Group by date, categorize: Added/Changed/Fixed/Removed/Docs
- Add new date heading at top of CHANGELOG.md

### judgment-day
- Launch TWO independent blind judge sub-agents in parallel
- Neither agent knows about the other - no cross-contamination
- Synthesize findings, apply fixes, re-judge until both pass
- Escalate after 2 iterations if issues remain

### go-testing
- Use table-driven tests for multiple test cases
- Use teatest for Bubbletea TUI testing
- Golden file testing for complex output comparisons
- Follow Go convention: `TestFunction_Name` for test names

### skill-creator
- Create skills for repeated patterns, project-specific conventions, complex workflows
- Structure: `skills/{skill-name}/SKILL.md` + optional `assets/` and `references/`
- SKILL.md must have: name, description, license, allowed-tools, and content

### aws-cdk-development
- CRITICAL: Do NOT explicitly specify resource names where CDK generates them automatically
- Let CDK generate unique names for reusability and parallel deployments
- Use CDK construct patterns - don't hard-code resource names
- For CDK guidance, use MCP tools (mcp__aws-mcp__*, mcp__*awsdocs*__*) before answering

### aws-mcp-setup
- Check if AWS MCP tools already available via `/mcp` command
- Full AWS MCP Server requires Python 3.10+, uvx, and valid AWS credentials
- AWS Documentation MCP requires no auth - documentation search only
- Guide user through setup if MCP tools unavailable

## Project Conventions

No convention index files found (AGENTS.md, CLAUDE.md, .cursorrules, GEMINI.md, copilot-instructions.md) in project root.

## Project Standards (auto-resolved)

### TypeScript/React (frontend)
- Strict TypeScript mode enabled
- ESLint with React hooks rules (eslint-plugin-react-hooks)
- Use Vitest for unit tests (`npm test`)
- Component tests via @testing-library/react

### Jest (backend)
- Jest 29.7.0 with ts-jest transform
- Test files: `**/*.test.ts` in backend/test/
- Collect coverage from `src/**/*.ts`

### AWS CDK (backend infrastructure)
- Python CDK v2 for infrastructure definition
- TypeScript for Lambda handlers
- Node.js 20.x Lambda runtime
- CDK-generated resource names (no explicit naming)

### Git Workflow
- Branching: main/develop with feature branches
- Conventional commits required
- ESLint must pass before commit
