# StatCoach Pro - Backend API

Backend API pour **StatCoach Pro**, l'application mobile professionnelle de suivi de statistiques de basketball en temps réel, construite avec **Clean Architecture**, **TDD** et **BDD**.

[![Backend CI](https://github.com/Gregson971/basketball-stats-coach/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Gregson971/basketball-stats-coach/actions/workflows/backend-ci.yml)
[![codecov](https://codecov.io/github/Gregson971/basketball-stats-coach/graph/badge.svg?token=RH60FEVC1C)](https://codecov.io/github/Gregson971/basketball-stats-coach)
![Tests](https://img.shields.io/badge/tests-432%20passing-success)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-Railway-purple)

**🚀 API en production :** [https://basketball-stats-coach-production.up.railway.app/api-docs](https://basketball-stats-coach-production.up.railway.app/api-docs)

## 🏗️ Architecture

Ce projet suit les principes de **Clean Architecture** pour assurer une séparation claire des responsabilités et faciliter la maintenabilité.

### Structure des dossiers

```
backend/
├── src/
│   ├── domain/                    # Couche Domaine (Entités et logique métier)
│   │   ├── entities/              # Entités du domaine
│   │   │   ├── Player.ts          # Entité Joueur
│   │   │   ├── Team.ts            # Entité Équipe
│   │   │   ├── Game.ts            # Entité Match
│   │   │   ├── GameStats.ts       # Entité Statistiques de match
│   │   │   └── User.ts            # Entité Utilisateur
│   │   └── repositories/          # Interfaces de repositories
│   │       ├── PlayerRepository.ts
│   │       ├── TeamRepository.ts
│   │       ├── GameRepository.ts
│   │       ├── GameStatsRepository.ts
│   │       └── UserRepository.ts
│   │
│   ├── application/               # Couche Application (Use Cases)
│   │   ├── use-cases/
│   │   │   ├── player/            # Use cases liés aux joueurs
│   │   │   │   └── CreatePlayer.ts
│   │   │   ├── game/              # Use cases liés aux matchs
│   │   │   │   └── StartGame.ts
│   │   │   └── stats/             # Use cases liés aux statistiques
│   │   │       └── RecordGameAction.ts
│   │   └── dtos/                  # Data Transfer Objects
│   │
│   ├── infrastructure/            # Couche Infrastructure (Implémentation)
│   │   ├── database/
│   │   │   ├── mongodb/           # Configuration MongoDB
│   │   │   └── repositories/      # Implémentation des repositories
│   │   └── sync/                  # Système de synchronisation hors-ligne
│   │
│   └── presentation/              # Couche Présentation (API)
│       ├── controllers/           # Contrôleurs HTTP
│       ├── routes/                # Routes API
│       └── middlewares/           # Middlewares Express
│
└── tests/
    ├── unit/                      # Tests unitaires (TDD)
    │   ├── domain/                # Tests des entités
    │   └── application/           # Tests des use cases
    ├── integration/               # Tests d'intégration
    │   ├── repositories/          # Tests des repositories avec MongoDB
    │   └── sync/                  # Tests du système de sync
    └── api/                       # Tests API avec Supertest
        └── setup/                 # Mock repositories pour tests API
```

## 🎯 Principes de Clean Architecture

### 1. **Domain Layer** (Domaine)

- Contient la logique métier pure
- Indépendant des frameworks et technologies
- Définit les entités et les règles métier

### 2. **Application Layer** (Application)

- Contient les use cases (cas d'utilisation)
- Orchestre les entités du domaine
- Indépendant de l'UI et de l'infrastructure

### 3. **Infrastructure Layer** (Infrastructure)

- Implémentation concrète des repositories
- Accès aux bases de données
- Services externes

### 4. **Presentation Layer** (Présentation)

- API REST avec Express
- Contrôleurs et routes
- Validation des requêtes

## 📊 Entités du domaine

### Player (Joueur)

Représente un joueur de basketball avec ses informations personnelles et physiques.

**Sécurité:** Chaque joueur est lié à un `userId` pour l'isolation des données.

**Attributs:**

- `firstName`, `lastName`, `nickname`
- `height` (cm), `weight` (kg), `age`
- `gender`, `grade`, `position`
- `teamId`

### Team (Équipe)

Représente une équipe de basketball.

**Sécurité:** Chaque équipe est liée à un `userId` pour l'isolation des données.

**Attributs:**

- `name`, `coach`, `season`, `league`

### Game (Match)

Représente un match de basketball avec gestion complète du roster, lineup et quart-temps.

**Sécurité:** Chaque match est lié à un `userId` pour l'isolation des données.

**Attributs:**

- `teamId`, `opponent`, `gameDate`, `location`
- `status`: `not_started` | `in_progress` | `completed`
- `roster`: Tableau de 5-15 player IDs convoqués pour le match
- `startingLineup`: Tableau de exactement 5 player IDs titulaires
- `currentLineup`: Tableau de exactement 5 player IDs sur le terrain
- `currentQuarter`: Numéro du quart-temps en cours (1-4)
- `startedAt`, `completedAt`

### Substitution (Changement de joueur)

Représente un changement de joueur pendant un match.

**Sécurité:** Chaque substitution est liée à un `userId` pour l'isolation des données.

**Attributs:**

- `gameId`: Match concerné
- `quarter`: Quart-temps du changement (1-4)
- `playerOut`: Player ID sortant du terrain
- `playerIn`: Player ID entrant sur le terrain
- `timestamp`: Horodatage du changement

### GameStats (Statistiques de match)

Représente les statistiques d'un joueur pour un match donné.

**Sécurité:** Chaque statistique est liée à un `userId` pour l'isolation des données.

**Statistiques:**

- **Tirs:** Free Throws, 2-Points, 3-Points (made/attempted)
- **Rebonds:** Offensifs, Défensifs
- **Autres:** Assists, Steals, Blocks, Turnovers, Personal Fouls
- **Temps:** Minutes jouées

**Méthodes calculées:**

- `getTotalPoints()`, `getTotalRebounds()`
- `getFieldGoalPercentage()`, `getFreeThrowPercentage()`, `getThreePointPercentage()`

### User (Utilisateur)

Représente un utilisateur de l'application avec authentification sécurisée.

**Attributs:**

- `email` - Adresse email unique (utilisée pour la connexion)
- `password` - Mot de passe hashé avec bcrypt
- `name` - Nom complet de l'utilisateur

## 🧪 Tests

Ce projet suit une approche TDD (Test Driven Development) stricte avec une couverture de test complète.

### Résultats des tests

- **Tests totaux**: 432 tests passing
- **Test Suites**: 41 suites
- **Coverage**: ~85%
- **Statut**: ✅ Tous les tests passent
- **Isolation des données**: ✅ Tous les tests vérifient l'isolation par `userId`

### Types de tests

**Tests unitaires** (183 tests) - Tests des use cases et entités du domaine

- Tests isolés des use cases (Player, Team, Game, Stats, Auth)
- Tests des entités et de la logique métier (Substitution, Game quarters, etc.)
- Tests d'isolation des données par utilisateur
- Mock des dépendances

**Tests d'intégration** (49 tests) - Tests des repositories avec MongoDB

- Tests avec base de données en mémoire (MongoDB Memory Server)
- Validation de la persistance des données
- Tests des requêtes complexes avec filtrage par `userId`
- Tests de cascade delete
- 6 repository test suites (ajout SubstitutionRepository)

**Tests API** (200 tests) - Tests des endpoints Express avec Supertest

- Tests de toutes les routes REST (30 endpoints)
- Validation des codes HTTP et réponses JSON
- Tests des middlewares et gestion d'erreurs
- Tests d'authentification JWT
- Players API: 12 tests
- Teams API: 14 tests
- Games API: 143 tests (ajout roster, lineup, quarters, substitutions)
- Stats API: 12 tests
- Auth API: 19 tests

### Commandes de test

```bash
# Lancer tous les tests
npm test

# Tests unitaires uniquement
npm run test:unit

# Tests d'intégration uniquement
npm run test:integration

# Tests API uniquement
npm run test:api

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 🚀 Installation et démarrage

### Prérequis

- Node.js 20+
- Docker & Docker Compose (pour MongoDB)
- npm ou yarn

### Option 1 : Développement local avec Docker MongoDB (Recommandé pour développement)

```bash
# 1. Démarrer MongoDB avec Docker
docker-compose up -d mongodb

# Vérifier que MongoDB est démarré
docker-compose ps

# 2. Installation des dépendances
npm install

# 3. Créer le fichier .env (déjà configuré pour Docker)
cp .env.example .env

# 4. Développement avec hot reload
npm run dev

# Arrêter MongoDB
docker-compose down

# Supprimer les volumes (données)
docker-compose down -v
```

### Option 2 : Développement complet avec Docker (API + MongoDB avec hot reload)

L'API tourne dans un conteneur Docker avec hot reload. Idéal pour le développement.

```bash
# Construction des images
npm run docker:build

# Démarrer en mode développement (avec hot reload)
npm run docker:up:dev

# Voir les logs de l'API
npm run docker:logs:api

# Voir tous les logs (API + MongoDB)
npm run docker:logs:all

# Redémarrer l'API
npm run docker:restart:api

# Arrêter tout
docker-compose down

# Rebuild complet (si besoin)
npm run docker:rebuild
```

L'API sera accessible à http://localhost:3000

### Option 3 : Production avec Docker (API + MongoDB)

Déploiement en production avec conteneurs optimisés.

```bash
# Construction et démarrage en production
npm run docker:build
npm run docker:up:all

# Voir les logs
docker-compose logs -f api

# Arrêter
docker-compose down
```

### Option 4 : Développement sans Docker

```bash
# 1. Installation des dépendances
npm install

# 2. Installer MongoDB localement ou utiliser MongoDB Atlas
# Modifier MONGODB_URI dans .env

# 3. Développement avec hot reload
npm run dev
```

### Option 5 : Build et production locale

```bash
# Compilation TypeScript
npm run build

# Production
npm start
```

## 🔒 Sécurité et isolation des données

### Principe de l'isolation par utilisateur

**Toutes les données sont isolées par `userId`** pour garantir qu'un utilisateur ne peut accéder qu'à ses propres données.

### Caractéristiques de sécurité

- ✅ **Authentification JWT**: Tokens sécurisés avec expiration de 7 jours
- ✅ **Isolation totale des données**: Chaque utilisateur ne voit que ses propres équipes, joueurs, matchs et statistiques
- ✅ **Mots de passe hashés**: Utilisation de bcrypt avec 10 rounds
- ✅ **Cascade delete**: Suppression automatique de toutes les données d'un utilisateur
- ✅ **Validation automatique**: Le `userId` est vérifié à chaque opération
- ✅ **Protection contre l'énumération**: Impossible de deviner l'existence de données d'autres utilisateurs

### Comment ça fonctionne

1. **Authentification**: L'utilisateur reçoit un token JWT après login/register
2. **Extraction du userId**: Le middleware extrait le `userId` du token
3. **Filtrage automatique**: Tous les repositories filtrent les données par `userId`
4. **Isolation garantie**: Un utilisateur ne peut jamais accéder aux données d'un autre

**Exemple:**

```typescript
// ❌ IMPOSSIBLE: User A ne peut pas accéder aux données de User B
GET /api/players/player-b-123
Authorization: Bearer <token-user-a>
// Résultat: 404 Not Found

// ✅ POSSIBLE: User A accède à ses propres données
GET /api/players/player-a-456
Authorization: Bearer <token-user-a>
// Résultat: 200 OK
```

---

## 🔧 Configuration

Créer un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

### Variables d'environnement principales

**Serveur:**

- `PORT`: Port du serveur (défaut: 3000)
- `NODE_ENV`: Environnement (development/production)

**Authentification:**

- `JWT_SECRET`: Clé secrète pour la génération des tokens JWT (⚠️ À changer en production!)

```env
JWT_SECRET=your-very-secret-jwt-key-change-this-in-production
```

**MongoDB (avec Docker):**

```env
MONGODB_URI=mongodb://statcoach:statcoach_secret@localhost:27017/statcoach_pro?authSource=admin
```

**MongoDB (local sans Docker):**

```env
MONGODB_URI=mongodb://localhost:27017/statcoach_pro
```

**MongoDB (Atlas):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/statcoach_pro
```

### 🐳 Commandes Docker utiles

#### Scripts npm pour Docker (Recommandés)

```bash
# Construction des images Docker
npm run docker:build

# Démarrer tous les services (Production: API + MongoDB)
npm run docker:up:all

# Démarrer en mode développement (Dev: API avec hot reload + MongoDB)
npm run docker:up:dev

# Voir les logs de l'API en temps réel
npm run docker:logs:api

# Voir tous les logs (API + MongoDB)
npm run docker:logs:all

# Redémarrer l'API
npm run docker:restart:api

# Rebuild complet (sans cache)
npm run docker:rebuild
```

#### Commandes Docker natives

```bash
# Démarrer uniquement MongoDB
docker-compose up -d mongodb

# Voir les logs MongoDB
docker-compose logs -f mongodb

# Arrêter MongoDB
docker-compose stop mongodb

# Redémarrer MongoDB
docker-compose restart mongodb

# Accéder au shell MongoDB
docker exec -it statcoach-mongodb mongosh -u statcoach -p statcoach_secret --authenticationDatabase admin

# Voir les conteneurs actifs
docker-compose ps

# Arrêter tous les services
docker-compose down

# Nettoyer tout (⚠️ supprime les données)
docker-compose down -v
```

#### Configuration Docker

Le projet dispose de deux configurations Docker:

1. **Production** (`Dockerfile`):
   - Build multi-stage optimisé
   - Image Node.js Alpine légère
   - Compilation TypeScript
   - Optimisé pour la performance

2. **Développement** (`Dockerfile.dev`):
   - Hot reload avec ts-node-dev
   - Volumes montés pour le code source
   - Rechargement automatique des changements
   - Idéal pour le développement

Voir `docker-compose.yml` pour les détails de configuration.

## 🔐 Authentification JWT

L'API utilise JWT (JSON Web Tokens) pour sécuriser les endpoints.

### Routes publiques

Ces routes ne nécessitent pas d'authentification:

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /health` - Health check

### Routes protégées

Toutes les autres routes (`/api/players`, `/api/teams`, `/api/games`, `/api/stats`) nécessitent un token JWT valide.

### Utilisation

**1. Créer un compte:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

**Réponse:**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**2. Se connecter:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**3. Utiliser le token pour accéder aux routes protégées:**

```bash
curl -X GET http://localhost:3000/api/teams \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Sécurité

- Les mots de passe sont hashés avec **bcrypt** (10 rounds)
- Les tokens JWT expirent après **7 jours**
- La clé secrète JWT doit être définie dans la variable d'environnement `JWT_SECRET`
- ⚠️ **Important**: Changez `JWT_SECRET` en production avec une valeur forte et aléatoire

## 📱 Support du mode hors-ligne

L'application supporte le mode hors-ligne avec synchronisation automatique:

- Les statistiques peuvent être enregistrées sans connexion internet
- Synchronisation automatique quand la connexion revient
- Gestion des conflits et retry automatique

## 🏗️ Architecture du serveur

### Point d'entrée

Le serveur démarre via `src/index.ts`, qui:

1. **Charge la configuration** via dotenv (.env)
2. **Se connecte à MongoDB** avec gestion d'erreurs
3. **Initialise les repositories** (Dependency Injection)
   - MongoPlayerRepository
   - MongoTeamRepository
   - MongoGameRepository
   - MongoGameStatsRepository
4. **Crée l'application Express** via `createApp()`
5. **Démarre le serveur** sur le port configuré (défaut: 3000)

### Démarrage du serveur

```typescript
// src/index.ts
import { createApp } from './presentation/app';
import { connectToDatabase } from './infrastructure/database/mongodb/connection';

async function startServer() {
  await connectToDatabase(MONGODB_URI);

  const repositories = {
    playerRepository: new MongoPlayerRepository(),
    teamRepository: new MongoTeamRepository(),
    gameRepository: new MongoGameRepository(),
    gameStatsRepository: new MongoGameStatsRepository(),
  };

  const app = createApp(repositories);
  app.listen(PORT);
}
```

### Gestion de la connexion MongoDB

Le module `src/infrastructure/database/mongodb/connection.ts` gère:

- Connexion à MongoDB avec Mongoose
- Event handlers (connected, error, disconnected)
- Graceful shutdown (SIGINT)
- Reconnexion automatique

## 🛠️ Technologies

### Backend

- **TypeScript** - Typage statique strict
- **Node.js / Express** - Serveur API REST
- **MongoDB / Mongoose** - Base de données NoSQL

### Tests

- **Jest** - Framework de tests (unitaires, intégration, API)
- **Supertest** - Tests HTTP pour Express
- **MongoDB Memory Server** - Base de données en mémoire pour les tests

### Documentation

- **Swagger / OpenAPI 3.0** - Documentation interactive de l'API
- **swagger-jsdoc** - Génération de spec OpenAPI depuis JSDoc
- **swagger-ui-express** - Interface Swagger UI

### DevOps

- **Docker / Docker Compose** - Conteneurisation (Production + Dev)
- **ESLint** - Linting du code
- **ts-node-dev** - Hot reload en développement

## 📝 Standards de code

- Clean Architecture stricte
- TDD/BDD obligatoire
- Typage TypeScript strict
- Coverage minimum: 70%

## 🔄 Workflow de développement

1. Créer une branche feature
2. Écrire les tests en premier (TDD)
3. Implémenter la fonctionnalité
4. Vérifier que tous les tests passent
5. Vérifier le coverage (minimum 70%)
6. Build TypeScript sans erreurs
7. Code review
8. Merge vers main
9. Déploiement automatique sur Railway

## 📚 Documentation API

### Documentation interactive Swagger

Une documentation interactive complète de l'API est disponible via Swagger UI:

**Environnement de développement:**

```bash
# Démarrer le serveur
npm run dev

# Accéder à la documentation Swagger
# Ouvrir dans le navigateur: http://localhost:3000/api-docs
```

**Environnement de production:**

- **API Docs**: https://basketball-stats-coach-production.up.railway.app/api-docs
- **Health Check**: https://basketball-stats-coach-production.up.railway.app/health

La documentation Swagger permet de:

- Visualiser tous les endpoints disponibles
- Voir les schémas de données et les modèles
- Tester directement les endpoints depuis l'interface
- Consulter les exemples de requêtes et réponses

### Endpoints disponibles

**🔐 Authentication (Authentification)** - `/api/auth`

Routes **publiques** (pas d'authentification requise):

- `POST /api/auth/register` - Créer un compte utilisateur
- `POST /api/auth/login` - Se connecter et obtenir un token JWT

> **Note**: Toutes les autres routes sont protégées par JWT et nécessitent un token valide dans l'header `Authorization: Bearer <token>`

**Players (Joueurs)** - `/api/players` 🔒

- `POST /api/players` - Créer un joueur
- `GET /api/players` - Liste de tous les joueurs
- `GET /api/players/:id` - Détails d'un joueur
- `PUT /api/players/:id` - Modifier un joueur
- `DELETE /api/players/:id` - Supprimer un joueur
- `GET /api/players/team/:teamId` - Joueurs d'une équipe

**Teams (Équipes)** - `/api/teams` 🔒

- `POST /api/teams` - Créer une équipe
- `GET /api/teams` - Liste de toutes les équipes
- `GET /api/teams/:id` - Détails d'une équipe
- `PUT /api/teams/:id` - Modifier une équipe
- `DELETE /api/teams/:id` - Supprimer une équipe

**Games (Matchs)** - `/api/games` 🔒

- `POST /api/games` - Créer un match
- `GET /api/games/:id` - Détails d'un match
- `PUT /api/games/:id` - Modifier un match
- `DELETE /api/games/:id` - Supprimer un match
- `GET /api/games/team/:teamId` - Matchs d'une équipe
- `GET /api/games/status/:status` - Matchs par statut
- `PUT /api/games/:id/roster` - Définir le roster (5-15 joueurs)
- `PUT /api/games/:id/starting-lineup` - Définir la composition de départ (5 joueurs)
- `POST /api/games/:id/start` - Démarrer un match
- `POST /api/games/:id/complete` - Terminer un match
- `POST /api/games/:id/next-quarter` - Passer au quart-temps suivant
- `POST /api/games/:id/substitution` - Enregistrer un changement de joueur

**Stats (Statistiques)** - `/api/stats` 🔒

- `POST /api/stats/games/:gameId/actions` - Enregistrer une action
- `DELETE /api/stats/games/:gameId/actions/:playerId` - Annuler la dernière action
- `GET /api/stats/games/:gameId/players/:playerId` - Stats d'un joueur pour un match
- `GET /api/stats/players/:playerId/career` - Stats de carrière d'un joueur

**Health Check** - `/health`

- `GET /health` - Vérifier l'état de l'API

Pour plus de détails sur chaque endpoint, consultez:

- **Documentation Swagger UI**: http://localhost:3000/api-docs (quand le serveur est lancé)
- **Documentation détaillée**: Voir [docs/API.md](./docs/API.md)
- **Architecture**: Voir [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 📖 Documentation complète

Le projet dispose d'une documentation complète dans le dossier `docs/`:

### Documentation principale

- **[README.md](./README.md)** - Ce fichier (vue d'ensemble et démarrage rapide)
- **[docs/QUICK_START.md](./docs/QUICK_START.md)** - Guide de démarrage rapide avec TDD
- **[docs/USE_CASES.md](./docs/USE_CASES.md)** - Liste complète des 23 use cases implémentés

### Documentation technique

- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Architecture Clean Architecture détaillée
  - Explication des 4 couches (Domain, Application, Infrastructure, Presentation)
  - Patterns et principes (SOLID, DI, Repository Pattern)
  - Flux de données et exemples concrets
  - Stratégie de tests (unitaires, intégration, API)

- **[docs/API.md](./docs/API.md)** - Documentation complète de l'API REST
  - 24 endpoints documentés avec exemples
  - Format des requêtes et réponses
  - Codes HTTP et gestion des erreurs
  - Workflows complets (création équipe, match, stats)

- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guide de déploiement sur Railway
  - Configuration Railway (projet, service, MongoDB)
  - Variables d'environnement
  - Processus de déploiement automatique
  - Vérification et monitoring
  - Dépannage et rollback

### Swagger / OpenAPI

Documentation interactive accessible quand le serveur est lancé:

- **URL Locale**: http://localhost:3000/api-docs
- **URL Production**: https://basketball-stats-coach-production.up.railway.app/api-docs
- **Format**: OpenAPI 3.0
- **Fonctionnalités**: Tester les endpoints directement depuis l'interface

---

## 📊 État du projet

### Fonctionnalités complètes

- ✅ **29 use cases** implémentés (Player, Team, Game, Stats, Auth)
- ✅ **30 endpoints API REST** avec Swagger
- ✅ **432 tests** passing (unitaires, intégration, API)
- ✅ **Gestion complète des matchs**: Roster (5-15 joueurs), Lineup (5 joueurs), Quart-temps (1-4), Substitutions
- ✅ **Authentification JWT** avec bcrypt
  - Routes publiques: `/api/auth/register` et `/api/auth/login`
  - Routes protégées: Toutes les autres routes nécessitent un token JWT
  - Token JWT valide 7 jours
- ✅ **Clean Architecture** stricte avec 4 couches
- ✅ **Docker** production et développement
- ✅ **MongoDB** avec repositories
- ✅ **TypeScript** strict
- ✅ **TDD/BDD** avec coverage ~70%
- ✅ **CI/CD** avec GitHub Actions
- ✅ **Déploiement** en production sur Railway

### Prochaines étapes

- 🔄 Frontend mobile (React Native / Expo)
- 🔄 Système de synchronisation hors-ligne
- 🔄 Notifications en temps réel
- 🔄 Export des statistiques (PDF, Excel)
- 🔄 Analyse avancée des performances
- 🔄 Gestion des rôles et permissions (admin/coach/player)

---

## 🤝 Contribution

Pour contribuer au projet:

1. Suivre l'architecture Clean Architecture
2. Écrire les tests en premier (TDD)
3. Maintenir la couverture de tests > 70%
4. Respecter les conventions de code TypeScript
5. Documenter les nouveaux endpoints dans Swagger
6. S'assurer que la CI passe avant de merge

---

## 📞 Support

Pour toute question ou problème:

- **Documentation**: Consultez les fichiers dans `docs/`
- **API**: Swagger UI à http://localhost:3000/api-docs
- **Architecture**: Voir [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
