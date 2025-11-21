import { Router, Application } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth";

export class ProductRoutes {
  public productController: ProductController = new ProductController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
     app.route("/api/products")
      .get(this.productController.getAllProducts)
      .post(this.productController.createProduct);

    app.route("/api/products/:id")
      .get(this.productController.getProductById)
      .patch(this.productController.updateProduct)
      .delete(this.productController.deleteProduct);

    app.route("/api/products/:id/logic")
      .delete(this.productController.deleteProductAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/ocul/Products")
      .get(authMiddleware, this.productController.getAllProducts)
      .post(authMiddleware, this.productController.createProduct);

    app.route("/api/ocul/Products/:id")
      .get(authMiddleware, this.productController.getProductById)
      .patch(authMiddleware, this.productController.updateProduct)
      .delete(authMiddleware, this.productController.deleteProduct);

    app.route("/api/ocul/Products/:id/logic")
      .delete(authMiddleware, this.productController.deleteProductAdv);

  }
}
