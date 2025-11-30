import { Router } from 'express';
import { IPlayerRepository } from '../../domain/repositories/PlayerRepository';
import { ITeamRepository } from '../../domain/repositories/TeamRepository';
import { IGameRepository } from '../../domain/repositories/GameRepository';
import { IGameStatsRepository } from '../../domain/repositories/GameStatsRepository';
import { createPlayerRoutes } from './playerRoutes';
import { createTeamRoutes } from './teamRoutes';
import { createGameRoutes } from './gameRoutes';
import { createStatsRoutes } from './statsRoutes';

export interface RepositoryDependencies {
  playerRepository: IPlayerRepository;
  teamRepository: ITeamRepository;
  gameRepository: IGameRepository;
  gameStatsRepository: IGameStatsRepository;
}

export const createApiRoutes = (repositories: RepositoryDependencies): Router => {
  const router = Router();

  router.use('/players', createPlayerRoutes(repositories.playerRepository));
  router.use('/teams', createTeamRoutes(repositories.teamRepository));
  router.use('/games', createGameRoutes(repositories.gameRepository));
  router.use(
    '/stats',
    createStatsRoutes(repositories.gameStatsRepository, repositories.gameRepository)
  );

  return router;
};
