import { Router, Application } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth";

export class CategoryRoutes {
  public categoryController: CategoryController = new CategoryController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
     app.route("/api/categories")
      .get(this.categoryController.getAllCategories)
      .post(this.categoryController.createCategory);

    app.route("/api/categories/:id")
      .get(this.categoryController.getCategoryById)
      .patch(this.categoryController.updateCategory)
      .delete(this.categoryController.deleteCategory);

    app.route("/api/categories/:id/logic")
      .delete(this.categoryController.deleteCategoryAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/ocul/Categories")
      .get(authMiddleware, this.categoryController.getAllCategories)
      .post(authMiddleware, this.categoryController.createCategory);

    app.route("/api/ocul/Categories/:id")
      .get(authMiddleware, this.categoryController.getCategoryById)
      .patch(authMiddleware, this.categoryController.updateCategory)
      .delete(authMiddleware, this.categoryController.deleteCategory);

    app.route("/api/ocul/Categories/:id/logic")
      .delete(authMiddleware, this.categoryController.deleteCategoryAdv);

  }

  
}
