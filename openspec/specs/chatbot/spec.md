# Chatbot Specification

## Purpose

Conversational AI that answers natural-language questions using ONLY published article content as context. Every answer MUST be grounded in real articles with citations. The system MUST NOT fabricate information.

## Requirements

### Requirement: Chat API Endpoint

The system MUST expose a `POST /api/chat` endpoint that accepts a JSON body with a `message` field (string, required, non-empty) and returns a JSON response with `answer` and `citations`.

#### Scenario: User sends a valid question

- GIVEN the chat endpoint is deployed
- WHEN a user sends `POST /api/chat` with `{"message": "¿qué eventos culturales hay este mes?"}`
- THEN the system returns HTTP 200 with a JSON response containing `answer` (string) and `citations` (array of `{title, url}`)
- AND the answer is derived exclusively from published article content

#### Scenario: User sends an empty message

- GIVEN the chat endpoint is deployed
- WHEN a user sends `POST /api/chat` with `{"message": ""}`
- THEN the system returns HTTP 400 with a validation error

#### Scenario: Malformed JSON body

- GIVEN the chat endpoint
- WHEN a user sends a request with invalid JSON
- THEN the system returns HTTP 400 with a generic validation error

#### Scenario: GET request to chat endpoint

- GIVEN the chat endpoint
- WHEN a user sends a GET request to `/api/chat`
- THEN the system returns HTTP 405 Method Not Allowed

### Requirement: Article Context Retrieval

The system MUST query DynamoDB articles using a GSI on category and date to find articles relevant to the user's question. It MUST inject full article bodies as context for the AI — not summaries, not chunks.

#### Scenario: Relevant articles exist

- GIVEN published articles exist in DynamoDB matching the query topic
- WHEN a user sends a question about that topic
- THEN the system retrieves full article bodies (title, body, url, category, publishDate) from DynamoDB
- AND passes each complete body as context to Bedrock Claude Haiku

#### Scenario: No articles match the query

- GIVEN no published articles match the user's question
- WHEN the system queries DynamoDB
- THEN the system invokes Bedrock with empty article context
- AND the response answer is "No encontré información"

### Requirement: AI Response Generation

The system MUST invoke AWS Bedrock Claude Haiku with a system prompt that strictly limits responses to provided article context. The system prompt MUST contain: "Answer ONLY from provided articles. Say 'No encontré información' if unsure."

#### Scenario: Grounded answer with citations

- GIVEN full article bodies are provided as Bedrock context
- WHEN Bedrock generates a response
- THEN each claim in the answer maps to a cited article
- AND no information outside the provided context appears in the answer
- AND citations include article title and URL for each referenced source

#### Scenario: Bedrock API is unavailable

- GIVEN the Bedrock API returns an error or is throttled
- WHEN a user sends a message
- THEN the system returns HTTP 502 with a user-friendly error message
- AND the error does not expose internal API details

### Requirement: Response Structure

The system MUST return a JSON object with an `answer` field (string, the natural-language response) and a `citations` field (array of objects, each with `title` and `url`). The `citations` array MUST be empty when no articles were found.

#### Scenario: Answer citing multiple articles

- GIVEN two articles are relevant to the query
- WHEN Bedrock generates the answer referencing both
- THEN `citations` contains two entries with their respective `title` and `url`
- AND `answer` contains the natural-language response referencing both articles

#### Scenario: No information found

- GIVEN no articles match the query
- WHEN Bedrock responds with "No encontré información"
- THEN `answer` is "No encontré información"
- AND `citations` is an empty array
