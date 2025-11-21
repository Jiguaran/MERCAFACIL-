import { Application } from "express";
import { RoleController } from '../../controllers/authorization/role.controller';
import { authMiddleware } from '../../middleware/auth';

export class RoleRoutes {
  public roleController: RoleController = new RoleController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/api/roles/public")
      .get(this.roleController.getAllRoles)
      .post(this.roleController.createRole);

    app.route("/api/roles/public/:id")
      .get(this.roleController.getRoleById)
      .patch(this.roleController.updateRole)
      .delete(this.roleController.deleteRole);

    app.route("/api/roles/public/:id/logic")
      .delete(this.roleController.deleteRoleAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/roles")
      .get(authMiddleware, this.roleController.getAllRoles)
      .post(authMiddleware, this.roleController.createRole);

    app.route("/api/roles/:id")
      .get(authMiddleware, this.roleController.getRoleById)
      .patch(authMiddleware, this.roleController.updateRole)
      .delete(authMiddleware, this.roleController.deleteRole);

    app.route("/api/roles/:id/logic")
      .delete(authMiddleware, this.roleController.deleteRoleAdv);
  }
}