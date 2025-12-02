import { View, Text, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Menu } from 'react-native-paper';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { gameService, teamService } from '@/services';
import { Button, LoadingScreen } from '@/components/common';
import type { Team } from '@/types';

export default function CreateGameScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  // Form state
  const [teamId, setTeamId] = useState('');
  const [opponent, setOpponent] = useState('');
  const [gameDate, setGameDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Charge les équipes au montage et à chaque focus
  useFocusEffect(
    useCallback(() => {
      loadTeams();
    }, [])
  );

  const loadTeams = async () => {
    setLoadingTeams(true);
    const result = await teamService.getAll();
    if (result.success && result.data) {
      setTeams(result.data);
    }
    setLoadingTeams(false);
  };

  const selectedTeam = teams.find((t) => t.id === teamId);

  const handleCreate = async () => {
    // Validation
    if (!teamId.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner une équipe');
      return;
    }

    if (!opponent.trim()) {
      Alert.alert('Erreur', "Le nom de l'adversaire est requis");
      return;
    }

    setLoading(true);

    const payload = {
      teamId: teamId.trim(),
      opponent: opponent.trim(),
      ...(gameDate && { gameDate }),
      ...(location && { location: location.trim() }),
      ...(notes && { notes: notes.trim() }),
    };

    const result = await gameService.create(payload);

    setLoading(false);

    if (result.success) {
      Alert.alert('Succès', 'Match créé avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert('Erreur', result.error || 'Impossible de créer le match');
    }
  };

  if (loadingTeams) {
    return <LoadingScreen message="Chargement des équipes..." />;
  }

  // Si aucune équipe n'existe
  if (teams.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-8">
        <Text className="text-6xl mb-4">🏀</Text>
        <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
          Aucune équipe disponible
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Vous devez d'abord créer une équipe avant de programmer des matchs
        </Text>
        <View className="w-full max-w-xs gap-3">
          <Button
            title="Créer une équipe"
            onPress={() => router.push('/teams/create')}
            variant="primary"
          />
          <Button title="Retour" onPress={() => router.back()} variant="secondary" />
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Informations du match */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Informations du match</Text>

          {/* Sélecteur d'équipe */}
          <View className="mb-3">
            <Text className="text-sm text-gray-600 mb-2">Équipe *</Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  className="border border-gray-400 rounded px-4 py-3 bg-white"
                >
                  <Text className={teamId ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedTeam ? selectedTeam.name : 'Sélectionner une équipe'}
                  </Text>
                </TouchableOpacity>
              }
            >
              {teams.map((team) => (
                <Menu.Item
                  key={team.id}
                  onPress={() => {
                    setTeamId(team.id);
                    setMenuVisible(false);
                  }}
                  title={team.name}
                />
              ))}
            </Menu>
          </View>

          <TextInput
            label="Adversaire *"
            value={opponent}
            onChangeText={setOpponent}
            mode="outlined"
            placeholder="ex: Tigers"
            className="mb-3"
          />

          {/* Date Picker */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                label="Date du match"
                value={gameDate ? gameDate.toLocaleDateString('fr-FR') : ''}
                mode="outlined"
                placeholder="Sélectionner une date"
                className="mb-3"
                right={<TextInput.Icon icon="calendar" />}
              />
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={gameDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setGameDate(selectedDate);
                }
              }}
            />
          )}

          <TextInput
            label="Lieu"
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            placeholder="ex: Gymnase Municipal"
            className="mb-3"
          />

          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            placeholder="Notes optionnelles"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Boutons */}
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1">
            <Button
              title="Annuler"
              onPress={() => router.back()}
              variant="secondary"
              disabled={loading}
            />
          </View>
          <View className="flex-1">
            <Button title="Créer" onPress={handleCreate} variant="primary" loading={loading} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
