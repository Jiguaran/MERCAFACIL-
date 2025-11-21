import { Router, Application } from "express";
import { ProductTagController } from "../controllers/productTag.controller";
import { authMiddleware } from "../middleware/auth";

export class ProductTagRoutes {
  public productTagController: ProductTagController = new ProductTagController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
     app.route("/api/productTags")
      .get(this.productTagController.getAllProductTags)
      .post(this.productTagController.createProductTag);

    app.route("/api/productTags/:id")
      .get(this.productTagController.getProductTagById)
      .patch(this.productTagController.updateProductTag)
      .delete(this.productTagController.deleteProductTag);

    app.route("/api/productTags/:id/logic")
      .delete(this.productTagController.deleteProductTagAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/ocul/ProductTags")
      .get(authMiddleware, this.productTagController.getAllProductTags)
      .post(authMiddleware, this.productTagController.createProductTag);

    app.route("/api/ocul/ProductTags/:id")
      .get(authMiddleware, this.productTagController.getProductTagById)
      .patch(authMiddleware, this.productTagController.updateProductTag)
      .delete(authMiddleware, this.productTagController.deleteProductTag);

    app.route("/api/ocul/ProductTags/:id/logic")
      .delete(authMiddleware, this.productTagController.deleteProductTagAdv);

  }
}
