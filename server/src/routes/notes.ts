/**
 * Notes Router — CRUD endpoints for love notes
 */
import { Router, Request, Response } from "express";
import Note from "../models/Note.js";

const router = Router();

/** GET /api/notes — Fetch all love notes, newest first */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }).limit(100);
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

/** POST /api/notes — Save a new love note */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, message } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const note = await Note.create({
      name: name?.trim() || "Anonymous",
      message: message.trim(),
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "Failed to save note" });
  }
});

export default router;
