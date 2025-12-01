import { TouchableOpacity, Text } from 'react-native';

interface ActionButtonProps {
  title: string;
  icon?: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'gray';
  onPress: () => void;
  disabled?: boolean;
}

const VARIANT_STYLES = {
  success: {
    bg: 'bg-green-500',
    activeBg: 'bg-green-600',
    text: 'text-white',
  },
  danger: {
    bg: 'bg-red-500',
    activeBg: 'bg-red-600',
    text: 'text-white',
  },
  warning: {
    bg: 'bg-orange-500',
    activeBg: 'bg-orange-600',
    text: 'text-white',
  },
  info: {
    bg: 'bg-blue-500',
    activeBg: 'bg-blue-600',
    text: 'text-white',
  },
  gray: {
    bg: 'bg-gray-400',
    activeBg: 'bg-gray-500',
    text: 'text-white',
  },
};

export function ActionButton({
  title,
  icon,
  variant = 'info',
  onPress,
  disabled = false,
}: ActionButtonProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${disabled ? 'bg-gray-300' : styles.bg} rounded-xl p-4 items-center justify-center min-h-[80px] active:${styles.activeBg}`}
      activeOpacity={0.8}
    >
      {icon && <Text className="text-3xl mb-1">{icon}</Text>}
      <Text className={`${styles.text} font-bold text-center text-sm`} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
