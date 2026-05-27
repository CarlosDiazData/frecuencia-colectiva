# Proposal: Chatbot Consulta Noticias

## Intent

Users can't search the news site — the Navbar search input decorates without functionality. Add a conversational chat that answers questions using ONLY published article content, with citations. Readers ask "¿qué eventos culturales hay este mes?" and get answers grounded in real articles.

## Scope

### In Scope
- Chat UI page with per-session message history (no persistence, refreshes on reload)
- POST `/api/chat` Lambda: receives message → DynamoDB GSI query → Bedrock Claude Haiku with article context → answer + citations
- Full article body injection as LLM context (not summaries/chunks)
- Strict prompt: "Answer ONLY from provided articles. Say 'No encontré información' if unsure."
- REST polling: send, spinner, receive full response (no streaming)
- CDK: new Lambda, API Gateway route, Bedrock + DynamoDB IAM permissions

### Out of Scope
- Session persistence / conversation memory across reloads
- Streaming / WebSocket responses
- Rate limiting (MVP for few testers)
- Vector store / OpenSearch / semantic search
- Fixing broken Navbar search

## Capabilities

### New Capabilities
- `chatbot`: Conversational AI answering questions using published article content as context. Natural-language queries → cited, grounded answers.

### Modified Capabilities
None — existing specs (ephemeral-deploy, ephemeral-destroy) unchanged.

## Approach

**Direct LLM + Context Injection** via AWS Bedrock Claude Haiku.

User → ChatPage (React) → POST /api/chat → Lambda → DynamoDB (category+date GSI) + Bedrock (full article bodies as context) → answer with citations.

Confirmed design decisions: stateless, full body injection, REST polling, strict anti-hallucination prompt, no rate limiting.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/handlers/` | New | `chatHandler.ts` |
| `backend/infrastructure/` | Modified | New Lambda, route, Bedrock IAM |
| `backend/package.json` | Modified | `@aws-sdk/client-bedrock-runtime` |
| `frontend/src/pages/` | New | `ChatPage.tsx` |
| `frontend/src/components/` | New | `ChatWidget.tsx` |
| `frontend/src/hooks/` | New | `useChat.ts` |
| `frontend/src/utils/api.ts` | Modified | `sendChatMessage()` |
| `frontend/src/types/` | Modified | Chat message types |
| `frontend/src/App.tsx` | Modified | `/chat` route |
| `backend/test/` | New | Chat handler tests |
| `frontend/src/__tests__/` | New | Chat UI tests |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Bedrock hallucinations | Medium | Strict system prompt; edge-case testing |
| Bedrock regional unavailability | Low | Verify us-east-1 during design |
| 2-5s latency degrades UX | Medium | Animated "Buscando..." states |
| DynamoDB Scan growth limits | Low | <50 articles; GSI covers most queries |

## Rollback Plan

1. CDK diff → remove Lambda + route (no data migration needed — stateless)
2. Remove `/chat` route, delete ChatPage/ChatWidget/useChat files
3. No DynamoDB cleanup required

## Dependencies

- AWS Bedrock Claude Haiku model access in target region
- `@aws-sdk/client-bedrock-runtime` npm package

## Success Criteria

- [ ] Question → cited answer within 10 seconds
- [ ] Zero fabricated answers (answer always grounded in article context)
- [ ] "No encontré información" when no articles match
- [ ] Chat UI shows per-session message history
- [ ] All new tests pass (frontend + backend)
- [ ] CDK synth succeeds with new infrastructure
