import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import envConfig from "./config/envConfig.js";
import AuthRouter from "../backend/routes/user.routes.js";
import productRouter from "./routes/book.routes.js";

dotenv.config();

const app = express();

mongoose
  .connect(envConfig.db.URL)
  .then(() => {
    console.log("Mongoose connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });

const PORT = envConfig.general.PORT || 8080;

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRouter);
app.use("/book", productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
