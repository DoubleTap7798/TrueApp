import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(
  cors({
    origin: [
      "https://trueapp-web-production.up.railway.app",
      "http://localhost:5173"
    ]
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on port ${port}`);
});