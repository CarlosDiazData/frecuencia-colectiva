# Design: Chatbot Consulta Noticias

## Technical Approach

Full-body context injection: Lambda scans all DynamoDB articles (<50), formats them as structured blocks, passes everything to Bedrock Claude Haiku with a strict anti-hallucination prompt. Claude does relevance filtering + citation — no intermediate NLP, no vector search. React ChatPage polls REST `POST /api/chat`, waits for response, renders answer + citations. Stateless per-session via React memory.

## Architecture Decisions

| Decision | Choice | Rejected | Rationale |
|----------|--------|----------|-----------|
| Model | Claude Haiku 4.5 | Sonnet | 3× cheaper, 2× faster. 200K context window. Q&A from provided context needs no deep reasoning — prompt guardrails, not model intelligence, prevent hallucination. |
| Retrieval | Scan all | GSI category query | <50 articles makes full scan trivial (~2ms cold, <1ms warm). No category-classification failure mode. Claude sees the full corpus — zero missed articles. The existing GSI remains for `filterByCategoryHandler`. |
| State | Stateless | DynamoDB sessions | MVP. Per-session history lives in `useChat` hook. Refresh clears history — acceptable for first release. No data migration, trivial rollback. |
| Transport | REST POST | WebSocket/SSE | 2–5s latency covered by animated "Buscando…" state. Aligns with existing API Gateway patterns, simpler Lambda (no connection lifecycle). |
| API | Converse API | InvokeModel | Structured messages, native system prompt, token usage metadata. Future-proof (InvokeModel being deprecated for Claude). |

## Sequence Diagram

```
User → ChatPage (React) → POST /api/chat → Lambda → ScanCommand (DynamoDB)
                                                          ↓
User ← ChatPage ← 200 JSON ← API Gateway ← Lambda ← articles (all)
                   {answer,          ↑                        ↓
                    citations}  format response    Converse API (Bedrock Haiku)
                                                   system + question + context
```

## Prompt Engineering

**System prompt** (Converse API `system` field):

> Eres un asistente cultural que responde SOLO con los artículos proporcionados.
> 1. Responde ÚNICAMENTE con datos explícitos de los artículos.
> 2. Si no hay información suficiente, di: "No encontré información sobre este tema en nuestros artículos publicados."
> 3. NO inventes fechas, nombres, lugares, ni detalles. NADA fuera de los artículos.
> 4. Cada dato factual debe citarse como [Título del artículo](URL).
> 5. Máximo 3 párrafos. Sé conversacional pero preciso.
> 6. Si los artículos son parcialmente relevantes, menciona lo encontrado y reconoce vacíos.

**Context format** — one block per article, injected as user message content:

```
--- ARTÍCULO 1 ---
Título: {title}
Categoría: {category}
Fecha: {date}
URL: {url}
Contenido:
{body}
--- ARTÍCULO 2 ---
...
```

User question appended after all article blocks.

## Lambda Handler Architecture

Follows `contactHandler` pattern: `APIGatewayProxyHandler`, `corsHeaders` object, `createResponse()` helper (matching `listArticlesHandler` style). Flow:

1. **Method guard**: reject GET (405), handle OPTIONS (200)
2. **Validate**: parse body, require non-empty `message` string → 400 on failure
3. **Scan DynamoDB**: `ScanCommand` on articles table → extract `{title, body, url, category, date}`
4. **Build context**: if articles exist, format article blocks + user message → invoke `BedrockRuntimeClient.send(new ConverseCommand(...))`. If zero articles, skip Bedrock → `answer: "No encontré información…"`, `citations: []`
5. **Format response**: extract `answer` from Claude output, parse citations from markdown links in answer, return `{answer, citations}`

**Error handling**: 502 for Bedrock failures (user-friendly, no API internals), 500 for DynamoDB. **Timeout**: 30s (Bedrock ~3–5s typical, DynamoDB <100ms). **Memory**: 512MB (article bodies + SDK buffers).

**Response shape**:
```typescript
{ answer: string; citations: { title: string; url: string }[] }
```

**New dependency**: `@aws-sdk/client-bedrock-runtime` in `backend/package.json`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/src/handlers/chatHandler.ts` | Create | Lambda: scan articles → Bedrock Converse → response |
| `backend/src/handlers/index.ts` | Modify | Export `chatHandler` |
| `backend/package.json` | Modify | Add `@aws-sdk/client-bedrock-runtime` |
| `backend/infrastructure/frecuencia_colectiva_stack.py` | Modify | Chat Lambda, `/chat` route, Bedrock IAM |
| `frontend/src/types/chat.ts` | Create | `ChatMessage`, `ChatResponse` types |
| `frontend/src/types/index.ts` | Modify | Export chat types |
| `frontend/src/utils/api.ts` | Modify | Add `sendChatMessage()` |
| `frontend/src/hooks/useChat.ts` | Create | `messages`, `sendMessage`, `loading`, `error` |
| `frontend/src/hooks/index.ts` | Modify | Export `useChat` |
| `frontend/src/components/ChatWidget.tsx` | Create | Message list, input, citations, loading state |
| `frontend/src/components/index.ts` | Modify | Export `ChatWidget` |
| `frontend/src/pages/ChatPage.tsx` | Create | Page wrapper with header |
| `frontend/src/pages/index.ts` | Modify | Export `ChatPage` |
| `frontend/src/App.tsx` | Modify | Add `<Route path="/chat" element={<ChatPage />} />` |
| `backend/test/chatHandler.test.ts` | Create | Jest tests: validation, errors, response shape |
| `frontend/src/test/ChatWidget.test.tsx` | Create | Vitest + testing-library: render, submit, citations |

## CDK Infrastructure

Python CDK additions (in `frecuencia_colectiva_stack.py`):

```python
# Bedrock IAM — scoped to Claude Haiku model ARN
lambda_role.add_to_policy(PolicyStatement(
    actions=["bedrock:InvokeModel"],
     resources=["arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0"],
))

chat_fn = Function(self, "ChatHandler",
    runtime=Runtime.NODEJS_20_X,
    handler="chatHandler.handler",
    code=Code.from_asset("dist/handlers"),
    role=lambda_role,
    environment={
        "TABLE_NAME": articles_table.table_name,
         "BEDROCK_MODEL_ID": "anthropic.claude-haiku-4-5-20251001-v1:0",
    },
    memory_size=512,
    timeout=Duration.seconds(30),
)

chat = api.root.add_resource("chat")
chat.add_method("POST", LambdaIntegration(chat_fn))
```

Existing `articles_table.grant_read_data(lambda_role)` covers DynamoDB access. No NAG suppression needed — Bedrock policy uses specific model ARN (not `*`).

## Testing Strategy

| Layer | What | Tool |
|-------|------|------|
| Backend unit | Input validation, error codes, response shape | Jest + mocked DynamoDB/Bedrock |
| Backend integration | Real Bedrock call, citation extraction, prompt format | Jest + dev AWS account |
| Frontend unit | `useChat` hook states (loading, error, success) | Vitest + mocked `sendChatMessage` |
| Frontend integration | ChatWidget render, submit flow, citation display | Vitest + @testing-library/react |

## Open Questions

- [x] Is Bedrock Claude Haiku 4.5 model access enabled in the us-east-1 deployment account? → **Confirmed available in us-east-1 (Standard tier)**
- [ ] Confirm `@aws-sdk/client-bedrock-runtime` Converse API availability at v3.500+ (current SDK baseline)
