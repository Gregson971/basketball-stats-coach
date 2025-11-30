import { View, Text } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-4xl mb-4">{icon}</Text>
      <Text className="text-xl font-semibold text-gray-700 mb-2">{title}</Text>
      {description && <Text className="text-gray-500 text-center">{description}</Text>}
    </View>
  );
}
