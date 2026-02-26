import { Router } from "express";
import argon2 from "argon2";
import { z } from "zod";
import prisma from "../db/prisma.mjs";
import { COOKIE_NAME, sessionCookieOptions } from "../auth/cookies.mjs";
import { newSessionToken, hashToken } from "../auth/tokens.mjs";

const router = Router();
const SESSION_DAYS = 14;

router.post("/register", async (req, res) => {
    const schema = z.object({
        email: z-string().email(),
        password: z.string().min(12),
    });
    const { email, password } = schema.parse(req.body);

    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            passwordHash: await argon2.hash(password),
        },
        select: { id: true, email: true },
    });

    res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
    const schema = z.object({
        email: z.string().email(), // <- email deprecated? Check it
        password: z.string().min(1),
    });
    const { email, password } = schema.parse(req.body);

    const user = await prisma.user.findUnique({
        where: { email: email.toLoswerCase() },
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = newSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000); // <- What does the * 24 xx mean? Check it

    await prisma.session.create({
        data: {
            userId: user.id,
            tokenHash,
            expiresAt,
            ip: req.ip,
            userAgent: req.get("user-agent") ?? null,
        },
    });

    res.cookie(COOKIE_NAME, token, sessionCookieOptions());
    res.json({ user: { id: user.id, email: user.email } });
});

router.post("/logout", async (req, res) => {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) {
        await prisma.session.updateMany({
            where: { tokenHash: hashToken(token), revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.status(204).send();
});

router.get("/me", (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    res.json({ user: req.user });
});

export default router;