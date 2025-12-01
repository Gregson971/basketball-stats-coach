import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { teamService, gameService, playerService, statsService } from '@/services';
import { LoadingScreen, EmptyState, InfoRow, Button } from '@/components/common';
import type { Team, Game, Player, GameStats } from '@/types';

interface GameWithStats {
  game: Game;
  totalPoints: number;
  playersWithStats: number;
}

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<GameWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    loadTeam();
  }, [id]);

  const loadTeam = async () => {
    setLoading(true);

    // Charger l'équipe
    const teamResult = await teamService.getById(id);
    if (teamResult.success && teamResult.data) {
      setTeam(teamResult.data);
    } else {
      Alert.alert('Erreur', 'Impossible de charger l\'équipe');
      setLoading(false);
      return;
    }

    // Charger les joueurs de l'équipe
    const playersResult = await playerService.getByTeam(id);
    if (playersResult.success && playersResult.data) {
      setPlayers(playersResult.data);
    }

    // Charger les matchs de l'équipe
    await loadTeamGames();

    setLoading(false);
  };

  const loadTeamGames = async () => {
    setLoadingStats(true);

    const gamesResult = await gameService.getByTeam(id);
    if (!gamesResult.success || !gamesResult.data) {
      setLoadingStats(false);
      return;
    }

    // Pour chaque match, calculer les stats
    const gamesWithStats = await Promise.all(
      gamesResult.data.map(async (game) => {
        if (game.status === 'not_started') {
          return {
            game,
            totalPoints: 0,
            playersWithStats: 0,
          };
        }

        // Récupérer les stats de tous les joueurs pour ce match
        const playersResult = await playerService.getByTeam(id);
        if (!playersResult.success || !playersResult.data) {
          return {
            game,
            totalPoints: 0,
            playersWithStats: 0,
          };
        }

        let totalPoints = 0;
        let playersWithStats = 0;

        for (const player of playersResult.data) {
          const statsResult = await statsService.getPlayerGameStats(game.id, player.id);
          if (statsResult.success && statsResult.data) {
            const stats = statsResult.data;
            totalPoints += stats.freeThrowsMade + stats.twoPointsMade * 2 + stats.threePointsMade * 3;
            playersWithStats++;
          }
        }

        return {
          game,
          totalPoints,
          playersWithStats,
        };
      })
    );

    setGames(gamesWithStats);
    setLoadingStats(false);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer l\'équipe', 'Êtes-vous sûr de vouloir supprimer cette équipe ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const result = await teamService.delete(id);
          if (result.success) {
            Alert.alert('Succès', 'Équipe supprimée', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          } else {
            Alert.alert('Erreur', 'Impossible de supprimer l\'équipe');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingScreen message="Chargement de l'équipe..." />;
  }

  if (!team) {
    return <EmptyState icon="❌" title="Équipe introuvable" />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header avec icône */}
        <View className="bg-white p-6 rounded-lg mb-4 items-center">
          <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">🏀</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{team.name}</Text>
          {team.coach && <Text className="text-lg text-gray-500 mt-1">Coach: {team.coach}</Text>}
        </View>

        {/* Informations */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Informations</Text>

          {team.season && <InfoRow label="Saison" value={team.season} />}
          {team.league && <InfoRow label="Ligue" value={team.league} />}
          <InfoRow
            label="Créée le"
            value={new Date(team.createdAt).toLocaleDateString('fr-FR')}
          />
        </View>

        {/* Effectif */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Effectif</Text>
          <InfoRow label="Nombre de joueurs" value={players.length.toString()} />
          <InfoRow label="Matchs joués" value={games.filter((g) => g.game.status !== 'not_started').length.toString()} />
          <InfoRow label="Matchs à venir" value={games.filter((g) => g.game.status === 'not_started').length.toString()} />
        </View>

        {/* Statistiques de la saison */}
        {games.length > 0 && (
          <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Statistiques de la saison
            </Text>

            {loadingStats ? (
              <Text className="text-gray-500 text-center py-4">Chargement des stats...</Text>
            ) : (
              <>
                {/* Stats globales */}
                <View className="bg-primary-50 p-4 rounded-lg mb-4">
                  <View className="flex-row justify-around">
                    <View className="items-center">
                      <Text className="text-2xl font-bold text-primary-600">
                        {games.reduce((sum, g) => sum + g.totalPoints, 0)}
                      </Text>
                      <Text className="text-xs text-gray-600">Points marqués</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-2xl font-bold text-gray-700">
                        {games.filter((g) => g.game.status !== 'not_started').length}
                      </Text>
                      <Text className="text-xs text-gray-600">Matchs joués</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-2xl font-bold text-gray-700">
                        {games.filter((g) => g.game.status !== 'not_started').length > 0
                          ? (
                              games.reduce((sum, g) => sum + g.totalPoints, 0) /
                              games.filter((g) => g.game.status !== 'not_started').length
                            ).toFixed(1)
                          : '0.0'}
                      </Text>
                      <Text className="text-xs text-gray-600">Pts / match</Text>
                    </View>
                  </View>
                </View>

                {/* Liste des matchs */}
                <Text className="text-sm font-semibold text-gray-700 mb-2">Détail par match</Text>
                {games.length === 0 ? (
                  <Text className="text-gray-500 text-center py-4">Aucun match</Text>
                ) : (
                  games.map((gameWithStats) => (
                    <TouchableOpacity
                      key={gameWithStats.game.id}
                      onPress={() => {
                        if (gameWithStats.game.status === 'completed') {
                          router.push(`/games/${gameWithStats.game.id}/summary`);
                        } else {
                          router.push(`/games/${gameWithStats.game.id}`);
                        }
                      }}
                      className="border-b border-gray-100 py-3"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-gray-900">
                            vs {gameWithStats.game.opponent}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {gameWithStats.game.gameDate
                              ? new Date(gameWithStats.game.gameDate).toLocaleDateString('fr-FR')
                              : 'Date non définie'}
                          </Text>
                        </View>
                        <View className="items-end">
                          {gameWithStats.game.status === 'not_started' ? (
                            <View className="bg-blue-100 px-2 py-1 rounded">
                              <Text className="text-xs font-semibold text-blue-700">À venir</Text>
                            </View>
                          ) : gameWithStats.game.status === 'in_progress' ? (
                            <View className="flex-row items-center">
                              <View className="bg-green-100 px-2 py-1 rounded mr-2">
                                <Text className="text-xs font-semibold text-green-700">En cours</Text>
                              </View>
                              <Text className="text-lg font-bold text-primary-600">
                                {gameWithStats.totalPoints}
                              </Text>
                            </View>
                          ) : (
                            <View className="flex-row items-center">
                              <View className="bg-gray-100 px-2 py-1 rounded mr-2">
                                <Text className="text-xs font-semibold text-gray-700">Terminé</Text>
                              </View>
                              <Text className="text-lg font-bold text-gray-900">
                                {gameWithStats.totalPoints}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </>
            )}
          </View>
        )}

        {/* Actions */}
        <View className="mb-8">
          <Button title="Supprimer l'équipe" onPress={handleDelete} variant="danger" />
        </View>
      </View>
    </ScrollView>
  );
}
