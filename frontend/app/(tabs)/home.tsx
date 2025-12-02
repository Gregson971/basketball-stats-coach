import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services';

export default function HomeScreen() {
  const router = useRouter();

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

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-sky-600 p-6 pb-8">
        <Text className="text-white text-3xl font-bold mb-2">StatCoach Pro</Text>
        <Text className="text-sky-100 text-base">
          Gérez vos équipes et suivez les statistiques de vos matchs
        </Text>
      </View>

      {/* Quick Actions */}
      <View className="p-4 gap-4">
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">Actions rapides</Text>

          <View className="gap-3">
            <TouchableOpacity
              onPress={() => router.push('/players/create')}
              className="bg-sky-600 p-4 rounded-lg flex-row items-center"
            >
              <Text className="text-3xl mr-3">👤</Text>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Nouveau joueur</Text>
                <Text className="text-sky-100 text-sm">Ajouter un joueur à votre effectif</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/teams/create')}
              className="bg-orange-600 p-4 rounded-lg flex-row items-center"
            >
              <Text className="text-3xl mr-3">🏀</Text>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Nouvelle équipe</Text>
                <Text className="text-orange-100 text-sm">Créer une nouvelle équipe</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/games/create')}
              className="bg-green-600 p-4 rounded-lg flex-row items-center"
            >
              <Text className="text-3xl mr-3">🎯</Text>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">Nouveau match</Text>
                <Text className="text-green-100 text-sm">Programmer un nouveau match</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Sections */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">Navigation</Text>

          <View className="gap-2">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/players')}
              className="p-4 border border-gray-200 rounded-lg flex-row items-center"
            >
              <Text className="text-2xl mr-3">👤</Text>
              <Text className="text-gray-800 font-medium text-base flex-1">
                Voir tous les joueurs
              </Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/teams')}
              className="p-4 border border-gray-200 rounded-lg flex-row items-center"
            >
              <Text className="text-2xl mr-3">🏀</Text>
              <Text className="text-gray-800 font-medium text-base flex-1">
                Voir toutes les équipes
              </Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/games')}
              className="p-4 border border-gray-200 rounded-lg flex-row items-center"
            >
              <Text className="text-2xl mr-3">🎯</Text>
              <Text className="text-gray-800 font-medium text-base flex-1">
                Voir tous les matchs
              </Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="mt-4">
          <TouchableOpacity onPress={handleLogout} className="bg-red-600 p-4 rounded-lg">
            <Text className="text-white font-semibold text-center text-base">Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
