import { Request, Response } from "express";
import { Shipment, ShipmentI } from "../models/Shipment";
import { Order } from "../models/Order";
import { Client } from "../models/Client";

export class ShipmentController {
  // Get all Shipment with statuss "ACTIVE"
  public async getAllShipments(req: Request, res: Response) {
    try {
      const shipments: ShipmentI[] = await Shipment.findAll({
        where: { status: 'ACTIVE' },
        include:[{
          model: Order,
          as: "order",
          attributes: ['id'],
          include:[{
            model: Client,
            as: "client",
            attributes: ['name'],
          }]
        }]
      });
      res.status(200).json({ shipments });
    } catch (error) {
      res.status(500).json({ error: "Error fetching Shipments" });
    }
  }

  // Get a Shipment by ID

  public async getShipmentById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const shipment = await Shipment.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });
      if (shipment) {
        res.status(200).json({shipment});
      } else {
        res.status(404).json({ error: "shipment not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching shipment" });
    }
  }

  // Create a new shipment
  public async createShipment(req: Request, res: Response) {
    const { id, id_order, tracking_number, fecha_envio, status } = req.body;
    try {
      let body: ShipmentI = {
        id_order,
        tracking_number,
        fecha_envio,
        status,
      };

      const newShipment = await Shipment.create({ ...body });
      res.status(201).json(newShipment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a Shipment
  public async updateShipment(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { id, id_order, tracking_number, fecha_envio, status } = req.body;
    try {
      let body: ShipmentI = {
        id_order,
        tracking_number,
        fecha_envio,
        status,
      };

      const shipmentExist = await Shipment.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (shipmentExist) {
        await shipmentExist.update(body, {
          where: { id: pk },
        });
        res.status(200).json(shipmentExist);
      } else {
        res.status(404).json({ error: "shipment not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a shipment physically
  public async deleteShipment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shipmentToDelete = await Shipment.findByPk(id);

      if (shipmentToDelete) {
        await shipmentToDelete.destroy();
        res.status(200).json({ message: "Shipment deleted successfully" });
      } else {
        res.status(404).json({ error: "Shipment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting Shipment" });
    }
  }

  // Delete a Shipment logically (change status to "INACTIVE")
  public async deleteShipmentAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const shipmentToUpdate = await Shipment.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (shipmentToUpdate) {
        await shipmentToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "shipment marked as inactive" });
      } else {
        res.status(404).json({ error: "shipment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking shipment as inactive" });
    }
  }
}