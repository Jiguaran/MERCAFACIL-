import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import bcrypt from 'bcryptjs';
import { Order } from "./Order";  // 🔹 Importas solo lo que necesitas
import { Review } from "./Review";



export interface ClientI {
  id?: number;
  name: string;
  address: string;
  email: string;
  password: string;
  status: "ACTIVE" | "INACTIVE";
  code: string;
}

export class Client extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public email!: string;
  public password!: string;
  public status!: "ACTIVE" | "INACTIVE";
  public code!: string;
}
Client.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Address cannot be empty" },
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [10, 10]
      }
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "clients",
    timestamps: false,
        hooks: {
          beforeCreate: async (client: Client) => {
            if (client.password) {
              const salt = await bcrypt.genSalt(10);
              client.password = await bcrypt.hash(client.password, salt);
            }
          },
          beforeUpdate: async (client: Client) => {
            if (client.password) {
              const salt = await bcrypt.genSalt(10);
              client.password = await bcrypt.hash(client.password, salt);
            }
          }
        }
  }
);