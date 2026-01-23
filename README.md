# BCF 2026 Hackathon - Natural Language Database Query API

This project provides a backend API that allows users to query a PostgreSQL database using natural language questions. The system uses Google's Gemini AI to generate SQL queries from user questions, executes them on the database, and returns structured results.

## Features

- Natural language to SQL conversion using Google Gemini AI
- PostgreSQL database integration
- RESTful API endpoints
- Health check endpoint
- Support for different result types (scalar, record, table)

## Prerequisites

- Node.js (version 18 or higher)
- Docker and Docker Compose
- Google Gemini API key

## Setup

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and Gemini API key.

4. **Start the database:**
   ```bash
   docker-compose up -d postgres
   ```
   This will start PostgreSQL on port 5433 with the required database and data.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   The server will start on port 8080.

## API Endpoints

### Health Check
- **GET** `/api/health`
- Checks database connectivity
- Response: `{ "status": "ok", "database": "connected" }`

### Query Database
- **POST** `/api/query`
- Body: `{ "question": "string", "llm": "optional model name" }`
- Generates SQL from natural language question and executes it
- Response format varies based on result type

## Usage Example

```bash
curl -X POST http://localhost:8080/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the total sales by category?"}'
```

## Project Structure

- `src/app/api/` - Next.js API routes
- `lib/` - Utility functions for LLM and schema handling
- `prisma/` - Database schema and client setup

## Technologies Used

- Next.js
- Prisma
- Google Generative AI (Gemini)
- PostgreSQL
- Tailwind CSS (for potential frontend)