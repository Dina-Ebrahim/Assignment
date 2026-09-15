import { Sequelize } from "sequelize";
import { DB_NAME, DB_PASSWORD, DB_USER, DB_PORT, DB_HOST } from "../config.js";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  port: DB_PORT,
  host: DB_HOST,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
  },
});

export const bootstrab = async (port, app) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false, force: false, match: /_test$/ });
    console.log(`DB connected successfully`);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  } catch (error) {
    console.log(`fail to connect on DB`);
    console.log(error);
    process.exit(1);
  }
};
