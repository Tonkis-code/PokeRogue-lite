import express from "express";
import Run from "../engine/run.mjs";

const router = express.Router();

let activeRun = null;



router.post("/run/start", (req, res) => {
    activeRun = new Run();
    res.json(activeRun.getState());
});

router.post("/run/attack", (req, res) => {
    if (!activeRun) {
        return res.status(400).json({ message: "No active run."});
    }

    const result = activeRun.attack(0);
    res.json(result);
});

router.get("/run/state", (req, res) => {
    if (!activeRun) {
        return res.status(400).json({ message: "No active run." });
    }

    res.json(activeRun.getState());
});

export default router;