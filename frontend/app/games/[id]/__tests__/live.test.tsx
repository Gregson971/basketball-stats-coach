/**
 * Unit tests for LiveGameScreen
 */

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LiveGameScreen from '../live';
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

describe('LiveGameScreen', () => {
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
    status: 'in_progress',
    roster: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5', 'player-6'],
    startingLineup: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
    currentLineup: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
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

      const { getByText } = render(<LiveGameScreen />);

      expect(getByText('Chargement...')).toBeTruthy();
    });
  });

  describe('Error states', () => {
    it('should show error when game is not found', async () => {
      mockGameService.getById.mockResolvedValue({ success: false });

      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        expect(getByText('Match introuvable')).toBeTruthy();
      });
    });

    it('should show error when game is not in progress', async () => {
      const notStartedGame = { ...mockGame, status: 'not_started' as const };
      mockGameService.getById.mockResolvedValue({ success: true, data: notStartedGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });

      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        expect(getByText('Match non démarré')).toBeTruthy();
        expect(
          getByText("Ce match n'est pas en cours. Démarrez le match pour accéder à cette page.")
        ).toBeTruthy();
      });
    });
  });

  describe('Game display', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should display game information', async () => {
      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        expect(getByText('Match en cours')).toBeTruthy();
        expect(getByText('Test Opponent')).toBeTruthy();
        expect(getByText('1 / 4')).toBeTruthy();
      });
    });

    it('should display players on court', async () => {
      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        expect(getByText('🏀 Sur le terrain (5/5)')).toBeTruthy();
        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('Jane Smith')).toBeTruthy();
        expect(getByText('Bob Johnson')).toBeTruthy();
        expect(getByText('Alice Williams')).toBeTruthy();
        expect(getByText('Charlie Brown')).toBeTruthy();
      });
    });

    it('should display players on bench', async () => {
      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        expect(getByText('💺 Banc de touche (1)')).toBeTruthy();
        expect(getByText('David Lee')).toBeTruthy();
      });
    });
  });

  describe('Quarter management', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should move to next quarter when confirmed', async () => {
      const nextQuarterGame = { ...mockGame, currentQuarter: 2 };
      mockGameService.nextQuarter.mockResolvedValue({ success: true, data: nextQuarterGame });

      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        const nextQuarterButton = getByText('Quart-temps suivant');
        fireEvent.press(nextQuarterButton);
      });

      // Confirm in alert
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Confirmer',
          'Passer au quart-temps 2 ?',
          expect.arrayContaining([
            { text: 'Annuler', style: 'cancel' },
            { text: 'Confirmer', onPress: expect.any(Function) },
          ])
        );
      });
    });

    it('should not allow next quarter at quarter 4', async () => {
      const finalQuarterGame = { ...mockGame, currentQuarter: 4 };
      mockGameService.getById.mockResolvedValue({ success: true, data: finalQuarterGame });
      mockGameService.nextQuarter.mockResolvedValue({ success: true, data: finalQuarterGame });

      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        expect(getByText('4 / 4')).toBeTruthy();
      });

      // Try to press next quarter button (should be disabled)
      await waitFor(() => {
        fireEvent.press(getByText('Quart-temps suivant'));
      });

      // Verify nextQuarter was not called because button is disabled
      expect(mockGameService.nextQuarter).not.toHaveBeenCalled();
    });
  });

  describe('Substitution', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should select player out from court', async () => {
      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
      });

      await waitFor(() => {
        expect(getByText('SORTANT')).toBeTruthy();
        expect(getByText('Changement en cours')).toBeTruthy();
      });
    });

    it('should select player in from bench', async () => {
      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        fireEvent.press(getByText('David Lee'));
      });

      await waitFor(() => {
        expect(getByText('ENTRANT')).toBeTruthy();
        expect(getByText('Changement en cours')).toBeTruthy();
      });
    });

    it('should deselect player when pressed again', async () => {
      const { getAllByText, getByText, queryByText } = render(<LiveGameScreen />);

      // Select player (use getAllByText since name appears in list and might appear in panel)
      await waitFor(() => {
        const johnDoeElements = getAllByText('John Doe');
        fireEvent.press(johnDoeElements[0]);
      });

      await waitFor(() => {
        expect(getByText('SORTANT')).toBeTruthy();
      });

      // Deselect player
      await waitFor(() => {
        const johnDoeElements = getAllByText('John Doe');
        fireEvent.press(johnDoeElements[0]);
      });

      await waitFor(() => {
        expect(queryByText('SORTANT')).toBeFalsy();
      });
    });

    it('should successfully record substitution when both players selected', async () => {
      const mockSubstitution = {
        id: 'sub-1',
        gameId: 'game-1',
        quarter: 1,
        playerOut: 'player-1',
        playerIn: 'player-6',
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const gameAfterSub = {
        ...mockGame,
        currentLineup: ['player-6', 'player-2', 'player-3', 'player-4', 'player-5'],
      };
      mockGameService.recordSubstitution.mockResolvedValue({
        success: true,
        data: { game: gameAfterSub, substitution: mockSubstitution },
      });

      const { getByText } = render(<LiveGameScreen />);

      // Select players
      await waitFor(() => {
        fireEvent.press(getByText('John Doe')); // Player out
        fireEvent.press(getByText('David Lee')); // Player in
      });

      // Confirm substitution
      await waitFor(() => {
        fireEvent.press(getByText('Confirmer'));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Confirmer le changement',
          'John Doe ➡️ David Lee',
          expect.arrayContaining([
            { text: 'Annuler', style: 'cancel' },
            { text: 'Confirmer', onPress: expect.any(Function) },
          ])
        );
      });
    });

    it('should not allow confirm without selecting both players', async () => {
      mockGameService.recordSubstitution.mockResolvedValue({
        success: true,
        data: { game: mockGame, substitution: {} as any },
      });

      const { getByText } = render(<LiveGameScreen />);

      // Select only one player
      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
      });

      // Try to confirm (button should be disabled)
      await waitFor(() => {
        fireEvent.press(getByText('Confirmer'));
      });

      // Verify recordSubstitution was not called because button is disabled
      expect(mockGameService.recordSubstitution).not.toHaveBeenCalled();
    });

    it('should cancel substitution selection', async () => {
      const { getByText, queryByText } = render(<LiveGameScreen />);

      // Select players
      await waitFor(() => {
        fireEvent.press(getByText('John Doe'));
        fireEvent.press(getByText('David Lee'));
      });

      await waitFor(() => {
        expect(getByText('Changement en cours')).toBeTruthy();
      });

      // Cancel
      await waitFor(() => {
        fireEvent.press(getByText('Annuler'));
      });

      await waitFor(() => {
        expect(queryByText('Changement en cours')).toBeFalsy();
      });
    });
  });

  describe('Complete game', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should show confirmation when completing game', async () => {
      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        fireEvent.press(getByText('🏁 Terminer le match'));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Terminer le match',
          'Êtes-vous sûr de vouloir terminer ce match ? Cette action est irréversible.',
          expect.arrayContaining([
            { text: 'Annuler', style: 'cancel' },
            { text: 'Terminer', style: 'destructive', onPress: expect.any(Function) },
          ])
        );
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      mockGameService.getById.mockResolvedValue({ success: true, data: mockGame });
      mockPlayerService.getByTeam.mockResolvedValue({ success: true, data: mockPlayers });
    });

    it('should have button to navigate to stats screen', async () => {
      const { getByText } = render(<LiveGameScreen />);

      await waitFor(() => {
        expect(getByText('📊 Enregistrer des statistiques')).toBeTruthy();
      });
    });
  });
});
