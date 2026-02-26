import express from "express";
import Run from "../engine/run.mjs";
import { prisma } from "../db/prisma.mjs";

const router = express.Router();

// Temp until auth exists - Prisma Studio user id
const USER_ID = 1;

async function getActiveRunRow() {
    return prisma.run.findFirst({
        where: { userId: USER_ID, isOver: false },
        orderBy: { updatedAt: "desc" },
    });
}

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

router.post("/attack", async (req, res) => {
    try {
        const moveIndex = req.body?.moveIndex ?? 0;

        const row = await getActiveRunRow();
        if (!row) return res.status(400).json({ message: "No active run." });

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

        res.json({ runId: row.id, ...result});
    }   catch (e) {
        res.status(500).json({ message: "Failed to process attack", error: String(e) });
    }
});

router.get("/state", async (req, res) => {
    try {
        const row = await getActiveRunRow();
        if (!row) return res.status(400).json({ message: "No active run." });

        const run = await Run.fromJSON(row.state);
        res.json({ runId: row.id, ...run.getState() });
    }   catch (e) {
        res.status(500).json ({ message: "Failed to get state", error: String(e) });
    }
});

export default router;