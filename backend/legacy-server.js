import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, app: "ajizour-api" });
});

app.get("/api", (_request, response) => {
  response.json({
    name: "Ajizour Tourism API",
    status: "running",
    stack: ["Node.js", "Express", "TypeScript-ready"],
  });
});

app.use((error, _request, response, _next) => {
  response.status(500).json({
    message: error instanceof Error ? error.message : "Unexpected API error",
  });
});

app.listen(port, () => {
  console.log(`Ajizour API listening on http://127.0.0.1:${port}`);
});
