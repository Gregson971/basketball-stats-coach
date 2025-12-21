import { useEffect, useCallback } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Text } from 'react-native';
import { authService } from '@/services';

export default function TabsLayout() {
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const isAuthenticated = await authService.isAuthenticated();
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0284c7',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color: _color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: 'Joueurs',
          tabBarLabel: 'Joueurs',
          tabBarIcon: ({ color: _color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Équipes',
          tabBarLabel: 'Équipes',
          tabBarIcon: ({ color: _color }) => <Text style={{ fontSize: 24 }}>🏀</Text>,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Matchs',
          tabBarLabel: 'Matchs',
          tabBarIcon: ({ color: _color }) => <Text style={{ fontSize: 24 }}>🎯</Text>,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Cache cette tab de la navigation
        }}
      />
    </Tabs>
  );
}
