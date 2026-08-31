import { db } from "../../DB/connection.db.js";

export const createSupplier = async (inputs) => {
  const { sup_name, sup_contactNumber } = inputs;
  const query = `INSERT INTO suppliers (sup_name,sup_contactNumber) VALUE (?,?)`;
  const [RESULT] = await db.execute(query, [sup_name, sup_contactNumber]);
  return RESULT;
};

export const getAll = async () => {
  const query = `SELECT * FROM suppliers`;
  const [RESULT] = await db.execute(query);
  return RESULT;
};

export const UPDATE = async (inputs) => {
  const { sup_id, sup_contactNumber, sup_name } = inputs;
  const query = `UPDATE suppliers SET sup_contactNumber=? ,sup_name =? WHERE sup_id =? `;
  const [RESULT] = await db.execute(query, [
    sup_contactNumber,
    sup_name,
    sup_id,
  ]);
  if (!RESULT.affectedRows) {
    throw new Error("Supplier not found");
  }
  return RESULT;
};

export const DELETE = async (inputs) => {
  const { sup_id } = inputs;
  const query = `DELETE FROM suppliers WHERE sup_id=?`;
  const [RESULT] = await db.execute(query, [sup_id]);
  if (!RESULT.affectedRows) {
    throw new Error("Supplier not found");
  }
  return RESULT;
};

export const seedSupplier = async (inputs) => {
  const { sup_name, sup_contactNumber } = inputs;
  const query = `SELECT * FROM suppliers WHERE sup_name=? `;
  const [supplier] = await db.execute(query, [sup_name]);
  if (supplier.length) {
    throw new Error("Supplier already exists");
  }
  const insert = `INSERT INTO suppliers (sup_name, sup_contactNumber) VALUES (?, ?)`;
  const [RESULT] = await db.execute(insert, [sup_name, sup_contactNumber]);
  return RESULT;
};
export const StartingWithF = async () => {
  const query = `SELECT * FROM suppliers WHERE sup_name LIKE 'F%' `;
  const [RESULT] = await db.execute(query);
  return RESULT;
};
