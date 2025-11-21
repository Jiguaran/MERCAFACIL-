import { Request, Response } from "express";
import { Resource, ResourceI } from "../../models/authorization/Resource";

export class ResourceController {
  // Obtener todos los recursos
  public async getAllResources(req: Request, res: Response): Promise<void> {
    try {
      const resources: ResourceI[] = await Resource.findAll({
        where: { is_active: "ACTIVE" },
      });
      res.status(200).json({ resources });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los recursos" });
    }
  }

  // Obtener un recurso por ID
  public async getResourceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resource = await Resource.findOne({
        where: { id, is_active: "ACTIVE" },
      });
      if (resource) {
        res.status(200).json(resource);
      } else {
        res.status(404).json({ error: "Recurso no encontrado o inactivo" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el recurso" });
    }
  }

  // Crear un nuevo recurso
  public async createResource(req: Request, res: Response): Promise<void> {
    const { path, method, is_active } = req.body;
    try {
      const newResource = await Resource.create({ path, method, is_active });
      res.status(201).json(newResource);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar un recurso
  public async updateResource(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { path, method, is_active } = req.body;
    try {
      const resource = await Resource.findOne({ where: { id, is_active: "ACTIVE" } });
      if (resource) {
        await resource.update({ path, method, is_active });
        res.status(200).json(resource);
      } else {
        res.status(404).json({ error: "Recurso no encontrado o inactivo" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un recurso físicamente
  public async deleteResource(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const resource = await Resource.findByPk(id);
      if (resource) {
        await resource.destroy();
        res.status(200).json({ message: "Recurso eliminado correctamente" });
      } else {
        res.status(404).json({ error: "Recurso no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el recurso" });
    }
  }

  // Eliminar un recurso lógicamente
  public async deleteResourceAdv(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const resource = await Resource.findOne({ where: { id, is_active: "ACTIVE" } });
      if (resource) {
        await resource.update({ is_active: "INACTIVE" });
        res.status(200).json({ message: "Recurso marcado como inactivo" });
      } else {
        res.status(404).json({ error: "Recurso no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al marcar el recurso como inactivo" });
    }
  }
}