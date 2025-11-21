import { Router, Application } from "express";
import { SellerController } from "../controllers/seller.controller";
import { authMiddleware } from "../middleware/auth";


export class SellerRoutes {
  public sellerController: SellerController = new SellerController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
     app.route("/api/sellers")
      .get(this.sellerController.getAllSellers)
      .post(this.sellerController.createSeller);

    app.route("/api/sellers/:id")
      .get(this.sellerController.getSellerById)
      .patch(this.sellerController.updateSeller)
      .delete(this.sellerController.deleteSeller);

    app.route("/api/sellers/:id/logic")
      .delete(this.sellerController.deleteSellerAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/ocul/Sellers")
      .get(authMiddleware, this.sellerController.getAllSellers)
      .post(authMiddleware, this.sellerController.createSeller);

    app.route("/api/ocul/Sellers/:id")
      .get(authMiddleware, this.sellerController.getSellerById)
      .patch(authMiddleware, this.sellerController.updateSeller)
      .delete(authMiddleware, this.sellerController.deleteSeller);

    app.route("/api/ocul/Sellers/:id/logic")
      .delete(authMiddleware, this.sellerController.deleteSellerAdv);

  }
}
