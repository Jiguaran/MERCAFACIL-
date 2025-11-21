import { Request, Response } from "express";
import { Payment, PaymentI } from "../models/Payment";
import { Order } from "../models/Order";
import { Client } from "../models/Client";  

export class PaymentController {
  // Get all payment with status "ACTIVE"
  public async getAllPayments(req: Request, res: Response) {
    try {
      const payments: PaymentI[] = await Payment.findAll({
        where: { status: 'ACTIVE' },
        include: [  
          {
            model: Order,
            as: "order",
            attributes: ['id'],
            include:[{
              model: Client,
              as: "client",
              attributes: ['name'],
            }]
          }
        ],
      });
      res.status(200).json({ payments });
    } catch (error) {
      res.status(500).json({ error: "Error fetching payments" });
    }
  }

  // Get a payment by ID

  public async getPaymentById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const payment = await Payment.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });
      if (payment) {
        res.status(200).json({payment});
      } else {
        res.status(404).json({ error: "Payment not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching payment" });
    }
  }

  // Create a new payment
  public async createPayment(req: Request, res: Response) {
    const { id, id_order, method, amount, payment_date, status } = req.body;
    try {
      let body: PaymentI = {
        id_order,
        method,
        amount,
        payment_date,
        status,
      };

      const newPayment = await Payment.create({ ...body });
      res.status(201).json(newPayment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a payment
  public async updatePayment(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { id, id_order, method, amount, payment_date, status } = req.body;
    try {
      let body: PaymentI = {
        id_order,
        method,
        amount,
        payment_date,
        status,
      };

      const paymentExist = await Payment.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (paymentExist) {
        await paymentExist.update(body, {
          where: { id: pk },
        });
        res.status(200).json(paymentExist);
      } else {
        res.status(404).json({ error: "Payment not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a payment physically
  public async deletePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paymentToDelete = await Payment.findByPk(id);

      if (paymentToDelete) {
        await paymentToDelete.destroy();
        res.status(200).json({ message: "Payment deleted successfully" });
      } else {
        res.status(404).json({ error: "Payment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting payment" });
    }
  }

  // Delete a payment logically (change status to "INACTIVE")
  public async deletePaymentAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const paymentToUpdate = await Payment.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (paymentToUpdate) {
        await paymentToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Payment marked as inactive" });
      } else {
        res.status(404).json({ error: "Payment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking Payment as inactive" });
    }
  }
}