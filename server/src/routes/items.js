import express from "express";
import { PrismaClient } from "@prisma/client";
import { createItemSchema, updateItemSchema } from "../validators/items.js";

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/items
router.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: [{ bought: "asc" }, { priority: "asc" }, { updatedAt: "desc" }]
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post("/", async (req, res, next) => {
  try {
    const parsed = createItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validasi gagal", issues: parsed.error.issues });
    }

    const data = parsed.data;
    const item = await prisma.item.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit ?? null,
        category: data.category ?? null,
        priority: data.priority,
        bought: data.bought,
        note: data.note ?? null
      }
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// PUT /api/items/:id
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "ID tidak valid" });

    const parsed = updateItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validasi gagal", issues: parsed.error.issues });
    }

    const data = parsed.data;
    const item = await prisma.item.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.quantity !== undefined ? { quantity: data.quantity } : {}),
        ...(data.unit !== undefined ? { unit: data.unit ?? null } : {}),
        ...(data.category !== undefined ? { category: data.category ?? null } : {}),
        ...(data.priority !== undefined ? { priority: data.priority } : {}),
        ...(data.bought !== undefined ? { bought: data.bought } : {}),
        ...(data.note !== undefined ? { note: data.note ?? null } : {})
      }
    });

    res.json(item);
  } catch (err) {
    // Prisma: record not found
    if (err?.code === "P2025") return res.status(404).json({ message: "Item tidak ditemukan" });
    next(err);
  }
});

// PATCH /api/items/:id/toggle
router.patch("/:id/toggle", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "ID tidak valid" });

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Item tidak ditemukan" });

    const item = await prisma.item.update({
      where: { id },
      data: { bought: !existing.bought }
    });

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/items/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "ID tidak valid" });

    await prisma.item.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err?.code === "P2025") return res.status(404).json({ message: "Item tidak ditemukan" });
    next(err);
  }
});

export default router;
