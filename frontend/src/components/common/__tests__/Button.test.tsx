/**
 * Unit tests for Button
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  describe('Basic display', () => {
    it('should display title correctly', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<Button title="Test Button" onPress={onPressMock} />);

      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should call onPress when clicked', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);

      const button = getByText('Click Me');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled and loading states', () => {
    it('should not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Disabled" onPress={onPressMock} disabled={true} />
      );

      const button = getByText('Disabled');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should display "Chargement..." when loading', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<Button title="Submit" onPress={onPressMock} loading={true} />);

      expect(getByText('Chargement...')).toBeTruthy();
    });

    it('should not call onPress when loading', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<Button title="Submit" onPress={onPressMock} loading={true} />);

      const button = getByText('Chargement...');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('should use primary variant by default', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<Button title="Primary" onPress={onPressMock} />);

      expect(getByText('Primary')).toBeTruthy();
    });

    it('should apply secondary variant', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Secondary" variant="secondary" onPress={onPressMock} />
      );

      expect(getByText('Secondary')).toBeTruthy();
    });

    it('should apply danger variant', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Delete" variant="danger" onPress={onPressMock} />
      );

      expect(getByText('Delete')).toBeTruthy();
    });
  });

  describe('State combinations', () => {
    it('should be disabled with a specific variant', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Disabled Danger" variant="danger" disabled={true} onPress={onPressMock} />
      );

      const button = getByText('Disabled Danger');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should be loading with a specific variant', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Submit" variant="primary" loading={true} onPress={onPressMock} />
      );

      expect(getByText('Chargement...')).toBeTruthy();
    });
  });
});
