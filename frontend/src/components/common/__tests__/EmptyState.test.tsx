/**
 * Unit tests for EmptyState
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  describe('Basic display', () => {
    it('should display title', () => {
      const { getByText } = render(<EmptyState title="Aucune donnée" />);

      expect(getByText('Aucune donnée')).toBeTruthy();
    });

    it('should display default icon', () => {
      const { getByText } = render(<EmptyState title="Empty" />);

      expect(getByText('📭')).toBeTruthy();
    });

    it('should display custom icon', () => {
      const { getByText } = render(<EmptyState title="Custom Icon" icon="🏀" />);

      expect(getByText('🏀')).toBeTruthy();
    });
  });

  describe('Description', () => {
    it('should display description if provided', () => {
      const { getByText } = render(
        <EmptyState title="Aucun match" description="Créez votre premier match pour commencer" />
      );

      expect(getByText('Aucun match')).toBeTruthy();
      expect(getByText('Créez votre premier match pour commencer')).toBeTruthy();
    });

    it('should not display description if not provided', () => {
      const { queryByText } = render(<EmptyState title="Aucun match" />);

      // Title should be present
      expect(queryByText('Aucun match')).toBeTruthy();
    });
  });

  describe('Various use cases', () => {
    it('should handle empty teams case', () => {
      const { getByText } = render(
        <EmptyState title="Aucune équipe" icon="👥" description="Commencez par créer une équipe" />
      );

      expect(getByText('👥')).toBeTruthy();
      expect(getByText('Aucune équipe')).toBeTruthy();
      expect(getByText('Commencez par créer une équipe')).toBeTruthy();
    });

    it('should handle empty players case', () => {
      const { getByText } = render(
        <EmptyState
          title="Aucun joueur"
          icon="🏀"
          description="Ajoutez des joueurs à votre équipe"
        />
      );

      expect(getByText('🏀')).toBeTruthy();
      expect(getByText('Aucun joueur')).toBeTruthy();
      expect(getByText('Ajoutez des joueurs à votre équipe')).toBeTruthy();
    });

    it('should handle empty games case', () => {
      const { getByText } = render(
        <EmptyState title="Aucun match" icon="📅" description="Planifiez votre premier match" />
      );

      expect(getByText('📅')).toBeTruthy();
      expect(getByText('Aucun match')).toBeTruthy();
      expect(getByText('Planifiez votre premier match')).toBeTruthy();
    });
  });

  describe('Long text', () => {
    it('should handle long title', () => {
      const longTitle =
        'Ceci est un titre très long qui pourrait potentiellement causer des problèmes de mise en page';
      const { getByText } = render(<EmptyState title={longTitle} />);

      expect(getByText(longTitle)).toBeTruthy();
    });

    it('should handle long description', () => {
      const longDescription =
        "Ceci est une description très longue qui explique en détail ce que l'utilisateur devrait faire dans cette situation particulière. Elle contient beaucoup d'informations utiles.";
      const { getByText } = render(<EmptyState title="Titre" description={longDescription} />);

      expect(getByText(longDescription)).toBeTruthy();
    });
  });
});
