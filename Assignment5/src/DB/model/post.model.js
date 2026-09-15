import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection.db.js";
export class postModel extends Model {}
postModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "p_id",
    },
    title: {
      type: DataTypes.STRING,
      field: "p_title",
    },
    content: {
      type: DataTypes.TEXT,
      field: "p_content",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "p_userId",
      references: {
        model: "User",
        key: "u_id",
      },
    },
  },
  {
    timestamps: true,
    createdAt: "p_createdAt",
    updatedAt: "p_updateAt",
    freezeTableName: true,
    sequelize,
    paranoid: true,
    deletedAt: "p_deletedAt",
  },
);
