import { Application } from "express";
import { ResourceRoleController } from "../../controllers/authorization/resourceRole.controller";
import { authMiddleware } from '../../middleware/auth';

export class ResourceRoleRoutes {
  public resourceRoleController: ResourceRoleController = new ResourceRoleController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/api/resourceRoles/public")
      .get(this.resourceRoleController.getAllResourceRoles)
      .post(this.resourceRoleController.createResourceRole);

    app.route("/api/resourceRoles/public/:id")
      .get(this.resourceRoleController.getResourceRoleById)
      .patch(this.resourceRoleController.updateResourceRole)
      .delete(this.resourceRoleController.deleteResourceRole);

    app.route("/api/resourceRoles/public/:id/logic")
      .delete(this.resourceRoleController.deleteResourceRoleAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/resourceRoles")
      .get(authMiddleware, this.resourceRoleController.getAllResourceRoles)
      .post(authMiddleware, this.resourceRoleController.createResourceRole);

    app.route("/api/resourceRoles/:id")
      .get(authMiddleware, this.resourceRoleController.getResourceRoleById)
      .patch(authMiddleware, this.resourceRoleController.updateResourceRole)
      .delete(authMiddleware, this.resourceRoleController.deleteResourceRole);

    app.route("/api/resourceRoles/:id/logic")
      .delete(authMiddleware, this.resourceRoleController.deleteResourceRoleAdv);
  }
}