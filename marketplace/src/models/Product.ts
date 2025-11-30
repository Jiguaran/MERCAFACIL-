import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/connection";
import { Category } from "./Category";
import { Seller } from "./Seller";
import { Tag } from "./Tag";
import { ProductTag } from "./ProductTag";
import { Review } from "./Review";
import { Order } from "./Order";
import { OrderDetail } from "./OrderDetail";
import { Payment } from "./Payment";
import { Client } from "./Client";
import { Shipment } from "./Shipment";

export interface ProductI {
  id?: number;
  name: string;
  price: number;
  description: string;
  id_seller: number;
  id_category: number;
  status: "ACTIVE" | "INACTIVE";
}

export class Product extends Model<ProductI> implements ProductI {
  public id!: number;
  public name!: string;
  public price!: number;
  public description!: string;
  public id_seller!: number;
  public id_category!: number;
  public status!: "ACTIVE" | "INACTIVE";
}

Product.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    id_seller: { type: DataTypes.INTEGER, allowNull: false },
    id_category: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: false,
  }
);

// Centralized Associations to prevent circular dependencies

// Product <-> Category
Product.belongsTo(Category, { foreignKey: "id_category", as: "category" });
Category.hasMany(Product, { foreignKey: "id_category", as: "products" });

// Product <-> Seller
Product.belongsTo(Seller, { foreignKey: "id_seller", as: "seller" });
Seller.hasMany(Product, { foreignKey: "id_seller", as: "products" });

// Product <-> Tag (Many-to-Many through ProductTag)
Product.belongsToMany(Tag, { through: ProductTag, foreignKey: "id_product", as: "tags" });
Tag.belongsToMany(Product, { through: ProductTag, foreignKey: "id_tag", as: "products" });

// Product <-> Order (Many-to-Many through OrderDetail)
Product.belongsToMany(Order, { through: OrderDetail, foreignKey: "id_product", as: "orders" });
Order.belongsToMany(Product, { through: OrderDetail, foreignKey: "id_order", as: "products" });

// Product <-> Review
Product.hasMany(Review, { foreignKey: "id_product", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "id_product", as: "product" });

// Client <-> Order & Review
Client.hasMany(Order, { foreignKey: "id_client", as: "orders" });
Order.belongsTo(Client, { foreignKey: "id_client", as: "client" });
Client.hasMany(Review, { foreignKey: "id_client", as: "reviews" });
Review.belongsTo(Client, { foreignKey: "id_client", as: "client" });

// Order <-> Payment
Order.hasOne(Payment, { foreignKey: 'id_order', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'id_order', as: 'order' });

//order <-> shipment
Order.hasOne(Shipment, { foreignKey: 'id_order', as: 'shipment' });
Shipment.belongsTo(Order, { foreignKey: 'id_order', as: 'order' });

//order <-> product
OrderDetail.belongsTo(Order, { foreignKey: "id_order", as: "order" });
OrderDetail.belongsTo(Product, { foreignKey: "id_product", as: "product" });

// ProductTag -> Product
ProductTag.belongsTo(Product, {
  foreignKey: "id_product",
  as: "product"
});

// ProductTag -> Tag
ProductTag.belongsTo(Tag, {
  foreignKey: "id_tag",
  as: "tag"
});
