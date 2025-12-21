import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, RadioButton, Menu } from 'react-native-paper';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { playerService, teamService } from '@/services';
import { Button, LoadingScreen } from '@/components/common';
import type { Position, Team } from '@/types';

export default function CreatePlayerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState<Position | ''>('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [teamId, setTeamId] = useState('');

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
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Erreur', 'Le prénom et le nom sont requis');
      return;
    }

    if (!teamId.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner une équipe');
      return;
    }

    setLoading(true);

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      teamId: teamId.trim(),
      ...(nickname && { nickname: nickname.trim() }),
      ...(position && { position }),
      ...(height && { height: parseInt(height) }),
      ...(weight && { weight: parseInt(weight) }),
      ...(age && { age: parseInt(age) }),
    };

    const result = await playerService.create(payload);

    setLoading(false);

    if (result.success) {
      Alert.alert('Succès', 'Joueur créé avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert('Erreur', result.error || 'Impossible de créer le joueur');
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
          Vous devez d'abord créer une équipe avant d'ajouter des joueurs
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
        {/* Informations de base */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Informations de base</Text>

          <TextInput
            label="Prénom *"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            className="mb-3"
          />

          <TextInput
            label="Nom *"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            className="mb-3"
          />

          <TextInput
            label="Surnom"
            value={nickname}
            onChangeText={setNickname}
            mode="outlined"
            className="mb-3"
          />

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
        </View>

        {/* Position */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Position</Text>
          <RadioButton.Group
            onValueChange={(value) => setPosition(value as Position)}
            value={position}
          >
            <View className="flex-row items-center mb-2">
              <RadioButton value="Guard" />
              <Text className="ml-2">Guard (Meneur)</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <RadioButton value="Forward" />
              <Text className="ml-2">Forward (Ailier)</Text>
            </View>
            <View className="flex-row items-center">
              <RadioButton value="Center" />
              <Text className="ml-2">Center (Pivot)</Text>
            </View>
          </RadioButton.Group>
        </View>

        {/* Caractéristiques physiques */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Caractéristiques physiques
          </Text>

          <TextInput
            label="Taille (cm)"
            value={height}
            onChangeText={setHeight}
            mode="outlined"
            keyboardType="numeric"
            placeholder="ex: 185"
            className="mb-3"
          />

          <TextInput
            label="Poids (kg)"
            value={weight}
            onChangeText={setWeight}
            mode="outlined"
            keyboardType="numeric"
            placeholder="ex: 80"
            className="mb-3"
          />

          <TextInput
            label="Âge"
            value={age}
            onChangeText={setAge}
            mode="outlined"
            keyboardType="numeric"
            placeholder="ex: 25"
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
