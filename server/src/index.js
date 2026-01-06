import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "shopping-note-api" });
});

app.use("/api/items", itemsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
