import { View, Text, TouchableOpacity } from 'react-native';
import type { Team } from '@/types';

interface TeamCardProps {
  team: Team;
  onPress?: () => void;
}

export function TeamCard({ team, onPress }: TeamCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-50"
    >
      {/* Team Icon and Name */}
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
          <Text className="text-2xl">🏀</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{team.name}</Text>
          {team.coach && <Text className="text-sm text-gray-500">Coach: {team.coach}</Text>}
        </View>
      </View>

      {/* Team Details */}
      <View className="flex-row gap-4">
        {team.season && (
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Saison</Text>
            <Text className="text-sm font-medium text-gray-700">{team.season}</Text>
          </View>
        )}
        {team.league && (
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Ligue</Text>
            <Text className="text-sm font-medium text-gray-700">{team.league}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
