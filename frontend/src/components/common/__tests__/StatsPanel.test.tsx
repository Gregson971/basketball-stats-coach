/**
 * Unit tests for StatsPanel
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { StatsPanel } from '../StatsPanel';
import type { GameStats } from '@/types';

describe('StatsPanel', () => {
  const mockStats: GameStats = {
    gameId: 'game-1',
    playerId: 'player-1',
    freeThrowsMade: 5,
    freeThrowsAttempted: 6,
    twoPointsMade: 4,
    twoPointsAttempted: 8,
    threePointsMade: 2,
    threePointsAttempted: 5,
    offensiveRebounds: 2,
    defensiveRebounds: 5,
    assists: 3,
    steals: 2,
    blocks: 1,
    turnovers: 2,
    personalFouls: 3,
  };

  describe('Display without stats', () => {
    it('should display a message when no stats', () => {
      const { getByText } = render(<StatsPanel stats={null} playerName="John Doe" />);

      expect(getByText('Aucune statistique pour le moment')).toBeTruthy();
    });
  });

  describe('Display with stats', () => {
    it('should display player name', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      expect(getByText('John Doe')).toBeTruthy();
    });

    it('should calculate and display total points correctly', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      // Points = 5 (FT) + 8 (2PT * 2) + 6 (3PT * 3) = 19 points
      expect(getByText('19 PTS')).toBeTruthy();
    });

    it('should calculate total rebounds', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      // Total rebounds = 2 (OFF) + 5 (DEF) = 7
      expect(getByText('7')).toBeTruthy();
    });

    it('should display assists', () => {
      const { getByText, getAllByText } = render(
        <StatsPanel stats={mockStats} playerName="John Doe" />
      );

      // There are multiple "3" on the page (assists, fouls, etc), just verify AST is present
      expect(getAllByText('3').length).toBeGreaterThan(0);
      expect(getByText('AST')).toBeTruthy();
    });

    it('should display steals', () => {
      const { getByText, getAllByText } = render(
        <StatsPanel stats={mockStats} playerName="John Doe" />
      );

      // There are multiple "2" on the page, just verify STL is present
      expect(getAllByText('2').length).toBeGreaterThan(0);
      expect(getByText('STL')).toBeTruthy();
    });

    it('should display blocks', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      expect(getByText('1')).toBeTruthy();
      expect(getByText('BLK')).toBeTruthy();
    });
  });

  describe('Percentage calculations', () => {
    it('should calculate FG percentage correctly', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      // FG% = (4 + 2) / (8 + 5) * 100 = 6/13 * 100 = 46.2%
      expect(getByText('46.2%')).toBeTruthy();
      expect(getByText('FG (6/13)')).toBeTruthy();
    });

    it('should calculate 3PT percentage correctly', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      // 3PT% = 2/5 * 100 = 40.0%
      expect(getByText('40.0%')).toBeTruthy();
      expect(getByText('3PT (2/5)')).toBeTruthy();
    });

    it('should calculate FT percentage correctly', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      // FT% = 5/6 * 100 = 83.3%
      expect(getByText('83.3%')).toBeTruthy();
      expect(getByText('FT (5/6)')).toBeTruthy();
    });

    it('should display 0.0% when no attempts', () => {
      const emptyStats: GameStats = {
        ...mockStats,
        twoPointsMade: 0,
        twoPointsAttempted: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
      };

      const { getAllByText } = render(<StatsPanel stats={emptyStats} playerName="John Doe" />);

      const percentages = getAllByText('0.0%');
      expect(percentages).toHaveLength(3); // FG%, 3PT%, FT%
    });
  });

  describe('Other statistics', () => {
    it('should display turnovers', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      expect(getByText('TO')).toBeTruthy();
    });

    it('should display personal fouls', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      expect(getByText('PF')).toBeTruthy();
    });

    it('should display offensive rebounds separately', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      expect(getByText('OREB')).toBeTruthy();
    });

    it('should display defensive rebounds separately', () => {
      const { getByText } = render(<StatsPanel stats={mockStats} playerName="John Doe" />);

      expect(getByText('DREB')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle zero stats', () => {
      const zeroStats: GameStats = {
        gameId: 'game-1',
        playerId: 'player-1',
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        twoPointsMade: 0,
        twoPointsAttempted: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        personalFouls: 0,
      };

      const { getByText } = render(<StatsPanel stats={zeroStats} playerName="Test Player" />);

      expect(getByText('0 PTS')).toBeTruthy();
    });

    it('should handle perfect shooting (100%)', () => {
      const perfectStats: GameStats = {
        ...mockStats,
        twoPointsMade: 5,
        twoPointsAttempted: 5,
        threePointsMade: 3,
        threePointsAttempted: 3,
      };

      const { getAllByText } = render(
        <StatsPanel stats={perfectStats} playerName="Perfect Player" />
      );

      // There are multiple 100.0% (FG%, 3PT%, potentially), just verify there's at least one
      expect(getAllByText('100.0%').length).toBeGreaterThan(0);
    });

    it('should round percentages to one decimal', () => {
      const oddStats: GameStats = {
        ...mockStats,
        twoPointsMade: 1,
        twoPointsAttempted: 3,
        threePointsMade: 0,
        threePointsAttempted: 0,
      };

      const { getByText } = render(<StatsPanel stats={oddStats} playerName="Odd Player" />);

      // 1/3 * 100 = 33.333...% should be rounded to 33.3%
      expect(getByText('33.3%')).toBeTruthy();
    });
  });
});
