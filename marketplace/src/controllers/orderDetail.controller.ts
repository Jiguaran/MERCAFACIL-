import { Request, Response } from "express";
import { OrderDetail, OrderDetailI } from "../models/OrderDetail";
import {Order, OrderI} from "../models/Order"; // IMPORTO ORDER PARA PODER HACER EL INCLUDE PARA LAS LLAVES
import {Product, ProductI} from "../models/Product"; // IMPORTO PRODUCTO PARA PODER HACER EL INCLUDE PARA LAS LLAVES FORANEAS


export class OrderDetailController {

  // Get all order details (ACTIVOS)
  public async getAllOrderDetails(req: Request, res: Response) {
    try {
      const orderdetails = await OrderDetail.findAll({
        where: { status: 'ACTIVE' },
        include: [ //CREAMOS EL INCLUDE PARA TRAER LAS RELACIONES
              // {
              //   model: Order,
              //   as: 'order',
              //   attributes: ['name'],
              // },
              {
                model: Product,
                as: "product",
                attributes: ['name'],
              }
            ],
 
        
      });

      res.status(200).json({ orderdetails });
    } catch (error) {
      res.status(500).json({ error: "Error fetching order details" });
    }
  }

  // Get order detail by ID
  public async getOrderDetailById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderDetail = await OrderDetail.findOne({
        where: {
          id,
          status: 'ACTIVE',
        },
      });

      if (!orderDetail) {
        return res.status(404).json({ error: "OrderDetail not found or inactive" });
      }

      res.status(200).json(orderDetail);
    } catch (error) {
      res.status(500).json({ error: "Error fetching order detail" });
    }
  }

  // Create a new OrderDetail
  public async createOrderDetail(req: Request, res: Response) {
    try {
      const { id_order, id_product, quantity, price, status } = req.body;

      const body: OrderDetailI = {
        id_order,
        id_product,
        quantity,
        price,
        status,
      };

      const newOrderDetail = await OrderDetail.create(body);
      res.status(201).json(newOrderDetail);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update order detail by ID
  public async updateOrderDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity, price, status } = req.body;

      const orderDetailExist = await OrderDetail.findOne({
        where: {
          id,
          status: "ACTIVE",
        },
      });

      if (!orderDetailExist) {
        return res.status(404).json({ error: "OrderDetail not found or inactive" });
      }

      await orderDetailExist.update({ quantity, price, status });

      res.status(200).json(orderDetailExist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete physically (by ID)
  public async deleteOrderDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderDetail = await OrderDetail.findByPk(id);

      if (!orderDetail) {
        return res.status(404).json({ error: "OrderDetail not found" });
      }

      await orderDetail.destroy();

      res.status(200).json({ message: "OrderDetail deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting OrderDetail" });
    }
  }

  // Delete logically
  public async deleteOrderDetailAdv(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderDetail = await OrderDetail.findOne({
        where: {
          id,
          status: "ACTIVE",
        },
      });

      if (!orderDetail) {
        return res.status(404).json({ error: "OrderDetail not found" });
      }

      await orderDetail.update({ status: "INACTIVE" });

      res.status(200).json({ message: "OrderDetail marked as inactive" });
    } catch (error) {
      res.status(500).json({ error: "Error marking OrderDetail as inactive" });
    }
  }
}
