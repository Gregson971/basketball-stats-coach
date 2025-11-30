import { View, Text } from 'react-native';

export default function TeamsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-4xl mb-4">🏀</Text>
      <Text className="text-xl font-semibold text-gray-700">Équipes</Text>
      <Text className="text-gray-500 mt-2">À venir...</Text>
    </View>
  );
}
