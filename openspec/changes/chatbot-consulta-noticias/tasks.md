# Tasks: Chatbot Consulta Noticias

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~502 (222 new + 280 new) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Backend → PR 2: Frontend |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Backend: handler + CDK + tests | PR 1 | Base = main. ~222 lines. Chat API endpoint + Bedrock + DynamoDB Scan. |
| 2 | Frontend: chat UI + hook + tests | PR 2 | Base = main. ~280 lines. ChatWidget, useChat, page, routing. |

## Phase 1: Backend Foundation

- [x] 1.1 Add `@aws-sdk/client-bedrock-runtime` to `backend/package.json` dependencies
- [x] 1.2 Create `backend/src/types/chat.ts` — `ChatMessage`, `ChatResponse`, and `Citation` interfaces (created in backend per PR #1 scope; frontend types in PR #2)
- [x] 1.3 Export chat types from `backend/src/handlers/index.ts` (via `chatHandler` export — types consumed inline; full type exports for frontend in PR #2)

## Phase 2: Backend Core — Chat Handler

- [x] 2.1 Create `backend/src/handlers/chatHandler.ts` — method guard (GET 405 / OPTIONS 200), body validation (non-empty `message` → 400), DynamoDB ScanCommand, Bedrock ConverseCommand, response formatting with citation extraction
- [x] 2.2 Export `chatHandler` from `backend/src/handlers/index.ts`
- [x] 2.3 Add `chat_fn` Lambda (512MB, 30s), POST `/chat` route, and Bedrock `bedrock:InvokeModel` IAM policy (scoped to Haiku model ARN) in `backend/infrastructure/frecuencia_colectiva_stack.py`

## Phase 3: Frontend Core — Chat UI

- [x] 3.1 Add `sendChatMessage()` POST function to `frontend/src/utils/api.ts`
- [x] 3.2 Create `frontend/src/hooks/useChat.ts` — `messages`, `sendMessage`, `loading`, `error` state
- [x] 3.3 Export `useChat` from `frontend/src/hooks/index.ts`
- [x] 3.4 Create `frontend/src/components/ChatWidget.tsx` — message list, input field, citations, animated loading
- [x] 3.5 Export `ChatWidget` from `frontend/src/components/index.ts`
- [x] 3.6 Create `frontend/src/pages/ChatPage.tsx` — page wrapper rendering ChatWidget
- [x] 3.7 Export `ChatPage` from `frontend/src/pages/index.ts`
- [x] 3.8 Add `<Route path="/chat" element={<ChatPage />} />` to `frontend/src/App.tsx`

## Phase 4: Testing

- [x] 4.1 Create `backend/test/chatHandler.test.ts` — Jest test: validation (empty message → 400, invalid JSON → 400, missing body → 400), method guard (GET → 405, OPTIONS → 200), DynamoDB error → 500, Bedrock error → 502, zero articles → "No encontré información", successful response shape with citation parsing
- [x] 4.2 Create `frontend/src/test/ChatWidget.test.tsx` — Vitest + testing-library: renders input/button, submit calls sendChatMessage, displays loading state, renders answer + citations
