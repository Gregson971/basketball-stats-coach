import { Router } from 'express';
import { IPlayerRepository } from '../../domain/repositories/PlayerRepository';
import { ITeamRepository } from '../../domain/repositories/TeamRepository';
import { IGameRepository } from '../../domain/repositories/GameRepository';
import { IGameStatsRepository } from '../../domain/repositories/GameStatsRepository';
import { ISubstitutionRepository } from '../../domain/repositories/SubstitutionRepository';
import { IUserRepository } from '../../domain/repositories/UserRepository';
import { createPlayerRoutes } from './playerRoutes';
import { createTeamRoutes } from './teamRoutes';
import { createGameRoutes } from './gameRoutes';
import { createStatsRoutes } from './statsRoutes';
import { createAuthRoutes } from './authRoutes';
import { authMiddleware } from '../middleware/authMiddleware';

export interface RepositoryDependencies {
  playerRepository: IPlayerRepository;
  teamRepository: ITeamRepository;
  gameRepository: IGameRepository;
  gameStatsRepository: IGameStatsRepository;
  substitutionRepository: ISubstitutionRepository;
  userRepository: IUserRepository;
}

export interface CreateApiRoutesOptions {
  disableAuth?: boolean;
}

export const createApiRoutes = (
  repositories: RepositoryDependencies,
  options: CreateApiRoutesOptions = {}
): Router => {
  const router = Router();

  // Authentication routes (public)
  router.use('/auth', createAuthRoutes(repositories.userRepository));

  // Protected routes - require authentication (unless disabled for tests)
  const middleware = options.disableAuth ? [] : [authMiddleware];

  router.use('/players', ...middleware, createPlayerRoutes(repositories.playerRepository));
  router.use('/teams', ...middleware, createTeamRoutes(repositories.teamRepository));
  router.use(
    '/games',
    ...middleware,
    createGameRoutes(
      repositories.gameRepository,
      repositories.playerRepository,
      repositories.substitutionRepository
    )
  );
  router.use(
    '/stats',
    ...middleware,
    createStatsRoutes(repositories.gameStatsRepository, repositories.gameRepository)
  );

  return router;
};
