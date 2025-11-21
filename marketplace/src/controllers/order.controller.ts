import { Request, Response } from "express";
import { Order, OrderI } from "../models/Order";
import { Client } from "../models/Client";


export class OrderController {
  // Get all orders with statuss "ACTIVE"
  public async getAllOrders(req: Request, res: Response) {
    try {
      const orders: OrderI[] = await Order.findAll({
        where: { statuss: 'ACTIVE' },
        include:[{
          model: Client,
          as: "client",
          attributes: ['name'],
        }]
      });
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Error fetching orders" });
    }
  }

  // Get a order by ID

  public async getOrderById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const order = await Order.findOne({
        where: { 
          id: pk, 
          statuss: 'ACTIVE' },
      });
      if (order) {
        res.status(200).json({order});
      } else {
        res.status(404).json({ error: "Order not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching order" });
    }
  }

  // Create a new Order
  public async createOrder(req: Request, res: Response) {
    const { id, id_client, fecha, total, status,statuss } = req.body;
    try {
      let body: OrderI = {
        id_client,
        fecha,
        total,
        status,
        statuss,
      };

      const newOrder = await Order.create({ ...body });
      res.status(201).json(newOrder);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a Order
  public async updateOrder(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { id, id_client, fecha, total, status, statuss } = req.body;
    try {
      let body: OrderI = {
        id_client,
        fecha,
        total,
        status,
        statuss,
      };

      const orderExist = await Order.findOne({
        where: { 
          id: pk, 
          statuss: 'ACTIVE' },
      });

      if (orderExist) {
        await orderExist.update(body, {
          where: { id: pk },
        });
        res.status(200).json(orderExist);
      } else {
        res.status(404).json({ error: "Order not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a Order physically
  public async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orderToDelete = await Order.findByPk(id);

      if (orderToDelete) {
        await orderToDelete.destroy();
        res.status(200).json({ message: "Order deleted successfully" });
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting Order" });
    }
  }

  // Delete a Order logically (change status to "INACTIVE")
  public async deleteOrderAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const orderToUpdate = await Order.findOne({
        where: { 
          id: pk, 
          statuss: 'ACTIVE' },
      });

      if (orderToUpdate) {
        await orderToUpdate.update({ statuss: 'INACTIVE' });
        res.status(200).json({ message: "Order marked as inactive" });
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking order as inactive" });
    }
  }
}