# StatCoach Pro - Use Cases

Liste complète des use cases implémentés avec TDD.

## ✅ Player Use Cases (6/6)

### 1. CreatePlayer

**Fichier:** `src/application/use-cases/player/CreatePlayer.ts`
**Tests:** `tests/unit/application/use-cases/player/CreatePlayer.test.ts`
**Description:** Créer un nouveau joueur dans une équipe

**Paramètres:**

- `userId` (required) - Automatiquement extrait du token JWT
- `firstName` (required)
- `lastName` (required)
- `teamId` (required)
- `nickname` (optional)
- `height`, `weight`, `age` (optional)
- `gender`, `grade`, `position` (optional)

---

### 2. UpdatePlayer

**Fichier:** `src/application/use-cases/player/UpdatePlayer.ts`
**Tests:** `tests/unit/application/use-cases/player/UpdatePlayer.test.ts`
**Description:** Mettre à jour les informations d'un joueur

**Paramètres:**

- `playerId` (required)
- `userId` (required) - Authentifie et filtre les données
- Champs à modifier (partial)

**Champs immutables:** `id`, `teamId`, `createdAt`

---

### 3. DeletePlayer

**Fichier:** `src/application/use-cases/player/DeletePlayer.ts`
**Tests:** `tests/unit/application/use-cases/player/DeletePlayer.test.ts`
**Description:** Supprimer un joueur

**Paramètres:**

- `playerId` (required)

---

### 4. GetPlayer

**Fichier:** `src/application/use-cases/player/GetPlayer.ts`
**Tests:** `tests/unit/application/use-cases/player/GetPlayer.test.ts`
**Description:** Récupérer un joueur par son ID

**Paramètres:**

- `playerId` (required)
- `userId` (required) - Assure l'isolation des données

---

### 5. GetPlayersByTeam

**Fichier:** `src/application/use-cases/player/GetPlayersByTeam.ts`
**Tests:** `tests/unit/application/use-cases/player/GetPlayersByTeam.test.ts`
**Description:** Récupérer tous les joueurs d'une équipe

**Paramètres:**

- `teamId` (required)
- `userId` (required) - Retourne uniquement les joueurs de l'utilisateur

---

## ✅ Team Use Cases (5/5)

### 1. CreateTeam

**Fichier:** `src/application/use-cases/team/CreateTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/CreateTeam.test.ts`
**Description:** Créer une nouvelle équipe

**Paramètres:**

- `userId` (required) - Automatiquement extrait du token JWT
- `name` (required)
- `coach`, `season`, `league` (optional)

---

### 2. UpdateTeam

**Fichier:** `src/application/use-cases/team/UpdateTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/UpdateTeam.test.ts`
**Description:** Mettre à jour les informations d'une équipe

**Paramètres:**

- `teamId` (required)
- `userId` (required) - Vérifie la propriété de l'équipe
- Champs à modifier (partial)

**Champs immutables:** `id`, `createdAt`

---

### 3. DeleteTeam

**Fichier:** `src/application/use-cases/team/DeleteTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/DeleteTeam.test.ts`
**Description:** Supprimer une équipe

**Paramètres:**

- `teamId` (required)
- `userId` (required) - Vérifie la propriété de l'équipe

---

### 4. GetTeam

**Fichier:** `src/application/use-cases/team/GetTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/GetTeam.test.ts`
**Description:** Récupérer une équipe par son ID

**Paramètres:**

- `teamId` (required)
- `userId` (required) - Assure l'isolation des données

---

### 5. GetAllTeams

**Fichier:** `src/application/use-cases/team/GetAllTeams.ts`
**Tests:** `tests/unit/application/use-cases/team/GetAllTeams.test.ts`
**Description:** Récupérer toutes les équipes de l'utilisateur

**Paramètres:**

- `userId` (required) - Retourne uniquement les équipes de l'utilisateur

---

## ✅ Game Use Cases (12/12)

### 1. CreateGame

**Fichier:** `src/application/use-cases/game/CreateGame.ts`
**Tests:** `tests/unit/application/use-cases/game/CreateGame.test.ts`
**Description:** Créer un nouveau match

**Paramètres:**

- `userId` (required) - Automatiquement extrait du token JWT
- `teamId` (required)
- `opponent` (required)
- `gameDate`, `location`, `notes` (optional)

---

### 2. UpdateGame

**Fichier:** `src/application/use-cases/game/UpdateGame.ts`
**Tests:** `tests/unit/application/use-cases/game/UpdateGame.test.ts`
**Description:** Mettre à jour les informations d'un match

**Paramètres:**

- `gameId` (required)
- `userId` (required) - Vérifie la propriété du match
- Champs à modifier (partial)

**Champs immutables:** `id`, `teamId`, `createdAt`, `startedAt`, `completedAt`

---

### 3. DeleteGame

**Fichier:** `src/application/use-cases/game/DeleteGame.ts`
**Tests:** `tests/unit/application/use-cases/game/DeleteGame.test.ts`
**Description:** Supprimer un match

**Paramètres:**

- `gameId` (required)
- `userId` (required) - Vérifie la propriété du match

---

### 4. GetGame

**Fichier:** `src/application/use-cases/game/GetGame.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGame.test.ts`
**Description:** Récupérer un match par son ID

**Paramètres:**

- `gameId` (required)
- `userId` (required) - Assure l'isolation des données

---

### 5. GetGamesByTeam

**Fichier:** `src/application/use-cases/game/GetGamesByTeam.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGamesByTeam.test.ts`
**Description:** Récupérer tous les matchs d'une équipe

**Paramètres:**

- `teamId` (required)
- `userId` (required) - Retourne uniquement les matchs de l'utilisateur

---

### 6. GetGamesByStatus

**Fichier:** `src/application/use-cases/game/GetGamesByStatus.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGamesByStatus.test.ts`
**Description:** Récupérer tous les matchs par statut

**Paramètres:**

- `status` (required): 'not_started' | 'in_progress' | 'completed'
- `userId` (required) - Retourne uniquement les matchs de l'utilisateur

---

### 7. StartGame

**Fichier:** `src/application/use-cases/game/StartGame.ts`
**Tests:** `tests/unit/application/use-cases/game/StartGame.test.ts`
**Description:** Démarrer un match (change status → in_progress)

**Paramètres:**

- `gameId` (required)
- `userId` (required) - Vérifie la propriété du match

---

### 8. CompleteGame

**Fichier:** `src/application/use-cases/game/CompleteGame.ts`
**Tests:** `tests/unit/application/use-cases/game/CompleteGame.test.ts`
**Description:** Terminer un match (change status → completed)

**Paramètres:**

- `gameId` (required)
- `userId` (required) - Vérifie la propriété du match

---

### 9. SetGameRoster

**Fichier:** `src/application/use-cases/game/SetGameRoster.ts`
**Tests:** `tests/unit/application/use-cases/game/SetGameRoster.test.ts`
**Description:** Définir le roster du match (liste des joueurs convoqués)

**Paramètres:**

- `gameId` (required)
- `playerIds` (required) - Array de 5 à 15 player IDs
- `userId` (required) - Vérifie la propriété du match

**Validations:**

- Entre 5 et 15 joueurs requis
- Tous les joueurs doivent appartenir à l'équipe du match
- Pas de doublons dans la liste
- Le match doit être au statut `not_started`
- Tous les joueurs doivent exister

---

### 10. SetStartingLineup

**Fichier:** `src/application/use-cases/game/SetStartingLineup.ts`
**Tests:** `tests/unit/application/use-cases/game/SetStartingLineup.test.ts`
**Description:** Définir la composition de départ (5 joueurs titulaires)

**Paramètres:**

- `gameId` (required)
- `playerIds` (required) - Array de exactement 5 player IDs
- `userId` (required) - Vérifie la propriété du match

**Validations:**

- Exactement 5 joueurs requis
- Le roster doit être défini au préalable
- Tous les joueurs doivent faire partie du roster
- Pas de doublons dans la liste
- Le match doit être au statut `not_started`

**Effet:** Initialise également `currentLineup` avec les mêmes joueurs

---

### 11. NextQuarter

**Fichier:** `src/application/use-cases/game/NextQuarter.ts`
**Tests:** `tests/unit/application/use-cases/game/NextQuarter.test.ts`
**Description:** Passer au quart-temps suivant (incrémente currentQuarter)

**Paramètres:**

- `gameId` (required)
- `userId` (required) - Vérifie la propriété du match

**Validations:**

- Le match doit être au statut `in_progress`
- Le quart-temps actuel doit être < 4
- Progression: currentQuarter → currentQuarter + 1 (1→2→3→4)

---

### 12. RecordSubstitution

**Fichier:** `src/application/use-cases/game/RecordSubstitution.ts`
**Tests:** `tests/unit/application/use-cases/game/RecordSubstitution.test.ts`
**Description:** Enregistrer un changement de joueur pendant le match

**Paramètres:**

- `gameId` (required)
- `playerOut` (required) - Player ID sortant du terrain
- `playerIn` (required) - Player ID entrant sur le terrain
- `userId` (required) - Vérifie la propriété du match

**Validations:**

- Le match doit être au statut `in_progress`
- `playerOut` doit être dans `currentLineup`
- `playerIn` doit être dans `roster` mais pas dans `currentLineup`
- `playerOut` et `playerIn` doivent être différents
- Les deux joueurs doivent appartenir à l'équipe

**Effet:**

- Crée une entrée Substitution avec gameId, quarter, playerOut, playerIn, timestamp
- Met à jour `currentLineup` en remplaçant playerOut par playerIn
- Retourne à la fois le Game mis à jour et la Substitution créée

---

## ✅ GameStats Use Cases (4/4)

### 1. RecordGameAction

**Fichier:** `src/application/use-cases/stats/RecordGameAction.ts`
**Tests:** `tests/unit/application/use-cases/stats/RecordGameAction.test.ts`
**Description:** Enregistrer une action pendant un match

**Paramètres:**

- `gameId` (required)
- `playerId` (required)
- `userId` (required) - Vérifie la propriété du match et des statistiques
- `actionType` (required):
  - `freeThrow`, `twoPoint`, `threePoint`
  - `offensiveRebound`, `defensiveRebound`
  - `assist`, `steal`, `block`
  - `turnover`, `personalFoul`
- `made` (optional): pour les tirs (true/false)

**Actions supportées:**

```typescript
type ActionType =
  | 'freeThrow' // Lancer franc
  | 'twoPoint' // Panier à 2 points
  | 'threePoint' // Panier à 3 points
  | 'offensiveRebound' // Rebond offensif
  | 'defensiveRebound' // Rebond défensif
  | 'assist' // Passe décisive
  | 'steal' // Interception
  | 'block' // Contre
  | 'turnover' // Perte de balle
  | 'personalFoul'; // Faute personnelle
```

---

### 2. UndoLastGameAction

**Fichier:** `src/application/use-cases/stats/UndoLastGameAction.ts`
**Tests:** `tests/unit/application/use-cases/stats/UndoLastGameAction.test.ts`
**Description:** Annuler la dernière action enregistrée

**Paramètres:**

- `gameId` (required)
- `playerId` (required)
- `userId` (required) - Vérifie la propriété des statistiques

---

### 3. GetPlayerGameStats

**Fichier:** `src/application/use-cases/stats/GetPlayerGameStats.ts`
**Tests:** `tests/unit/application/use-cases/stats/GetPlayerGameStats.test.ts`
**Description:** Récupérer les stats d'un joueur pour un match

**Paramètres:**

- `gameId` (required)
- `playerId` (required)
- `userId` (required) - Assure l'isolation des données

**Retour:**

- Toutes les statistiques du match
- Points totaux calculés
- Pourcentages calculés

---

### 4. GetPlayerCareerStats

**Fichier:** `src/application/use-cases/stats/GetPlayerCareerStats.ts`
**Tests:** `tests/unit/application/use-cases/stats/GetPlayerCareerStats.test.ts`
**Description:** Récupérer les statistiques agrégées d'un joueur

**Paramètres:**

- `playerId` (required)
- `userId` (required) - Retourne uniquement les statistiques de l'utilisateur

**Retour:**

```typescript
{
  playerId: string;
  gamesPlayed: number;
  totalPoints: number;
  totalRebounds: number;
  totalAssists: number;
  averagePoints: number;
  averageRebounds: number;
  averageAssists: number;
  fieldGoalPercentage: number;
  freeThrowPercentage: number;
  threePointPercentage: number;
  // ...
}
```

---

## ✅ Auth Use Cases (2/2)

### 1. Register

**Fichier:** `src/application/use-cases/auth/Register.ts`
**Tests:** `tests/unit/application/use-cases/auth/Register.test.ts`
**Description:** Créer un nouveau compte utilisateur

**Paramètres:**

- `email` (required) - Format email valide
- `password` (required) - Minimum 6 caractères
- `name` (required)

**Comportement:**

- Vérifie que l'email n'existe pas déjà (case-insensitive)
- Hash le mot de passe avec bcrypt (10 rounds)
- Crée l'entité User
- Génère un token JWT valide 7 jours
- Retourne l'utilisateur (sans password) et le token

**Retour:**

```typescript
{
  success: true,
  user: { id, email, name, createdAt, updatedAt },
  token: "eyJhbGciOi..."
}
```

---

### 2. Login

**Fichier:** `src/application/use-cases/auth/Login.ts`
**Tests:** `tests/unit/application/use-cases/auth/Login.test.ts`
**Description:** Authentifier un utilisateur existant

**Paramètres:**

- `email` (required)
- `password` (required)

**Comportement:**

- Recherche l'utilisateur par email (case-insensitive)
- Vérifie le mot de passe avec bcrypt.compare
- Génère un nouveau token JWT valide 7 jours
- Retourne l'utilisateur (sans password) et le token
- Message d'erreur générique pour éviter l'énumération d'emails

**Retour:**

```typescript
{
  success: true,
  user: { id, email, name, createdAt, updatedAt },
  token: "eyJhbGciOi..."
}
```

**Sécurité:**

- Le message d'erreur est identique que l'email existe ou non ("Invalid email or password")
- Empêche l'énumération des emails
- Les mots de passe ne sont jamais retournés dans les réponses

---

## 📊 Statistiques

- **Use Cases implémentés:** 29 (6 Player + 5 Team + 12 Game + 4 Stats + 2 Auth)
- **Endpoints API REST:** 30
- **Tests totaux:** 432 tests
  - Tests unitaires (Use Cases): 183 tests
  - Tests unitaires (Domain): 110 tests (ajout Substitution entity)
  - Tests d'intégration (Repositories): 49 tests (ajout SubstitutionRepository)
  - Tests API (Supertest): 200 tests
    - Players API: 12 tests
    - Teams API: 14 tests
    - Games API: 143 tests (ajout roster, lineup, quarters, substitutions)
    - Stats API: 12 tests
    - Auth API: 19 tests
- **Test Suites:** 41 suites
- **Coverage:** ~85%
- **Tous les tests:** ✅ **PASSING**
- **Isolation des données:** ✅ **Implémentée** - Tous les use cases filtrent par `userId`

---

## 🏗️ Architecture des Tests

Les tests sont organisés en 3 niveaux:

```
tests/
├── unit/
│   ├── application/
│   │   └── use-cases/
│   │       ├── player/      # Tests use cases Player (18 tests)
│   │       ├── team/        # Tests use cases Team (18 tests)
│   │       ├── game/        # Tests use cases Game (33 tests)
│   │       ├── stats/       # Tests use cases Stats (25 tests)
│   │       └── auth/        # Tests use cases Auth (27 tests)
│   └── domain/              # Tests entités domaine (123 tests)
├── integration/             # Tests repositories MongoDB (43 tests)
│   ├── MongoPlayerRepository.test.ts
│   ├── MongoTeamRepository.test.ts
│   ├── MongoGameRepository.test.ts
│   ├── MongoGameStatsRepository.test.ts
│   └── MongoUserRepository.test.ts
└── api/                     # Tests API avec Supertest (75 tests)
    ├── players.api.test.ts  # Tests endpoints /api/players
    ├── teams.api.test.ts    # Tests endpoints /api/teams
    ├── games.api.test.ts    # Tests endpoints /api/games
    ├── stats.api.test.ts    # Tests endpoints /api/stats
    ├── auth.api.test.ts     # Tests endpoints /api/auth
    └── setup/               # Mock repositories pour tests API
```

---

## 🌐 Endpoints API REST

Tous les use cases sont exposés via une API REST complète. Voir [API.md](./API.md) pour la documentation détaillée.

### Players - `/api/players`

- `POST /api/players` → CreatePlayer
- `GET /api/players` → Liste de tous les joueurs
- `GET /api/players/:id` → GetPlayer
- `PUT /api/players/:id` → UpdatePlayer
- `DELETE /api/players/:id` → DeletePlayer
- `GET /api/players/team/:teamId` → GetPlayersByTeam

### Teams - `/api/teams`

- `POST /api/teams` → CreateTeam
- `GET /api/teams` → GetAllTeams
- `GET /api/teams/:id` → GetTeam
- `PUT /api/teams/:id` → UpdateTeam
- `DELETE /api/teams/:id` → DeleteTeam

### Games - `/api/games`

- `POST /api/games` → CreateGame
- `GET /api/games/:id` → GetGame
- `PUT /api/games/:id` → UpdateGame
- `DELETE /api/games/:id` → DeleteGame
- `GET /api/games/team/:teamId` → GetGamesByTeam
- `GET /api/games/status/:status` → GetGamesByStatus
- `POST /api/games/:id/start` → StartGame
- `POST /api/games/:id/complete` → CompleteGame

### Stats - `/api/stats`

- `POST /api/stats/games/:gameId/actions` → RecordGameAction
- `DELETE /api/stats/games/:gameId/actions/:playerId` → UndoLastGameAction
- `GET /api/stats/games/:gameId/players/:playerId` → GetPlayerGameStats
- `GET /api/stats/players/:playerId/career` → GetPlayerCareerStats

### Auth - `/api/auth`

- `POST /api/auth/register` → Register (Public)
- `POST /api/auth/login` → Login (Public)

**Note:** Tous les endpoints nécessitent un token JWT sauf `/health` et `/api/auth/*`

**Documentation interactive:** http://localhost:3000/api-docs (Swagger UI)

---

## 🔄 Flux typique d'utilisation

### 0. Authentification

**Via Use Cases:**

```typescript
// S'inscrire
const result = await Register({
  email: 'coach@example.com',
  password: 'securepass123',
  name: 'Coach Smith',
});
// Retourne { token: "eyJhbGciOi..." }

// Ou se connecter
const result = await Login({
  email: 'coach@example.com',
  password: 'securepass123',
});
```

**Via API REST:**

```bash
# S'inscrire
POST /api/auth/register
{ "email": "coach@example.com", "password": "securepass123", "name": "Coach Smith" }

# Ou se connecter
POST /api/auth/login
{ "email": "coach@example.com", "password": "securepass123" }

# Utiliser le token pour toutes les requêtes suivantes
Authorization: Bearer eyJhbGciOi...
```

### 1. Configuration initiale

**Via Use Cases:**

```typescript
// Créer une équipe
CreateTeam({ name: 'Wild Cats' });

// Ajouter des joueurs
CreatePlayer({ firstName: 'Ryan', lastName: 'Evans', teamId: '...' });
CreatePlayer({ firstName: 'Lilly', lastName: 'Evans', teamId: '...' });
```

**Via API REST:**

```bash
# Créer une équipe (avec token JWT)
POST /api/teams
Authorization: Bearer eyJhbGciOi...
{ "name": "Wild Cats" }

# Ajouter des joueurs
POST /api/players
Authorization: Bearer eyJhbGciOi...
{ "firstName": "Ryan", "lastName": "Evans", "teamId": "team-123" }
```

### 2. Début de match

**Via Use Cases:**

```typescript
// Créer un match
CreateGame({ teamId: '...', opponent: 'Tigers' });

// Démarrer le match
StartGame(gameId);
```

**Via API REST:**

```bash
# Créer un match
POST /api/games
{ "teamId": "team-123", "opponent": "Tigers" }

# Démarrer le match
POST /api/games/game-123/start
```

### 3. Pendant le match

**Via Use Cases:**

```typescript
// Enregistrer les actions en temps réel
RecordGameAction({
  gameId,
  playerId,
  actionType: 'twoPoint',
  made: true,
});

// Si erreur, annuler
UndoLastGameAction({ gameId, playerId });
```

**Via API REST:**

```bash
# Enregistrer une action
POST /api/stats/games/game-123/actions
{ "playerId": "player-123", "actionType": "twoPoint", "made": true }

# Annuler la dernière action
DELETE /api/stats/games/game-123/actions/player-123
```

### 4. Fin de match

**Via Use Cases:**

```typescript
// Terminer le match
CompleteGame(gameId);

// Consulter les stats
GetPlayerGameStats({ gameId, playerId });
GetPlayerCareerStats({ playerId });
```

**Via API REST:**

```bash
# Terminer le match
POST /api/games/game-123/complete

# Consulter les stats
GET /api/stats/games/game-123/players/player-123
GET /api/stats/players/player-123/career
```

---

## 🎯 Pattern des Use Cases

Tous les use cases suivent le même pattern:

```typescript
export class UseCase {
  constructor(private readonly repository: IRepository) {}

  async execute(params): Promise<Result> {
    try {
      // 1. Validation
      // 2. Logique métier
      // 3. Persistence
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

**Avantages:**

- ✅ Testable facilement
- ✅ Indépendant de l'infrastructure
- ✅ Validation centralisée
- ✅ Gestion d'erreurs cohérente
- ✅ Suivre les principes SOLID
- ✅ Clean Architecture
