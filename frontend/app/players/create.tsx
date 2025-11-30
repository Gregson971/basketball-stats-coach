import { View, Text, ScrollView, Alert } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { playerService } from '@/services';
import { Button } from '@/components/common';
import type { Position } from '@/types';

export default function CreatePlayerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState<Position | ''>('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [teamId, setTeamId] = useState('');

  const handleCreate = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Erreur', 'Le prénom et le nom sont requis');
      return;
    }

    if (!teamId.trim()) {
      Alert.alert('Erreur', "L'ID de l'équipe est requis");
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

          <TextInput
            label="ID de l'équipe *"
            value={teamId}
            onChangeText={setTeamId}
            mode="outlined"
            placeholder="ex: team-123"
            className="mb-3"
          />
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
