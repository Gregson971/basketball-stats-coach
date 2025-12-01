import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { playerService, statsService } from '@/services';
import { LoadingScreen, EmptyState, InfoRow } from '@/components/common';
import type { Player, CareerStats } from '@/types';

export default function PlayerCareerStatsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPlayerAndStats = useCallback(async () => {
    setLoading(true);

    // Charger le joueur
    const playerResult = await playerService.getById(id);
    if (playerResult.success && playerResult.data) {
      setPlayer(playerResult.data);
    }

    // Charger les stats carrière
    const statsResult = await statsService.getPlayerCareerStats(id);
    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    } else {
      // Aucune stats encore
      setStats(null);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadPlayerAndStats();
  }, [loadPlayerAndStats]);

  if (loading) {
    return <LoadingScreen message="Chargement des statistiques..." />;
  }

  if (!player) {
    return <EmptyState icon="❌" title="Joueur introuvable" />;
  }

  if (!stats || stats.gamesPlayed === 0) {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {/* Header */}
          <View className="bg-white p-6 rounded-lg mb-4 items-center">
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">👤</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {player.firstName} {player.lastName}
            </Text>
          </View>

          <EmptyState
            icon="📊"
            title="Aucune statistique"
            description="Ce joueur n'a pas encore de statistiques en carrière"
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="bg-white p-6 rounded-lg mb-4 items-center">
          <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {player.firstName} {player.lastName}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">{stats.gamesPlayed} matchs joués</Text>
        </View>

        {/* Moyennes par match */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Moyennes par match</Text>

          <View className="flex-row justify-around mb-4">
            <View className="items-center">
              <Text className="text-3xl font-bold text-primary-600">
                {stats.averagePoints.toFixed(1)}
              </Text>
              <Text className="text-xs text-gray-500">PTS</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-gray-700">
                {stats.averageRebounds.toFixed(1)}
              </Text>
              <Text className="text-xs text-gray-500">REB</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-gray-700">
                {stats.averageAssists.toFixed(1)}
              </Text>
              <Text className="text-xs text-gray-500">AST</Text>
            </View>
          </View>
        </View>

        {/* Totaux en carrière */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Totaux en carrière</Text>

          <InfoRow label="Points totaux" value={stats.totalPoints.toString()} />
          <InfoRow label="Rebonds totaux" value={stats.totalRebounds.toString()} />
          <InfoRow label="Passes décisives" value={stats.totalAssists.toString()} />
          <InfoRow label="Matchs joués" value={stats.gamesPlayed.toString()} />
        </View>

        {/* Pourcentages */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Pourcentages de tir</Text>

          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {stats.fieldGoalPercentage.toFixed(1)}%
              </Text>
              <Text className="text-xs text-gray-500">Field Goals</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {stats.threePointPercentage.toFixed(1)}%
              </Text>
              <Text className="text-xs text-gray-500">3 Points</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {stats.freeThrowPercentage.toFixed(1)}%
              </Text>
              <Text className="text-xs text-gray-500">Lancers francs</Text>
            </View>
          </View>
        </View>

        {/* Performance */}
        <View className="bg-white p-4 rounded-lg mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Performance</Text>

          <View className="space-y-2">
            <View className="flex-row items-center mb-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-600">Points par match</Text>
                <View className="bg-gray-200 h-2 rounded-full mt-1">
                  <View
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${Math.min((stats.averagePoints / 30) * 100, 100)}%` }}
                  />
                </View>
              </View>
              <Text className="text-sm font-bold text-gray-900 ml-3 w-12 text-right">
                {stats.averagePoints.toFixed(1)}
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-600">Rebonds par match</Text>
                <View className="bg-gray-200 h-2 rounded-full mt-1">
                  <View
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((stats.averageRebounds / 15) * 100, 100)}%` }}
                  />
                </View>
              </View>
              <Text className="text-sm font-bold text-gray-900 ml-3 w-12 text-right">
                {stats.averageRebounds.toFixed(1)}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-sm text-gray-600">Passes par match</Text>
                <View className="bg-gray-200 h-2 rounded-full mt-1">
                  <View
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${Math.min((stats.averageAssists / 10) * 100, 100)}%` }}
                  />
                </View>
              </View>
              <Text className="text-sm font-bold text-gray-900 ml-3 w-12 text-right">
                {stats.averageAssists.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
