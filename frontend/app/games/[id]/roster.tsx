import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { gameService, playerService } from '@/services';
import { LoadingScreen, EmptyState, Button } from '@/components/common';
import type { Game, Player } from '@/types';

export default function SetRosterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
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
      // Pre-select already defined roster
      if (gameResult.data.roster && gameResult.data.roster.length > 0) {
        setSelectedPlayers(gameResult.data.roster);
      }
    }

    if (playersResult.success && playersResult.data) {
      setPlayers(playersResult.data);
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
        if (prev.length >= 15) {
          Alert.alert('Maximum atteint', 'Vous ne pouvez sélectionner que 15 joueurs maximum');
          return prev;
        }
        return [...prev, playerId];
      }
    });
  };

  const handleSave = async () => {
    if (selectedPlayers.length < 5) {
      Alert.alert('Erreur', 'Vous devez sélectionner au moins 5 joueurs');
      return;
    }

    if (selectedPlayers.length > 15) {
      Alert.alert('Erreur', 'Vous ne pouvez pas sélectionner plus de 15 joueurs');
      return;
    }

    setSaving(true);
    const result = await gameService.setRoster(id, selectedPlayers);
    setSaving(false);

    if (result.success) {
      Alert.alert('Succès', 'Roster défini avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert('Erreur', result.error || 'Impossible de définir le roster');
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
          Le roster ne peut être modifié que pour les matchs non démarrés
        </Text>
        <Button title="Retour" onPress={() => router.back()} variant="secondary" />
      </View>
    );
  }

  if (players.length === 0) {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          <EmptyState
            icon="👥"
            title="Aucun joueur"
            subtitle="Ajoutez des joueurs à votre équipe avant de définir le roster"
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
          <Text className="text-2xl font-bold text-gray-800 mb-2">Sélection du roster</Text>
          <Text className="text-gray-600 mb-4">{game.opponent}</Text>
          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="text-sm text-gray-700">
              Sélectionnez entre 5 et 15 joueurs convoqués pour ce match
            </Text>
            <Text className="text-lg font-semibold text-blue-600 mt-2">
              {selectedPlayers.length} / 15 joueurs sélectionnés
            </Text>
            {selectedPlayers.length < 5 && (
              <Text className="text-sm text-red-600 mt-1">Minimum 5 joueurs requis</Text>
            )}
          </View>
        </View>

        {/* Players List */}
        <View className="bg-white rounded-lg overflow-hidden mb-4">
          <View className="bg-gray-100 p-3 border-b border-gray-200">
            <Text className="font-semibold text-gray-700">Joueurs de l'équipe</Text>
          </View>
          {players.map((player) => {
            const isSelected = selectedPlayers.includes(player.id);
            return (
              <TouchableOpacity
                key={player.id}
                onPress={() => togglePlayer(player.id)}
                className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${
                  isSelected ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <View className="flex-1">
                  <Text className={`text-lg font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
                    {player.firstName} {player.lastName}
                  </Text>
                  {player.position && (
                    <Text className="text-sm text-gray-600 mt-1">{player.position}</Text>
                  )}
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
            title={saving ? 'Enregistrement...' : 'Enregistrer le roster'}
            onPress={handleSave}
            disabled={selectedPlayers.length < 5 || selectedPlayers.length > 15 || saving}
          />
          <Button title="Annuler" onPress={() => router.back()} variant="secondary" />
        </View>
      </View>
    </ScrollView>
  );
}
