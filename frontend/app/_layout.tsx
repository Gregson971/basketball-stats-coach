import '../global.css';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0284c7',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="players/create" options={{ title: 'Nouveau joueur' }} />
          <Stack.Screen name="players/[id]" options={{ title: 'Détails du joueur' }} />
          <Stack.Screen name="teams/create" options={{ title: 'Nouvelle équipe' }} />
          <Stack.Screen name="teams/[id]" options={{ title: 'Détails de l\'équipe' }} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
