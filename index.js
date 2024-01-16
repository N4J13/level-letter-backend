import express from "express";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import connectDB from "./db.js";
import path from "path";

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Test");
});


connectDB();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
