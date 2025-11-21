import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";


export interface CategoryI {
  id?: number;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export class Category extends Model {
  public id!: number;
  public name!: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Category.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);
