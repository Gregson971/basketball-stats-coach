import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { gameService } from '@/services';
import { LoadingScreen, EmptyState, InfoRow, Button } from '@/components/common';
import type { Game } from '@/types';

const STATUS_LABELS = {
  not_started: 'Non démarré',
  in_progress: 'En cours',
  completed: 'Terminé',
};

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    setLoading(true);
    const result = await gameService.getById(id);
    if (result.success && result.data) {
      setGame(result.data);
    } else {
      Alert.alert('Erreur', 'Impossible de charger le match');
    }
    setLoading(false);
  };

  const handleStart = async () => {
    setActionLoading(true);
    const result = await gameService.start(id);
    setActionLoading(false);

    if (result.success && result.data) {
      setGame(result.data);
      Alert.alert('Succès', 'Match démarré');
    } else {
      Alert.alert('Erreur', 'Impossible de démarrer le match');
    }
  };

  const handleComplete = async () => {
    Alert.alert('Terminer le match', 'Êtes-vous sûr de vouloir terminer ce match ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Terminer',
        onPress: async () => {
          setActionLoading(true);
          const result = await gameService.complete(id);
          setActionLoading(false);

          if (result.success && result.data) {
            setGame(result.data);
            Alert.alert('Succès', 'Match terminé');
          } else {
            Alert.alert('Erreur', 'Impossible de terminer le match');
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer le match', 'Êtes-vous sûr de vouloir supprimer ce match ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const result = await gameService.delete(id);
          if (result.success) {
            Alert.alert('Succès', 'Match supprimé', [{ text: 'OK', onPress: () => router.back() }]);
          } else {
            Alert.alert('Erreur', 'Impossible de supprimer le match');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingScreen message="Chargement du match..." />;
  }

  if (!game) {
    return <EmptyState icon="❌" title="Match introuvable" />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="bg-white p-6 rounded-lg mb-4 items-center">
          <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">🎯</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">vs {game.opponent}</Text>
          <Text className="text-lg text-gray-500 mt-1">{STATUS_LABELS[game.status]}</Text>
        </View>

        {/* Informations */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Informations</Text>

          <InfoRow label="Statut" value={STATUS_LABELS[game.status]} />
          {game.gameDate && (
            <InfoRow
              label="Date"
              value={new Date(game.gameDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          )}
          {game.location && <InfoRow label="Lieu" value={game.location} />}
          {game.notes && <InfoRow label="Notes" value={game.notes} />}
          {game.startedAt && (
            <InfoRow label="Démarré le" value={new Date(game.startedAt).toLocaleString('fr-FR')} />
          )}
          {game.completedAt && (
            <InfoRow
              label="Terminé le"
              value={new Date(game.completedAt).toLocaleString('fr-FR')}
            />
          )}
        </View>

        {/* Actions du match */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Actions</Text>

          {game.status === 'not_started' && (
            <View className="mb-3">
              <Button
                title="Démarrer le match"
                onPress={handleStart}
                variant="primary"
                loading={actionLoading}
              />
            </View>
          )}

          {game.status === 'in_progress' && (
            <>
              <View className="mb-3">
                <Button
                  title="Enregistrer des stats"
                  onPress={() => router.push(`/games/${id}/stats`)}
                  variant="primary"
                />
              </View>
              <View className="mb-3">
                <Button
                  title="Terminer le match"
                  onPress={handleComplete}
                  variant="secondary"
                  loading={actionLoading}
                />
              </View>
            </>
          )}

          {game.status === 'completed' && (
            <View className="mb-3">
              <Button
                title="Voir les statistiques du match"
                onPress={() => router.push(`/games/${id}/summary`)}
                variant="primary"
              />
            </View>
          )}

          {game.status === 'in_progress' && (
            <View className="mb-3">
              <Button
                title="Voir les stats en cours"
                onPress={() => router.push(`/games/${id}/summary`)}
                variant="secondary"
              />
            </View>
          )}
        </View>

        {/* Supprimer */}
        <View className="mb-8">
          <Button title="Supprimer le match" onPress={handleDelete} variant="danger" />
        </View>
      </View>
    </ScrollView>
  );
}
