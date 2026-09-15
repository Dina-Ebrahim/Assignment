import { DataTypes } from "sequelize";
import { sequelize } from "../connection.db.js";

const checkNameLength = (user) => {
  if (user.name.length <= 2) {
    throw new Error("Name must be greater than 2 characters");
  }
};
export const userModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      field: "u_id",
    },
    name: {
      type: DataTypes.STRING(255),
      field: "u_name",
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      field: "u_email",
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      field: "u_password",
      validate: {
        checkPasswordLength(value) {
          if (value.length <= 6) {
            throw new Error("Password must be greater than 6 characters");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      field: "u_role",
    },
  },

  {
    timestamps: true,
    createdAt: "u_createdAt",
    updatedAt: "u_updateAt",
    freezeTableName: true,
    hooks: {
      beforeCreate: checkNameLength,
    },
  },
);
