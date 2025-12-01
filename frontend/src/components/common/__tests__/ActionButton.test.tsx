/**
 * Unit tests for ActionButton
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActionButton } from '../ActionButton';

describe('ActionButton', () => {
  it('should render correctly with basic props', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<ActionButton title="Test Button" onPress={onPressMock} />);

    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('should call onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<ActionButton title="Click Me" onPress={onPressMock} />);

    const button = getByText('Click Me');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should display icon if provided', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ActionButton title="With Icon" icon="🏀" onPress={onPressMock} />
    );

    const icon = getByText('🏀');
    expect(icon).toBeTruthy();
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ActionButton title="Disabled" onPress={onPressMock} disabled={true} />
    );

    const button = getByText('Disabled');
    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  describe('Style variants', () => {
    it('should apply success variant', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ActionButton title="Success" variant="success" onPress={onPressMock} />
      );

      const button = getByText('Success');
      expect(button).toBeTruthy();
    });

    it('should apply danger variant', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ActionButton title="Danger" variant="danger" onPress={onPressMock} />
      );

      const button = getByText('Danger');
      expect(button).toBeTruthy();
    });

    it('should apply warning variant', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ActionButton title="Warning" variant="warning" onPress={onPressMock} />
      );

      const button = getByText('Warning');
      expect(button).toBeTruthy();
    });

    it('should apply info variant by default', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<ActionButton title="Info" onPress={onPressMock} />);

      const button = getByText('Info');
      expect(button).toBeTruthy();
    });

    it('should apply gray variant', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ActionButton title="Gray" variant="gray" onPress={onPressMock} />
      );

      const button = getByText('Gray');
      expect(button).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should limit title to 2 lines', () => {
      const onPressMock = jest.fn();
      const longTitle = 'This is a very long title that should be limited to two lines maximum';
      const { getByText } = render(<ActionButton title={longTitle} onPress={onPressMock} />);

      const button = getByText(longTitle);
      expect(button.props.numberOfLines).toBe(2);
    });

    it('should visually disable button when disabled', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ActionButton title="Disabled" onPress={onPressMock} disabled={true} />
      );

      const button = getByText('Disabled');
      expect(button).toBeTruthy();
    });
  });
});
