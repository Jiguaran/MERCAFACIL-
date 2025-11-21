import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import { sequelize } from "../database/connection";
import { Routes } from "../routes";

var cors = require("cors"); // install en node y types
dotenv.config();

export class App {
  public app: Application;
  private mainRoutes: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.mainRoutes.clientRoutes.routes(this.app);
    this.mainRoutes.categoryRoutes.routes(this.app);
    this.mainRoutes.orderRoutes.routes(this.app);
    this.mainRoutes.orderDetailRoutes.routes(this.app);
    this.mainRoutes.paymentRoutes.routes(this.app);
    this.mainRoutes.productRoutes.routes(this.app);
    this.mainRoutes.productTagRoutes.routes(this.app);
    this.mainRoutes.reviewRoutes.routes(this.app);
    this.mainRoutes.sellerRoutes.routes(this.app);
    this.mainRoutes.shipmentRoutes.routes(this.app);
    this.mainRoutes.tagRoutes.routes(this.app);
    this.mainRoutes.userRoutes.routes(this.app);
    this.mainRoutes.roleRoutes.routes(this.app);
    this.mainRoutes.roleUserRoutes.routes(this.app);
    this.mainRoutes.refreshTokenRoutes.routes(this.app);
    this.mainRoutes.resourceRoutes.routes(this.app);
    this.mainRoutes.resourceRoleRoutes.routes(this.app);
    this.mainRoutes.authRoutes.routes(this.app)
  }

  private async dbConnection(): Promise<void> {
    try {
      await sequelize.sync({ force: false }); // Synchronize the database
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}