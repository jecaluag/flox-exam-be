# Task Management API

Simple task management API built with Express.js, TypeScript, and SQLite.

## Setup

1. Install dependencies

```bash
npm install
```

2. Run the server

```bash
npm run dev
```

Server runs at http://localhost:3000

## API Endpoints

```bash
# Get all tasks
GET /api/tasks

# Create task
POST /api/tasks
{
  "title": "Task name",
  "description": "Optional description"
}

# Toggle task status
PATCH /api/tasks/:id/toggle

# Delete task
DELETE /api/tasks/:id
```

## Tech Stack

- Express.js
- TypeScript
- SQLite (auto-creates db.sqlite file)
- Vite
