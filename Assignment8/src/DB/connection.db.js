import mongoose from "mongoose";
import { DB_URI } from "../config.js";
export const bootstrapDB = async (port, app) => {
  try {
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log(`DB Connected Successfully 🌸`);
    app.listen(port, () => {
      console.log("server is running😘");
    });
  } catch (error) {
    console.log({ error });
    console.log(`Fail to connect on DB ❌`);
  }
};
