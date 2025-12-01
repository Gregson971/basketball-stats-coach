import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
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
        name="index"
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
    </Tabs>
  );
}
