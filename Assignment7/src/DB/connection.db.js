import { MongoClient } from "mongodb";
import { DB_NAME, DB_URI } from "../config.js";

export const client = new MongoClient(DB_URI);

export const bootstrapDB = async (app, port) => {
  try {
    await client.connect();
    console.log(`DB Connected Successfully 🌸`);
    app.listen(port, () => {
      console.log("server is running😘");
    });
  } catch (error) {
    console.log({ error });
    console.log(`Fail to connect on DB ❌`);
  }
};

export const db = client.db(DB_NAME);
