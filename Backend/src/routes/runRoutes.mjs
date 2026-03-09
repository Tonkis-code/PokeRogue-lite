// Imports
import express from "express";
import crypto from "crypto";
import Run from "../engine/run.mjs";
import prisma from "../db/prisma.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.use(requireAuth);

function newRunId() {
    return crypto.randomUUID();
}

async function getRunRowOrNull(runId, userId) {
    if (!runId) return null;

    return prisma.run.findFirst({
        where: {
            runId,
            userId,
        },
    });
}

// GET /run
router.get("/", async (req, res) => {
    try {
        const runs = await prisma.run.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: "desc" },
            select: {
                runId: true,
                floor: true,
                turn: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json({ runs });
    } catch (e) {
        res.status(500).json({
            message: "Failed to list runs",
            error: String(e),
        });
    }
});

// POST /run/start
router.post("/start", async (req, res) => {
    try {
        const run = new Run();
        const runId = newRunId();

        const row = await prisma.run.create({
            data: {
                runId,
                userId: req.user.id,
                status: "ACTIVE",
                floor: run.floor,
                turn: 0,
                state: run.toJSON()
            },
            select: {
                runId: true,
            },
        });

        res.status(201).json({
            runId: row.runId,
            ...run.getState(),
        });
    } catch (e) {
        res.status(500).json({
            message: "Failed to start run",
            error: String(e),
        });
    }
});

// GET /run/:runId
router.get("/:runId", async (req, res) => {
    try {
        const runId = req.params.runId;

        const row = await getRunRowOrNull(runId, req.user.id);
        if (!row) {
            return res.status(404).json({ message: "Run not found" });
        }

        const run = await Run.fromJSON(row.state);

        res.json({
            runId: row.runId,
            status: row.status,
            turn: row.turn,
            ...run.getState(),
        });
    } catch (e) {
        res.status(500).json({
            message: "Failed to get state",
            error: String(e),
        });
    }
});

// POST /run/:runId/attack
router.post("/:runId/attack", async (req, res) => {
    try {
        const runId = req.params.runId;
        const moveIndex = req.body?.moveIndex ?? 0;

        const row = await getRunRowOrNull(runId, req.user.id);
        if (!row) {
            return res.status(404).json({ message: "Run not found." });
        }

        if (row.status !== "ACTIVE") {
            return res.status(400).json({ message: "Run is already over." });
        }

        const run = await Run.fromJSON(row.state);
        const result = run.attack(moveIndex);

        await prisma.run.update({
            where: { runId: row.runId },
            data: {
                floor: run.floor,
                turn: { increment: 1 },
                status: run.isOver ? "DEAD" : "ACTIVE",
                state: run.toJSON(),
            },
        });

        res.json({
            runId: row.runId,
            ...result,
        });
    } catch (e) {
        res.status(500).json({
            message: "Failed to process attack",
            error: String(e),
        });
    }
});

// DELETE /run/:runId
router.delete("/:runId", async (req, res) => {
    try {
        const runId = req.params.runId;

        const row = await getRunRowOrNull(runId, req.user.id);
        if (!row) {
            return res.status(404).json({ message: "Run not found." });
        }

        await prisma.run.update({
            where: { runId: row.runId },
            data: { status: "ABANDONED" },
        });

        res.status(204).send();
    }   catch (e) {
        res.status(500).json({
            message: "Failed to abandon run",
            error: String(e),
        });
    }
});

export default router;