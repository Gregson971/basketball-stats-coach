/**
 * Welcome Screen
 * Entry point - redirects to login or main app based on auth status
 */

import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuthenticated = await authService.isAuthenticated();

    if (isAuthenticated) {
      // User is logged in, go to main app
      router.replace('/(tabs)');
    } else {
      // User not logged in, go to login
      router.replace('/login');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-sky-600">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="mt-4 text-white text-lg font-semibold">StatCoach Pro</Text>
      <Text className="mt-2 text-white/80">Chargement...</Text>
    </View>
  );
}
