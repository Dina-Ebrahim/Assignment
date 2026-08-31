import mysql2 from "mysql2/promise";

export const db = mysql2.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "test14",
  waitForConnections: true,
  queueLimit: 0,
  connectionLimit: 4,
});

export async function bootstrapDB(app, port = 3000) {
  try {
    const [data] = await db.query(`SELECT 1 + 1 AS RESULT`);

    console.log("DB connected 💕");

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  } catch (error) {
    console.log("Fail to connect on DB ❌");
    console.log(error.message);
  }
}
