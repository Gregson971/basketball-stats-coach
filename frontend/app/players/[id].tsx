import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { playerService } from '@/services';
import { LoadingScreen, EmptyState, InfoRow, Button } from '@/components/common';
import type { Player } from '@/types';

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayer();
  }, [id]);

  const loadPlayer = async () => {
    setLoading(true);
    const result = await playerService.getById(id);
    if (result.success && result.data) {
      setPlayer(result.data);
    } else {
      Alert.alert('Erreur', 'Impossible de charger le joueur');
    }
    setLoading(false);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer le joueur', 'Êtes-vous sûr de vouloir supprimer ce joueur ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const result = await playerService.delete(id);
          if (result.success) {
            Alert.alert('Succès', 'Joueur supprimé', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          } else {
            Alert.alert('Erreur', 'Impossible de supprimer le joueur');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingScreen message="Chargement du joueur..." />;
  }

  if (!player) {
    return <EmptyState icon="❌" title="Joueur introuvable" />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header avec photo */}
        <View className="bg-white p-6 rounded-lg mb-4 items-center">
          <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {player.firstName} {player.lastName}
          </Text>
          {player.nickname && (
            <Text className="text-lg text-gray-500 mt-1">"{player.nickname}"</Text>
          )}
        </View>

        {/* Informations */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Informations</Text>

          {player.position && <InfoRow label="Position" value={player.position} />}
          {player.height && <InfoRow label="Taille" value={`${player.height} cm`} />}
          {player.weight && <InfoRow label="Poids" value={`${player.weight} kg`} />}
          {player.age && <InfoRow label="Âge" value={`${player.age} ans`} />}
          <InfoRow label="Équipe ID" value={player.teamId} />
        </View>

        {/* Statistiques (à venir) */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Statistiques</Text>
          <Text className="text-gray-500">Les statistiques apparaîtront ici</Text>
        </View>

        {/* Actions */}
        <View className="mb-8">
          <Button title="Supprimer le joueur" onPress={handleDelete} variant="danger" />
        </View>
      </View>
    </ScrollView>
  );
}
