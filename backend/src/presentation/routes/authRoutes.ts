import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { IUserRepository } from '../../domain/repositories/UserRepository';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequiredFields } from '../middleware/validateRequest';

export const createAuthRoutes = (userRepository: IUserRepository): Router => {
  const router = Router();
  const controller = new AuthController(userRepository);

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Créer un nouveau compte utilisateur
   *     description: Enregistre un nouvel utilisateur et retourne un token JWT
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - name
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: password123
   *               name:
   *                 type: string
   *                 example: John Doe
   *     responses:
   *       201:
   *         description: Utilisateur créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                     name:
   *                       type: string
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                 token:
   *                   type: string
   *                   description: JWT token
   *       400:
   *         description: Erreur de validation ou email déjà existant
   */
  router.post(
    '/register',
    validateRequiredFields(['email', 'password', 'name']),
    asyncHandler(controller.registerUser.bind(controller))
  );

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Se connecter
   *     description: Authentifie un utilisateur et retourne un token JWT
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: Connexion réussie
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                     name:
   *                       type: string
   *                 token:
   *                   type: string
   *                   description: JWT token
   *       401:
   *         description: Email ou mot de passe invalide
   */
  router.post(
    '/login',
    validateRequiredFields(['email', 'password']),
    asyncHandler(controller.loginUser.bind(controller))
  );

  return router;
};
