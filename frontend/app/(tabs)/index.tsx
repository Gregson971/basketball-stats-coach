import { View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { playerService, authService } from '@/services';
import { LoadingScreen, EmptyState, PlayerCard, Button } from '@/components/common';
import type { Player } from '@/types';

export default function PlayersScreen() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Recharge la liste à chaque fois que l'écran devient actif
  useFocusEffect(
    useCallback(() => {
      loadPlayers();
    }, [])
  );

  const loadPlayers = async () => {
    setLoading(true);
    const result = await playerService.getAll();
    if (result.success && result.data) {
      setPlayers(result.data);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            router.replace('/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <LoadingScreen message="Chargement des joueurs..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header avec boutons */}
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Link href="/players/create" asChild>
              <View>
                <Button title="+ Nouveau joueur" onPress={() => router.push('/players/create')} />
              </View>
            </Link>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 px-4 py-3 rounded-lg justify-center"
          >
            <Text className="text-white font-semibold">Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste des joueurs */}
      {players.length === 0 ? (
        <EmptyState
          icon="👤"
          title="Aucun joueur"
          description="Commencez par ajouter votre premier joueur"
        />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <PlayerCard player={item} onPress={() => router.push(`/players/${item.id}`)} />
          )}
        />
      )}
    </View>
  );
}
