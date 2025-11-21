import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import { Order } from './Order';

export interface ShipmentI {
  id?: number;
  id_order: number;
  tracking_number: string;
  status?: "ACTIVE" | "INACTIVE"; // ✅ Opcional en la creación
  fecha_envio?: Date;             // ✅ Opcional en la creación
}

export class Shipment extends Model<ShipmentI> implements ShipmentI {
  public id!: number;
  public id_order!: number;
  public tracking_number!: string;
  public status!: "ACTIVE" | "INACTIVE";
  public fecha_envio!: Date; // <-- AÑADIDO
}

Shipment.init(
  {
    id_order: { type: DataTypes.INTEGER, allowNull: false },
    tracking_number: { type: DataTypes.STRING, allowNull: false },
    fecha_envio: { // <-- AÑADIDO
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Shipment",
    tableName: "shipments",
    timestamps: false,
  }
);