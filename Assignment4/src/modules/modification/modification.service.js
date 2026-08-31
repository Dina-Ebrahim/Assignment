import { db } from "../../DB/connection.db.js";
export const addCategory = async () => {
  const query = `ALTER TABLE products ADD Category VARCHAR(100)`;
  const [RESULT] = await db.execute(query);
  return RESULT;
};
export const removeCategory = async () => {
  const query = `ALTER TABLE products DROP COLUMN Category`;
  const [RESULT] = await db.execute(query);
  if (!RESULT.deletedCount) {
    throw new Error("No books found", {
      cause: { status: 404 },
    });
  }
  return RESULT;
};
export const changeContactNumber = async () => {
  const query = `ALTER TABLE suppliers MODIFY sup_contactNumber VARCHAR(15)`;
  const [RESULT] = await db.execute(query);
  return RESULT;
};

export const makeProductNameNotNull = async () => {
  const query = `ALTER TABLE products MODIFY p_name VARCHAR(100) NOT NULL`;
  const [RESULT] = await db.execute(query);
  return RESULT;
};
