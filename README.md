# PokeRogue

PokeRogue is a full-stack learning project inspired by Pokémon and roguelike games.

I built the project to practice backend development, authentication, REST APIs, database persistence, and separating application logic from API logic.

The project is no longer under active development, but it represents an earlier stage of my full-stack/backend development journey.

---

## Tech Stack

### Backend

- Node.js
- Express
- Prisma
- PostgreSQL
- Argon2
- Zod

### Frontend

- HTML
- Vanilla JavaScript
- Fetch API

---

## Architecture

The application is separated into a frontend, API, game engine, and persistence layer.

```text
Browser
   ↓
Frontend (HTML + JavaScript)
   ↓
Express API
   ↓
Game Engine
   ↓
Prisma ORM
   ↓
PostgreSQL
```

The game logic is kept separate from Express so that the core gameplay system is not directly dependent on the API layer.

---

## Features

### Authentication

The project implements session-based authentication using cookies.

Available authentication endpoints:

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

Sessions are persisted in the database and authenticated users can create and continue runs.

---

### Run System

A run represents a single roguelike playthrough.

Each run keeps track of:

- current floor
- battle state
- player Pokémon
- enemy Pokémon
- turn state
- whether the run has ended

Run state is persisted as JSON in PostgreSQL and reconstructed when loaded.

Available endpoints:

```text
GET    /run
POST   /run/start
GET    /run/:runId
POST   /run/:runId/attack
DELETE /run/:runId
```

---

### Battle Engine

The gameplay logic is implemented using separate JavaScript classes:

- `Pokemon`
- `Move`
- `Battle`
- `Run`

The engine handles basic functionality such as:

- player attacks
- enemy attacks
- battle results
- floor progression
- enemy generation
- healing between floors

The basic gameplay loop is:

```text
Register / Login
      ↓
Start Run
      ↓
Battle Enemy
      ↓
Win → Next Floor
Lose → Run Ends
```

Enemy Pokémon are selected from a small hardcoded pool and their stats scale with the current floor.

---

## Frontend

The frontend is intentionally minimal and primarily serves as a testing interface for the backend.

It supports:

- registration
- login
- starting runs
- selecting attacks
- displaying battle state

The frontend communicates with the Express API using `fetch()` and authenticated requests include session cookies.

Example:

```javascript
fetch("http://localhost:3000/run/start", {
  method: "POST",
  credentials: "include"
});
```

---

## Database

Database access and schema management are handled using Prisma with PostgreSQL.

The main models are:

### User

```text
User
- id
- email
- passwordHash
- sessions
- runs
```

### Session

```text
Session
- tokenHash
- expiresAt
- revokedAt
- userId
```

### Run

```text
Run
- runId
- status
- floor
- turn
- state (JSON)
- userId
```

---

## Running the Project

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

The frontend can be served using any local HTTP server.

For example:

```bash
npx serve frontend
```

---

## What I Practiced

This project gave me practical experience with:

- building REST APIs with Express
- PostgreSQL database persistence
- Prisma ORM
- session-based authentication
- password hashing
- cookie-based authentication
- request validation
- frontend/backend communication
- separating game logic from API logic
- designing persistent application state
- debugging a full-stack application

---

## Project Status

**Archived / no longer under active development.**

The project was created as a learning exercise and successfully served its purpose of giving me experience with full-stack development, backend architecture, authentication, databases, and API design.

Rather than continuing development, I have moved on to other projects and technologies.
