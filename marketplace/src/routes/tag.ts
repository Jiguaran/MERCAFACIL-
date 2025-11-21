import { Router, Application } from "express";
import { TagController } from "../controllers/tag.controller";
import { authMiddleware } from "../middleware/auth";


export class TagRoutes {
  public tagController: TagController = new TagController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
     app.route("/api/tags")
      .get(this.tagController.getAllTags)
      .post(this.tagController.createTag);

    app.route("/api/tags/:id")
      .get(this.tagController.getTagById)
      .patch(this.tagController.updateTag)
      .delete(this.tagController.deleteTag);

    app.route("/api/tags/:id/logic")
      .delete(this.tagController.deleteTagAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/ocul/Tags")
      .get(authMiddleware, this.tagController.getAllTags)
      .post(authMiddleware, this.tagController.createTag);

    app.route("/api/ocul/Tags/:id")
      .get(authMiddleware, this.tagController.getTagById)
      .patch(authMiddleware, this.tagController.updateTag)
      .delete(authMiddleware, this.tagController.deleteTag);

    app.route("/api/ocul/Tags/:id/logic")
      .delete(authMiddleware, this.tagController.deleteTagAdv);

  }
}
