import { View, Text, ScrollView, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { gameService, playerService, statsService } from '@/services';
import { LoadingScreen, EmptyState, ActionButton, StatsPanel } from '@/components/common';
import type { Game, Player, ActionType, GameStats } from '@/types';

export default function GameStatsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentStats, setCurrentStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    loadGameAndPlayers();
  }, [id]);

  // Charger les stats quand un joueur est sélectionné
  useEffect(() => {
    if (selectedPlayer) {
      loadPlayerStats();
    }
  }, [selectedPlayer]);

  const loadPlayerStats = async () => {
    if (!selectedPlayer) return;

    const result = await statsService.getPlayerGameStats(id, selectedPlayer.id);
    if (result.success && result.data) {
      setCurrentStats(result.data);
    } else {
      // Aucune stats encore, initialiser à zéro
      setCurrentStats({
        gameId: id,
        playerId: selectedPlayer.id,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        twoPointsMade: 0,
        twoPointsAttempted: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        personalFouls: 0,
      });
    }
  };

  const loadGameAndPlayers = async () => {
    setLoading(true);

    // Charger le match
    const gameResult = await gameService.getById(id);
    if (gameResult.success && gameResult.data) {
      setGame(gameResult.data);

      // Charger les joueurs de l'équipe
      const playersResult = await playerService.getByTeam(gameResult.data.teamId);
      if (playersResult.success && playersResult.data) {
        setPlayers(playersResult.data);
        // Sélectionner automatiquement le premier joueur
        if (playersResult.data.length > 0) {
          setSelectedPlayer(playersResult.data[0]);
        }
      }
    }

    setLoading(false);
  };

  const recordAction = async (actionType: ActionType, made?: boolean) => {
    if (!selectedPlayer) {
      Alert.alert('Erreur', 'Veuillez sélectionner un joueur');
      return;
    }

    setRecording(true);

    const result = await statsService.recordAction({
      gameId: id,
      playerId: selectedPlayer.id,
      actionType,
      made,
    });

    setRecording(false);

    if (result.success && result.data) {
      // Mettre à jour les stats affichées
      setCurrentStats(result.data);
    } else {
      Alert.alert('Erreur', result.error || 'Impossible d\'enregistrer l\'action');
    }
  };

  const undoLastAction = async () => {
    if (!selectedPlayer) {
      Alert.alert('Erreur', 'Veuillez sélectionner un joueur');
      return;
    }

    Alert.alert('Annuler', 'Annuler la dernière action de ce joueur ?', [
      { text: 'Non', style: 'cancel' },
      {
        text: 'Oui',
        onPress: async () => {
          const result = await statsService.undoLastAction(id, selectedPlayer.id);
          if (result.success && result.data) {
            // Mettre à jour les stats affichées
            setCurrentStats(result.data);
          } else {
            Alert.alert('Erreur', 'Impossible d\'annuler l\'action');
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

  if (game.status !== 'in_progress') {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-4xl mb-4">⚠️</Text>
        <Text className="text-xl font-semibold text-gray-700 text-center">
          Le match doit être en cours
        </Text>
        <Text className="text-gray-500 mt-2 text-center">
          Démarrez le match depuis l'écran des détails
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header - Liste des joueurs */}
      <View className="bg-white border-b border-gray-200 p-3">
        <Text className="text-xs font-semibold text-gray-500 mb-2">JOUEURS</Text>
        <FlatList
          horizontal
          data={players}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              className={`mr-2 p-3 rounded-lg border-2 ${
                selectedPlayer?.id === item.id
                  ? 'bg-primary-100 border-primary-500'
                  : 'bg-gray-50 border-gray-200'
              }`}
              onTouchEnd={() => setSelectedPlayer(item)}
            >
              <Text
                className={`font-bold ${selectedPlayer?.id === item.id ? 'text-primary-700' : 'text-gray-700'}`}
              >
                {item.firstName} {item.lastName}
              </Text>
              {item.position && (
                <Text className="text-xs text-gray-500">{item.position}</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Actions Grid */}
      <ScrollView className="flex-1 p-4">
        {selectedPlayer ? (
          <>
            {/* Stats en temps réel */}
            <View className="mb-4">
              <StatsPanel
                stats={currentStats}
                playerName={`${selectedPlayer.firstName} ${selectedPlayer.lastName}`}
              />
            </View>

            {/* Tirs réussis */}
            <Text className="text-sm font-semibold text-gray-700 mb-2">TIRS RÉUSSIS</Text>
            <View className="flex-row gap-2 mb-4">
              <View className="flex-1">
                <ActionButton
                  title="1 PT"
                  icon="✓"
                  variant="success"
                  onPress={() => recordAction('freeThrow', true)}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="2 PTS"
                  icon="✓"
                  variant="success"
                  onPress={() => recordAction('twoPoint', true)}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="3 PTS"
                  icon="✓"
                  variant="success"
                  onPress={() => recordAction('threePoint', true)}
                  disabled={recording}
                />
              </View>
            </View>

            {/* Tirs manqués */}
            <Text className="text-sm font-semibold text-gray-700 mb-2">TIRS MANQUÉS</Text>
            <View className="flex-row gap-2 mb-4">
              <View className="flex-1">
                <ActionButton
                  title="X MISSED FT"
                  icon="✗"
                  variant="danger"
                  onPress={() => recordAction('freeThrow', false)}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="X MISSED 2PT"
                  icon="✗"
                  variant="danger"
                  onPress={() => recordAction('twoPoint', false)}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="X MISSED 3PT"
                  icon="✗"
                  variant="danger"
                  onPress={() => recordAction('threePoint', false)}
                  disabled={recording}
                />
              </View>
            </View>

            {/* Actions offensives et défensives */}
            <Text className="text-sm font-semibold text-gray-700 mb-2">ACTIONS</Text>
            <View className="flex-row gap-2 mb-4">
              <View className="flex-1">
                <ActionButton
                  title="OFF. REB"
                  icon="🏀"
                  variant="warning"
                  onPress={() => recordAction('offensiveRebound')}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="DEF. REB"
                  icon="🛡️"
                  variant="warning"
                  onPress={() => recordAction('defensiveRebound')}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="ASSIST"
                  icon="🤝"
                  variant="warning"
                  onPress={() => recordAction('assist')}
                  disabled={recording}
                />
              </View>
            </View>

            <View className="flex-row gap-2 mb-4">
              <View className="flex-1">
                <ActionButton
                  title="STEAL"
                  icon="💨"
                  variant="warning"
                  onPress={() => recordAction('steal')}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="BLOCK"
                  icon="🚫"
                  variant="warning"
                  onPress={() => recordAction('block')}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="TURNOVER"
                  icon="⚠️"
                  variant="warning"
                  onPress={() => recordAction('turnover')}
                  disabled={recording}
                />
              </View>
            </View>

            <View className="flex-row gap-2 mb-4">
              <View className="flex-1">
                <ActionButton
                  title="FOUL"
                  icon="🟨"
                  variant="warning"
                  onPress={() => recordAction('personalFoul')}
                  disabled={recording}
                />
              </View>
              <View className="flex-1">
                <ActionButton
                  title="UNDO"
                  icon="↩️"
                  variant="gray"
                  onPress={undoLastAction}
                  disabled={recording}
                />
              </View>
              <View className="flex-1" />
            </View>
          </>
        ) : (
          <EmptyState
            icon="👆"
            title="Sélectionnez un joueur"
            description="Choisissez un joueur pour commencer à enregistrer les statistiques"
          />
        )}
      </ScrollView>
    </View>
  );
}
