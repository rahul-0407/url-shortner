import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDb } from "./db/client";
import { attachAuth } from "./middleware/auth";
import urlsRoutes from "./routes/urls.routes";
import redirectRoutes from "./routes/redirect.routes";

await connectDb();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://app.vercel.app",      
  "https://domain.com",            
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(attachAuth);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1", urlsRoutes);
app.use("/", redirectRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[server] unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.port, () => {
  console.log(`url-shortener listening on :${env.port} (worker ${env.workerId})`);
});