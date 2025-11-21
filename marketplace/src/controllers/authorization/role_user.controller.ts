import { Request, Response } from 'express';
import { RoleUser, RoleUserI } from '../../models/authorization/RoleUser';

export class RoleUserController {
  // Obtener todos los RoleUsers
  public async getAllRoleUsers(req: Request, res: Response): Promise<void> {
    try {
      const roleUsers: RoleUserI[] = await RoleUser.findAll();
      res.status(200).json({ roleUsers });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios de roles' });
    }
  }

  // Obtener un RoleUser por ID
  public async getRoleUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleUser = await RoleUser.findOne({ where: { id, is_active: "ACTIVE" } });
      if (roleUser) {
        res.status(200).json(roleUser);
      } else {
        res.status(404).json({ error: 'RoleUser no encontrado o inactivo' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el RoleUser' });
    }
  }

  // Crear un nuevo RoleUser
  public async createRoleUser(req: Request, res: Response): Promise<void> {
    const { role_id, user_id, is_active } = req.body;
    try {
      const newRoleUser = await RoleUser.create({ role_id, user_id, is_active });
      res.status(201).json(newRoleUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar un RoleUser
  public async updateRoleUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { role_id, user_id, is_active } = req.body;
    try {
      const roleUser = await RoleUser.findOne({ where: { id, is_active: "ACTIVE" } });
      if (roleUser) {
        await roleUser.update({ role_id, user_id, is_active });
        res.status(200).json(roleUser);
      } else {
        res.status(404).json({ error: 'RoleUser no encontrado o inactivo' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un RoleUser físicamente
  public async deleteRoleUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const roleUser = await RoleUser.findByPk(id);
      if (roleUser) {
        await roleUser.destroy();
        res.status(200).json({ message: 'RoleUser eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'RoleUser no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el RoleUser' });
    }
  }

  // Eliminar un RoleUser lógicamente
  public async deleteRoleUserAdv(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const roleUser = await RoleUser.findOne({ where: { id, is_active: "ACTIVE" } });
      if (roleUser) {
        await roleUser.update({ is_active: "INACTIVE" });
        res.status(200).json({ message: 'RoleUser marcado como inactivo' });
      } else {
        res.status(404).json({ error: 'RoleUser no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al marcar el RoleUser como inactivo' });
    }
  }
}