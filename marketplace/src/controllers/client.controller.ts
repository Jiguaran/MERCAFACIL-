import { Request, Response } from "express";
import { Client, ClientI } from "../models/Client";

export class ClientController {
  // Get all clients with status "ACTIVE"
  public async getAllClients(req: Request, res: Response) {
    try {
      const clients: ClientI[] = await Client.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ clients });
    } catch (error) {
      res.status(500).json({ error: "Error fetching clients" });
    }
  }

  // Get a client by ID

  public async getClientById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const client = await Client.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });
      if (client) {
        res.status(200).json({client});
      } else {
        res.status(404).json({ error: "Client not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching client" });
    }
  }

  // Create a new client
  public async createClient(req: Request, res: Response) {
    const { id, name, address, code, email, password, status } = req.body;
    try {
      let body: ClientI = {
        name,
        code,
        address,
        email,
        password,
        status,
      };

      const newClient = await Client.create({ ...body });
      res.status(201).json(newClient);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a client
  public async updateClient(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { id, name, address, code, email, password, status } = req.body;
    try {
      let body: ClientI = {
        name,
        address,
        code,
        email,
        password,
        status,
      };

      const clientExist = await Client.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (clientExist) {
        await clientExist.update(body, {
          where: { id: pk },
        });
        res.status(200).json(clientExist);
      } else {
        res.status(404).json({ error: "Client not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a client physically
  public async deleteClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clientToDelete = await Client.findByPk(id);

      if (clientToDelete) {
        await clientToDelete.destroy();
        res.status(200).json({ message: "Client deleted successfully" });
      } else {
        res.status(404).json({ error: "Client not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting client" });
    }
  }

  // Delete a client logically (change status to "INACTIVE")
  public async deleteClientAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const clientToUpdate = await Client.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (clientToUpdate) {
        await clientToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Client marked as inactive" });
      } else {
        res.status(404).json({ error: "Client not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking client as inactive" });
    }
  }
}