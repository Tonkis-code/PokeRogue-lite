import prisma from "../db/prisma.mjs";
import { COOKIE_NAME } from "../auth/cookies.mjs";
import { hashToken } from "../auth/tokens.mjs";

export async function attachUser(req, res, next) {
    try {
        const token = req.cookies?.[COOKIE_NAME];
        if (!token) return next();

        const tokenHash = hashToken(token);

        const session = await prisma.session.findUnique({
            where: { tokenHash },
            include: { user: { select: { id: true, email: true } } },
        });

        if (!session) return next();
        if (session.revokedAt) return next();
        if (session.expiresAt <= new Date()) return next();

        req.session = session;
        req.user = session.user;

        next();
    }   catch (err) {
        next(err);
    }
}

export function requireAuth(req, res, next) {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    next();
}