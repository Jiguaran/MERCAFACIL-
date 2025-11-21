import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";

export interface TagI {
  id?: number;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export class Tag extends Model<TagI> implements TagI {
  public id!: number;
  public name!: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Tag.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
    timestamps: false,
  }
);