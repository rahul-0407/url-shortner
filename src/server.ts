import express from "express";
import { env } from "./config/env";
import { connectDb } from "./db/client";
import urlsRoutes from "./routes/urls.routes";
import redirectRoutes from "./routes/redirect.routes";

await connectDb();

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/v1", urlsRoutes);
app.use("/", redirectRoutes);


app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});


app.listen(env.port, () => {
  console.log(`url-shortener listening on :${env.port} (worker ${env.workerId})`);
});