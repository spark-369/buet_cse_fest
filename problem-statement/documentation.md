# API Documentation

This document provides detailed information about the backend API endpoints for the Natural Language Database Query system.

## Base URL
```
http://localhost:8080
```

## Endpoints

### 1. Health Check

**Endpoint:** `GET /api/health`

**Description:** Checks the health of the service and database connectivity.

**Response:**
- **200 OK**
  ```json
  {
    "status": "ok",
    "database": "connected"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "status": "error",
    "database": "disconnected"
  }
  ```

### 2. Query Database

**Endpoint:** `POST /api/query`

**Description:** Accepts a natural language question, generates an SQL query using AI, executes it on the database, and returns the results.

**Request Body:**
```json
{
  "question": "string (required) - The natural language question to query the database",
  "llm": "string (optional) - The LLM model to use (default: 'gemini-2.5-flash')"
}
```

**Response Format:**
The response structure depends on the result type:

#### Scalar Result (single value)
```json
{
  "question": "What is the total number of users?",
  "llm": "gemini-2.5-flash",
  "result_type": "scalar",
  "columns": ["count"],
  "rows": [[42]],
  "meta": {
    "row_count": 1,
    "source": "database"
  }
}
```

#### Record Result (single row, multiple columns)
```json
{
  "question": "What is the information for user with ID 1?",
  "llm": "gemini-2.5-flash",
  "result_type": "record",
  "columns": ["id", "name", "email"],
  "rows": [[1, "John Doe", "john@example.com"]],
  "meta": {
    "row_count": 1,
    "source": "database"
  }
}
```

#### Table Result (multiple rows)
```json
{
  "question": "List all users",
  "llm": "gemini-2.5-flash",
  "result_type": "table",
  "columns": ["id", "name", "email"],
  "rows": [
    [1, "John Doe", "john@example.com"],
    [2, "Jane Smith", "jane@example.com"]
  ],
  "meta": {
    "row_count": 2,
    "source": "database"
  }
}
```

**Error Responses:**
- **400 Bad Request** - Invalid request body
- **500 Internal Server Error** - Database or AI service error

## Result Type Determination

- **scalar**: Single row with single column
- **record**: Single row with multiple columns
- **table**: Multiple rows

## Authentication

Currently, no authentication is required for the API endpoints.

## Rate Limiting

No rate limiting is implemented at this time.

## Examples

### Example 1: Simple Count Query
```bash
curl -X POST http://localhost:8080/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How many products are there?"}'
```

### Example 2: Complex Join Query
```bash
curl -X POST http://localhost:8080/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the names and prices of products in the electronics category?"}'
```

### Example 3: Using Specific LLM Model
```bash
curl -X POST http://localhost:8080/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Show me the top 5 customers by order value", "llm": "gemini-1.5-pro"}'
```

## Notes

- The system dynamically inspects the database schema to generate appropriate SQL queries.
- SQL generation is handled by Google Gemini AI models.
- All queries are executed as raw SQL for flexibility.
- The API assumes a PostgreSQL database backend.