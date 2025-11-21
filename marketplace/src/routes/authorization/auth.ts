import { Application } from "express";
import { AuthController } from '../../controllers/authorization/auth.controller';

export class AuthRoutes {
  public authController: AuthController = new AuthController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
    app.route("/api/register")
      .post(this.authController.register);

    app.route("/api/login")
      .post(this.authController.login);

    // ================== RUTAS CON AUTENTICACIÓN ==================

  }
}