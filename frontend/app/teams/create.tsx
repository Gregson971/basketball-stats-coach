import { View, Text, ScrollView, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { teamService } from '@/services';
import { Button } from '@/components/common';

export default function CreateTeamScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [coach, setCoach] = useState('');
  const [season, setSeason] = useState('');
  const [league, setLeague] = useState('');

  const handleCreate = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom de l\'équipe est requis');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      ...(coach && { coach: coach.trim() }),
      ...(season && { season: season.trim() }),
      ...(league && { league: league.trim() }),
    };

    const result = await teamService.create(payload);

    setLoading(false);

    if (result.success) {
      Alert.alert('Succès', 'Équipe créée avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert('Erreur', result.error || 'Impossible de créer l\'équipe');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Informations de l'équipe */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Informations de l'équipe
          </Text>

          <TextInput
            label="Nom de l'équipe *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            placeholder="ex: Wild Cats"
            className="mb-3"
          />

          <TextInput
            label="Coach"
            value={coach}
            onChangeText={setCoach}
            mode="outlined"
            placeholder="ex: John Smith"
            className="mb-3"
          />

          <TextInput
            label="Saison"
            value={season}
            onChangeText={setSeason}
            mode="outlined"
            placeholder="ex: 2024-2025"
            className="mb-3"
          />

          <TextInput
            label="Ligue"
            value={league}
            onChangeText={setLeague}
            mode="outlined"
            placeholder="ex: Nationale 1"
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
            <Button
              title="Créer"
              onPress={handleCreate}
              variant="primary"
              loading={loading}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
