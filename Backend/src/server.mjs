import express from "express";
import cors from "cors";
import Battle from "./engine/battle.mjs";
import Move from "./engine/move.mjs";
import Pokemon from "./engine/pokemon.mjs";
import Run from "./engine/run.mjs";
import runRoutes from "./routes/runRoutes.mjs";


const app = express();
const PORT = 3000;

app.get("/test-battle", (req, res) => {
    const ember = new Move("Ember", 10);
    const tackle = new Move("Tackle", 8);

    const charmander = new Pokemon("Charmander", {
        hp: 39,
        attack: 52,
        defense: 43
    }, [ember]);

    const squirtle = new Pokemon("Squirtle", {
        hp: 44,
        attack: 48,
        defense: 65
    }, [tackle]);

    const battle = new Battle(charmander, squirtle);

    const result = battle.takeTurn(0);

    res.json(result);
});

app.use(cors());
app.use(express.json());
app.use("/run", runRoutes);

app.get("/", (req, res) => {
    res.json({ message: "PokeRogue backend running" });
});

app.listen(PORT, () => {
    console.log(`Sever running on http://localhost:${PORT}`);
});