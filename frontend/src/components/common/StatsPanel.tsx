import { View, Text } from 'react-native';
import type { GameStats } from '@/types';

interface StatsPanelProps {
  stats: GameStats | null;
  playerName: string;
}

export function StatsPanel({ stats, playerName }: StatsPanelProps) {
  if (!stats) {
    return (
      <View className="bg-white p-4 rounded-lg">
        <Text className="text-gray-500 text-center">Aucune statistique pour le moment</Text>
      </View>
    );
  }

  // Calculs
  const totalPoints =
    stats.freeThrowsMade + stats.twoPointsMade * 2 + stats.threePointsMade * 3;
  const totalRebounds = stats.offensiveRebounds + stats.defensiveRebounds;
  const fieldGoalsMade = stats.twoPointsMade + stats.threePointsMade;
  const fieldGoalsAttempted = stats.twoPointsAttempted + stats.threePointsAttempted;
  const fgPercentage =
    fieldGoalsAttempted > 0 ? ((fieldGoalsMade / fieldGoalsAttempted) * 100).toFixed(1) : '0.0';
  const ftPercentage =
    stats.freeThrowsAttempted > 0
      ? ((stats.freeThrowsMade / stats.freeThrowsAttempted) * 100).toFixed(1)
      : '0.0';
  const threePercentage =
    stats.threePointsAttempted > 0
      ? ((stats.threePointsMade / stats.threePointsAttempted) * 100).toFixed(1)
      : '0.0';

  return (
    <View className="bg-white rounded-lg p-4 border border-gray-200">
      {/* Header */}
      <View className="mb-3 pb-3 border-b border-gray-200">
        <Text className="text-lg font-bold text-gray-900 text-center">{playerName}</Text>
        <Text className="text-3xl font-bold text-primary-600 text-center mt-1">
          {totalPoints} PTS
        </Text>
      </View>

      {/* Stats principales */}
      <View className="flex-row justify-around mb-3 pb-3 border-b border-gray-200">
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-900">{totalRebounds}</Text>
          <Text className="text-xs text-gray-500">REB</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-900">{stats.assists}</Text>
          <Text className="text-xs text-gray-500">AST</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-900">{stats.steals}</Text>
          <Text className="text-xs text-gray-500">STL</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-900">{stats.blocks}</Text>
          <Text className="text-xs text-gray-500">BLK</Text>
        </View>
      </View>

      {/* Pourcentages de tir */}
      <View className="flex-row justify-around mb-3 pb-3 border-b border-gray-200">
        <View className="items-center">
          <Text className="text-sm font-semibold text-gray-900">{fgPercentage}%</Text>
          <Text className="text-xs text-gray-500">
            FG ({fieldGoalsMade}/{fieldGoalsAttempted})
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-semibold text-gray-900">{threePercentage}%</Text>
          <Text className="text-xs text-gray-500">
            3PT ({stats.threePointsMade}/{stats.threePointsAttempted})
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-semibold text-gray-900">{ftPercentage}%</Text>
          <Text className="text-xs text-gray-500">
            FT ({stats.freeThrowsMade}/{stats.freeThrowsAttempted})
          </Text>
        </View>
      </View>

      {/* Autres stats */}
      <View className="flex-row justify-around">
        <View className="items-center">
          <Text className="text-sm font-semibold text-gray-900">{stats.turnovers}</Text>
          <Text className="text-xs text-gray-500">TO</Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-semibold text-gray-900">{stats.personalFouls}</Text>
          <Text className="text-xs text-gray-500">PF</Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-semibold text-gray-900">
            {stats.offensiveRebounds}
          </Text>
          <Text className="text-xs text-gray-500">OREB</Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-semibold text-gray-900">
            {stats.defensiveRebounds}
          </Text>
          <Text className="text-xs text-gray-500">DREB</Text>
        </View>
      </View>
    </View>
  );
}
