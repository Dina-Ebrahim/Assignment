import { PORT } from "./config.js";
import { bootstrab } from "./DB/connection.db.js";
import { globalErrorHandling } from "./middelware/index.js";
import express from "express";
import { authenticationcontroller } from "./modules/authentication/index.js";
import {
  commentcontroller,
  postController,
  userController,
} from "./modules/index.js";

const app = express();
const port = PORT;
app.use(express.json());
app.use("/user", authenticationcontroller);
app.use("/user", userController);
app.use("/post", postController);
app.use("/comment", commentcontroller);
app.all("{/*dummy}", (req, res) =>
  res.status(404).send({ message: "Invalied application routing" }),
);

app.use(globalErrorHandling);
bootstrab(port, app);
