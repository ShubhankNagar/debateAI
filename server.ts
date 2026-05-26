/**
 * Agora Debate — Express server entry point.
 * Slim orchestrator: loads middleware, routes, and starts the server.
 */
import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import { errorHandler } from "./server/middleware/errorHandler";
import topicRoutes from "./server/routes/topics";
import debateRoutes from "./server/routes/debate";

if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
}
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.set("trust proxy", 1); // Required for rate limiting behind Render proxy

// --- Security & performance middleware ---
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite injects inline scripts in dev
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));

// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- API routes ---
app.use("/api", topicRoutes);
app.use("/api", debateRoutes);

// --- Error handler (must be last middleware) ---
app.use(errorHandler);

// --- Start server ---
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🏛️  Agora Debate server running on http://localhost:${PORT}`);
  });
}

start();
