import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { gameService, playerService } from '@/services';
import { LoadingScreen, EmptyState, Button } from '@/components/common';
import type { Game, Player } from '@/types';

export default function SetLineupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rosterPlayers, setRosterPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      // Pre-select already defined lineup
      if (gameResult.data.startingLineup && gameResult.data.startingLineup.length > 0) {
        setSelectedPlayers(gameResult.data.startingLineup);
      }
    }

    if (playersResult.success && playersResult.data) {
      setPlayers(playersResult.data);

      // Filter players to show only those in the roster
      if (gameResult.success && gameResult.data) {
        const filtered = playersResult.data.filter((p) =>
          gameResult.data!.roster.includes(p.id)
        );
        setRosterPlayers(filtered);
      }
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        if (prev.length >= 5) {
          Alert.alert('Maximum atteint', 'Vous devez sélectionner exactement 5 joueurs');
          return prev;
        }
        return [...prev, playerId];
      }
    });
  };

  const handleSave = async () => {
    if (selectedPlayers.length !== 5) {
      Alert.alert('Erreur', 'Vous devez sélectionner exactement 5 joueurs');
      return;
    }

    setSaving(true);
    const result = await gameService.setStartingLineup(id, selectedPlayers);
    setSaving(false);

    if (result.success) {
      Alert.alert('Succès', 'Composition de départ définie avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert('Erreur', result.error || 'Impossible de définir la composition de départ');
    }
  };

  if (loading) {
    return <LoadingScreen message="Chargement..." />;
  }

  if (!game) {
    return <EmptyState icon="❌" title="Match introuvable" />;
  }

  if (game.status !== 'not_started') {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-4">
        <Text className="text-6xl mb-4">⚠️</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
          Modification impossible
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          La composition de départ ne peut être modifiée que pour les matchs non démarrés
        </Text>
        <Button title="Retour" onPress={() => router.back()} variant="secondary" />
      </View>
    );
  }

  if (!game.roster || game.roster.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-4">
        <Text className="text-6xl mb-4">👥</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
          Roster non défini
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          Vous devez d'abord définir le roster avant de choisir la composition de départ
        </Text>
        <Button
          title="Définir le roster"
          onPress={() => router.push(`/games/${id}/roster`)}
        />
      </View>
    );
  }

  if (rosterPlayers.length === 0) {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          <EmptyState
            icon="👥"
            title="Aucun joueur dans le roster"
            subtitle="Le roster est vide"
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="bg-white p-6 rounded-lg mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Composition de départ
          </Text>
          <Text className="text-gray-600 mb-4">{game.opponent}</Text>
          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="text-sm text-gray-700">
              Sélectionnez exactement 5 joueurs qui démarreront le match
            </Text>
            <Text
              className={`text-lg font-semibold mt-2 ${
                selectedPlayers.length === 5 ? 'text-green-600' : 'text-blue-600'
              }`}
            >
              {selectedPlayers.length} / 5 joueurs sélectionnés
            </Text>
            {selectedPlayers.length < 5 && (
              <Text className="text-sm text-red-600 mt-1">
                Il faut exactement 5 joueurs
              </Text>
            )}
            {selectedPlayers.length === 5 && (
              <Text className="text-sm text-green-600 mt-1">✓ Composition complète</Text>
            )}
          </View>
        </View>

        {/* Players List */}
        <View className="bg-white rounded-lg overflow-hidden mb-4">
          <View className="bg-gray-100 p-3 border-b border-gray-200">
            <Text className="font-semibold text-gray-700">
              Joueurs du roster ({rosterPlayers.length})
            </Text>
          </View>
          {rosterPlayers.map((player, index) => {
            const isSelected = selectedPlayers.includes(player.id);
            const selectionOrder = selectedPlayers.indexOf(player.id) + 1;

            return (
              <TouchableOpacity
                key={player.id}
                onPress={() => togglePlayer(player.id)}
                className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${
                  isSelected ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <View className="flex-1">
                  <View className="flex-row items-center">
                    {isSelected && (
                      <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center mr-2">
                        <Text className="text-white text-xs font-bold">
                          {selectionOrder}
                        </Text>
                      </View>
                    )}
                    <View>
                      <Text
                        className={`text-lg font-semibold ${
                          isSelected ? 'text-blue-600' : 'text-gray-800'
                        }`}
                      >
                        {player.firstName} {player.lastName}
                      </Text>
                      {player.position && (
                        <Text className="text-sm text-gray-600 mt-1">
                          {player.position}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Text className="text-white text-sm">✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Actions */}
        <View className="gap-3">
          <Button
            title={saving ? 'Enregistrement...' : 'Enregistrer la composition'}
            onPress={handleSave}
            disabled={selectedPlayers.length !== 5 || saving}
          />
          <Button title="Annuler" onPress={() => router.back()} variant="secondary" />
        </View>
      </View>
    </ScrollView>
  );
}
