import { Request, Response } from 'express';
import { User, UserI } from '../../models/authorization/User';

export class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users: UserI[] = await User.findAll();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }
}