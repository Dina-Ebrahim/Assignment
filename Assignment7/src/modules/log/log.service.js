import { db } from "../../DB/connection.db.js";
import { logModel } from "../../DB/model/index.js";
export const createLog = async () => {
  const result = await db.createCollection("logs", {
    capped: true,
    size: 1048576,
  });
  return {
    message: "Logs collection created successfully",
  };
};
export const insertLogs = async (inputs) => {
  const data = await logModel.insertOne(inputs);
  return data;
};
