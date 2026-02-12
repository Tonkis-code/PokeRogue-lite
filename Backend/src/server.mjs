import express from "express";
import cors from "cors";
import { attack } from "./engine/battle.mjs";

app.get("/test-battle", (req, res) => {
    const ember = new Move("Ember", 10);

    const charmander = new Pokemon("Charmander", {
        hp: 39,
        attack: 52,
        defense: 43
    }, [ember]);

    const squirtle = new Pokemon("Squirtle", {
        hp: 44,
        attack: 48,
        defense: 65
    }, []);

    const result = attack(charmander, squirtle, ember);

    res.json(result);
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "PokeRogue backend running" });
});

app.listen(PORT, () => {
    console.log(`Sever running on http://localhost:${PORT}`);
});