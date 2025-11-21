import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import { Product } from "./Product";
import bcrypt from 'bcryptjs';

export interface SellerI {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  status: "ACTIVE" | "INACTIVE";
}

export class Seller extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public password!: string;
  public status!: "ACTIVE" | "INACTIVE";
}

Seller.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Phone cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be a valid email address" }, // Validate email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
    {
    sequelize,
    modelName: "seller",
    tableName: "sellers",
    timestamps: false,
    hooks: {
      beforeCreate: async (seller: Seller) => {
        if (seller.password) {
          const salt = await bcrypt.genSalt(10);
          seller.password = await bcrypt.hash(seller.password, salt);
        }
      },
      beforeUpdate: async (seller: Seller) => {
        if (seller.password) {
          const salt = await bcrypt.genSalt(10);
          seller.password = await bcrypt.hash(seller.password, salt);
        }
      }
    }
  }
);