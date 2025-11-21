import { Request, Response } from 'express';
import { RefreshToken, RefreshTokenI } from '../../models/authorization/RefreshToken';

export class RefreshTokenController {
  public async getAllRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const referes_tokens: RefreshTokenI[] = await RefreshToken.findAll();
      res.status(200).json({ referes_tokens });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los los refresh token' });
    }
  }
}