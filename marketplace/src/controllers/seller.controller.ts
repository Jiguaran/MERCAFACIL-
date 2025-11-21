import { Request, Response } from "express";
import { Seller, SellerI } from "../models/Seller";


export class SellerController {
  // Get all Seller with statuss "ACTIVE"
  public async getAllSellers(req: Request, res: Response) {
    try {
      const sellers: SellerI[] = await Seller.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ sellers });
    } catch (error) {
      res.status(500).json({ error: "Error fetching sellers" });
    }
  }

  // Get a seller by ID

  public async getSellerById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const seller = await Seller.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });
      if (seller) {
        res.status(200).json({seller});
      } else {
        res.status(404).json({ error: "seller not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching seller" });
    }
  }

  // Create a new seller
  public async createSeller(req: Request, res: Response) {
    const { id, name, email, phone, password, status } = req.body;
    try {
      let body: SellerI = {
        name,
        email,
        phone,
        password,
        status,
      };

      const newSeller = await Seller.create({ ...body });
      res.status(201).json(newSeller);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a Seller
  public async updateSeller(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { id, name, email, phone, password, status } = req.body;
    try {
      let body: SellerI = {
        name,
        email,
        phone,
        password,
        status,
      };

      const sellerExist = await Seller.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (sellerExist) {
        await sellerExist.update(body, {
          where: { id: pk },
        });
        res.status(200).json(sellerExist);
      } else {
        res.status(404).json({ error: "seller not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a Seller physically
  public async deleteSeller(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sellerToDelete = await Seller.findByPk(id);

      if (sellerToDelete) {
        await sellerToDelete.destroy();
        res.status(200).json({ message: "Seller deleted successfully" });
      } else {
        res.status(404).json({ error: "Seller not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting Seller" });
    }
  }

  // Delete a Seller logically (change status to "INACTIVE")
  public async deleteSellerAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const sellerToUpdate = await Seller.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (sellerToUpdate) {
        await sellerToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Seller marked as inactive" });
      } else {
        res.status(404).json({ error: "Seller not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking Seller as inactive" });
    }
  }
}