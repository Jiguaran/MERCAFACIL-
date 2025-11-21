import { Request, Response } from "express";
import { Review, ReviewI } from "../models/Review";
import {Product} from "../models/Product"; // IMPORTO PRODUCTO PARA PODER HACER EL INCLUDE PARA LAS LLAVES FORANEAS
import {Client} from "../models/Client"; // IMPORTO CLIENTE PARA PODER HACER EL INCLUDE PARA LAS LLAVES FORANEAS

export class ReviewController {
  // Get all REVIEWS with statuss "ACTIVE"
  public async getAllReviews(req: Request, res: Response) {
    try {
      const reviews: ReviewI[] = await Review.findAll({
        where: { status: 'ACTIVE' },
        include: [  
          {
            model: Product,
            as: "product",
            attributes: ['name'],
          },
          {
            model: Client,
            as: "client",
            attributes: ['name'],
          }
         ]
      });
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ error: "Error fetching reviews" });
    }
  }

  // Get a review by ID

  public async getReviewById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const review = await Review.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });
      if (review) {
        res.status(200).json({review});
      } else {
        res.status(404).json({ error: "review not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching review" });
    }
  }

  // Create a new Review
  public async createReview(req: Request, res: Response) {
    const { id, id_product, id_client, rating, comment, status } = req.body;
    try {
      let body: ReviewI = {
        id_product,
        id_client,
        rating,
        comment,
        status,
      };

      const newReview = await Review.create({ ...body });
      res.status(201).json(newReview);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a Review
  public async updateReview(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { id, id_product, id_client, rating, comment, status } = req.body;
    try {
      let body: ReviewI = {
        id_product,
        id_client,
        rating,
        comment,
        status,
      };

      const reviewExist = await Review.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (reviewExist) {
        await reviewExist.update(body, {
          where: { id: pk },
        });
        res.status(200).json(reviewExist);
      } else {
        res.status(404).json({ error: "Review not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a Review physically
  public async deleteReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reviewToDelete = await Review.findByPk(id);

      if (reviewToDelete) {
        await reviewToDelete.destroy();
        res.status(200).json({ message: "review deleted successfully" });
      } else {
        res.status(404).json({ error: "review not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting review" });
    }
  }

  // Delete a Review logically (change status to "INACTIVE")
  public async deleteReviewAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const reviewToUpdate = await Review.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (reviewToUpdate) {
        await reviewToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Review marked as inactive" });
      } else {
        res.status(404).json({ error: "Review not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking Review as inactive" });
    }
  }
}