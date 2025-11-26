# StatCoach Pro - Backend API

Backend API pour **StatCoach Pro**, l'application mobile professionnelle de suivi de statistiques de basketball en temps réel, construite avec **Clean Architecture**, **TDD** et **BDD**.

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
│   │   │   └── GameStats.ts       # Entité Statistiques de match
│   │   └── repositories/          # Interfaces de repositories
│   │       ├── PlayerRepository.ts
│   │       ├── TeamRepository.ts
│   │       ├── GameRepository.ts
│   │       └── GameStatsRepository.ts
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
    │   ├── domain/
    │   └── application/
    ├── integration/               # Tests d'intégration
    └── features/                  # Tests BDD (Cucumber)
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

**Attributs:**
- `firstName`, `lastName`, `nickname`
- `height` (cm), `weight` (kg), `age`
- `gender`, `grade`, `position`
- `teamId`

### Team (Équipe)
Représente une équipe de basketball.

**Attributs:**
- `name`, `coach`, `season`, `league`

### Game (Match)
Représente un match de basketball.

**Attributs:**
- `teamId`, `opponent`, `gameDate`, `location`
- `status`: `not_started` | `in_progress` | `completed`
- `startedAt`, `completedAt`

### GameStats (Statistiques de match)
Représente les statistiques d'un joueur pour un match donné.

**Statistiques:**
- **Tirs:** Free Throws, 2-Points, 3-Points (made/attempted)
- **Rebonds:** Offensifs, Défensifs
- **Autres:** Assists, Steals, Blocks, Turnovers, Personal Fouls
- **Temps:** Minutes jouées

**Méthodes calculées:**
- `getTotalPoints()`, `getTotalRebounds()`
- `getFieldGoalPercentage()`, `getFreeThrowPercentage()`, `getThreePointPercentage()`

## 🧪 Tests

### TDD (Test Driven Development)
Tous les use cases et entités sont développés en suivant TDD:
1. Écrire le test en premier
2. Implémenter le code minimum pour faire passer le test
3. Refactoriser

### BDD (Behavior Driven Development)
Tests de comportement avec Cucumber pour valider les scénarios utilisateur.

### Commandes de test
```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage

# Tests BDD
npm run test:bdd
```

## 🚀 Installation et démarrage

### Prérequis

- Node.js 20+
- Docker & Docker Compose (pour MongoDB)
- npm ou yarn

### Option 1 : Développement avec Docker (Recommandé)

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

### Option 2 : Développement sans Docker

```bash
# 1. Installation des dépendances
npm install

# 2. Installer MongoDB localement ou utiliser MongoDB Atlas
# Modifier MONGODB_URI dans .env

# 3. Développement avec hot reload
npm run dev
```

### Option 3 : Build et production

```bash
# Compilation TypeScript
npm run build

# Production
npm start
```

### Option 4 : Lancer tout avec Docker (API + MongoDB)

```bash
# Décommenter la section 'api' dans docker-compose.yml
# Puis :
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter tout
docker-compose down
```

## 🔧 Configuration

Créer un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

### Variables d'environnement principales

**Serveur:**
- `PORT`: Port du serveur (défaut: 3000)
- `NODE_ENV`: Environnement (development/production)

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

```bash
# Démarrer MongoDB
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

# Nettoyer tout (⚠️ supprime les données)
docker-compose down -v
```

## 📱 Support du mode hors-ligne

L'application supporte le mode hors-ligne avec synchronisation automatique:
- Les statistiques peuvent être enregistrées sans connexion internet
- Synchronisation automatique quand la connexion revient
- Gestion des conflits et retry automatique

## 🛠️ Technologies

- **TypeScript** - Typage statique
- **Node.js / Express** - Serveur API
- **MongoDB / Mongoose** - Base de données
- **Jest** - Tests unitaires et d'intégration
- **Cucumber** - Tests BDD
- **ESLint** - Linting

## 📝 Standards de code

- Clean Architecture stricte
- TDD/BDD obligatoire
- Typage TypeScript strict
- Coverage minimum: 80%

## 🔄 Workflow de développement

1. Créer une branche feature
2. Écrire les tests (TDD)
3. Implémenter la fonctionnalité
4. Vérifier le coverage
5. Lancer les tests BDD
6. Code review
7. Merge

## 📚 Documentation API

La documentation de l'API sera générée automatiquement avec Swagger une fois l'API complète.
