import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDb } from "./db/client";
import { attachAuth } from "./middleware/auth";
import urlsRoutes from "./routes/urls.routes";
import redirectRoutes from "./routes/redirect.routes";
import adminAnalyticsRoutes from "./routes/adminAnalytics.routes";

await connectDb();

const app = express();

const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://localhost:4000",
  ...configuredOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
  })
);

app.use(express.json());
app.use(attachAuth);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/v1/admin/analytics", adminAnalyticsRoutes);

app.use("/api/v1", urlsRoutes);
app.use("/", redirectRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[server] unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

import { startProcessor } from "../processor/analyticsProcessor";

app.listen(env.port, () => {
  console.log(`url-shortener listening on :${env.port} (worker ${env.workerId})`);
  startProcessor().catch((err) => {
    console.error("[stream-processor] Failed to start analytics stream processor:", err);
  });
});