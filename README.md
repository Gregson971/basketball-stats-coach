# 🏀 StatCoach Pro

**StatCoach Pro** est une application mobile professionnelle de suivi statistique en temps réel pour le basketball. Conçue pour les entraîneurs et analystes, elle permet d'enregistrer et d'analyser les performances des joueurs pendant les matchs.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tests](https://img.shields.io/badge/tests-246%20passing-success)
![Coverage](https://img.shields.io/badge/coverage-70%25-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-Railway-purple)

[![Backend CI](https://github.com/Gregson971/basketball-stats-coach/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Gregson971/basketball-stats-coach/actions/workflows/backend-ci.yml)

**🚀 API en production :** [https://basketball-stats-coach-production.up.railway.app/api-docs](https://basketball-stats-coach-production.up.railway.app/api-docs)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Tests](#-tests)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)

---

## ✨ Fonctionnalités

### Gestion des équipes et joueurs

- ✅ Création et gestion d'équipes (nom, coach, saison, ligue)
- ✅ Gestion complète des joueurs (profil, position, statistiques physiques)
- ✅ Organisation par équipe et saison

### Suivi des matchs

- ✅ Création et planification de matchs
- ✅ Gestion des statuts (non démarré, en cours, terminé)
- ✅ Informations contextuelles (adversaire, lieu, date, notes)

### Enregistrement des statistiques en temps réel

- ✅ **Tirs** : Lancers francs, 2 points, 3 points (réussis/manqués)
- ✅ **Rebonds** : Offensifs et défensifs
- ✅ **Actions offensives** : Passes décisives
- ✅ **Actions défensives** : Interceptions, contres
- ✅ **Autres** : Pertes de balle, fautes personnelles
- ✅ **Fonction Undo** : Annulation de la dernière action

### Analyses et statistiques

- ✅ Statistiques par match (points, rebonds, assists, pourcentages)
- ✅ Statistiques carrière (moyennes, totaux, évolution)
- ✅ Calculs automatiques (FG%, 3P%, FT%, points totaux)

---

## 🏗️ Architecture

Le projet suit les principes de **Clean Architecture** avec une séparation stricte des responsabilités :

```
basketball-stats-coach/
├── backend/                    # API Node.js + TypeScript ✅
│   ├── src/
│   │   ├── domain/            # Entités et logique métier
│   │   │   ├── entities/      # Player, Team, Game, GameStats
│   │   │   └── repositories/  # Interfaces (DIP)
│   │   ├── application/       # Use Cases (logique applicative)
│   │   │   ├── use-cases/
│   │   │   │   ├── player/    # 6 use cases
│   │   │   │   ├── team/      # 5 use cases
│   │   │   │   ├── game/      # 8 use cases
│   │   │   │   └── stats/     # 4 use cases
│   │   │   └── dtos/          # Data Transfer Objects
│   │   ├── infrastructure/    # Implémentations techniques
│   │   │   ├── database/      # MongoDB + Mongoose
│   │   │   │   ├── mongodb/   # Connection, Models, Mappers
│   │   │   │   └── repositories/  # Implémentations concrètes
│   │   │   └── sync/          # Synchronisation (à venir)
│   │   └── presentation/      # API REST ✅
│   │       ├── controllers/   # Controllers HTTP
│   │       ├── routes/        # 24 endpoints REST
│   │       ├── middlewares/   # Validation, Error handling
│   │       └── swagger.ts     # OpenAPI 3.0 documentation
│   ├── tests/
│   │   ├── unit/              # Tests unitaires (94 tests)
│   │   ├── integration/       # Tests d'intégration (26 tests)
│   │   └── api/               # Tests API (56 tests)
│   ├── docs/                  # Documentation complète
│   │   ├── API.md            # Documentation API REST
│   │   ├── ARCHITECTURE.md   # Architecture détaillée
│   │   ├── QUICK_START.md    # Guide de démarrage
│   │   └── USE_CASES.md      # Liste des use cases
│   ├── Dockerfile            # Production
│   ├── Dockerfile.dev        # Développement avec hot reload
│   └── docker-compose.yml    # MongoDB + API (prod/dev)
└── frontend/                   # React Native + Expo ✅
    ├── app/                    # Navigation Expo Router (file-based)
    │   ├── _layout.tsx         # Layout racine
    │   ├── (tabs)/            # Navigation par tabs
    │   │   ├── index.tsx       # Tab Accueil
    │   │   ├── games.tsx       # Tab Matchs
    │   │   └── teams.tsx       # Tab Équipes
    │   ├── players/           # Routes des joueurs
    │   │   ├── [id]/
    │   │   │   ├── index.tsx   # Détails du joueur
    │   │   │   └── stats.tsx   # Stats du joueur
    │   │   └── create.tsx      # Création de joueur
    │   ├── teams/             # Routes des équipes
    │   │   ├── [id].tsx        # Détails de l'équipe
    │   │   └── create.tsx      # Création d'équipe
    │   └── games/             # Routes des matchs
    │       ├── [id]/
    │       │   ├── index.tsx   # Détails du match
    │       │   ├── stats.tsx   # Enregistrement des stats
    │       │   └── summary.tsx # Résumé du match
    │       └── create.tsx      # Création de match
    ├── src/
    │   ├── api/               # Client API
    │   ├── services/          # Services métier (player, team, game, stats)
    │   ├── stores/            # Zustand stores
    │   ├── components/        # Composants réutilisables
    │   │   ├── common/        # PlayerCard, TeamCard, GameCard, StatsPanel...
    │   │   └── ui/            # Composants Paper
    │   ├── types/             # Types TypeScript
    │   └── constants/         # Configuration
    └── .env                   # Variables d'environnement (gitignored)
```

### Principes SOLID

- **S**ingle Responsibility : Chaque classe a une seule responsabilité
- **O**pen/Closed : Ouvert à l'extension, fermé à la modification
- **L**iskov Substitution : Les interfaces sont respectées
- **I**nterface Segregation : Interfaces spécifiques et ciblées
- **D**ependency Inversion : Dépendance sur les abstractions

---

## 🛠️ Technologies

### Backend

- **Runtime** : Node.js 18+
- **Langage** : TypeScript 5.3
- **Base de données** : MongoDB 7.0
- **ODM** : Mongoose
- **Tests** : Jest + ts-jest + Supertest
- **Containerisation** : Docker + Docker Compose

### Frontend ✅

- **Framework** : React Native 0.81
- **Platform** : Expo 54
- **Navigation** : Expo Router 6.0 (file-based routing)
- **State Management** : Zustand 5.0
- **Styling** : NativeWind 4.2 (Tailwind CSS) + React Native Paper 5.14
- **Animations** : React Native Reanimated 3.x

### DevOps

- **CI/CD** : GitHub Actions
- **Qualité** : ESLint, Prettier
- **Git** : Conventional Commits

---

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- Docker et Docker Compose
- Git

### Installation du backend

```bash
# Cloner le repository
git clone https://github.com/votre-username/basketball-stats-coach.git
cd basketball-stats-coach/backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Démarrer MongoDB avec Docker
docker-compose up -d mongodb

# Lancer les tests
npm test

# Démarrer le serveur de développement
npm run dev
```

### Variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` :

```env
# MongoDB
MONGODB_URI=mongodb://statcoach:statcoach_secret@localhost:27017/statcoach_pro?authSource=admin

# Server
PORT=3000
NODE_ENV=development

# JWT (à venir)
JWT_SECRET=your-secret-key
```

---

## 🚀 Utilisation

### Commandes npm disponibles

```bash
# Backend
npm run dev                # Démarrer en mode développement
npm test                  # Lancer tous les tests
npm run test:watch        # Tests en mode watch
npm run test:coverage     # Tests avec couverture
npm run build             # Build pour production
npm start                 # Démarrer en production

# Docker - Development
npm run docker:build      # Construire les images Docker
npm run docker:up:dev     # API + MongoDB avec hot reload
npm run docker:logs:api   # Voir les logs de l'API

# Docker - Production
npm run docker:up:all     # API + MongoDB en production
npm run docker:restart:api # Redémarrer l'API
npm run docker:rebuild    # Rebuild complet
```

### Exemple d'utilisation des Use Cases

```typescript
// 1. Créer une équipe
const createTeam = new CreateTeam(teamRepository);
const { success, team } = await createTeam.execute({
  name: 'Wild Cats',
  coach: 'Coach Smith',
  season: '2024-2025',
});

// 2. Ajouter des joueurs
const createPlayer = new CreatePlayer(playerRepository);
await createPlayer.execute({
  firstName: 'Ryan',
  lastName: 'Evans',
  teamId: team.id,
  position: 'Guard',
  height: 185,
  weight: 80,
});

// 3. Créer et démarrer un match
const createGame = new CreateGame(gameRepository);
const { game } = await createGame.execute({
  teamId: team.id,
  opponent: 'Tigers',
  location: 'Main Arena',
});

const startGame = new StartGame(gameRepository);
await startGame.execute(game.id);

// 4. Enregistrer des actions
const recordAction = new RecordGameAction(gameStatsRepository, gameRepository);
await recordAction.execute({
  gameId: game.id,
  playerId: player.id,
  actionType: 'twoPoint',
  made: true,
});

// 5. Consulter les statistiques
const getStats = new GetPlayerGameStats(gameStatsRepository);
const { gameStats } = await getStats.execute(game.id, player.id);

console.log(`Points: ${gameStats.getTotalPoints()}`);
console.log(`FG%: ${gameStats.getFieldGoalPercentage()}%`);
```

---

## 🧪 Tests

Le projet suit une approche **Test-Driven Development (TDD)** stricte.

### Statistiques des tests

- **Total** : 246 tests
- **Test Suites** : 32 suites
- **Couverture** : ~90%
- **Status** : ✅ 100% passing

### Répartition des tests

| Catégorie            | Tests | Status |
| -------------------- | ----- | ------ |
| Player Use Cases     | 18    | ✅     |
| Team Use Cases       | 18    | ✅     |
| Game Use Cases       | 33    | ✅     |
| Stats Use Cases      | 25    | ✅     |
| Domain Entities      | 96    | ✅     |
| MongoDB Repositories | 26    | ✅     |
| API REST (Supertest) | 56    | ✅     |
| - Players API        | 12    | ✅     |
| - Teams API          | 14    | ✅     |
| - Games API          | 18    | ✅     |
| - Stats API          | 12    | ✅     |

### Lancer les tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov

# Tests spécifiques
npm test -- player
npm test -- CreatePlayer.test.ts
```

### Structure des tests

```typescript
describe('CreatePlayer Use Case', () => {
  let mockRepository: MockPlayerRepository;
  let createPlayer: CreatePlayer;

  beforeEach(() => {
    mockRepository = new MockPlayerRepository();
    createPlayer = new CreatePlayer(mockRepository);
  });

  test('should create a player successfully', async () => {
    const result = await createPlayer.execute({
      firstName: 'John',
      lastName: 'Doe',
      teamId: 'team-123',
    });

    expect(result.success).toBe(true);
    expect(result.player?.firstName).toBe('John');
  });
});
```

---

## 📚 Documentation

### Documents disponibles

- **[backend/README.md](backend/README.md)** : Documentation complète du backend
- **[backend/docs/USE_CASES.md](backend/docs/USE_CASES.md)** : Liste complète des 23 use cases avec exemples
- **[backend/docs/ARCHITECTURE.md](backend/docs/ARCHITECTURE.md)** : Documentation détaillée de la Clean Architecture
- **[backend/docs/API.md](backend/docs/API.md)** : Documentation complète de l'API REST (24 endpoints)
- **[backend/docs/QUICK_START.md](backend/docs/QUICK_START.md)** : Guide de démarrage rapide avec TDD
- **Swagger UI** : http://localhost:3000/api-docs (documentation interactive)

### Use Cases implémentés

#### Player (6)

- CreatePlayer, UpdatePlayer, DeletePlayer
- GetPlayer, GetPlayersByTeam, SearchPlayersByName

#### Team (5)

- CreateTeam, UpdateTeam, DeleteTeam
- GetTeam, GetAllTeams

#### Game (8)

- CreateGame, UpdateGame, DeleteGame
- GetGame, GetGamesByTeam, GetGamesByStatus
- StartGame, CompleteGame

#### Stats (4)

- RecordGameAction, UndoLastGameAction
- GetPlayerGameStats, GetPlayerCareerStats

---

## 🎯 Roadmap

### Phase 1 : Backend API ✅ (Complété)

- [x] Architecture Clean Architecture (4 couches)
- [x] 23 use cases avec TDD
- [x] 24 endpoints API REST avec Swagger
- [x] MongoDB + Mongoose + Repositories
- [x] 246 tests (100% passing, coverage 70%+)
- [x] CI/CD avec GitHub Actions
- [x] Déploiement en production sur Railway
- [x] Docker (Production + Dev avec hot reload)
- [x] Documentation complète (API, Architecture, Use Cases)

### Phase 2 : Frontend Mobile (En cours) 🚧

- [x] Configuration React Native + Expo
- [x] Navigation avec Expo Router (file-based)
- [x] Configuration NativeWind v4 (Tailwind CSS)
- [x] Client API avec gestion d'erreurs
- [x] Services métier (player, team, game, stats)
- [x] Gestion des joueurs (CRUD complet)
  - [x] Liste des joueurs avec auto-refresh
  - [x] Création de joueur (formulaire complet)
  - [x] Détails du joueur
  - [x] Stats du joueur
- [x] Gestion des équipes
  - [x] Liste des équipes
  - [x] Création d'équipe
  - [x] Détails de l'équipe
- [x] Gestion des matchs
  - [x] Liste des matchs
  - [x] Création de match
  - [x] Détails du match
- [x] Interface de match en temps réel
  - [x] Enregistrement des stats pendant le match
  - [x] Visualisation des stats en temps réel
  - [x] Résumé du match
- [x] Composants réutilisables
  - [x] PlayerCard, TeamCard, GameCard
  - [x] StatsPanel
  - [x] ActionButton, Button
  - [x] EmptyState, LoadingScreen
- [ ] Fonction Undo pour les stats
- [ ] Mode édition pour équipes et matchs
- [ ] Synchronisation offline

### Phase 3 : Fonctionnalités avancées

- [ ] Authentification JWT
- [ ] Gestion multi-utilisateurs
- [ ] Export PDF des statistiques
- [ ] Graphiques et analyses avancées
- [ ] Mode hors-ligne avec sync

### Phase 4 : Déploiement

- [x] API déployée sur Railway (https://basketball-stats-coach-production.up.railway.app)
- [ ] Application iOS (App Store)
- [ ] Application Android (Play Store)
- [x] Documentation API complète (Swagger UI)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créer** une branche (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### Standards de code

- TypeScript strict mode
- ESLint + Prettier
- Tests obligatoires (TDD)
- Coverage minimum : 80%
- Conventional Commits

---

## 📄 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 Support

Pour toute question ou suggestion :

- **Issues** : [GitHub Issues](https://github.com/Gregson971/basketball-stats-coach/issues)

---

<div align="center">

**Fait avec ❤️ pour les passionnés de basketball**

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !

</div>
