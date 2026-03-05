import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import Battle from "./engine/battle.mjs";
import Move from "./engine/move.mjs";
import Pokemon from "./engine/pokemon.mjs";

import runRoutes from "./routes/runRoutes.mjs";
import authRoutes from "./routes/auth.mjs";
import { attachUser } from "./middleware/auth.mjs";

const app = express();
const PORT = 3000;

// Global Middleware

app.set("trust proxy", 1);

app.use(helmet());

// Since we're using cookies for auth we are setting credentials to true
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// attaches req.user if sid cookie is valid
app.use(attachUser);

// Dev/Test routes

app.get("/test-battle", (req, res) => {
    const ember = new Move("Ember", 10);
    const tackle = new Move("Tackle", 8);

    const charmander = new Pokemon(
        "Charmander",
        { hp: 39, attack: 52, defense: 43 },
        [ember]
    );

    const squirtle = new Pokemon(
        "Squirtle",
        { hp: 44, attack: 48, defense: 65 },
        [tackle]
    );

    const battle = new Battle(charmander, squirtle);
    const result = battle.takeTurn(0);

    res.json(result);
});

// Auth routes (With Rate Limit)

app.use(
    "/auth",
    rateLimit({
        windowMs: 60_000,
        max: 30,
    })
);

app.use("/auth", authRoutes);

app.use("/run", runRoutes);

app.get("/", (req, res) => {
    res.json({ message: "PokeRogue backend running" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});