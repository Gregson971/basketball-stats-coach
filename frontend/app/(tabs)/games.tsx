import { View, FlatList } from 'react-native';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { gameService } from '@/services';
import { LoadingScreen, EmptyState, GameCard, Button } from '@/components/common';
import type { Game } from '@/types';

export default function GamesScreen() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Recharge la liste à chaque fois que l'écran devient actif
  useFocusEffect(
    useCallback(() => {
      loadGames();
    }, [])
  );

  const loadGames = async () => {
    setLoading(true);
    const result = await gameService.getAll();
    if (result.success && result.data) {
      setGames(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen message="Chargement des matchs..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header avec bouton d'ajout */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Link href="/games/create" asChild>
          <View>
            <Button title="+ Nouveau match" onPress={() => router.push('/games/create')} />
          </View>
        </Link>
      </View>

      {/* Liste des matchs */}
      {games.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="Aucun match"
          description="Commencez par créer votre premier match"
        />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <GameCard game={item} onPress={() => router.push(`/games/${item.id}`)} />
          )}
        />
      )}
    </View>
  );
}
