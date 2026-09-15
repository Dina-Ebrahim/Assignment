import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection.db.js";
export class commentModel extends Model {}
commentModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "c_id",
    },
    content: {
      type: DataTypes.TEXT,
      field: "c_content",
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "c_postId",
      references: {
        model: "postModel",
        key: "p_id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "c_userId",
      references: {
        model: "User",
        key: "u_id",
      },
    },
  },
  {
    timestamps: true,
    createdAt: "c_createdAt",
    updatedAt: "c_updateAt",
    freezeTableName: true,
    sequelize,
  },
);
