/**
 * Unit tests for GameCard
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameCard } from '../GameCard';
import type { Game } from '@/types';

describe('GameCard', () => {
  const baseGame: Game = {
    id: 'game-1',
    teamId: 'team-1',
    opponent: 'Test Opponent',
    status: 'not_started',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('Basic display', () => {
    it('should display opponent name', () => {
      const { getByText } = render(<GameCard game={baseGame} />);

      expect(getByText('vs Test Opponent')).toBeTruthy();
    });

    it('should call onPress when clicked', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<GameCard game={baseGame} onPress={onPressMock} />);

      const card = getByText('vs Test Opponent');
      fireEvent.press(card.parent!.parent!.parent!);

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should work without onPress', () => {
      const { getByText } = render(<GameCard game={baseGame} />);

      expect(getByText('vs Test Opponent')).toBeTruthy();
    });
  });

  describe('Game statuses', () => {
    it('should display "À venir" for not_started game', () => {
      const game: Game = { ...baseGame, status: 'not_started' };
      const { getByText } = render(<GameCard game={game} />);

      expect(getByText('À venir')).toBeTruthy();
    });

    it('should display "En cours" for in_progress game', () => {
      const game: Game = { ...baseGame, status: 'in_progress' };
      const { getByText } = render(<GameCard game={game} />);

      expect(getByText('En cours')).toBeTruthy();
    });

    it('should display "Terminé" for completed game', () => {
      const game: Game = { ...baseGame, status: 'completed' };
      const { getByText } = render(<GameCard game={game} />);

      expect(getByText('Terminé')).toBeTruthy();
    });
  });

  describe('Optional information', () => {
    it('should display location if provided', () => {
      const game: Game = { ...baseGame, location: 'Gymnase Municipal' };
      const { getByText } = render(<GameCard game={game} />);

      expect(getByText('📍 Gymnase Municipal')).toBeTruthy();
    });

    it('should not display location if not provided', () => {
      const { queryByText } = render(<GameCard game={baseGame} />);

      // Verify no text containing 📍 is present
      expect(queryByText(/📍/)).toBeFalsy();
    });

    it('should display date if provided', () => {
      const gameDate = new Date('2024-03-15');
      const game: Game = { ...baseGame, gameDate };
      const { getByText } = render(<GameCard game={game} />);

      expect(getByText('Date')).toBeTruthy();
      // Date should be formatted in French
      expect(getByText(/mars/)).toBeTruthy();
    });

    it('should display notes if provided', () => {
      const game: Game = { ...baseGame, notes: 'Match important' };
      const { getByText } = render(<GameCard game={game} />);

      expect(getByText('Notes')).toBeTruthy();
      expect(getByText('Match important')).toBeTruthy();
    });

    it('should truncate long notes', () => {
      const longNotes = 'Ceci est une note très longue qui devrait être tronquée à une seule ligne';
      const game: Game = { ...baseGame, notes: longNotes };
      const { getByText } = render(<GameCard game={game} />);

      const notesText = getByText(longNotes);
      expect(notesText.props.numberOfLines).toBe(1);
    });
  });

  describe('Complete cases', () => {
    it('should display all information when available', () => {
      const game: Game = {
        ...baseGame,
        opponent: 'Les Warriors',
        status: 'in_progress',
        location: 'Palais des Sports',
        gameDate: new Date('2024-04-20'),
        notes: 'Finale régionale',
      };

      const { getByText } = render(<GameCard game={game} />);

      expect(getByText('vs Les Warriors')).toBeTruthy();
      expect(getByText('En cours')).toBeTruthy();
      expect(getByText('📍 Palais des Sports')).toBeTruthy();
      expect(getByText('Date')).toBeTruthy();
      expect(getByText('Notes')).toBeTruthy();
      expect(getByText('Finale régionale')).toBeTruthy();
    });

    it('should display only minimal information', () => {
      const minimalGame: Game = {
        id: 'game-2',
        teamId: 'team-1',
        opponent: 'Simple Opponent',
        status: 'not_started',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { getByText, queryByText } = render(<GameCard game={minimalGame} />);

      expect(getByText('vs Simple Opponent')).toBeTruthy();
      expect(getByText('À venir')).toBeTruthy();
      expect(queryByText('Date')).toBeFalsy();
      expect(queryByText('Notes')).toBeFalsy();
    });
  });

  describe('Date formatting', () => {
    it('should format date correctly in French', () => {
      const gameDate = new Date('2024-12-25');
      const game: Game = { ...baseGame, gameDate };
      const { getByText } = render(<GameCard game={game} />);

      // Verify month is in French
      expect(getByText(/déc/)).toBeTruthy();
    });
  });
});
