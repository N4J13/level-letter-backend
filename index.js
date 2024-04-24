import express from "express";
import authRouter from "./routes/auth.router.js";
import cors from "cors";
import connectDB from "./db.js";
import gameRouter from "./routes/game.router.js";
import userRouter from "./routes/user.router.js";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/user" , userRouter);
app.use("/api/game", gameRouter);


app.get("/", (req, res) => {
  res.send("Test");
});

connectDB();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
