import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";

export interface OrderDetailI {
  id?: number;                // ← Agregado
  id_order: number;
  id_product: number;
  quantity: number;
  price: number;
  status: "ACTIVE" | "INACTIVE";
}

export class OrderDetail extends Model<OrderDetailI> implements OrderDetailI {
  public id!: number;         // ← Agregado
  public id_order!: number;
  public id_product!: number;
  public quantity!: number;
  public price!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

OrderDetail.init(
  {
    id: { 
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_order: { type: DataTypes.INTEGER, allowNull: false },
    id_product: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "OrderDetail",
    tableName: "order_details",
    timestamps: false,
  }
);
