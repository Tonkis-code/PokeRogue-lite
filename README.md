# Pokerogue Backend

This repository contains the backend (eventually frontend as well) for a roguelike Pokémon-style battle game.
It is built with **Node.js, Express, Prisma, and PostgreSQL**, and includes a complete authentication and session system.

The project was primarily created as a **learning project** to explore backend architecture, authentication, persistence, and game state management.

---

# Tech Stack

**Server**

* Node.js
* Express

**Database**

* PostgreSQL
* Prisma ORM

**Authentication**

* Argon2 password hashing
* Cookie-based sessions
* Session persistence in database

**Security**

* Helmet
* CORS
* Express rate limiting

---

# Project Structure

```
src/
│
├── engine/
│   ├── battle.mjs
│   ├── move.mjs
│   ├── pokemon.mjs
│   └── run.mjs
│
├── routes/
│   ├── auth.mjs
│   └── runRoutes.mjs
│
├── middleware/
│   └── auth.mjs
│
├── db/
│   └── prisma.mjs
│
└── server.mjs
```

### engine/

Contains the **game logic**.
This is independent from the HTTP server.

Classes:

* `Pokemon`
* `Move`
* `Battle`
* `Run`

The Run class manages an entire playthrough and can be serialized/deserialized using:

```
toJSON()
fromJSON()
```

This allows runs to be saved in the database.

---

### routes/auth.mjs

Handles authentication endpoints.

Routes:

```
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

Responsibilities:

* Validate input (Zod)
* Hash passwords using Argon2
* Verify credentials
* Create session records
* Set session cookie

---

### middleware/auth.mjs

Authentication middleware.

Contains two important functions.

**attachUser**

Runs on every request.

Responsibilities:

1. Read the `sid` cookie
2. Hash the token
3. Look up session in the database
4. Attach the user to `req.user`

```
req.user = { id, email }
```

---

**requireAuth**

Protects routes.

If no authenticated user exists:

```
401 Unauthorized
```

Otherwise the request proceeds.

---

### routes/runRoutes.mjs

Handles all game-related endpoints.

All routes require authentication:

```
router.use(requireAuth)
```

Endpoints:

```
POST /run/start
GET  /run
GET  /run/:runId
POST /run/:runId/attack
```

Responsibilities:

* Create new runs
* Load run state from database
* Execute battle turns
* Save updated run state

The run state is stored as JSON in the database.

---

# Authentication Flow

### Register

```
POST /auth/register
```

1. Validate email/password
2. Hash password using Argon2
3. Create user record

---

### Login

```
POST /auth/login
```

1. Find user by email
2. Verify password
3. Generate random session token
4. Store **token hash** in database
5. Send session cookie

---

### Session Handling

After login, every request includes the cookie:

```
sid=<session_token>
```

Middleware performs:

```
cookie -> hash -> lookup session -> attach user
```

This allows protected routes to access:

```
req.user
```

---

# Game Run Flow

### Start Run

```
POST /run/start
```

1. Create a new `Run` instance
2. Serialize run state
3. Store run in database
4. Return runId and state

---

### Attack

```
POST /run/:runId/attack
```

1. Load run from database
2. Deserialize run state
3. Execute attack
4. Update run state
5. Save new state

---

### Get Run State

```
GET /run/:runId
```

Loads run from database and returns the current state.

---

# Database Schema Overview

### User

```
User
 ├─ id
 ├─ email
 ├─ passwordHash
 ├─ createdAt
 └─ updatedAt
```

---

### Session

Stores login sessions.

```
Session
 ├─ id
 ├─ userId
 ├─ tokenHash
 ├─ expiresAt
 └─ revokedAt
```

---

### Run

Stores game runs.

```
Run
 ├─ id
 ├─ runId
 ├─ userId
 ├─ status
 ├─ floor
 ├─ turn
 └─ state (JSON)
```

---

# Request Lifecycle

```
Client Request
     |
     v
Express Server (server.mjs)
     |
     v
Global Middleware
  - helmet
  - cors
  - cookieParser
  - attachUser
     |
     v
Route Handler
     |
     v
Prisma ORM
     |
     v
PostgreSQL Database
```

---

# Learning Goals

This project was created to learn:

* Backend architecture
* Authentication and session management
* Database persistence
* Game state serialization
* REST API design
* Security practices

---

# Future Improvements

Potential future additions:

* Run history
* Leaderboards
* Frontend client
* Achievements
* Spectator mode
* Global error middleware
* Rate limiting on login

---
