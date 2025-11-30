import { Router } from 'express';
import { PlayerController } from '../controllers/PlayerController';
import { IPlayerRepository } from '../../domain/repositories/PlayerRepository';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequiredFields, validateParam } from '../middleware/validateRequest';

export const createPlayerRoutes = (playerRepository: IPlayerRepository): Router => {
  const router = Router();
  const controller = new PlayerController(playerRepository);

  /**
   * @swagger
   * /api/players:
   *   post:
   *     tags:
   *       - Players
   *     summary: Créer un nouveau joueur
   *     description: Ajoute un nouveau joueur dans la base de données
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - teamId
   *             properties:
   *               firstName:
   *                 type: string
   *                 example: Michael
   *               lastName:
   *                 type: string
   *                 example: Jordan
   *               teamId:
   *                 type: string
   *                 example: team-123
   *               nickname:
   *                 type: string
   *                 example: MJ
   *               position:
   *                 type: string
   *                 enum: [Guard, Forward, Center]
   *                 example: Guard
   *               height:
   *                 type: number
   *                 example: 198
   *               weight:
   *                 type: number
   *                 example: 98
   *               age:
   *                 type: number
   *                 example: 23
   *               gender:
   *                 type: string
   *                 enum: [M, F]
   *                 example: M
   *               grade:
   *                 type: string
   *                 example: Senior
   *     responses:
   *       201:
   *         description: Joueur créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 player:
   *                   $ref: '#/components/schemas/Player'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post(
    '/',
    validateRequiredFields(['firstName', 'lastName', 'teamId']),
    asyncHandler(controller.create.bind(controller))
  );

  /**
   * @swagger
   * /api/players/{id}:
   *   get:
   *     tags:
   *       - Players
   *     summary: Obtenir un joueur par ID
   *     description: Récupère les informations d'un joueur spécifique
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du joueur
   *     responses:
   *       200:
   *         description: Joueur trouvé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 player:
   *                   $ref: '#/components/schemas/Player'
   *       404:
   *         description: Joueur non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id', validateParam('id'), asyncHandler(controller.getById.bind(controller)));

  /**
   * @swagger
   * /api/players/{id}:
   *   put:
   *     tags:
   *       - Players
   *     summary: Mettre à jour un joueur
   *     description: Modifie les informations d'un joueur existant
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du joueur
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               nickname:
   *                 type: string
   *               position:
   *                 type: string
   *                 enum: [Guard, Forward, Center]
   *               height:
   *                 type: number
   *               weight:
   *                 type: number
   *               age:
   *                 type: number
   *               gender:
   *                 type: string
   *                 enum: [M, F]
   *               grade:
   *                 type: string
   *     responses:
   *       200:
   *         description: Joueur mis à jour
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 player:
   *                   $ref: '#/components/schemas/Player'
   *       404:
   *         description: Joueur non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put('/:id', validateParam('id'), asyncHandler(controller.update.bind(controller)));

  /**
   * @swagger
   * /api/players/{id}:
   *   delete:
   *     tags:
   *       - Players
   *     summary: Supprimer un joueur
   *     description: Supprime un joueur de la base de données
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du joueur
   *     responses:
   *       200:
   *         description: Joueur supprimé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       404:
   *         description: Joueur non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', validateParam('id'), asyncHandler(controller.delete.bind(controller)));

  /**
   * @swagger
   * /api/players/team/{teamId}:
   *   get:
   *     tags:
   *       - Players
   *     summary: Obtenir tous les joueurs d'une équipe
   *     description: Récupère la liste de tous les joueurs appartenant à une équipe spécifique
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'équipe
   *     responses:
   *       200:
   *         description: Liste des joueurs de l'équipe
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 players:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Player'
   *       400:
   *         description: Erreur de requête
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get(
    '/team/:teamId',
    validateParam('teamId'),
    asyncHandler(controller.getByTeam.bind(controller))
  );

  /**
   * @swagger
   * /api/players:
   *   get:
   *     tags:
   *       - Players
   *     summary: Obtenir tous les joueurs
   *     description: Récupère la liste complète de tous les joueurs
   *     responses:
   *       200:
   *         description: Liste de tous les joueurs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 players:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Player'
   *       500:
   *         description: Erreur serveur
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', asyncHandler(controller.getAll.bind(controller)));

  return router;
};
