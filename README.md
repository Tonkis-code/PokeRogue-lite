# PokeRogue (Learning Project)

A small full-stack Pokémon roguelike built to practice backend architecture, authentication, APIs, and game logic.

The project currently includes:

* Node.js / Express backend
* Prisma + PostgreSQL persistence
* Session-based authentication with cookies
* A simple Pokémon battle engine
* Run state persistence
* A minimal HTML + JS frontend for testing the API

This project is primarily for learning full-stack development and backend design.

---

# Project Architecture

The application is split into three main layers.

```
Browser
   ↓
Frontend (HTML + JS)
   ↓
Express API
   ↓
Game Engine (Run / Battle / Pokemon)
   ↓
Prisma ORM
   ↓
PostgreSQL Database
```

### Frontend

A minimal testing UI that interacts with the API.

Responsible for:

* login / register
* starting runs
* sending attack commands
* displaying battle state

### Backend API

Express routes handle:

* authentication
* session handling
* run creation
* battle actions
* saving run state

### Game Engine

Pure JavaScript classes implementing the gameplay logic:

* `Pokemon`
* `Move`
* `Battle`
* `Run`

The engine is independent from Express.

---

# Current Features

## Authentication

Session-based authentication using cookies.

Routes:

```
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

Sessions are stored in the database.

Authentication is required for run endpoints.

---

## Run System

A **Run** represents one roguelike playthrough.

Runs store:

* floor
* battle state
* player Pokémon
* enemy Pokémon
* whether the run is over

Run state is stored as JSON in the database and reconstructed when loaded.

Routes:

```
GET    /run
POST   /run/start
GET    /run/:runId
POST   /run/:runId/attack
DELETE /run/:runId
```

---

## Battle Engine

The battle system is implemented in separate classes.

### Pokemon

Represents a Pokémon with:

* name
* HP
* attack
* defense
* moves

### Move

Represents an attack with:

* name
* power

### Battle

Handles battle logic:

* player attack
* enemy attack
* determining winner

### Run

Handles roguelike progression:

* floor progression
* generating enemies
* healing between floors
* managing battles

---

# Current Gameplay Loop

```
Register / Login
      ↓
Start Run
      ↓
Battle Enemy
      ↓
Win → Next Floor
Lose → Run Ends
```

Enemy Pokémon are currently selected randomly from a small hardcoded pool.

---

# Example Enemy Pool

For development, enemies are defined directly in `run.mjs`.

Example:

```
Wild Squirtle
Wild Bulbasaur
Wild Pidgey
Wild Rattata
```

Stats scale slightly with floor number.

Later this will be replaced with data from the PokéAPI.

---

# Frontend

The frontend is intentionally minimal and used as a **debug UI for the backend**.

Files:

```
frontend/
  index.html
  app.js
```

Features:

* register
* login
* start run
* attack buttons
* battle state display

The frontend communicates with the backend using `fetch()`.

Example:

```javascript
fetch("http://localhost:3000/run/start", {
  method: "POST",
  credentials: "include"
});
```

---

# Database

Managed using Prisma.

Main models:

### User

```
User
- id
- email
- passwordHash
- sessions
- runs
```

### Session

```
Session
- tokenHash
- expiresAt
- revokedAt
- userId
```

### Run

```
Run
- runId
- status
- floor
- turn
- state (JSON)
- userId
```

---

# Technologies Used

Backend

* Node.js
* Express
* Prisma
* PostgreSQL
* Argon2 (password hashing)
* Zod (validation)

Frontend

* HTML
* Vanilla JavaScript
* Fetch API

---

# Running the Project

Start the backend:

```
npm run dev
```

Start the frontend using a local server:

Example:

```
npx serve frontend
```

or

```
python -m http.server
```

Then open:

```
http://localhost:3000
```

or the frontend server URL.

---

# Planned Improvements

## Gameplay

* fix attack turn logic
* add enemy move randomness
* add player leveling
* add XP system
* add items (potions)

## Game Data

* integrate PokéAPI
* load real Pokémon stats
* add sprites
* add abilities

## Frontend

* improve battle UI
* show move names
* HP bars
* battle messages

## Engine

* Pokémon leveling
* evolutions
* status effects

---

# Learning Goals

This project focuses on practicing:

* backend architecture
* authentication systems
* REST APIs
* database persistence
* game engine design
* frontend ↔ backend communication
* debugging full stack applications

---

# Status

Current state:

✔ Authentication working
✔ Session cookies working
✔ Run system working
✔ Battle engine functional
✔ Frontend API testing UI working

Next step:

Fix battle attack logic and improve battle UI.
