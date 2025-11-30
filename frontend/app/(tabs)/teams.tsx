import { View, FlatList } from 'react-native';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { teamService } from '@/services';
import { LoadingScreen, EmptyState, TeamCard, Button } from '@/components/common';
import type { Team } from '@/types';

export default function TeamsScreen() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Recharge la liste à chaque fois que l'écran devient actif
  useFocusEffect(
    useCallback(() => {
      loadTeams();
    }, [])
  );

  const loadTeams = async () => {
    setLoading(true);
    const result = await teamService.getAll();
    if (result.success && result.data) {
      setTeams(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen message="Chargement des équipes..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header avec bouton d'ajout */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Link href="/teams/create" asChild>
          <View>
            <Button title="+ Nouvelle équipe" onPress={() => router.push('/teams/create')} />
          </View>
        </Link>
      </View>

      {/* Liste des équipes */}
      {teams.length === 0 ? (
        <EmptyState
          icon="🏀"
          title="Aucune équipe"
          description="Commencez par ajouter votre première équipe"
        />
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TeamCard team={item} onPress={() => router.push(`/teams/${item.id}`)} />
          )}
        />
      )}
    </View>
  );
}
