import express from "express";
import Run from "../engine/run.mjs";
import prisma from "../db/prisma.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

function parseRunId(value) {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : null;
}

async function getRunRowOrNull(runId, userId) {
    if (!runId) return null;

    return prisma.run.findFirst({
        where: { id: runId, userId: userId },
    });
}


router.use(requireAuth);

// GET to check a list for runs
router.get("/", async (req, res) => {
    try {
        const runs = await prisma.run.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                floor: true,
                status: true,
                turn: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json({ runs });
    }   catch (e) {
        res.status(500).json({ message: "Failed to list runs", error: String(e) });
    }
})

// POST /run/start  -> creates a new run, returns runId
router.post("/start", async (req, res) => {
    try {
        const run = new Run();

        const row = await prisma.run.create({
            data: {
                userId: req.user.id,
                status: "ACTIVE",
                floor: run.floor,
                turn: 0,
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

        const row = await getRunRowOrNull(runId, req.user.id);
        if (!row) return res.status(404).json({ message: "Run not found." });
        if (row.status !== "ACTIVE") {
            return res.status(400).json({ message: "Run is already over." });
        }

        const run = await Run.fromJSON(row.state);
        const result = run.attack(moveIndex);

        await prisma.run.update({
            where: { id: row.id },
            data: {
                floor: run.floor,
                status: run.isOver ? "DEAD" : "ACTIVE",
                turn: { increment: 1 },
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

        const row = await getRunRowOrNull(runId, req.user.id);
        if (!row) return res.status(404).json({ message: "Run not found." });

        const run = await Run.fromJSON(row.state);
        res.json({ runId: row.id, ...run.getState() });
    }   catch (e) {
        res.status(500).json({ message: "Failed to get state", error: String(e) });
    }
});

export default router;