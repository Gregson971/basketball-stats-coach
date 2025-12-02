import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { IGameStatsRepository } from '../../domain/repositories/GameStatsRepository';
import { IGameRepository } from '../../domain/repositories/GameRepository';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequiredFields, validateParam } from '../middleware/validateRequest';

export const createStatsRoutes = (
  gameStatsRepository: IGameStatsRepository,
  gameRepository: IGameRepository
): Router => {
  const router = Router();
  const controller = new StatsController(gameStatsRepository, gameRepository);

  /**
   * @swagger
   * /api/stats/games/{gameId}/actions:
   *   post:
   *     tags:
   *       - Stats
   *     summary: Enregistrer une action de jeu
   *     description: Enregistre une action de jeu pour un joueur (panier, rebond, passe, etc.). Le userId est automatiquement extrait du token JWT et le match doit appartenir à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: gameId
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
   *             required:
   *               - playerId
   *               - actionType
   *             properties:
   *               playerId:
   *                 type: string
   *                 example: player-123
   *               actionType:
   *                 type: string
   *                 enum: [freeThrow, twoPoint, threePoint, offensiveRebound, defensiveRebound, assist, steal, block, turnover, foul]
   *                 example: twoPoint
   *               made:
   *                 type: boolean
   *                 description: Si l'action est un tir, indique si le tir est réussi (requis pour freeThrow, twoPoint, threePoint)
   *                 example: true
   *     responses:
   *       201:
   *         description: Action enregistrée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 gameStats:
   *                   $ref: '#/components/schemas/GameStats'
   *       400:
   *         description: Erreur de validation ou match non en cours
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post(
    '/games/:gameId/actions',
    validateParam('gameId'),
    validateRequiredFields(['playerId', 'actionType']),
    asyncHandler(controller.recordAction.bind(controller))
  );

  /**
   * @swagger
   * /api/stats/games/{gameId}/actions/{playerId}:
   *   delete:
   *     tags:
   *       - Stats
   *     summary: Annuler la dernière action d'un joueur
   *     description: Annule la dernière action enregistrée pour un joueur dans un match. Fonctionne uniquement si les statistiques appartiennent à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: gameId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du match
   *       - in: path
   *         name: playerId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du joueur
   *     responses:
   *       200:
   *         description: Action annulée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 gameStats:
   *                   $ref: '#/components/schemas/GameStats'
   *       400:
   *         description: Erreur - statistiques non trouvées ou aucune action à annuler
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete(
    '/games/:gameId/actions/:playerId',
    validateParam('gameId'),
    validateParam('playerId'),
    asyncHandler(controller.undoAction.bind(controller))
  );

  /**
   * @swagger
   * /api/stats/games/{gameId}/players/{playerId}:
   *   get:
   *     tags:
   *       - Stats
   *     summary: Obtenir les statistiques d'un joueur pour un match
   *     description: Récupère toutes les statistiques d'un joueur pour un match spécifique. Retourne uniquement si les statistiques appartiennent à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: gameId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du match
   *       - in: path
   *         name: playerId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du joueur
   *     responses:
   *       200:
   *         description: Statistiques du joueur pour le match
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 gameStats:
   *                   $ref: '#/components/schemas/GameStats'
   *       404:
   *         description: Statistiques non trouvées
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get(
    '/games/:gameId/players/:playerId',
    validateParam('gameId'),
    validateParam('playerId'),
    asyncHandler(controller.getGameStats.bind(controller))
  );

  /**
   * @swagger
   * /api/stats/players/{playerId}/career:
   *   get:
   *     tags:
   *       - Stats
   *     summary: Obtenir les statistiques de carrière d'un joueur
   *     description: Récupère les statistiques agrégées de tous les matchs d'un joueur. Retourne uniquement les statistiques appartenant à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: playerId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du joueur
   *     responses:
   *       200:
   *         description: Statistiques de carrière du joueur
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 stats:
   *                   $ref: '#/components/schemas/CareerStats'
   *       400:
   *         description: Erreur de requête
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get(
    '/players/:playerId/career',
    validateParam('playerId'),
    asyncHandler(controller.getCareerStats.bind(controller))
  );

  return router;
};
