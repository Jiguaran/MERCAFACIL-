import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";

export interface ProductTagI {
  id_product: number;
  id_tag: number;
  status: "ACTIVE" | "INACTIVE";
}

export class ProductTag extends Model<ProductTagI> implements ProductTagI {
  public id_product!: number;
  public id_tag!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

ProductTag.init(
  {
    id_product: { type: DataTypes.INTEGER, allowNull: false },
    id_tag: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "ProductTag",
    tableName: "product_tags",
    timestamps: false,
  }
);