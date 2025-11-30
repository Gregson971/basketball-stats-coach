import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { teamService } from '@/services';
import { LoadingScreen, EmptyState, InfoRow, Button } from '@/components/common';
import type { Team } from '@/types';

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, [id]);

  const loadTeam = async () => {
    setLoading(true);
    const result = await teamService.getById(id);
    if (result.success && result.data) {
      setTeam(result.data);
    } else {
      Alert.alert('Erreur', 'Impossible de charger l\'équipe');
    }
    setLoading(false);
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

        {/* Statistiques (à venir) */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Statistiques</Text>
          <Text className="text-gray-500">
            Les statistiques de l'équipe apparaîtront ici (nombre de joueurs, matchs joués, etc.)
          </Text>
        </View>

        {/* Actions */}
        <View className="mb-8">
          <Button title="Supprimer l'équipe" onPress={handleDelete} variant="danger" />
        </View>
      </View>
    </ScrollView>
  );
}
