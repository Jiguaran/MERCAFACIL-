import { Router, Application } from "express";
import { OrderDetailController } from "../controllers/orderDetail.controller";
import { authMiddleware } from "../middleware/auth";

export class OrderDetailRoutes {
  public orderDetailController: OrderDetailController = new OrderDetailController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN ==================
     app.route("/api/orderDetails")
      .get(this.orderDetailController.getAllOrderDetails)
      .post(this.orderDetailController.createOrderDetail);

    app.route("/api/orderDetails/:id")
      .get(this.orderDetailController.getOrderDetailById)
      .patch(this.orderDetailController.updateOrderDetail)
      .delete(this.orderDetailController.deleteOrderDetail);

    app.route("/api/orderDetails/:id/logic")
      .delete(this.orderDetailController.deleteOrderDetailAdv);

    // ================== RUTAS CON AUTENTICACIÓN ==================
    app.route("/api/ocul/OrderDetails")
      .get(authMiddleware, this.orderDetailController.getAllOrderDetails)
      .post(authMiddleware, this.orderDetailController.createOrderDetail);

    app.route("/api/ocul/OrderDetails/:id")
      .get(authMiddleware, this.orderDetailController.getOrderDetailById)
      .patch(authMiddleware, this.orderDetailController.updateOrderDetail)
      .delete(authMiddleware, this.orderDetailController.deleteOrderDetail);

    app.route("/api/ocul/OrderDetails/:id/logic")
      .delete(authMiddleware, this.orderDetailController.deleteOrderDetailAdv);
  }
}
