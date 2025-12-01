import { View, Text, TouchableOpacity } from 'react-native';
import type { Game } from '@/types';

interface GameCardProps {
  game: Game;
  onPress?: () => void;
}

const STATUS_CONFIG = {
  not_started: {
    label: 'À venir',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  in_progress: {
    label: 'En cours',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  completed: {
    label: 'Terminé',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
  },
};

export function GameCard({ game, onPress }: GameCardProps) {
  const statusConfig = STATUS_CONFIG[game.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-50"
    >
      {/* Header: Icon + Opponent + Status */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
            <Text className="text-2xl">🎯</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">vs {game.opponent}</Text>
            {game.location && <Text className="text-sm text-gray-500">📍 {game.location}</Text>}
          </View>
        </View>

        {/* Status Badge */}
        <View className={`px-3 py-1 rounded-full ${statusConfig.bgColor}`}>
          <Text className={`text-xs font-semibold ${statusConfig.textColor}`}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Game Details */}
      <View className="flex-row gap-4">
        {game.gameDate && (
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Date</Text>
            <Text className="text-sm font-medium text-gray-700">
              {new Date(game.gameDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        )}
        {game.notes && (
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Notes</Text>
            <Text className="text-sm font-medium text-gray-700" numberOfLines={1}>
              {game.notes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
