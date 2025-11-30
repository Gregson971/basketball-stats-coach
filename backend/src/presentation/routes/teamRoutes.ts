import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { ITeamRepository } from '../../domain/repositories/TeamRepository';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequiredFields, validateParam } from '../middleware/validateRequest';

export const createTeamRoutes = (teamRepository: ITeamRepository): Router => {
  const router = Router();
  const controller = new TeamController(teamRepository);

  /**
   * @swagger
   * /api/teams:
   *   post:
   *     tags:
   *       - Teams
   *     summary: Créer une nouvelle équipe
   *     description: Ajoute une nouvelle équipe dans la base de données
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 example: Chicago Bulls
   *               coach:
   *                 type: string
   *                 example: Phil Jackson
   *               season:
   *                 type: string
   *                 example: 2024-2025
   *               league:
   *                 type: string
   *                 example: NBA
   *     responses:
   *       201:
   *         description: Équipe créée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 team:
   *                   $ref: '#/components/schemas/Team'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post(
    '/',
    validateRequiredFields(['name']),
    asyncHandler(controller.create.bind(controller))
  );

  /**
   * @swagger
   * /api/teams/{id}:
   *   get:
   *     tags:
   *       - Teams
   *     summary: Obtenir une équipe par ID
   *     description: Récupère les informations d'une équipe spécifique
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'équipe
   *     responses:
   *       200:
   *         description: Équipe trouvée
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 team:
   *                   $ref: '#/components/schemas/Team'
   *       404:
   *         description: Équipe non trouvée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id', validateParam('id'), asyncHandler(controller.getById.bind(controller)));

  /**
   * @swagger
   * /api/teams/{id}:
   *   put:
   *     tags:
   *       - Teams
   *     summary: Mettre à jour une équipe
   *     description: Modifie les informations d'une équipe existante
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'équipe
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               coach:
   *                 type: string
   *               season:
   *                 type: string
   *               league:
   *                 type: string
   *     responses:
   *       200:
   *         description: Équipe mise à jour
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 team:
   *                   $ref: '#/components/schemas/Team'
   *       404:
   *         description: Équipe non trouvée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put('/:id', validateParam('id'), asyncHandler(controller.update.bind(controller)));

  /**
   * @swagger
   * /api/teams/{id}:
   *   delete:
   *     tags:
   *       - Teams
   *     summary: Supprimer une équipe
   *     description: Supprime une équipe de la base de données
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'équipe
   *     responses:
   *       200:
   *         description: Équipe supprimée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       404:
   *         description: Équipe non trouvée
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', validateParam('id'), asyncHandler(controller.delete.bind(controller)));

  /**
   * @swagger
   * /api/teams:
   *   get:
   *     tags:
   *       - Teams
   *     summary: Obtenir toutes les équipes
   *     description: Récupère la liste complète de toutes les équipes
   *     responses:
   *       200:
   *         description: Liste de toutes les équipes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 teams:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Team'
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
