import express from "express";
import Run from "../engine/run.mjs";
import prisma from "../db/prisma.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();
const USER_ID = 1; // temp until auth

function parseRunId(value) {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : null;
}

async function getRunRowOrNull(runId) {
    if (!runId) return null;

    return prisma.run.findFirst({
        where: { id: runId, userId: USER_ID },
    });
}


router.use(requireAuth);

// POST /run/start  -> creates a new run, returns runId
router.post("/start", async (req, res) => {
    try {
        const run = new Run();

        const row = await prisma.run.create({
            data: {
                userId: USER_ID,
                floor: run.floor,
                isOver: run.isOver,
                state: run.toJSON(),
            },
        });
        
        res.json({ runId: row.id, ...run.getState() });
    }   catch (e) {
        res.status(500).json({ message: "Failed to start run", error: String(e) });
    }
});

// POST /run/attack     body: { runId, moveIndex }
router.post("/attack", async (req, res ) => {
    try {
        const runId = parseRunId(req.body?.runId);
        const moveIndex = req.body?.moveIndex ?? 0;

        if (!runId) {
            return res.status(400).json({ message: "runId is required (number)."});
        }

        const row = await getRunRowOrNull(runId);
        if (!row) return res.status(404).json({ message: "Run not found." });
        if (row.isOver) return res.status(400).json({ message: "Run is already over." });

        const run = await Run.fromJSON(row.state);
        const result = run.attack(moveIndex);

        await prisma.run.update({
            where: { id: row.id },
            data: {
                floor: run.floor,
                isOver: run.isOver,
                state: run.toJSON(),
            },
        });

        res.json({ runId: row.id, ...result });
    }   catch (e) {
        res.status(500).json({ message: "Failed to process attack", error: String(e) });
    }
});

// GET /run/state=runId=123
router.get("/state", async (req, res) => {
    try {
        const runId = parseRunId(req.query?.runId);

        if(!runId) {
            return res.status(400).json({ message: "runId query param is required (number)."});
        }

        const row = await getRunRowOrNull(runId);
        if (!row) return res.status(404).json({ message: "Run not found." });

        const run = await Run.fromJSON(row.state);
        res.json({ runId: row.id, ...run.getState() });
    }   catch (e) {
        res.status(500).json({ message: "Failed to get state", error: String(e) });
    }
});

export default router;