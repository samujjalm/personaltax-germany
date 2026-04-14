import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { calculate } from "./routes/calculate.js";

const app = new Hono();

app.use("*", cors());

app.route("/api/calculate", calculate);

app.get("/api/health", (c) => c.json({ status: "ok" }));

const port = parseInt(process.env.PORT || "3001", 10);

console.log(`API server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
