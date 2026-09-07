import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import {
  authenticationcontroller,
  noteController,
  userController,
} from "./modules/index.js";
import { globalErrorHandling } from "./middelware/index.js";
import express from "express";
import { bootstrapDB } from "./DB/connection.db.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use("/note", noteController);
app.use("/auth", authenticationcontroller);
app.use("/user", userController);
app.use(globalErrorHandling);
bootstrapDB(port, app);
//https://ebrahimd375-4267788.postman.co/workspace/Dina-Ebrahim's-Workspace~cc2a78ac-31ff-4c03-8bc6-6c20069f6df4/collection/57065343-c6a4d891-919e-4f84-8609-1af5faae0e49?action=share&source=copy-link&creator=57065343
