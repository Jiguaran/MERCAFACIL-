import { Request, Response } from "express";
import { Category, CategoryI } from "../models/Category";

export class CategoryController {
  // Get all categories with status "ACTIVE"
  public async getAllCategories(req: Request, res: Response) {
    try {
      const categories: CategoryI[] = await Category.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error: "Error fetching categories" });
    }
  }

  // Get a category by ID

  public async getCategoryById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const category = await Category.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });
      if (category) {
        res.status(200).json({category});
      } else {
        res.status(404).json({ error: "category not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching category" });
    }
  }

  // Create a new category
  public async createCategory(req: Request, res: Response) {
    const { id, name, status } = req.body;
    try {
      let body: CategoryI = {
        name,
        status,
      };

      const newCategory = await Category.create({ ...body });
      res.status(201).json(newCategory);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a category
  public async updateCategory(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { id, name, status } = req.body;
    try {
      let body: CategoryI = {
        name,
        status,
      };

      const categoryExist = await Category.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (categoryExist) {
        await categoryExist.update(body, {
          where: { id: pk },
        });
        res.status(200).json(categoryExist);
      } else {
        res.status(404).json({ error: "Category not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a client physically
  public async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoryToDelete = await Category.findByPk(id);

      if (categoryToDelete) {
        await categoryToDelete.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting Category" });
    }
  }

  // Delete a client logically (change status to "INACTIVE")
  public async deleteCategoryAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const categoryToUpdate = await Category.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (categoryToUpdate) {
        await categoryToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "Category marked as inactive" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking Category as inactive" });
    }
  }
}