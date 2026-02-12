console.log("runRoutes loaded");
import express from "express";
import Run from "../engine/run.mjs";

const router = express.Router();

let activeRun = null;



router.post("/start", (req, res) => {
    activeRun = new Run();
    res.json(activeRun.getState());
});

router.post("/attack", (req, res) => {
    if (!activeRun) {
        return res.status(400).json({ message: "No active run."});
    }

    const { moveIndex } = req.body;

    const result = activeRun.attack(moveIndex ?? 0);

    res.json(result);
});

router.get("/state", (req, res) => {
    if (!activeRun) {
        return res.status(400).json({ message: "No active run." });
    }

    res.json(activeRun.getState());
});

export default router;