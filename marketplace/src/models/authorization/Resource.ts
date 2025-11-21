import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../database/connection";

export class Resource extends Model {
  public id!: number;
  public path!: string;
  public method!: string;
  public is_active!: "ACTIVE" | "INACTIVE";
}

export interface ResourceI {
  id?: number;
  path: string;
  method: string;
  is_active: "ACTIVE" | "INACTIVE";
}

Resource.init(
  {
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Path cannot be empty" },
      },
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Method cannot be empty" },
      },
    },
    is_active: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "resources",
    sequelize: sequelize,
    timestamps: false,
  }
);