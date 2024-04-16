import express from "express";
import authRouter from "./routes/auth.router.js";
import cors from "cors";
import connectDB from "./db.js";
import path from "path";
import gameProcess from "./routes/gameProcess.js";
import gameRouter from "./routes/game.js";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRouter);
app.use("/api/game_process", gameProcess);
app.use("/api/game", gameRouter);

app.get("/", (req, res) => {
  res.send("Test");
});

connectDB();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
