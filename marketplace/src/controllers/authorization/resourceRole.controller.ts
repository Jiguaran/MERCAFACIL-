import { Request, Response } from "express";
import { ResourceRole, ResourceRoleI } from "../../models/authorization/ResourceRole";

export class ResourceRoleController {
  // Obtener todos los ResourceRoles
  public async getAllResourceRoles(req: Request, res: Response): Promise<void> {
    try {
      const resourceRoles: ResourceRoleI[] = await ResourceRole.findAll({
        where: { is_active: "ACTIVE" },
      });
      res.status(200).json({ resourceRoles });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los ResourceRoles" });
    }
  }

  // Obtener un ResourceRole por ID
  public async getResourceRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resourceRole = await ResourceRole.findOne({
        where: { id, is_active: "ACTIVE" },
      });
      if (resourceRole) {
        res.status(200).json(resourceRole);
      } else {
        res.status(404).json({ error: "ResourceRole no encontrado o inactivo" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el ResourceRole" });
    }
  }

  // Crear un nuevo ResourceRole
  public async createResourceRole(req: Request, res: Response): Promise<void> {
    const { resource_id, role_id, is_active } = req.body;
    try {
      const newResourceRole = await ResourceRole.create({ resource_id, role_id, is_active });
      res.status(201).json(newResourceRole);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar un ResourceRole
  public async updateResourceRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { resource_id, role_id, is_active } = req.body;
    try {
      const resourceRole = await ResourceRole.findOne({ where: { id, is_active: "ACTIVE" } });
      if (resourceRole) {
        await resourceRole.update({ resource_id, role_id, is_active });
        res.status(200).json(resourceRole);
      } else {
        res.status(404).json({ error: "ResourceRole no encontrado o inactivo" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un ResourceRole físicamente
  public async deleteResourceRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const resourceRole = await ResourceRole.findByPk(id);
      if (resourceRole) {
        await resourceRole.destroy();
        res.status(200).json({ message: "ResourceRole eliminado correctamente" });
      } else {
        res.status(404).json({ error: "ResourceRole no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el ResourceRole" });
    }
  }

  // Eliminar un ResourceRole lógicamente
  public async deleteResourceRoleAdv(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const resourceRole = await ResourceRole.findOne({ where: { id, is_active: "ACTIVE" } });
      if (resourceRole) {
        await resourceRole.update({ is_active: "INACTIVE" });
        res.status(200).json({ message: "ResourceRole marcado como inactivo" });
      } else {
        res.status(404).json({ error: "ResourceRole no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al marcar el ResourceRole como inactivo" });
    }
  }
}