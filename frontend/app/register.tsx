/**
 * Register Screen
 * User registration screen
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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        // Redirect to main app
        router.replace('/(tabs)');
      } else {
        Alert.alert("Erreur d'inscription", result.error || 'Impossible de créer le compte');
      }
    } catch (error) {
      Alert.alert('Erreur', "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/login');
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

          {/* Register Form */}
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Inscription</Text>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Nom complet</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

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
            <View className="mb-4">
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

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Confirmer le mot de passe</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`rounded-lg py-4 ${loading ? 'bg-sky-400' : 'bg-sky-600'}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? 'Inscription...' : "S'inscrire"}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-600">Déjà un compte ? </Text>
              <TouchableOpacity onPress={goToLogin} disabled={loading}>
                <Text className="text-sky-600 font-semibold">Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
