import { db } from "../../DB/connection.db.js";
export const createSale = async (inputs) => {
  const { p_id, s_quantitySold, s_saleDate } = inputs;
  const query = `INSERT INTO sales (p_id , s_quantitySold, s_saleDate) VALUE (?,?,?)`;
  const [RESULT] = await db.execute(query, [p_id, s_quantitySold, s_saleDate]);
  return RESULT;
};

export const getAll = async () => {
  const query = `SELECT * FROM sales`;
  const [RESULT] = await db.execute(query);
  return RESULT;
};

export const getSalesByProduct = async (inputs) => {
  const { p_id } = inputs;
  const query = `SELECT * FROM sales WHERE p_id=?`;
  const [RESULT] = await db.execute(query, [p_id]);
  return RESULT;
};
export const seedSale = async (inputs) => {
  const { p_name, s_quantitySold, s_saleDate } = inputs;
  const checkQuery = ` SELECT p_id FROM products WHERE p_name = ?`;
  const [product] = await db.execute(checkQuery, [p_name]);
  if (!product.length) {
    throw new Error("Product not found");
  }
  const p_id = product[0].p_id;
  const query = ` INSERT INTO sales (p_id, s_quantitySold, s_saleDate) VALUES (?, ?, ?) `;

  const [result] = await db.execute(query, [p_id, s_quantitySold, s_saleDate]);

  if (!result.affectedRows) {
    throw new Error("Sale was not added");
  }

  return result;
};
export const TotalQuantitySold = async () => {
  const query = `
    SELECT 
      products.p_name,
      SUM(sales.s_quantitySold) AS totalQuantitySold
    FROM sales
    JOIN products
      ON sales.p_id = products.p_id
    GROUP BY products.p_id, products.p_name
  `;

  const [result] = await db.execute(query);

  return result;
};
