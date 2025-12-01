import { View, Text, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { gameService } from '@/services';
import { Button } from '@/components/common';

export default function CreateGameScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [teamId, setTeamId] = useState('');
  const [opponent, setOpponent] = useState('');
  const [gameDate, setGameDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreate = async () => {
    // Validation
    if (!teamId.trim() || !opponent.trim()) {
      Alert.alert('Erreur', "L'ID de l'équipe et l'adversaire sont requis");
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

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Informations du match */}
        <View className="bg-white p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Informations du match</Text>

          <TextInput
            label="ID de l'équipe *"
            value={teamId}
            onChangeText={setTeamId}
            mode="outlined"
            placeholder="ex: team-123"
            className="mb-3"
          />

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
