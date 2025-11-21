import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";

export interface OrderI {
  id?: number;
  id_client: number;
  status?: "PENDING" | "PAID" | "SHIPPED"; // ✅ Opcional en la creación
  statuss?: "ACTIVE" | "INACTIVE";// ✅ Opcional en la creación
  fecha?: Date;                           // ✅ Opcional en la creación
  total: number;
}

export class Order extends Model<OrderI> implements OrderI {
  public id!: number;
  public id_client!: number;
  public status!: "PENDING" | "PAID" | "SHIPPED"; // El tipo sigue siendo estricto en la instancia
  public statuss!: "ACTIVE" | "INACTIVE";
  public fecha!: Date;
  public total!: number;
}

Order.init(
  {
    id_client: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM("PENDING", "PAID", "SHIPPED"), defaultValue: "PENDING" },
    statuss: { type: DataTypes.ENUM("ACTIVE", "INACTIVE"), defaultValue: "ACTIVE" },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: false,
  }
);
