import { Router, Application } from "express";
import { ShipmentController } from "../controllers/shipment.controller";
import { authMiddleware } from "../middleware/auth";


export class ShipmentRoutes {
  public shipmentController: ShipmentController = new ShipmentController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
     app.route("/api/shipments")
      .get(this.shipmentController.getAllShipments)
      .post(this.shipmentController.createShipment);

    app.route("/api/shipments/:id")
      .get(this.shipmentController.getShipmentById)
      .patch(this.shipmentController.updateShipment)
      .delete(this.shipmentController.deleteShipment);

    app.route("/api/shipments/:id/logic")
      .delete(this.shipmentController.deleteShipmentAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/ocul/Shipments")
      .get(authMiddleware, this.shipmentController.getAllShipments)
      .post(authMiddleware, this.shipmentController.createShipment);

    app.route("/api/ocul/Shipments/:id")
      .get(authMiddleware, this.shipmentController.getShipmentById)
      .patch(authMiddleware, this.shipmentController.updateShipment)
      .delete(authMiddleware, this.shipmentController.deleteShipment);

    app.route("/api/ocul/Shipments/:id/logic")
      .delete(authMiddleware, this.shipmentController.deleteShipmentAdv);

  }
}
