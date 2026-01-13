import express from "express";
import cors from "cors";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/", (req, res) => {
  res.status(200).json({
    message: "Сервер работает!",
    timestamp: new Date().toISOString(),
    status: "success"
  });
});