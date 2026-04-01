import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { appsRouter } from "./routes/apps";
import { categoriesRouter } from "./routes/categories";

const app = express();
const port = Number(process.env.PORT || 8080);

// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const staticAllowedOrigins = new Set([
  "https://trueapp-web-production.up.railway.app",
  "http://localhost:5173",
  ...configuredOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
      if (isLocalhost || staticAllowedOrigins.has(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  })
);

app.use(express.json());

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use("/api/apps", appsRouter);
app.use("/api/categories", categoriesRouter);

// Compare endpoint — resolves two app IDs in one request
app.get("/api/compare", async (req: Request, res: Response) => {
  try {
    const { ids } = req.query as { ids?: string };
    if (!ids) {
      return res.status(400).json({ error: "ids query param is required" });
    }
    const idList = ids.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 2);
    const { getAppsByIds } = await import("./db/queries");
    const apps = await getAppsByIds(idList);
    res.json({ data: apps });
  } catch (err) {
    console.error("[GET /api/compare]", err);
    res.status(500).json({ error: "Failed to compare apps" });
  }
});

// ─────────────────────────────────────────────
// 404 + error handler
// ─────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀  TrueApp API listening on port ${port}`);
});
