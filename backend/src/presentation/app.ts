import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { createApiRoutes, RepositoryDependencies } from './routes';
import { swaggerSpec } from './swagger';

/**
 * Créer et configurer l'application Express
 */
export const createApp = (repositories?: RepositoryDependencies): Application => {
  const app = express();

  // Middleware de base
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * @swagger
   * /health:
   *   get:
   *     tags:
   *       - Health
   *     summary: Vérifier la santé de l'API
   *     description: Retourne le statut de l'API et un timestamp
   *     responses:
   *       200:
   *         description: L'API fonctionne correctement
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: StatCoach Pro API is running
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   */
  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'StatCoach Pro API is running',
      timestamp: new Date().toISOString()
    });
  });

  // Documentation Swagger/OpenAPI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes API
  if (repositories) {
    app.use('/api', createApiRoutes(repositories));
  }

  // Gestion des erreurs
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
