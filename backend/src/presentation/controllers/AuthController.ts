import { Request, Response } from 'express';
import { Register } from '../../application/use-cases/auth/Register';
import { Login } from '../../application/use-cases/auth/Login';
import { IUserRepository } from '../../domain/repositories/UserRepository';

export class AuthController {
  private register: Register;
  private login: Login;

  constructor(userRepository: IUserRepository) {
    this.register = new Register(userRepository);
    this.login = new Login(userRepository);
  }

  /**
   * POST /api/auth/register
   */
  async registerUser(req: Request, res: Response): Promise<void> {
    const result = await this.register.execute(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.error,
      });
      return;
    }

    res.status(201).json({
      success: true,
      user: result.user,
      token: result.token,
    });
  }

  /**
   * POST /api/auth/login
   */
  async loginUser(req: Request, res: Response): Promise<void> {
    const result = await this.login.execute(req.body);

    if (!result.success) {
      res.status(401).json({
        success: false,
        error: result.error,
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: result.user,
      token: result.token,
    });
  }
}
