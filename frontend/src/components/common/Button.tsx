import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-3 px-6 rounded-lg ${getVariantStyles()}`}
    >
      <Text className={`text-center font-semibold ${getTextStyles()}`}>
        {loading ? 'Chargement...' : title}
      </Text>
    </TouchableOpacity>
  );
}
