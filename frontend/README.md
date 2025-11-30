# StatCoach Pro - Frontend Mobile

Application mobile React Native pour le suivi statistique de basketball en temps réel.

![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)
![Expo](https://img.shields.io/badge/Expo-54-000020)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![NativeWind](https://img.shields.io/badge/NativeWind-4.2-38bdf8)
![Expo Router](https://img.shields.io/badge/Expo%20Router-6.0-000020)

---

## 📋 Table des matières

- [Technologies](#-technologies)
- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Architecture](#-architecture)
- [Navigation](#-navigation)
- [Composants](#-composants)
- [Services](#-services)
- [Développement](#-développement)

---

## 🛠️ Technologies

### Core

- **React Native 0.81** - Framework mobile cross-platform
- **Expo 54** - Toolchain et plateforme de développement
- **TypeScript 5.9** - Typage statique
- **Expo Router 6.0** - Navigation file-based (comme Next.js)

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
- Backend API en cours d'exécution (voir [../backend/README.md](../backend/README.md))

### Installation des dépendances

```bash
cd frontend
npm install
```

### Configuration des variables d'environnement

1. **Copier le fichier d'exemple :**
```bash
cp .env.example .env
```

2. **Configurer votre IP locale :**
```bash
# Trouver votre IP locale
ifconfig | grep "inet " | grep -v 127.0.0.1

# Éditer .env et remplacer par votre IP
# EXPO_PUBLIC_API_URL=http://VOTRE_IP:3000
```

**Important :**
- Le fichier `.env` est gitignored (ne sera pas commité)
- Pour tester sur **simulateur iOS** : `http://localhost:3000` fonctionne
- Pour tester sur **appareil physique** : utilisez votre IP locale (ex: `http://192.168.1.89:3000`)

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
├── app/                            # Navigation Expo Router (file-based)
│   ├── _layout.tsx                 # Layout racine avec Stack Navigator
│   ├── (tabs)/                     # Groupe de navigation par tabs
│   │   ├── _layout.tsx             # Tabs Navigator (Joueurs, Équipes, Matchs)
│   │   ├── index.tsx               # Écran: Liste des joueurs
│   │   ├── teams.tsx               # Écran: Équipes
│   │   └── games.tsx               # Écran: Matchs
│   └── players/                    # Routes des joueurs
│       ├── create.tsx              # Écran: Créer un joueur
│       └── [id].tsx                # Écran: Détails du joueur (dynamic route)
│
├── src/
│   ├── api/                        # Client API
│   │   └── client.ts               # HTTP client générique
│   │
│   ├── services/                   # Services métier
│   │   ├── playerService.ts        # Service des joueurs
│   │   └── index.ts
│   │
│   ├── stores/                     # Zustand stores
│   │   └── useGameStore.ts         # Store pour l'état du match
│   │
│   ├── components/
│   │   ├── common/                 # Composants réutilisables
│   │   │   ├── Button.tsx          # Bouton personnalisé
│   │   │   ├── LoadingScreen.tsx   # Écran de chargement
│   │   │   ├── EmptyState.tsx      # État vide
│   │   │   ├── PlayerCard.tsx      # Card joueur
│   │   │   ├── InfoRow.tsx         # Ligne d'information
│   │   │   └── index.ts
│   │   └── ui/                     # Composants Paper (forms, modals)
│   │
│   ├── hooks/                      # Custom React hooks
│   │
│   ├── utils/                      # Fonctions utilitaires
│   │
│   ├── types/                      # Définitions TypeScript
│   │   └── index.ts                # Types: Player, Game, Team, Stats
│   │
│   └── constants/
│       └── api.ts                  # Configuration API (URLs, endpoints)
│
├── assets/                         # Images, fonts, etc.
├── global.css                      # Styles globaux Tailwind
├── tailwind.config.js              # Configuration Tailwind
├── app.json                        # Configuration Expo
├── tsconfig.json                   # Configuration TypeScript
└── package.json
```

### Principes d'architecture

- **File-based Routing**: Navigation Expo Router (convention over configuration)
- **Component-based**: Composants réutilisables et modulaires
- **Type-safe**: TypeScript strict activé
- **State management**: Zustand pour l'état global
- **Service Layer**: Services dédiés pour les appels API
- **Styling**: NativeWind (Tailwind) + React Native Paper

---

## 🗺️ Navigation

### Structure de navigation

```
App
├── (tabs)                          # Bottom Tab Navigator
│   ├── Joueurs (index)             # Liste des joueurs
│   ├── Équipes                     # À venir
│   └── Matchs                      # À venir
│
└── Stack Navigator
    ├── Créer un joueur             # /players/create
    └── Détails du joueur           # /players/[id]
```

### Routes implémentées

| Route                | Écran                    | Description                        |
| -------------------- | ------------------------ | ---------------------------------- |
| `/`                  | Liste des joueurs        | Affiche tous les joueurs           |
| `/players/create`    | Création de joueur       | Formulaire de création             |
| `/players/[id]`      | Détails du joueur        | Infos et stats du joueur           |
| `/teams`             | Équipes (placeholder)    | À venir                            |
| `/games`             | Matchs (placeholder)     | À venir                            |

### Navigation programmatique

```tsx
import { useRouter, Link } from 'expo-router';

// Navigation avec hooks
const router = useRouter();
router.push('/players/create');
router.back();

// Navigation avec Link
<Link href="/players/123">Voir le joueur</Link>
```

---

## 🧩 Composants

### Composants réutilisables (`src/components/common/`)

#### Button

```tsx
import { Button } from '@/components/common';

<Button
  title="Créer"
  onPress={handleCreate}
  variant="primary" // 'primary' | 'secondary' | 'danger'
  loading={isLoading}
  disabled={!isValid}
/>
```

#### LoadingScreen

```tsx
import { LoadingScreen } from '@/components/common';

if (loading) {
  return <LoadingScreen message="Chargement des joueurs..." />;
}
```

#### EmptyState

```tsx
import { EmptyState } from '@/components/common';

<EmptyState
  icon="👤"
  title="Aucun joueur"
  description="Commencez par ajouter votre premier joueur"
/>
```

#### PlayerCard

```tsx
import { PlayerCard } from '@/components/common';

<PlayerCard
  player={player}
  onPress={() => router.push(`/players/${player.id}`)}
/>
```

#### InfoRow

```tsx
import { InfoRow } from '@/components/common';

<InfoRow label="Position" value={player.position} />
<InfoRow label="Taille" value={`${player.height} cm`} />
```

---

## 🔧 Services

### Player Service (`src/services/playerService.ts`)

Service dédié pour gérer tous les appels API liés aux joueurs :

```tsx
import { playerService } from '@/services';

// Récupérer tous les joueurs
const result = await playerService.getAll();

// Récupérer un joueur par ID
const player = await playerService.getById('player-123');

// Créer un joueur
const newPlayer = await playerService.create({
  firstName: 'John',
  lastName: 'Doe',
  teamId: 'team-123',
  position: 'Guard',
});

// Mettre à jour un joueur
await playerService.update('player-123', { height: 185 });

// Supprimer un joueur
await playerService.delete('player-123');
```

### API Client (`src/api/client.ts`)

Client HTTP générique avec gestion d'erreurs :

```tsx
import { apiClient } from '@/api/client';

// GET request
const result = await apiClient.get<Player[]>('/api/players');

// POST request
const created = await apiClient.post('/api/players', data);

// PUT request
const updated = await apiClient.put('/api/players/123', data);

// DELETE request
await apiClient.delete('/api/players/123');
```

---

## 💻 Développement

### Configuration NativeWind v4

NativeWind v4 nécessite une configuration spécifique qui a été mise en place :

**Fichiers de configuration :**
- `tailwind.config.js` - Scanne `app/` et `src/` pour les classes Tailwind
- `metro.config.js` - Configure Metro pour compiler le CSS avec NativeWind
- `babel.config.js` - Inclut les presets NativeWind et Reanimated
- `nativewind-env.d.ts` - Support TypeScript pour NativeWind
- `global.css` - Importé dans `app/_layout.tsx`

**Dépendances requises :**
- `nativewind` - Tailwind CSS pour React Native
- `react-native-reanimated` - Animations (requis par NativeWind v4)
- `react-native-worklets` - Worklets pour les animations

### Utiliser NativeWind (Tailwind CSS)

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-primary-600">Hello!</Text>
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

### Utiliser les Path Aliases

```tsx
import { playerService } from '@/services';
import { Button, LoadingScreen } from '@/components/common';
import type { Player } from '@/types';
import { API_CONFIG } from '@/constants/api';
```

### React Native Paper (Forms & Modals)

```tsx
import { TextInput, Button, RadioButton } from 'react-native-paper';

export default function Form() {
  return (
    <>
      <TextInput
        label="Nom"
        value={name}
        onChangeText={setName}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleSubmit}>
        Envoyer
      </Button>
    </>
  );
}
```

### Scripts disponibles

```bash
# Développement
npm start                   # Démarrer Expo
npm run ios                 # iOS Simulator
npm run android             # Android Emulator
npm run web                 # Web browser

# Qualité du code
npm run lint                # ESLint
npm run lint:fix            # ESLint + auto-fix
npm run format              # Prettier
npm run format:check        # Vérifier le formatage
npm run type-check          # TypeScript

# Nettoyage
npm run clean               # Supprimer node_modules, .expo, dist
```

---

## 📱 Écrans implémentés

### 1. Liste des joueurs (`app/(tabs)/index.tsx`)

- ✅ Récupère les joueurs depuis l'API
- ✅ Affiche avec PlayerCard
- ✅ Bouton "Nouveau joueur"
- ✅ Navigation vers les détails
- ✅ État vide si aucun joueur

### 2. Création de joueur (`app/players/create.tsx`)

- ✅ Formulaire complet avec React Native Paper
- ✅ Champs: prénom, nom, surnom, équipe, position, taille, poids, âge
- ✅ Validation des champs requis
- ✅ Envoi vers l'API via playerService
- ✅ Retour à la liste après création

### 3. Détails du joueur (`app/players/[id].tsx`)

- ✅ Récupère les détails depuis l'API
- ✅ Affiche toutes les informations
- ✅ Section statistiques (à venir)
- ✅ Bouton de suppression avec confirmation

---

## 📚 Documentation API

- **API Docs**: https://basketball-stats-coach-production.up.railway.app/api-docs
- **Backend Repo**: ../backend/README.md

---

## 🔧 Dépannage

### Les styles NativeWind ne s'appliquent pas

**Symptômes :** Les classes Tailwind (`className="..."`) n'ont aucun effet.

**Solutions :**
1. Vérifier que `tailwind.config.js` scanne bien `app/` et `src/`
2. Vérifier que `metro.config.js` utilise `withNativeWind`
3. Vérifier que `global.css` est importé dans `app/_layout.tsx`
4. Redémarrer avec cache vidé : `npm start -- --clear`

### Erreur "Cannot find module 'react-native-worklets/plugin'"

**Solution :**
```bash
npm install react-native-worklets@0.5.1 --legacy-peer-deps
npm start -- --clear
```

### Erreur "Cannot find module 'react-native-reanimated'"

**Solution :**
```bash
npx expo install react-native-reanimated
# Ajouter le plugin dans babel.config.js (déjà fait)
npm start -- --clear
```

### La liste des joueurs ne se recharge pas

**Symptômes :** Les joueurs créés n'apparaissent pas dans la liste.

**Causes possibles :**
1. **API non accessible** - Vérifier que le backend tourne et que l'URL dans `.env` est correcte
2. **Format de réponse API** - Le client API cherche `data.players` dans la réponse (déjà corrigé)
3. **Pas de refresh automatique** - La liste utilise `useFocusEffect` pour se recharger (déjà implémenté)

**Test de l'API :**
```bash
# Vérifier que l'API répond
curl http://VOTRE_IP:3000/health

# Vérifier les joueurs
curl http://VOTRE_IP:3000/api/players
```

### L'app ne peut pas se connecter au backend

**Pour simulateur iOS :**
- Utiliser `http://localhost:3000` dans `.env`

**Pour appareil physique :**
- Utiliser votre IP locale : `http://192.168.x.x:3000`
- Vérifier que le téléphone et le Mac sont sur le même réseau WiFi
- Vérifier que le pare-feu n'bloque pas le port 3000

**Trouver votre IP locale :**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Warnings npm lors de l'installation

**Warnings de peer dependencies :**
- Ajouté `legacy-peer-deps=true` dans `.npmrc` (déjà fait)

**Warnings de packages deprecated :**
- Ces warnings viennent de dépendances indirectes (Expo/React Native)
- Ils sont informatifs et n'affectent pas le fonctionnement

### Metro Bundler ne démarre pas

**Solution :**
```bash
# Nettoyer complètement
npm run clean
npm install
npm start -- --clear
```

### Expo Go ne se connecte pas au serveur de développement

**Solutions :**
1. Scanner le QR code avec l'appareil photo (iOS) ou Expo Go (Android)
2. Vérifier que le téléphone et le Mac sont sur le même WiFi
3. Essayer de se connecter manuellement avec l'URL affichée dans le terminal

---

## 🔗 Liens utiles

- **Expo Docs**: https://docs.expo.dev/
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **NativeWind v4**: https://www.nativewind.dev/v4/overview
- **Zustand**: https://zustand-demo.pmnd.rs/
- **React Native Paper**: https://reactnativepaper.com/
- **React Native Reanimated**: https://docs.swmansion.com/react-native-reanimated/

---

## 📞 Support

Pour toute question ou problème :

- **GitHub Issues**: https://github.com/Gregson971/basketball-stats-coach/issues
- **Backend Docs**: ../backend/README.md
- **API Documentation**: https://basketball-stats-coach-production.up.railway.app/api-docs

---

**Fait avec ❤️ pour les passionnés de basketball**
