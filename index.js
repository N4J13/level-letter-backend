import express from "express";
import router from "./routes/userRouter.js";
import cors from "cors";
import connectDB from "./db.js";
import path from "path";

const app = express();
const port = 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", router);


app.get("/" , (req,res) => {
  const htmlFilePath = path.join(__dirname, 'index.html');
  res.sendFile(htmlFilePath);
})

connectDB();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
