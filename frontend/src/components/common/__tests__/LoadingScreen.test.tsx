/**
 * Unit tests for LoadingScreen
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { LoadingScreen } from '../LoadingScreen';

describe('LoadingScreen', () => {
  describe('Basic display', () => {
    it('should display default message', () => {
      const { getByText } = render(<LoadingScreen />);

      expect(getByText('Chargement...')).toBeTruthy();
    });

    it('should display custom message', () => {
      const { getByText } = render(<LoadingScreen message="Chargement des données..." />);

      expect(getByText('Chargement des données...')).toBeTruthy();
    });

    it('should display loading indicator (ActivityIndicator)', () => {
      const { UNSAFE_getByType } = render(<LoadingScreen />);

      // Verify ActivityIndicator is present
      const indicator = UNSAFE_getByType(ActivityIndicator);
      expect(indicator).toBeTruthy();
    });
  });

  describe('Various messages', () => {
    it('should handle empty message', () => {
      const { getByText } = render(<LoadingScreen message="" />);

      expect(getByText('')).toBeTruthy();
    });

    it('should handle long message', () => {
      const longMessage = 'Veuillez patienter pendant que nous chargeons toutes vos données...';
      const { getByText } = render(<LoadingScreen message={longMessage} />);

      expect(getByText(longMessage)).toBeTruthy();
    });
  });

  describe('Use cases', () => {
    it('should display message for loading games', () => {
      const { getByText } = render(<LoadingScreen message="Chargement des matchs..." />);

      expect(getByText('Chargement des matchs...')).toBeTruthy();
    });

    it('should display message for loading teams', () => {
      const { getByText } = render(<LoadingScreen message="Chargement des équipes..." />);

      expect(getByText('Chargement des équipes...')).toBeTruthy();
    });

    it('should display message for loading players', () => {
      const { getByText } = render(<LoadingScreen message="Chargement des joueurs..." />);

      expect(getByText('Chargement des joueurs...')).toBeTruthy();
    });
  });
});
