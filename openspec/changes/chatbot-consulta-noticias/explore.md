# Exploration: chatbot-consulta-noticias

## Current State

### Article Data Model (DynamoDB)
- Single table `ArticlesTable` with partition key `articleId` (string)
- GSI `categoryIndex` on `category` (PK) + `date` (SK), descending
- Billing: PAY_PER_REQUEST (auto-scaling)
- Article fields: `articleId`, `title`, `summary`, `body` (HTML), `author`, `date` (ISO), `category`, `imageUrl`, `readTimeMinutes`
- Volume: small scale (~5-50 articles based on seed data patterns)
- No vector embeddings, no full-text search index

### API Endpoints (REST API Gateway)
| Method | Path | Handler | Features |
|--------|------|---------|----------|
| GET | `/articles` | `listArticlesHandler` | `?category=` (GSI query), `?search=` (Scan+FilterExpression on title/summary), default: Scan with Limit 50 |
| GET | `/articles/{id}` | `getArticleHandler` | Single article by `articleId` |
| POST | `/contact` | `contactHandler` | SES email (unrelated) |

### Current Search Limitations
- **Text search** (`?search=X`): DynamoDB `Scan` + `FilterExpression: contains(title, X) OR contains(summary, X)` — full table scan, body is NOT searchable, no pagination carried through properly
- **Category filtering**: efficient via GSI Query, no additional aggregation
- **No search results page**: `SearchContext` stores query in Navbar but never navigates to results — the search input is decoration, not functional
- **No date-range filtering**: date is indexed in GSI sort key but no endpoint exposes range queries
- **No cross-category aggregation**: all articles or filter by one category, no combined queries

### Frontend Routes
- `/` → `HomePage` (all articles, hero + grid layout)
- `/section/:category` → `SectionPage` (filter by category)
- `/article/:id` → `ArticlePage` (single article + related)
- Static pages: Nosotros, Directorio, Contacto, Anunciate, AvisoPrivacidad
- **No `/search` route** — search infrastructure exists (context, API call) but no page consumes it

### Frontend Stack Notes
- React 18.2 + TypeScript, Vite 5.1, TailwindCSS 3.4
- React Context + hooks (no Redux/Zustand)
- No existing chat UI components

## Affected Areas

- `backend/src/handlers/` — New `chatHandler.ts` for chatbot Lambda
- `backend/infrastructure/frecuencia_colectiva_stack.py` — New Lambda function resource, API Gateway route, IAM permissions for Bedrock
- `backend/app.py` — May need new stack outputs
- `frontend/src/pages/` — New `ChatPage.tsx` or widget component
- `frontend/src/components/` — New `ChatWidget.tsx` UI component
- `frontend/src/App.tsx` — New route for chatbot page
- `frontend/src/utils/api.ts` — New `sendChatMessage()` API function
- `frontend/src/types/` — New types for chat messages
- `frontend/src/hooks/` — New `useChat.ts` hook
- `backend/package.json` — New dependency: `@aws-sdk/client-bedrock-runtime`
- `backend/test/` — New tests for chat handler
- `frontend/src/test/` — New tests for chat UI

## Approaches

### 1. Direct LLM with Context Injection (Recommended for current scale)

- Lambda receives user question via new `POST /api/chat` endpoint
- Lambda fetches relevant articles using existing DynamoDB search (title/summary/category/date)
- Injects article content into a Bedrock (Claude Haiku) prompt as context
- LLM answers based ONLY on provided context — no training, no vector store
- Frontend: simple chat page or embedded widget using REST polling

**Pros:**
- No vector store needed — zero additional infrastructure
- Fastest time-to-market (~4-5 days MVP)
- No data leaves AWS (Bedrock within account)
- Easy to restrict answers to factual article content
- Scales well for the current small article volume

**Cons:**
- Doesn't scale to thousands of articles (context window limit)
- Each request re-searches DynamoDB (Scan-based search is slow as data grows)
- No persistent conversation memory per user session
- Latency: LLM inference adds 2-5s per query

**Effort:** Medium (~4-5 days for MVP)

### 2. RAG with Vector Store + Bedrock

- Add pgvector on Aurora Serverless v2, or OpenSearch Serverless
- Generate embeddings per article (body, summary, title) on publish
- Chatbot queries: embed question → vector search → retrieve top K chunks → LLM answer
- Enables semantic search: "¿qué eventos culturales hay este mes?" finds conceptually related articles

**Pros:**
- Semantic understanding beyond keyword matching
- Scales to thousands of articles
- Can chunk long articles for granular retrieval
- Industry standard pattern for production RAG

**Cons:**
- Significantly more infrastructure and cost:
  - OpenSearch Serverless: ~$30+/mo minimum (overkill for this scale)
  - Aurora Serverless v2: VPC, networking complexity
  - Embedding generation pipeline needed for new articles
- ~2-3x development time vs Approach 1
- Over-engineered for the current article volume

**Effort:** High (~10-14 days)

### 3. Hybrid: Enhanced Keyword Search + Optional LLM

- Fix and enhance the existing search: make `body` searchable, add GSI on `date` for range queries
- Create a `/search` page with proper results display
- Optionally add an LLM layer on top that rephrases search results as conversational answers
- Uses Bedrock only for the "chat" interface, not for core search

**Pros:**
- Fixes the broken search first (existing technical debt)
- LLM becomes optional — core search works without AI
- Lower cost if LLM is used sparingly
- Progressive enhancement path

**Cons:**
- Two systems to maintain (search + LLM)
- Keyword search still can't do semantic understanding
- More complex frontend (search page + chat UI)

**Effort:** Medium (~6-8 days)

## Recommendation

**Approach 1 (Direct LLM + Context Injection)** is the pragmatic choice for this project's current scale.

**Rationale:**
1. Article volume is small (tens, not thousands) — no vector store needed
2. The existing search infrastructure is already limited (Scan-based, no body search) — the chatbot can bypass it by directly querying DynamoDB with better filtering (category + date range via existing GSI)
3. Bedrock Claude Haiku is cost-effective at this scale (~$0.25/M input tokens, ~$1.25/M output tokens — a 50-article chat session costs fractions of a cent)
4. Avoids the cost overhead of OpenSearch Serverless (~$30+/mo) which would dominate the project's AWS bill
5. Simplest path to a working MVP that demonstrates value

**Suggested Architecture:**
```
User → Chat UI (React) → POST /api/chat → Chat Lambda
  → DynamoDB: query articles by category/date
  → Bedrock (Claude Haiku): question + article context → answer
  → Return answer + citations to frontend
```

**Key Design Decisions to Make in the Spec Phase:**
1. Stateless vs session-based chat (no memory vs DynamoDB session store)
2. How to pass articles as context — entire articles vs chunks
3. Streaming: REST polling vs WebSocket API for real-time feel
4. Prompt strategy to prevent hallucination (strict "answer only from context")
5. Whether to crawl article body or just title+summary for context
6. Rate limiting to control Bedrock costs

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Bedrock hallucinations** | High — wrong answers erode trust | Strict prompt: "Answer ONLY from provided articles. Say 'No encontré información' if unsure." |
| **Bedrock availability** | Medium — may not be in all regions | Check regional availability during design; use multi-region or fallback |
| **Latency (2-5s per query)** | Medium — poor UX | Streaming response via WebSocket or chunked transfer; loading states in UI |
| **Cost unpredictability** | Low-Medium — usage spikes | Set Bedrock usage limits; rate-limit by user session; monitor with CloudWatch |
| **Search quality degrades** | Low — at current volume | With 50 articles, inject ALL articles as context; works fine |
| **No search results page exists** | Low — technical debt | Chatbot is a new feature, not dependent on fixing existing search |
| **DynamoDB Scan-based search** | Low — at current volume | Use GSI query for category+date; for small dataset, Scan is acceptable |

## Ready for Proposal

**Yes.** The exploration is complete. The project is well-positioned for this feature — the architecture (Lambda + API Gateway + DynamoDB) already provides the building blocks needed. Approach 1 is the clear pragmatic recommendation for the current scale.

The proposal phase should define:
- Chat session model (stateless or with memory)
- Context injection strategy (which article fields, how many articles)
- Frontend integration model (separate page vs floating widget)
- Bedrock prompt engineering approach
- Rate limiting and cost controls
