/**
 * Unit tests for SetLineupScreen
 */

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SetLineupScreen from '../lineup';
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

describe('SetLineupScreen', () => {
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
    {
      id: 'player-6',
      firstName: 'David',
      lastName: 'Lee',
      teamId: 'team-1',
      position: 'Guard',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockGame: Game = {
    id: 'game-1',
    teamId: 'team-1',
    opponent: 'Test Opponent',
    status: 'not_started',
    roster: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5', 'player-6'],
    startingLineup: [],
    currentLineup: [],
    currentQuarter: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockGameService = gameService as jest.Mocked<typeof gameService>;
  const mockPlayerService = playerService as jest.Mocked<typeof playerService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading screen while fetching data', () => {
      mockGameService.getById.mockReturnValue(new Promise(() => {}));
      mockPlayerService.getByTeam.mockReturnValue(new Promise(() => {}));

      const { getByText } = render(<SetLineupScreen />);

      expect(getByText('Chargement...')).toBeTruthy();
    });
  });

  describe('Error states', () => {
    it('should show error when game is not found', async () => {
      mockGameService.getById.mockResolvedValue({ success: false });

      const { getByText } = render(<SetLineupScreen />);

      await waitFor(() => {
        expect(getByText('Match introuvable')).toBeTruthy();
      });
    });

    it('should show error when game has already started', async () => {
      const startedGame = { ...mockGame, status: 'in_progress' as const };
      mockGameService.getById.mockResolvedValue({ success: true, data: startedGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });

      const { getByText } = render(<SetLineupScreen />);

      await waitFor(() => {
        expect(getByText('Modification impossible')).toBeTruthy();
        expect(
          getByText(
            'La composition de départ ne peut être modifiée que pour les matchs non démarrés'
          )
        ).toBeTruthy();
      });
    });

    it('should show error when roster is not defined', async () => {
      const gameWithoutRoster = { ...mockGame, roster: [] };
      mockGameService.getById.mockResolvedValue({ success: true, data: gameWithoutRoster });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });

      const { getByText } = render(<SetLineupScreen />);

      await waitFor(() => {
        expect(getByText('Roster non défini')).toBeTruthy();
        expect(
          getByText("Vous devez d'abord définir le roster avant de choisir la composition de départ")
        ).toBeTruthy();
      });
    });

    it('should show error when roster is empty', async () => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: [] });

      const { getByText } = render(<SetLineupScreen />);

      await waitFor(() => {
        expect(getByText('Aucun joueur dans le roster')).toBeTruthy();
      });
    });
  });

  describe('Player selection', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should display only players from roster', async () => {
      const { getByText, queryByText } = render(<SetLineupScreen />);

      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('Jane Smith')).toBeTruthy();
        expect(getByText('Bob Johnson')).toBeTruthy();
        expect(getByText('Alice Williams')).toBeTruthy();
        expect(getByText('Charlie Brown')).toBeTruthy();
        expect(getByText('David Lee')).toBeTruthy();
      });
    });

    it('should toggle player selection on press', async () => {
      const { getByText } = render(<SetLineupScreen />);

      await waitFor(() => {
        const playerButton = getByText('John Doe');
        fireEvent.press(playerButton);
      });

      // Player should be selected (count should be 1/5)
      await waitFor(() => {
        expect(getByText('1 / 5 joueurs sélectionnés')).toBeTruthy();
      });
    });

    it('should prevent selecting more than 5 players', async () => {
      const { getByText } = render(<SetLineupScreen />);

      // Select 5 players
      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
        fireEvent.press(getByText('Jane Smith'));
        fireEvent.press(getByText('Bob Johnson'));
        fireEvent.press(getByText('Alice Williams'));
        fireEvent.press(getByText('Charlie Brown'));
      });

      // Try to select 6th player
      await waitFor(() => {
        fireEvent.press(getByText('David Lee'));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Maximum atteint',
          'Vous devez sélectionner exactement 5 joueurs'
        );
      });
    });

    it('should show selection order with numbered badges', async () => {
      const { getByText } = render(<SetLineupScreen />);

      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
        fireEvent.press(getByText('Jane Smith'));
      });

      await waitFor(() => {
        // Should show badge with number 1 for first selected player
        expect(getByText('1')).toBeTruthy();
        // Should show badge with number 2 for second selected player
        expect(getByText('2')).toBeTruthy();
      });
    });

    it('should preselect players if starting lineup already defined', async () => {
      const gameWithLineup = {
        ...mockGame,
        startingLineup: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
      };
      mockGameService.getById.mockResolvedValue({ success: true, data: gameWithLineup });

      const { getByText } = render(<SetLineupScreen />);

      await waitFor(() => {
        expect(getByText('5 / 5 joueurs sélectionnés')).toBeTruthy();
        expect(getByText('✓ Composition complète')).toBeTruthy();
      });
    });
  });

  describe('Saving lineup', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should not save lineup with less than 5 players', async () => {
      const { getByText } = render(<SetLineupScreen />);

      // Select only 3 players
      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
        fireEvent.press(getByText('Jane Smith'));
        fireEvent.press(getByText('Bob Johnson'));
      });

      // Try to save (button should be disabled, so onPress won't fire)
      await waitFor(() => {
        fireEvent.press(getByText('Enregistrer la composition'));
      });

      // Verify that setStartingLineup was not called because button is disabled
      await waitFor(() => {
        expect(mockGameService.setStartingLineup).not.toHaveBeenCalled();
      });
    });

    it('should successfully save lineup with exactly 5 players', async () => {
      mockGameService.setStartingLineup.mockResolvedValue({ success: true, data: mockGame });

      const { getByText } = render(<SetLineupScreen />);

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
        fireEvent.press(getByText('Enregistrer la composition'));
      });

      await waitFor(() => {
        expect(mockGameService.setStartingLineup).toHaveBeenCalledWith('game-1', [
          'player-1',
          'player-2',
          'player-3',
          'player-4',
          'player-5',
        ]);
        expect(Alert.alert).toHaveBeenCalledWith(
          'Succès',
          'Composition de départ définie avec succès',
          [
            {
              text: 'OK',
              onPress: expect.any(Function),
            },
          ]
        );
      });
    });

    it('should show error when save fails', async () => {
      mockGameService.setStartingLineup.mockResolvedValue({
        success: false,
        error: 'Server error',
      });

      const { getByText } = render(<SetLineupScreen />);

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
        fireEvent.press(getByText('Enregistrer la composition'));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'Server error');
      });
    });

    it('should not allow save when not exactly 5 players selected', async () => {
      mockGameService.setStartingLineup.mockResolvedValue({ success: true, data: mockGame });
      const { getByText } = render(<SetLineupScreen />);

      // Don't select any players, try to save
      await waitFor(() => {
        fireEvent.press(getByText('Enregistrer la composition'));
      });

      // Verify that setStartingLineup was not called
      expect(mockGameService.setStartingLineup).not.toHaveBeenCalled();
    });

    it('should allow save when exactly 5 players selected', async () => {
      mockGameService.setStartingLineup.mockResolvedValue({ success: true, data: mockGame });
      const { getByText } = render(<SetLineupScreen />);

      // Select 5 players
      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
        fireEvent.press(getByText('Jane Smith'));
        fireEvent.press(getByText('Bob Johnson'));
        fireEvent.press(getByText('Alice Williams'));
        fireEvent.press(getByText('Charlie Brown'));
      });

      // Save should work
      await waitFor(() => {
        fireEvent.press(getByText('Enregistrer la composition'));
      });

      await waitFor(() => {
        expect(mockGameService.setStartingLineup).toHaveBeenCalled();
      });
    });
  });
});
