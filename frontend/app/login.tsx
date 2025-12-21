/**
 * Login Screen
 * User authentication screen
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login({ email: email.trim(), password });

      if (result.success) {
        // Redirect to main app
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erreur de connexion', result.error || 'Email ou mot de passe invalide');
      }
    } catch {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-sky-600"
    >
      <ScrollView contentContainerClassName="flex-grow">
        <View className="flex-1 justify-center px-8">
          {/* Logo/Title */}
          <View className="items-center mb-12">
            <Image
              source={require('../assets/icon.png')}
              style={{ width: 64, height: 64, marginBottom: 8 }}
            />
            <Text className="text-3xl font-bold text-white">StatCoach Pro</Text>
            <Text className="text-white/80 mt-2">Gestion de stats basketball</Text>
          </View>

          {/* Login Form */}
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Connexion</Text>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Email</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Mot de passe</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`rounded-lg py-4 ${loading ? 'bg-sky-400' : 'bg-sky-600'}`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-600">Pas encore de compte ? </Text>
              <TouchableOpacity onPress={goToRegister} disabled={loading}>
                <Text className="text-sky-600 font-semibold">S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
