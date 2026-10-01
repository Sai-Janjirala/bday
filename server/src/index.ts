/**
 * Express Server — Birthday Love Notes API
 * Simple backend for saving and retrieving love notes/wishes
 */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/birthday-love-notes";

// ─── Middleware ───
app.use(cors());
app.use(express.json());

// ─── Routes ───
app.use("/api/notes", notesRouter);

// ─── Health check ───
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Love notes API is running 💝" });
});

// ─── Connect to MongoDB & Start Server ───
async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("💝 Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`💌 Love notes server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    console.log("\n📝 Note: The frontend works perfectly without the backend!");
    console.log("   The backend is only needed for the love notes feature.\n");

    // Start server anyway without MongoDB
    app.listen(PORT, () => {
      console.log(
        `💌 Server running on http://localhost:${PORT} (without MongoDB)`
      );
    });
  }
}

start();
