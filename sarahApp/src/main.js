import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import {
  authenticationcontroller,
  userController,
  messageController,
  identityRequestController,
  conversationController,
} from "./modules/index.js";
import { globalErrorHandling } from "./middelware/index.js";
import express from "express";
import { bootstrapDB } from "./DB/connection.db.js";
import cors from "cors";
import helmet from "helmet";
import { generateLimiter } from "./common/utils/limiter.js";

const app = express();
const port = 3000;
await bootstrapDB(port, app);

app.set("trust proxy", true);
const limiter = generateLimiter({});
app.use(helmet(), limiter, cors(), express.json());
app.use(cors());
app.use("/assets", express.static("./assets"));
app.use("/auth", authenticationcontroller);
app.use("/user", userController);
app.use("/Message", messageController);
app.use("/identity-request", identityRequestController);
app.use("/conversation", conversationController);
app.use(globalErrorHandling);
