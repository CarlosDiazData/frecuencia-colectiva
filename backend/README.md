# News API - Backend

This directory contains the AWS CDK infrastructure and Lambda handlers for the News API.

## Structure

```
backend/
├── src/
│   ├── handlers/           # Lambda function handlers
│   │   ├── listArticlesHandler.ts
│   │   ├── getArticleHandler.ts
│   │   └── filterByCategoryHandler.ts
│   └── infrastructure/     # CDK stack definitions
│       └── news_stack.py
├── test/                   # Unit tests
├── package.json
├── tsconfig.json
├── requirements.txt        # Python dependencies for CDK
├── app.py                  # CDK app entry point
└── cdk.json               # CDK configuration
```

## Lambda Handlers

### listArticlesHandler
- Returns all articles or filtered by query parameters
- Supports `?category=` and `?search=` query parameters
- Returns paginated results (max 50 items)

### getArticleHandler  
- Returns a single article by ID
- Returns 404 if article not found

### filterByCategoryHandler
- Filters articles by category using GSI
- Supports: technology, sports, world, culture

## Deployment

```bash
cd backend

# Install Node.js dependencies
npm install

# Build TypeScript
npm run build

# Deploy CDK stack
cdk deploy --all
```

## Testing

```bash
npm test
```
