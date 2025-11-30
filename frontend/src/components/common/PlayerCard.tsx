import { View, Text, TouchableOpacity } from 'react-native';
import type { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  onPress: () => void;
}

export function PlayerCard({ player, onPress }: PlayerCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-lg mb-3 border border-gray-200"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {player.firstName} {player.lastName}
          </Text>
          <View className="flex-row gap-2 mt-1">
            {player.position && <Text className="text-sm text-gray-500">{player.position}</Text>}
            {player.height && <Text className="text-sm text-gray-400">• {player.height} cm</Text>}
          </View>
        </View>
        <Text className="text-gray-400">→</Text>
      </View>
    </TouchableOpacity>
  );
}
