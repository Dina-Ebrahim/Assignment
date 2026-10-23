import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { authenticationcontroller, userController } from "./modules/index.js";
import { globalErrorHandling } from "./middelware/index.js";
import express from "express";
import { bootstrapDB } from "./DB/connection.db.js";
import cors from "cors";

const app = express();
const port = 3000;
await bootstrapDB(port, app);
app.use(express.json());
app.use(cors());

app.use("/auth", authenticationcontroller);
app.use("/user", userController);
app.use(globalErrorHandling);
