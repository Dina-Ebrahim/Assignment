import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import {
  bookController,
  Authorcontroller,
  logcontroller,
} from "./modules/index.js";
import { globalErrorHandling } from "./middelware/index.js";
import express from "express";
import { bootstrapDB } from "./DB/connection.db.js";

const app = express();
const port = 3000;
bootstrapDB(app, port);
app.use(express.json());
app.use("/collection/books", bookController);
app.use("/collection/authors", Authorcontroller);
app.use("/collection/logs", logcontroller);
app.use(globalErrorHandling);
