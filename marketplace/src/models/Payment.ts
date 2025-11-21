import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";

export interface PaymentI {
  id?: number;
  id_order: number;
  method: string;
  amount: number;
  status?: "ACTIVE" | "INACTIVE"; // ✅ Opcional en la creación
  payment_date?: Date;             // ✅ Opcional en la creación
}

export class Payment extends Model<PaymentI> implements PaymentI {
  public id!: number;
  public id_order!: number;
  public method!: string;
  public amount!: number;
  public status!: "ACTIVE" | "INACTIVE";
  public payment_date!: Date; // <-- CAMBIADO
}

Payment.init(
  {
    id_order: { type: DataTypes.INTEGER, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
    payment_date: { // <-- CAMBIADO
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    timestamps: false,
  }
);