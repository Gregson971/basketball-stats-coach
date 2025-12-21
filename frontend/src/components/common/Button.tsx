import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'medium',
}: ButtonProps) {
  const getVariantStyles = () => {
    if (disabled || loading) return 'bg-gray-400';

    switch (variant) {
      case 'primary':
        return 'bg-primary-600';
      case 'secondary':
        return 'bg-gray-200';
      case 'danger':
        return 'bg-red-600';
      default:
        return 'bg-primary-600';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'text-gray-700';
      default:
        return 'text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'py-2 px-4';
      case 'large':
        return 'py-4 px-8';
      case 'medium':
      default:
        return 'py-3 px-6';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-lg ${getSizeStyles()} ${getVariantStyles()}`}
    >
      <Text className={`text-center font-semibold ${getTextStyles()}`}>
        {loading ? 'Chargement...' : title}
      </Text>
    </TouchableOpacity>
  );
}
