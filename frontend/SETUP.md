# Setup Frontend - StatCoach Pro

Documentation du setup initial du frontend mobile React Native.

---

## ✅ Configuration effectuée

### 1. Initialisation du projet

```bash
npx create-expo-app@latest frontend --template blank-typescript
```

**Technologies installées :**

- Expo 54.0.25
- React Native 0.81.5
- React 19.1.0
- TypeScript 5.9.2

### 2. Installation des dépendances

```bash
# State management
npm install zustand

# UI & Styling
npm install nativewind react-native-paper react-native-safe-area-context

# Dev dependencies
npm install -D tailwindcss
```

**Versions installées :**

- zustand: 5.0.9
- nativewind: 4.2.1
- react-native-paper: 5.14.5
- tailwindcss: 3.3.2

### 3. Configuration NativeWind v4

**babel.config.js**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
  };
};
```

**tailwind.config.js**

```javascript
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          /* ... */
        },
      },
    },
  },
};
```

**global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**nativewind-env.d.ts**

```typescript
/// <reference types="nativewind/types" />
```

### 4. Configuration TypeScript

**tsconfig.json**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/api/*": ["src/api/*"],
      "@/stores/*": ["src/stores/*"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/constants/*": ["src/constants/*"]
    }
  }
}
```

### 5. Structure de dossiers

```
frontend/
├── App.tsx
├── global.css
├── nativewind-env.d.ts
├── src/
│   ├── api/
│   │   └── client.ts              # HTTP client générique
│   ├── stores/
│   │   └── useGameStore.ts        # Zustand store pour les matchs
│   ├── components/
│   │   ├── common/                # Composants custom (NativeWind)
│   │   └── ui/                    # Composants Paper (forms, modals)
│   ├── screens/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   │   └── index.ts               # Types TypeScript
│   └── constants/
│       └── api.ts                 # Configuration API
├── tailwind.config.js
├── tsconfig.json
├── babel.config.js
└── package.json
```

### 6. Fichiers créés

#### `src/constants/api.ts`

- Configuration des URLs (dev/prod)
- Tous les endpoints du backend
- Auto-switch selon `__DEV__`

#### `src/types/index.ts`

- Types pour Player, Team, Game, GameStats, CareerStats
- Types pour les actions et les réponses API
- Correspond aux DTOs du backend

#### `src/api/client.ts`

- Client HTTP générique avec méthodes GET/POST/PUT/DELETE
- Gestion des erreurs
- Types de réponse standardisés

#### `src/stores/useGameStore.ts`

- Store Zustand pour l'état du match actuel
- Gestion des joueurs et statistiques
- Actions pour mettre à jour l'état

#### `App.tsx`

- Import de `global.css`
- Exemple d'utilisation de NativeWind
- Écran de démarrage avec styling Tailwind

### 7. Scripts npm ajoutés

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf node_modules .expo dist"
  }
}
```

---

## 🧪 Vérification du setup

### Type checking

```bash
npm run type-check
```

✅ Aucune erreur TypeScript

### Lancer l'app

```bash
npm start
```

Ensuite :

- Appuyer sur `i` pour iOS
- Appuyer sur `a` pour Android
- Scanner le QR code avec Expo Go

---

## 📝 Prochaines étapes

1. **Navigation**

   - Installer React Navigation ou Expo Router
   - Configurer les écrans (Stack, Tabs, Drawer)

2. **Composants de base**

   - Créer les composants communs (Button, Card, etc.)
   - Intégrer React Native Paper pour les forms

3. **Écrans principaux**

   - Sélection d'équipe
   - Liste des matchs
   - Match en temps réel
   - Statistiques

4. **Tests**

   - Configuration Jest pour React Native
   - Tests unitaires des stores Zustand
   - Tests des composants

5. **CI/CD**
   - GitHub Actions pour builds
   - EAS Build pour iOS/Android

---

## 🔗 Ressources

- **Backend API**: https://basketball-stats-coach-production.up.railway.app/api-docs
- **Expo Docs**: https://docs.expo.dev/
- **NativeWind v4**: https://www.nativewind.dev/v4/overview
- **Zustand**: https://zustand-demo.pmnd.rs/
- **React Native Paper**: https://reactnativepaper.com/
