import { Request, Response } from "express";
import { Tag, TagI } from "../models/Tag";


export class TagController {
  // Get all Shipment with statuss "ACTIVE"
  public async getAllTags(req: Request, res: Response) {
    try {
      const tags: TagI[] = await Tag.findAll({
        where: { status: 'ACTIVE' },
      });
      res.status(200).json({ tags });
    } catch (error) {
      res.status(500).json({ error: "Error fetching tags" });
    }
  }

  // Get a tags by ID

  public async getTagById(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const tag = await Tag.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });
      if (tag) {
        res.status(200).json({tag});
      } else {
        res.status(404).json({ error: "tag not found or inactive" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching tag" });
    }
  }

  // Create a new tag
  public async createTag(req: Request, res: Response) {
    const { id, name, status } = req.body;
    try {
      let body: TagI = {
        name,
        status,
      };

      const newTag = await Tag.create({ ...body });
      res.status(201).json(newTag);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a Tag
  public async updateTag(req: Request, res: Response) {
    const { id: pk } = req.params;
    const { id, name, status } = req.body;
    try {
      let body: TagI = {
        name,
        status,
      };

      const tagExist = await Tag.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (tagExist) {
        await tagExist.update(body, {
          where: { id: pk },
        });
        res.status(200).json(tagExist);
      } else {
        res.status(404).json({ error: "tag not found or inactive" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a tag physically
  public async deleteTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tagToDelete = await Tag.findByPk(id);

      if (tagToDelete) {
        await tagToDelete.destroy();
        res.status(200).json({ message: "Tag deleted successfully" });
      } else {
        res.status(404).json({ error: "Tag not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting Tag" });
    }
  }

  // Delete a Tag logically (change status to "INACTIVE")
  public async deleteTagAdv(req: Request, res: Response) {
    try {
      const { id: pk } = req.params;
      const tagToUpdate = await Tag.findOne({
        where: { 
          id: pk, 
          status: 'ACTIVE' },
      });

      if (tagToUpdate) {
        await tagToUpdate.update({ status: 'INACTIVE' });
        res.status(200).json({ message: "tag marked as inactive" });
      } else {
        res.status(404).json({ error: "tag not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error marking tag as inactive" });
    }
  }
}