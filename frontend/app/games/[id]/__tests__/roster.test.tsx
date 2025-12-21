/**
 * Unit tests for SetRosterScreen
 */

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SetRosterScreen from '../roster';
import { gameService, playerService } from '@/services';
import type { Game, Player } from '@/types';

// Mock services
jest.mock('@/services');
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'game-1' }),
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
  }),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('SetRosterScreen', () => {
  const mockGame: Game = {
    id: 'game-1',
    teamId: 'team-1',
    opponent: 'Test Opponent',
    status: 'not_started',
    roster: [],
    startingLineup: [],
    currentLineup: [],
    currentQuarter: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPlayers: Player[] = [
    {
      id: 'player-1',
      firstName: 'John',
      lastName: 'Doe',
      teamId: 'team-1',
      position: 'Guard',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'player-2',
      firstName: 'Jane',
      lastName: 'Smith',
      teamId: 'team-1',
      position: 'Forward',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'player-3',
      firstName: 'Bob',
      lastName: 'Johnson',
      teamId: 'team-1',
      position: 'Center',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'player-4',
      firstName: 'Alice',
      lastName: 'Williams',
      teamId: 'team-1',
      position: 'Guard',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'player-5',
      firstName: 'Charlie',
      lastName: 'Brown',
      teamId: 'team-1',
      position: 'Forward',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockGameService = gameService as jest.Mocked<typeof gameService>;
  const mockPlayerService = playerService as jest.Mocked<typeof playerService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading screen while fetching data', () => {
      mockGameService.getById.mockReturnValue(new Promise(() => {}));
      mockPlayerService.getByTeam.mockReturnValue(new Promise(() => {}));

      const { getByText } = render(<SetRosterScreen />);

      expect(getByText('Chargement...')).toBeTruthy();
    });
  });

  describe('Error states', () => {
    it('should show error when game is not found', async () => {
      mockGameService.getById.mockResolvedValue({ success: false });

      const { getByText } = render(<SetRosterScreen />);

      await waitFor(() => {
        expect(getByText('Match introuvable')).toBeTruthy();
      });
    });

    it('should show error when game has already started', async () => {
      const startedGame = { ...mockGame, status: 'in_progress' as const };
      mockGameService.getById.mockResolvedValue({ success: true, data: startedGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });

      const { getByText } = render(<SetRosterScreen />);

      await waitFor(() => {
        expect(getByText('Modification impossible')).toBeTruthy();
        expect(
          getByText('Le roster ne peut être modifié que pour les matchs non démarrés')
        ).toBeTruthy();
      });
    });

    it('should show error when no players exist', async () => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: [] });

      const { getByText } = render(<SetRosterScreen />);

      await waitFor(() => {
        expect(getByText('Aucun joueur')).toBeTruthy();
      });
    });
  });

  describe('Player selection', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should display all team players', async () => {
      const { getByText } = render(<SetRosterScreen />);

      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('Jane Smith')).toBeTruthy();
        expect(getByText('Bob Johnson')).toBeTruthy();
      });
    });

    it('should toggle player selection on press', async () => {
      const { getByText } = render(<SetRosterScreen />);

      await waitFor(() => {
        const playerButton = getByText('John Doe');
        fireEvent.press(playerButton);
      });

      // Player should be selected (count should be 1/15)
      await waitFor(() => {
        expect(getByText('1 / 15 joueurs sélectionnés')).toBeTruthy();
      });
    });

    it('should prevent selecting more than 15 players', async () => {
      const manyPlayers = Array.from({ length: 20 }, (_, i) => ({
        ...mockPlayers[0],
        id: `player-${i}`,
        firstName: `Player${i}`,
      }));
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: manyPlayers });

      const { getByText } = render(<SetRosterScreen />);

      // Select 15 players
      await waitFor(() => {
        for (let i = 0; i < 15; i++) {
          fireEvent.press(getByText(`Player${i} Doe`));
        }
      });

      // Try to select 16th player
      await waitFor(() => {
        fireEvent.press(getByText('Player15 Doe'));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Maximum atteint',
          'Vous ne pouvez sélectionner que 15 joueurs maximum'
        );
      });
    });

    it('should preselect players if roster already defined', async () => {
      const gameWithRoster = {
        ...mockGame,
        roster: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
      };
      mockGameService.getById.mockResolvedValue({ success: true, data: gameWithRoster });

      const { getByText } = render(<SetRosterScreen />);

      await waitFor(() => {
        expect(getByText('5 / 15 joueurs sélectionnés')).toBeTruthy();
      });
    });
  });

  describe('Saving roster', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should not save roster with less than 5 players', async () => {
      const { getByText } = render(<SetRosterScreen />);

      // Select only 3 players
      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
        fireEvent.press(getByText('Jane Smith'));
        fireEvent.press(getByText('Bob Johnson'));
      });

      // Try to save (button should be disabled, so onPress won't fire)
      await waitFor(() => {
        fireEvent.press(getByText('Enregistrer le roster'));
      });

      // Verify that setRoster was not called because button is disabled
      await waitFor(() => {
        expect(mockGameService.setRoster).not.toHaveBeenCalled();
      });
    });

    it('should successfully save roster with 5-15 players', async () => {
      mockGameService.setRoster.mockResolvedValue({ success: true, data: mockGame });

      const { getByText } = render(<SetRosterScreen />);

      // Select 5 players
      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
        fireEvent.press(getByText('Jane Smith'));
        fireEvent.press(getByText('Bob Johnson'));
        fireEvent.press(getByText('Alice Williams'));
        fireEvent.press(getByText('Charlie Brown'));
      });

      // Save
      await waitFor(() => {
        fireEvent.press(getByText('Enregistrer le roster'));
      });

      await waitFor(() => {
        expect(mockGameService.setRoster).toHaveBeenCalledWith('game-1', [
          'player-1',
          'player-2',
          'player-3',
          'player-4',
          'player-5',
        ]);
        expect(Alert.alert).toHaveBeenCalledWith('Succès', 'Roster défini avec succès', [
          {
            text: 'OK',
            onPress: expect.any(Function),
          },
        ]);
      });
    });

    it('should show error when save fails', async () => {
      mockGameService.setRoster.mockResolvedValue({
        success: false,
        error: 'Server error',
      });

      const { getByText } = render(<SetRosterScreen />);

      // Select 5 players
      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
        fireEvent.press(getByText('Jane Smith'));
        fireEvent.press(getByText('Bob Johnson'));
        fireEvent.press(getByText('Alice Williams'));
        fireEvent.press(getByText('Charlie Brown'));
      });

      // Save
      await waitFor(() => {
        fireEvent.press(getByText('Enregistrer le roster'));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'Server error');
      });
    });
  });
});
