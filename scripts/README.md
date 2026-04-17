# Seed Scripts

This directory contains utility scripts for seeding the database with sample data.

## seedData.ts

Seeds the DynamoDB `Articles` table with 8 sample articles across 4 categories:

- **Technology**: 2 articles
- **World**: 2 articles  
- **Sports**: 2 articles
- **Culture**: 2 articles

## Usage

```bash
cd scripts

# Install dependencies
npm install

# Configure AWS credentials
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key

# Set table name (optional, defaults to 'Articles')
export TABLE_NAME=Articles

# Run seed script
npm run seed
```

## Sample Articles

The seed script includes realistic news articles covering:
- AI breakthroughs
- Climate agreements
- Sports championships
- Cultural exhibitions
- And more...

Each article includes:
- Unique UUID
- Title and summary
- Full body text (multiple paragraphs)
- Author name
- Publication date
- Category
- Image URL (Unsplash)
- Read time in minutes
