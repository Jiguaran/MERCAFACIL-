import { Router } from "express";
import { ClientRoutes } from "./client";
import { CategoryRoutes } from "./category";
import { OrderRoutes } from "./order";
import { OrderDetailRoutes } from "./orderDetail";
import { PaymentRoutes } from "./payment";
import { ProductRoutes } from "./product";
import { ProductTagRoutes } from "./productTag";
import { ReviewRoutes } from "./review";
import { SellerRoutes } from "./seller";
import { ShipmentRoutes } from "./shipment";
import { TagRoutes } from "./tag";
import { UserRoutes } from "./authorization/user";
import { RoleRoutes } from "./authorization/role";
import { RoleUserRoutes } from "./authorization/role_user";
import { RefreshTokenRoutes } from "./authorization/refresh_token";
import { ResourceRoutes } from "./authorization/resource"; // Import ResourceRoutes
import { ResourceRoleRoutes } from "./authorization/resourceRole"; // Import ResourceRoleRoutes
import { AuthRoutes } from "./authorization/auth"; // Add this import

export class Routes {
  public clientRoutes: ClientRoutes = new ClientRoutes();
  public categoryRoutes: CategoryRoutes = new CategoryRoutes();
  public orderRoutes: OrderRoutes = new OrderRoutes();
  public orderDetailRoutes: OrderDetailRoutes = new OrderDetailRoutes();
  public paymentRoutes: PaymentRoutes = new PaymentRoutes();
  public productRoutes: ProductRoutes = new ProductRoutes();
  public productTagRoutes: ProductTagRoutes = new ProductTagRoutes();
  public reviewRoutes: ReviewRoutes = new ReviewRoutes();
  public sellerRoutes: SellerRoutes = new SellerRoutes();
  public shipmentRoutes: ShipmentRoutes = new ShipmentRoutes();
  public tagRoutes: TagRoutes = new TagRoutes();
  public userRoutes: UserRoutes = new UserRoutes();
  public roleRoutes: RoleRoutes = new RoleRoutes();
  public roleUserRoutes: RoleUserRoutes = new RoleUserRoutes();
  public refreshTokenRoutes: RefreshTokenRoutes = new RefreshTokenRoutes();
  public resourceRoutes: ResourceRoutes = new ResourceRoutes();
  public resourceRoleRoutes: ResourceRoleRoutes = new ResourceRoleRoutes();
  public authRoutes: AuthRoutes = new AuthRoutes(); // Add this line

}