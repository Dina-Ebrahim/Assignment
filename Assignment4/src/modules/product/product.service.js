import { db } from "../../DB/connection.db.js";
export const createProduct = async (inputs) => {
  const { P_name, p_price, p_stockQuantity, sup_id } = inputs;
  const query = `INSERT INTO products ( P_name, p_price, p_stockQuantity,sup_id ) VALUE (?,?,?,?)`;
  const [RESULT] = await db.execute(query, [
    P_name,
    p_price,
    p_stockQuantity,
    sup_id,
  ]);
  return RESULT;
};
export const getAll = async () => {
  const query = `SELECT * FROM products`;
  const [RESULT] = await db.execute(query);
  return RESULT;
};

export const getAllbyId = async (inputs) => {
  const { p_id } = inputs;
  const query = `SELECT * FROM products WHERE p_id = ?`;
  const [RESULT] = await db.execute(query, [p_id]);
  return RESULT;
};

export const UPDATE = async (inputs) => {
  const { p_id, p_name, p_price, p_stockQuantity, sup_id } = inputs;
  const query = `UPDATE products SET  p_name=? , p_price=?, p_stockQuantity=?, sup_id=? WHERE p_id=?`;
  const [RESULT] = await db.execute(query, [
    p_name,
    p_price,
    p_stockQuantity,
    sup_id,
    p_id,
  ]);
  if (!RESULT.affectedRows) {
    throw new Error("Product not found");
  }

  return RESULT;
};

export const DELETE = async (inputs) => {
  const { p_id } = inputs;
  const query = `DELETE  FROM products WHERE p_id=?`;
  const [RESULT] = await db.execute(query, [p_id]);
  if (!RESULT.affectedRows) {
    throw new Error("Product not found");
  }

  return RESULT;
};
export const seedProducts = async (inputs) => {
  const { sup_name, products } = inputs;

  const supplierquery = `SELECT * FROM suppliers WHERE sup_name=?`;

  const [supplier] = await db.execute(supplierquery, [sup_name]);

  if (!supplier.length) {
    throw new Error("FreshFoods supplier not found");
  }

  const sup_id = supplier[0].sup_id;

  const results = [];

  for (const product of products) {
    const { p_name, p_price, p_stockQuantity } = product;

    const checkQuery = `
      SELECT p_id
      FROM products
      WHERE p_name = ?
    `;

    const [existingProduct] = await db.execute(checkQuery, [p_name]);

    if (existingProduct.length) {
      throw new Error(`Product ${p_name} already exists`);
    }

    const insertQuery = `
      INSERT INTO products
      (p_name, p_price, p_stockQuantity, sup_id)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(insertQuery, [
      p_name,
      p_price,
      p_stockQuantity,
      sup_id,
    ]);

    results.push(result);
  }

  return results;
};

export const updateProductPrice = async (inputs) => {
  const { p_name, p_price } = inputs;

  const checkQuery = `
    SELECT p_id
    FROM products
    WHERE p_name = ?
  `;

  const [product] = await db.execute(checkQuery, [p_name]);

  if (!product.length) {
    throw new Error("Product not found");
  }

  const query = `
    UPDATE products
    SET p_price = ?
    WHERE p_name = ?
  `;

  const [result] = await db.execute(query, [p_price, p_name]);

  if (!result.affectedRows) {
    throw new Error("Price was not updated");
  }

  return result;
};
export const deleteEgg = async () => {
  const checkQuery = ` SELECT p_id FROM products WHERE p_name = ? `;
  const [product] = await db.execute(checkQuery, ["Eggs"]);
  if (!product.length) {
    throw new Error("Product Eggs not found");
  }
  const p_id = product[0].p_id;
  const salesQuery = `SELECT p_id FROM sales  WHERE p_id = ? `;
  const [sales] = await db.execute(salesQuery, [p_id]);
  if (sales.length) {
    throw new Error("Cannot delete Eggs because it has sales");
  }
  const deleteQuery = `DELETE FROM products WHERE p_id = ? `;
  const [result] = await db.execute(deleteQuery, [p_id]);
  if (!result.affectedRows) {
    throw new Error("Product was not deleted");
  }

  return result;
};
export const HighStock = async () => {
  const query = `SELECT * FROM products ORDER BY p_stockQuantity	DESC LIMIT 1 `;
  const [RESULT] = await db.execute(query);
  return RESULT[0];
};
export const allProductNeverSale = async () => {
  const query = `SELECT p.* FROM Products p LEFT JOIN Sales s ON p.p_id = s.s_id WHERE s.p_id IS NULL`;
  const [RESULT] = await db.execute(query);
  return RESULT[0];
};
export const getAllSale = async () => {
  const query = `SELECT p.p_name, s.s_quantitySold , s.s_saleDate FROM products p INNER JOIN sales s ON p.p_id = s.p_id `;
  const [RESULT] = await db.execute(query);
  return RESULT;
};
