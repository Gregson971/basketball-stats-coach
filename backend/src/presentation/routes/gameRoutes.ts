import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { IGameRepository } from '../../domain/repositories/GameRepository';
import { IPlayerRepository } from '../../domain/repositories/PlayerRepository';
import { ISubstitutionRepository } from '../../domain/repositories/SubstitutionRepository';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequiredFields, validateParam } from '../middleware/validateRequest';

export const createGameRoutes = (
  gameRepository: IGameRepository,
  playerRepository: IPlayerRepository,
  substitutionRepository: ISubstitutionRepository
): Router => {
  const router = Router();
  const controller = new GameController(gameRepository, playerRepository, substitutionRepository);

  /**
   * @swagger
   * /api/games:
   *   post:
   *     tags:
   *       - Games
   *     summary: Créer un nouveau match
   *     description: Ajoute un nouveau match dans la base de données. Le userId est automatiquement extrait du token JWT.
   *     security:
   *       - bearerAuth: []
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
  router.post(
    '/',
    validateRequiredFields(['teamId', 'opponent']),
    asyncHandler(controller.create.bind(controller))
  );

  /**
   * @swagger
   * /api/games/{id}:
   *   get:
   *     tags:
   *       - Games
   *     summary: Obtenir un match par ID
   *     description: Récupère les informations d'un match spécifique. Retourne uniquement si le match appartient à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
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
   *     description: Modifie les informations d'un match existant. Fonctionne uniquement si le match appartient à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
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
   *     description: Supprime un match de la base de données. Fonctionne uniquement si le match appartient à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
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
   *     description: Récupère la liste de tous les matchs d'une équipe spécifique de l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
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
  router.get(
    '/team/:teamId',
    validateParam('teamId'),
    asyncHandler(controller.getByTeam.bind(controller))
  );

  /**
   * @swagger
   * /api/games/status/{status}:
   *   get:
   *     tags:
   *       - Games
   *     summary: Obtenir tous les matchs par statut
   *     description: Récupère la liste de tous les matchs avec un statut spécifique pour l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
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
  router.get(
    '/status/:status',
    validateParam('status'),
    asyncHandler(controller.getByStatus.bind(controller))
  );

  /**
   * @swagger
   * /api/games/{id}/start:
   *   post:
   *     tags:
   *       - Games
   *     summary: Démarrer un match
   *     description: Change le statut du match à "in_progress" et enregistre l'heure de début. Fonctionne uniquement si le match appartient à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
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
   *     description: Change le statut du match à "completed" et enregistre l'heure de fin. Fonctionne uniquement si le match appartient à l'utilisateur authentifié.
   *     security:
   *       - bearerAuth: []
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
  router.post(
    '/:id/complete',
    validateParam('id'),
    asyncHandler(controller.complete.bind(controller))
  );

  /**
   * @swagger
   * /api/games/{id}/roster:
   *   put:
   *     tags:
   *       - Games
   *     summary: Définir le roster du match
   *     description: Définit la liste des joueurs convoqués pour le match (entre 5 et 15 joueurs). Le match doit être dans le statut "not_started".
   *     security:
   *       - bearerAuth: []
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
   *             required:
   *               - playerIds
   *             properties:
   *               playerIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                 minItems: 5
   *                 maxItems: 15
   *                 description: Liste des identifiants des joueurs convoqués
   *                 example: ["player-1", "player-2", "player-3", "player-4", "player-5"]
   *     responses:
   *       200:
   *         description: Roster défini avec succès
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
   *         description: Erreur de validation ou match déjà démarré
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put(
    '/:id/roster',
    validateParam('id'),
    validateRequiredFields(['playerIds']),
    asyncHandler(controller.setRoster.bind(controller))
  );

  /**
   * @swagger
   * /api/games/{id}/starting-lineup:
   *   put:
   *     tags:
   *       - Games
   *     summary: Définir la composition de départ
   *     description: Définit les 5 joueurs qui démarreront le match. Le roster doit être défini au préalable et le match doit être dans le statut "not_started".
   *     security:
   *       - bearerAuth: []
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
   *             required:
   *               - playerIds
   *             properties:
   *               playerIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                 minItems: 5
   *                 maxItems: 5
   *                 description: Liste exacte de 5 joueurs du roster
   *                 example: ["player-1", "player-2", "player-3", "player-4", "player-5"]
   *     responses:
   *       200:
   *         description: Composition de départ définie avec succès
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
   *         description: Erreur de validation ou match déjà démarré
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put(
    '/:id/starting-lineup',
    validateParam('id'),
    validateRequiredFields(['playerIds']),
    asyncHandler(controller.setLineup.bind(controller))
  );

  /**
   * @swagger
   * /api/games/{id}/next-quarter:
   *   post:
   *     tags:
   *       - Games
   *     summary: Passer au quart-temps suivant
   *     description: Incrémente le quart-temps en cours (de 1 à 4). Le match doit être en cours ("in_progress").
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du match
   *     responses:
   *       200:
   *         description: Quart-temps incrémenté avec succès
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
   *         description: Erreur - match non en cours ou déjà au 4ème quart-temps
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post(
    '/:id/next-quarter',
    validateParam('id'),
    asyncHandler(controller.nextQuarterHandler.bind(controller))
  );

  /**
   * @swagger
   * /api/games/{id}/substitution:
   *   post:
   *     tags:
   *       - Games
   *     summary: Effectuer un changement de joueur
   *     description: Remplace un joueur sur le terrain par un joueur du banc. Le match doit être en cours. Le joueur sortant doit être sur le terrain et le joueur entrant doit être dans le roster mais pas sur le terrain.
   *     security:
   *       - bearerAuth: []
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
   *             required:
   *               - playerOut
   *               - playerIn
   *             properties:
   *               playerOut:
   *                 type: string
   *                 description: ID du joueur qui sort du terrain
   *                 example: player-3
   *               playerIn:
   *                 type: string
   *                 description: ID du joueur qui entre sur le terrain
   *                 example: player-6
   *     responses:
   *       200:
   *         description: Substitution effectuée avec succès
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
   *                 substitution:
   *                   $ref: '#/components/schemas/Substitution'
   *       400:
   *         description: Erreur - match non en cours, joueur déjà sur le terrain, etc.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post(
    '/:id/substitution',
    validateParam('id'),
    validateRequiredFields(['playerOut', 'playerIn']),
    asyncHandler(controller.substitution.bind(controller))
  );

  return router;
};
