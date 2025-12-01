import { View, Text, ScrollView, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { gameService, playerService, statsService } from '@/services';
import { LoadingScreen, EmptyState } from '@/components/common';
import type { Game, Player, GameStats } from '@/types';

interface PlayerWithStats {
  player: Player;
  stats: GameStats | null;
}

export default function GameSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [playersWithStats, setPlayersWithStats] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameAndStats();
  }, [id]);

  const loadGameAndStats = async () => {
    setLoading(true);

    // Charger le match
    const gameResult = await gameService.getById(id);
    if (!gameResult.success || !gameResult.data) {
      Alert.alert('Erreur', 'Impossible de charger le match');
      setLoading(false);
      return;
    }

    setGame(gameResult.data);

    // Charger les joueurs de l'équipe
    const playersResult = await playerService.getByTeam(gameResult.data.teamId);
    if (!playersResult.success || !playersResult.data) {
      setLoading(false);
      return;
    }

    // Charger les stats de chaque joueur pour ce match
    const playersWithStatsData = await Promise.all(
      playersResult.data.map(async (player) => {
        const statsResult = await statsService.getPlayerGameStats(id, player.id);
        return {
          player,
          stats: statsResult.success && statsResult.data ? statsResult.data : null,
        };
      })
    );

    setPlayersWithStats(playersWithStatsData);
    setLoading(false);
  };

  const calculateTotals = () => {
    return playersWithStats.reduce(
      (acc, { stats }) => {
        if (!stats) return acc;
        return {
          points:
            acc.points + stats.freeThrowsMade + stats.twoPointsMade * 2 + stats.threePointsMade * 3,
          rebounds: acc.rebounds + stats.offensiveRebounds + stats.defensiveRebounds,
          assists: acc.assists + stats.assists,
          steals: acc.steals + stats.steals,
          blocks: acc.blocks + stats.blocks,
          turnovers: acc.turnovers + stats.turnovers,
          fouls: acc.fouls + stats.personalFouls,
        };
      },
      { points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fouls: 0 }
    );
  };

  if (loading) {
    return <LoadingScreen message="Chargement des statistiques..." />;
  }

  if (!game) {
    return <EmptyState icon="❌" title="Match introuvable" />;
  }

  const totals = calculateTotals();
  const hasStats = playersWithStats.some((p) => p.stats);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header du match */}
        <View className="bg-white p-6 rounded-lg mb-4">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            vs {game.opponent}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            {game.gameDate
              ? new Date(game.gameDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Date non définie'}
          </Text>
          {game.location && (
            <Text className="text-sm text-gray-500 text-center mt-1">📍 {game.location}</Text>
          )}
        </View>

        {!hasStats ? (
          <EmptyState
            icon="📊"
            title="Aucune statistique"
            description="Ce match n'a pas encore de statistiques enregistrées"
          />
        ) : (
          <>
            {/* Totaux de l'équipe */}
            <View className="bg-primary-500 p-4 rounded-lg mb-4">
              <Text className="text-white text-lg font-semibold mb-3 text-center">
                Totaux de l'équipe
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-3xl font-bold text-white">{totals.points}</Text>
                  <Text className="text-xs text-white">PTS</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">{totals.rebounds}</Text>
                  <Text className="text-xs text-white">REB</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">{totals.assists}</Text>
                  <Text className="text-xs text-white">AST</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">{totals.steals}</Text>
                  <Text className="text-xs text-white">STL</Text>
                </View>
              </View>
            </View>

            {/* En-tête du tableau */}
            <View className="bg-white rounded-lg overflow-hidden mb-8">
              <View className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                <Text className="text-sm font-semibold text-gray-700">
                  Statistiques des joueurs
                </Text>
              </View>

              {/* Tableau des stats */}
              <View>
                {/* Header du tableau */}
                <View className="flex-row bg-gray-50 px-3 py-2 border-b border-gray-200">
                  <Text className="flex-1 text-xs font-semibold text-gray-600">JOUEUR</Text>
                  <Text className="w-10 text-xs font-semibold text-gray-600 text-center">PTS</Text>
                  <Text className="w-10 text-xs font-semibold text-gray-600 text-center">REB</Text>
                  <Text className="w-10 text-xs font-semibold text-gray-600 text-center">AST</Text>
                  <Text className="w-10 text-xs font-semibold text-gray-600 text-center">STL</Text>
                  <Text className="w-10 text-xs font-semibold text-gray-600 text-center">BLK</Text>
                </View>

                {/* Lignes des joueurs */}
                {playersWithStats
                  .filter((p) => p.stats)
                  .map(({ player, stats }) => {
                    if (!stats) return null;
                    const points =
                      stats.freeThrowsMade + stats.twoPointsMade * 2 + stats.threePointsMade * 3;
                    const rebounds = stats.offensiveRebounds + stats.defensiveRebounds;

                    return (
                      <View key={player.id} className="flex-row px-3 py-3 border-b border-gray-100">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-gray-900">
                            {player.firstName} {player.lastName}
                          </Text>
                          {player.position && (
                            <Text className="text-xs text-gray-500">{player.position}</Text>
                          )}
                        </View>
                        <Text className="w-10 text-sm text-gray-900 text-center font-semibold">
                          {points}
                        </Text>
                        <Text className="w-10 text-sm text-gray-700 text-center">{rebounds}</Text>
                        <Text className="w-10 text-sm text-gray-700 text-center">
                          {stats.assists}
                        </Text>
                        <Text className="w-10 text-sm text-gray-700 text-center">
                          {stats.steals}
                        </Text>
                        <Text className="w-10 text-sm text-gray-700 text-center">
                          {stats.blocks}
                        </Text>
                      </View>
                    );
                  })}

                {/* Ligne des totaux */}
                <View className="flex-row bg-gray-50 px-3 py-3 border-t-2 border-gray-300">
                  <Text className="flex-1 text-sm font-bold text-gray-900">TOTAUX</Text>
                  <Text className="w-10 text-sm font-bold text-primary-600 text-center">
                    {totals.points}
                  </Text>
                  <Text className="w-10 text-sm font-bold text-gray-900 text-center">
                    {totals.rebounds}
                  </Text>
                  <Text className="w-10 text-sm font-bold text-gray-900 text-center">
                    {totals.assists}
                  </Text>
                  <Text className="w-10 text-sm font-bold text-gray-900 text-center">
                    {totals.steals}
                  </Text>
                  <Text className="w-10 text-sm font-bold text-gray-900 text-center">
                    {totals.blocks}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
