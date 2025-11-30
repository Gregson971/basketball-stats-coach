import './global.css';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-primary-600 mb-4">🏀 StatCoach Pro</Text>
      <Text className="text-gray-600 mb-2">Basketball Stats Tracking App</Text>
      <Text className="text-sm text-gray-400">Powered by Expo + NativeWind + Zustand</Text>
      <StatusBar style="auto" />
    </View>
  );
}
