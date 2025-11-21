import { Request, Response } from 'express';
import { Role, RoleI } from '../../models/authorization/Role';

export class RoleController {
  // Obtener todos los roles
  public async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles: RoleI[] = await Role.findAll();
      res.status(200).json({ roles });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los roles' });
    }
  }

  // Obtener un rol por ID
  public async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = await Role.findOne({ where: { id, is_active: "ACTIVE" } });
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ error: 'Rol no encontrado o inactivo' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el rol' });
    }
  }

  // Crear un nuevo rol
  public async createRole(req: Request, res: Response): Promise<void> {
    const { name, is_active } = req.body;
    try {
      const newRole = await Role.create({ name, is_active });
      res.status(201).json(newRole);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar un rol
  public async updateRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, is_active } = req.body;
    try {
      const role = await Role.findOne({ where: { id, is_active: "ACTIVE" } });
      if (role) {
        await role.update({ name, is_active });
        res.status(200).json(role);
      } else {
        res.status(404).json({ error: 'Rol no encontrado o inactivo' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un rol físicamente
  public async deleteRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const role = await Role.findByPk(id);
      if (role) {
        await role.destroy();
        res.status(200).json({ message: 'Rol eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Rol no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el rol' });
    }
  }

  // Eliminar un rol lógicamente
  public async deleteRoleAdv(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const role = await Role.findOne({ where: { id, is_active: "ACTIVE" } });
      if (role) {
        await role.update({ is_active: "INACTIVE" });
        res.status(200).json({ message: 'Rol marcado como inactivo' });
      } else {
        res.status(404).json({ error: 'Rol no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al marcar el rol como inactivo' });
    }
  }
}