# StatCoach Pro - Frontend Mobile

Application mobile React Native pour le suivi statistique de basketball en temps réel.

![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)
![Expo](https://img.shields.io/badge/Expo-54-000020)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![NativeWind](https://img.shields.io/badge/NativeWind-4.2-38bdf8)

---

## 📋 Table des matières

- [Technologies](#-technologies)
- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Architecture](#-architecture)
- [Configuration](#-configuration)
- [Développement](#-développement)

---

## 🛠️ Technologies

### Core

- **React Native 0.81** - Framework mobile cross-platform
- **Expo 54** - Toolchain et plateforme de développement
- **TypeScript 5.9** - Typage statique

### State Management

- **Zustand 5.0** - State management léger et moderne

### UI & Styling

- **NativeWind 4.2** - Tailwind CSS pour React Native
- **React Native Paper 5.14** - Composants Material Design (forms, modals, inputs)

### API

- **Fetch API** - Client HTTP natif
- **Backend**: https://basketball-stats-coach-production.up.railway.app

---

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- Expo CLI (installé automatiquement)
- iOS Simulator (macOS) ou Android Studio
- Expo Go app (pour tester sur device physique)

### Installation des dépendances

```bash
cd frontend
npm install
```

---

## 🚀 Démarrage

### Développement

```bash
# Démarrer le serveur Expo
npm start

# Démarrer sur iOS Simulator (macOS uniquement)
npm run ios

# Démarrer sur Android Emulator
npm run android

# Démarrer sur le web
npm run web
```

### Scanner le QR Code

1. Lancer `npm start`
2. Scanner le QR code avec :
   - **iOS** : Camera app
   - **Android** : Expo Go app

---

## 🏗️ Architecture

### Structure des dossiers

```
frontend/
├── App.tsx                     # Point d'entrée de l'application
├── global.css                  # Styles globaux Tailwind
├── src/
│   ├── api/                    # Client API et services
│   │   └── client.ts           # HTTP client générique
│   ├── stores/                 # Zustand stores
│   │   └── useGameStore.ts     # Store pour l'état du match
│   ├── components/
│   │   ├── common/             # Composants custom (NativeWind)
│   │   └── ui/                 # Composants Paper (forms, modals)
│   ├── screens/                # Écrans de l'app
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Fonctions utilitaires
│   ├── types/                  # Définitions TypeScript
│   │   └── index.ts            # Types principaux (Player, Game, Stats)
│   └── constants/
│       └── api.ts              # Configuration API
├── assets/                     # Images, fonts, etc.
├── tailwind.config.js          # Configuration Tailwind
├── tsconfig.json               # Configuration TypeScript
└── package.json
```

### Principes d'architecture

- **Component-based**: Composants réutilisables et modulaires
- **Type-safe**: TypeScript strict activé
- **State management**: Zustand pour la gestion d'état globale
- **API Integration**: Client centralisé pour le backend
- **Styling**: NativeWind (Tailwind) + React Native Paper

---

## 🔧 Configuration

### Variables d'environnement

Les URLs de l'API sont configurées dans `src/constants/api.ts`:

```typescript
export const API_CONFIG = {
  DEV_URL: 'http://localhost:3000',
  PROD_URL: 'https://basketball-stats-coach-production.up.railway.app',
  get BASE_URL() {
    return __DEV__ ? this.DEV_URL : this.PROD_URL;
  },
};
```

### Path Aliases

Les imports peuvent utiliser des aliases (`tsconfig.json`):

```typescript
import { apiClient } from '@/api/client';
import { useGameStore } from '@/stores/useGameStore';
import type { Player, Game } from '@/types';
```

### Tailwind Configuration

Les couleurs et le thème sont configurés dans `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9',
        600: '#0284c7',
        // ...
      },
    },
  },
}
```

---

## 💻 Développement

### Utiliser NativeWind (Tailwind CSS)

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-primary-600">
        Hello StatCoach!
      </Text>
    </View>
  );
}
```

### Utiliser Zustand Store

```tsx
import { useGameStore } from '@/stores/useGameStore';

export default function GameScreen() {
  const { currentGame, players, setCurrentGame } = useGameStore();

  // Utiliser l'état...
}
```

### Appeler l'API Backend

```tsx
import { apiClient } from '@/api/client';
import { API_CONFIG } from '@/constants/api';

// GET request
const result = await apiClient.get(API_CONFIG.ENDPOINTS.PLAYERS);
if (result.success) {
  console.log(result.data);
}

// POST request
const newPlayer = await apiClient.post(API_CONFIG.ENDPOINTS.PLAYERS, {
  firstName: 'John',
  lastName: 'Doe',
  teamId: 'team-123',
});
```

### React Native Paper (Forms & Modals)

```tsx
import { TextInput, Button } from 'react-native-paper';

export default function LoginForm() {
  return (
    <>
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
      />
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
    </>
  );
}
```

---

## 📱 Fonctionnalités à implémenter

### Phase 1 (Setup) ✅

- [x] Configuration Expo + TypeScript
- [x] NativeWind (Tailwind CSS)
- [x] Zustand state management
- [x] API client
- [x] Structure de dossiers

### Phase 2 (Écrans de base)

- [ ] Écran de sélection d'équipe
- [ ] Écran de liste des matchs
- [ ] Écran de création de match

### Phase 3 (Match en temps réel)

- [ ] Écran de match actif
- [ ] Interface d'enregistrement de stats
- [ ] Visualisation des stats en temps réel
- [ ] Fonction Undo

### Phase 4 (Statistiques)

- [ ] Écran des stats d'un joueur
- [ ] Écran des stats d'équipe
- [ ] Graphiques et visualisations

### Phase 5 (Offline & Sync)

- [ ] Mode hors-ligne
- [ ] Synchronisation automatique

---

## 🔗 Liens utiles

- **Backend API**: https://basketball-stats-coach-production.up.railway.app/api-docs
- **Expo Docs**: https://docs.expo.dev/
- **NativeWind Docs**: https://www.nativewind.dev/
- **Zustand Docs**: https://zustand-demo.pmnd.rs/
- **React Native Paper**: https://reactnativepaper.com/

---

## 📞 Support

Pour toute question ou problème :

- **GitHub Issues**: https://github.com/Gregson971/basketball-stats-coach/issues
- **Backend Docs**: ../backend/README.md

---

**Fait avec ❤️ pour les passionnés de basketball**
