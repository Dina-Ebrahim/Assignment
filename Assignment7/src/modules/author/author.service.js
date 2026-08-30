import { db } from "../../DB/connection.db.js";
import { authorModel } from "../../DB/model/index.js";
export const createAuthor = async (inputs) => {
  const data = await authorModel.insertOne(inputs);
  return data;
};
