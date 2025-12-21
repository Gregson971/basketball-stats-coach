import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { gameService, playerService } from '@/services';
import { LoadingScreen, EmptyState, Button } from '@/components/common';
import type { Game, Player } from '@/types';

export default function LiveGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerOut, setSelectedPlayerOut] = useState<string | null>(null);
  const [selectedPlayerIn, setSelectedPlayerIn] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    const [gameResult, playersResult] = await Promise.all([
      gameService.getById(id),
      gameService.getById(id).then(async (result) => {
        if (result.success && result.data) {
          return playerService.getByTeam(result.data.teamId);
        }
        return { success: false };
      }),
    ]);

    if (gameResult.success && gameResult.data) {
      setGame(gameResult.data);
    }

    if (playersResult.success && playersResult.data) {
      setPlayers(playersResult.data);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNextQuarter = async () => {
    if (!game) return;

    Alert.alert('Confirmer', `Passer au quart-temps ${game.currentQuarter + 1} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: async () => {
          setProcessingAction(true);
          const result = await gameService.nextQuarter(id);
          setProcessingAction(false);

          if (result.success && result.data) {
            setGame(result.data);
            Alert.alert('Succès', `Passage au quart-temps ${result.data.currentQuarter}`);
          } else {
            Alert.alert('Erreur', result.error || 'Impossible de passer au quart-temps suivant');
          }
        },
      },
    ]);
  };

  const handleSubstitution = async () => {
    if (!selectedPlayerOut || !selectedPlayerIn) {
      Alert.alert('Erreur', 'Sélectionnez un joueur sortant et un joueur entrant');
      return;
    }

    const playerOut = players.find((p) => p.id === selectedPlayerOut);
    const playerIn = players.find((p) => p.id === selectedPlayerIn);

    Alert.alert(
      'Confirmer le changement',
      `${playerOut?.firstName} ${playerOut?.lastName} ➡️ ${playerIn?.firstName} ${playerIn?.lastName}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setProcessingAction(true);
            const result = await gameService.recordSubstitution(
              id,
              selectedPlayerOut,
              selectedPlayerIn
            );
            setProcessingAction(false);

            if (result.success && result.data) {
              setGame(result.data.game);
              setSelectedPlayerOut(null);
              setSelectedPlayerIn(null);
              Alert.alert('Succès', 'Changement enregistré');
            } else {
              Alert.alert('Erreur', result.error || "Impossible d'enregistrer le changement");
            }
          },
        },
      ]
    );
  };

  const handleCompleteGame = async () => {
    Alert.alert(
      'Terminer le match',
      'Êtes-vous sûr de vouloir terminer ce match ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Terminer',
          style: 'destructive',
          onPress: async () => {
            setProcessingAction(true);
            const result = await gameService.complete(id);
            setProcessingAction(false);

            if (result.success) {
              Alert.alert('Succès', 'Match terminé avec succès', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } else {
              Alert.alert('Erreur', result.error || 'Impossible de terminer le match');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingScreen message="Chargement..." />;
  }

  if (!game) {
    return <EmptyState icon="❌" title="Match introuvable" />;
  }

  if (game.status !== 'in_progress') {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-4">
        <Text className="text-6xl mb-4">⚠️</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2 text-center">Match non démarré</Text>
        <Text className="text-gray-600 text-center mb-4">
          Ce match n'est pas en cours. Démarrez le match pour accéder à cette page.
        </Text>
        <Button title="Retour" onPress={() => router.back()} variant="secondary" />
      </View>
    );
  }

  // Get players on court and on bench
  const playersOnCourt = players.filter((p) => game.currentLineup.includes(p.id));
  const playersOnBench = players.filter(
    (p) => game.roster.includes(p.id) && !game.currentLineup.includes(p.id)
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header - Game Info */}
        <View className="bg-white p-6 rounded-lg mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Match en cours</Text>
          <Text className="text-lg text-gray-600 mb-4">{game.opponent}</Text>

          {/* Quarter Display */}
          <View className="bg-blue-50 p-4 rounded-lg mb-4">
            <Text className="text-sm text-gray-700 mb-2">Quart-temps</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-3xl font-bold text-blue-600">{game.currentQuarter} / 4</Text>
              <Button
                title="Quart-temps suivant"
                onPress={handleNextQuarter}
                disabled={game.currentQuarter >= 4 || processingAction}
                size="small"
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View className="gap-2">
            <Button
              title="📊 Enregistrer des statistiques"
              onPress={() => router.push(`/games/${id}/stats`)}
              variant="secondary"
            />
            <Button
              title="🏁 Terminer le match"
              onPress={handleCompleteGame}
              disabled={processingAction}
              variant="secondary"
            />
          </View>
        </View>

        {/* Current Lineup - Players on Court */}
        <View className="bg-white rounded-lg overflow-hidden mb-4">
          <View className="bg-green-100 p-3 border-b border-green-200">
            <Text className="font-semibold text-green-800">
              🏀 Sur le terrain ({playersOnCourt.length}/5)
            </Text>
          </View>
          {playersOnCourt.length === 0 ? (
            <View className="p-4">
              <Text className="text-gray-500 text-center">Aucun joueur sur le terrain</Text>
            </View>
          ) : (
            playersOnCourt.map((player) => {
              const isSelectedOut = selectedPlayerOut === player.id;
              return (
                <TouchableOpacity
                  key={player.id}
                  onPress={() => {
                    if (isSelectedOut) {
                      setSelectedPlayerOut(null);
                    } else {
                      setSelectedPlayerOut(player.id);
                    }
                  }}
                  className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${
                    isSelectedOut ? 'bg-red-50' : 'bg-white'
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className={`text-lg font-semibold ${
                        isSelectedOut ? 'text-red-600' : 'text-gray-800'
                      }`}
                    >
                      {player.firstName} {player.lastName}
                    </Text>
                    {player.position && (
                      <Text className="text-sm text-gray-600 mt-1">{player.position}</Text>
                    )}
                  </View>
                  {isSelectedOut && (
                    <View className="bg-red-500 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">SORTANT</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Bench - Players not on Court */}
        <View className="bg-white rounded-lg overflow-hidden mb-4">
          <View className="bg-gray-100 p-3 border-b border-gray-200">
            <Text className="font-semibold text-gray-700">
              💺 Banc de touche ({playersOnBench.length})
            </Text>
          </View>
          {playersOnBench.length === 0 ? (
            <View className="p-4">
              <Text className="text-gray-500 text-center">
                Tous les joueurs sont sur le terrain
              </Text>
            </View>
          ) : (
            playersOnBench.map((player) => {
              const isSelectedIn = selectedPlayerIn === player.id;
              return (
                <TouchableOpacity
                  key={player.id}
                  onPress={() => {
                    if (isSelectedIn) {
                      setSelectedPlayerIn(null);
                    } else {
                      setSelectedPlayerIn(player.id);
                    }
                  }}
                  className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${
                    isSelectedIn ? 'bg-green-50' : 'bg-white'
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className={`text-lg font-semibold ${
                        isSelectedIn ? 'text-green-600' : 'text-gray-800'
                      }`}
                    >
                      {player.firstName} {player.lastName}
                    </Text>
                    {player.position && (
                      <Text className="text-sm text-gray-600 mt-1">{player.position}</Text>
                    )}
                  </View>
                  {isSelectedIn && (
                    <View className="bg-green-500 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">ENTRANT</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Substitution Action */}
        {(selectedPlayerOut || selectedPlayerIn) && (
          <View className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
            <Text className="font-semibold text-blue-800 mb-2">Changement en cours</Text>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="text-xs text-gray-600 mb-1">Sortant</Text>
                <Text className="font-semibold text-gray-800">
                  {selectedPlayerOut
                    ? `${players.find((p) => p.id === selectedPlayerOut)?.firstName} ${
                        players.find((p) => p.id === selectedPlayerOut)?.lastName
                      }`
                    : '—'}
                </Text>
              </View>
              <Text className="text-2xl mx-4">➡️</Text>
              <View className="flex-1">
                <Text className="text-xs text-gray-600 mb-1">Entrant</Text>
                <Text className="font-semibold text-gray-800">
                  {selectedPlayerIn
                    ? `${players.find((p) => p.id === selectedPlayerIn)?.firstName} ${
                        players.find((p) => p.id === selectedPlayerIn)?.lastName
                      }`
                    : '—'}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Button
                  title="Annuler"
                  onPress={() => {
                    setSelectedPlayerOut(null);
                    setSelectedPlayerIn(null);
                  }}
                  variant="secondary"
                  size="small"
                />
              </View>
              <View className="flex-1">
                <Button
                  title="Confirmer"
                  onPress={handleSubstitution}
                  disabled={!selectedPlayerOut || !selectedPlayerIn || processingAction}
                  size="small"
                />
              </View>
            </View>
          </View>
        )}

        {/* Help Text */}
        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-sm text-gray-700 text-center">
            Sélectionnez un joueur sur le terrain et un joueur sur le banc pour effectuer un
            changement
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
