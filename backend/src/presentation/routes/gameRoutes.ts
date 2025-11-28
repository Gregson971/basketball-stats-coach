import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { IGameRepository } from '../../domain/repositories/GameRepository';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequiredFields, validateParam } from '../middleware/validateRequest';

export const createGameRoutes = (gameRepository: IGameRepository): Router => {
  const router = Router();
  const controller = new GameController(gameRepository);

  /**
   * @swagger
   * /api/games:
   *   post:
   *     tags:
   *       - Games
   *     summary: Créer un nouveau match
   *     description: Ajoute un nouveau match dans la base de données
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - teamId
   *               - opponent
   *             properties:
   *               teamId:
   *                 type: string
   *                 example: team-123
   *               opponent:
   *                 type: string
   *                 example: Los Angeles Lakers
   *               gameDate:
   *                 type: string
   *                 format: date-time
   *                 example: 2024-12-25T19:00:00Z
   *               location:
   *                 type: string
   *                 example: Staples Center
   *               notes:
   *                 type: string
   *                 example: Match important pour les playoffs
   *     responses:
   *       201:
   *         description: Match créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 game:
   *                   $ref: '#/components/schemas/Game'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/', validateRequiredFields(['teamId', 'opponent']), asyncHandler(controller.create.bind(controller)));

  /**
   * @swagger
   * /api/games/{id}:
   *   get:
   *     tags:
   *       - Games
   *     summary: Obtenir un match par ID
   *     description: Récupère les informations d'un match spécifique
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du match
   *     responses:
   *       200:
   *         description: Match trouvé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 game:
   *                   $ref: '#/components/schemas/Game'
   *       404:
   *         description: Match non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id', validateParam('id'), asyncHandler(controller.getById.bind(controller)));

  /**
   * @swagger
   * /api/games/{id}:
   *   put:
   *     tags:
   *       - Games
   *     summary: Mettre à jour un match
   *     description: Modifie les informations d'un match existant
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du match
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               opponent:
   *                 type: string
   *               gameDate:
   *                 type: string
   *                 format: date-time
   *               location:
   *                 type: string
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Match mis à jour
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 game:
   *                   $ref: '#/components/schemas/Game'
   *       404:
   *         description: Match non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put('/:id', validateParam('id'), asyncHandler(controller.update.bind(controller)));

  /**
   * @swagger
   * /api/games/{id}:
   *   delete:
   *     tags:
   *       - Games
   *     summary: Supprimer un match
   *     description: Supprime un match de la base de données
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du match
   *     responses:
   *       200:
   *         description: Match supprimé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       404:
   *         description: Match non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', validateParam('id'), asyncHandler(controller.delete.bind(controller)));

  /**
   * @swagger
   * /api/games/team/{teamId}:
   *   get:
   *     tags:
   *       - Games
   *     summary: Obtenir tous les matchs d'une équipe
   *     description: Récupère la liste de tous les matchs d'une équipe spécifique
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'équipe
   *     responses:
   *       200:
   *         description: Liste des matchs de l'équipe
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 games:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Game'
   *       400:
   *         description: Erreur de requête
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/team/:teamId', validateParam('teamId'), asyncHandler(controller.getByTeam.bind(controller)));

  /**
   * @swagger
   * /api/games/status/{status}:
   *   get:
   *     tags:
   *       - Games
   *     summary: Obtenir tous les matchs par statut
   *     description: Récupère la liste de tous les matchs avec un statut spécifique
   *     parameters:
   *       - in: path
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [not_started, in_progress, completed]
   *         description: Statut du match
   *     responses:
   *       200:
   *         description: Liste des matchs avec le statut demandé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 games:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Game'
   *       400:
   *         description: Erreur de requête
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/status/:status', validateParam('status'), asyncHandler(controller.getByStatus.bind(controller)));

  /**
   * @swagger
   * /api/games/{id}/start:
   *   post:
   *     tags:
   *       - Games
   *     summary: Démarrer un match
   *     description: Change le statut du match à "in_progress" et enregistre l'heure de début
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du match
   *     responses:
   *       200:
   *         description: Match démarré avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 game:
   *                   $ref: '#/components/schemas/Game'
   *       400:
   *         description: Erreur - le match ne peut pas être démarré
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/:id/start', validateParam('id'), asyncHandler(controller.start.bind(controller)));

  /**
   * @swagger
   * /api/games/{id}/complete:
   *   post:
   *     tags:
   *       - Games
   *     summary: Terminer un match
   *     description: Change le statut du match à "completed" et enregistre l'heure de fin
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du match
   *     responses:
   *       200:
   *         description: Match terminé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 game:
   *                   $ref: '#/components/schemas/Game'
   *       400:
   *         description: Erreur - le match ne peut pas être terminé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/:id/complete', validateParam('id'), asyncHandler(controller.complete.bind(controller)));

  return router;
};
