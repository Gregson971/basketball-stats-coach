# StatCoach Pro - Use Cases

Liste complète des use cases implémentés avec TDD.

## ✅ Player Use Cases (6/6)

### 1. CreatePlayer

**Fichier:** `src/application/use-cases/player/CreatePlayer.ts`
**Tests:** `tests/unit/application/use-cases/player/CreatePlayer.test.ts`
**Description:** Créer un nouveau joueur dans une équipe

**Paramètres:**

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

---

### 5. GetPlayersByTeam

**Fichier:** `src/application/use-cases/player/GetPlayersByTeam.ts`
**Tests:** `tests/unit/application/use-cases/player/GetPlayersByTeam.test.ts`
**Description:** Récupérer tous les joueurs d'une équipe

**Paramètres:**

- `teamId` (required)

---

## ✅ Team Use Cases (5/5)

### 1. CreateTeam

**Fichier:** `src/application/use-cases/team/CreateTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/CreateTeam.test.ts`
**Description:** Créer une nouvelle équipe

**Paramètres:**

- `name` (required)
- `coach`, `season`, `league` (optional)

---

### 2. UpdateTeam

**Fichier:** `src/application/use-cases/team/UpdateTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/UpdateTeam.test.ts`
**Description:** Mettre à jour les informations d'une équipe

**Paramètres:**

- `teamId` (required)
- Champs à modifier (partial)

**Champs immutables:** `id`, `createdAt`

---

### 3. DeleteTeam

**Fichier:** `src/application/use-cases/team/DeleteTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/DeleteTeam.test.ts`
**Description:** Supprimer une équipe

**Paramètres:**

- `teamId` (required)

---

### 4. GetTeam

**Fichier:** `src/application/use-cases/team/GetTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/GetTeam.test.ts`
**Description:** Récupérer une équipe par son ID

**Paramètres:**

- `teamId` (required)

---

### 5. GetAllTeams

**Fichier:** `src/application/use-cases/team/GetAllTeams.ts`
**Tests:** `tests/unit/application/use-cases/team/GetAllTeams.test.ts`
**Description:** Récupérer toutes les équipes

**Paramètres:** Aucun

---

## ✅ Game Use Cases (8/8)

### 1. CreateGame

**Fichier:** `src/application/use-cases/game/CreateGame.ts`
**Tests:** `tests/unit/application/use-cases/game/CreateGame.test.ts`
**Description:** Créer un nouveau match

**Paramètres:**

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
- Champs à modifier (partial)

**Champs immutables:** `id`, `teamId`, `createdAt`, `startedAt`, `completedAt`

---

### 3. DeleteGame

**Fichier:** `src/application/use-cases/game/DeleteGame.ts`
**Tests:** `tests/unit/application/use-cases/game/DeleteGame.test.ts`
**Description:** Supprimer un match

**Paramètres:**

- `gameId` (required)

---

### 4. GetGame

**Fichier:** `src/application/use-cases/game/GetGame.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGame.test.ts`
**Description:** Récupérer un match par son ID

**Paramètres:**

- `gameId` (required)

---

### 5. GetGamesByTeam

**Fichier:** `src/application/use-cases/game/GetGamesByTeam.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGamesByTeam.test.ts`
**Description:** Récupérer tous les matchs d'une équipe

**Paramètres:**

- `teamId` (required)

---

### 6. GetGamesByStatus

**Fichier:** `src/application/use-cases/game/GetGamesByStatus.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGamesByStatus.test.ts`
**Description:** Récupérer tous les matchs par statut

**Paramètres:**

- `status` (required): 'not_started' | 'in_progress' | 'completed'

---

### 7. StartGame

**Fichier:** `src/application/use-cases/game/StartGame.ts`
**Tests:** `tests/unit/application/use-cases/game/StartGame.test.ts`
**Description:** Démarrer un match (change status → in_progress)

**Paramètres:**

- `gameId` (required)

---

### 8. CompleteGame

**Fichier:** `src/application/use-cases/game/CompleteGame.ts`
**Tests:** `tests/unit/application/use-cases/game/CompleteGame.test.ts`
**Description:** Terminer un match (change status → completed)

**Paramètres:**

- `gameId` (required)

---

## ✅ GameStats Use Cases (4/4)

### 1. RecordGameAction

**Fichier:** `src/application/use-cases/stats/RecordGameAction.ts`
**Tests:** `tests/unit/application/use-cases/stats/RecordGameAction.test.ts`
**Description:** Enregistrer une action pendant un match

**Paramètres:**

- `gameId` (required)
- `playerId` (required)
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

---

### 3. GetPlayerGameStats

**Fichier:** `src/application/use-cases/stats/GetPlayerGameStats.ts`
**Tests:** `tests/unit/application/use-cases/stats/GetPlayerGameStats.test.ts`
**Description:** Récupérer les stats d'un joueur pour un match

**Paramètres:**

- `gameId` (required)
- `playerId` (required)

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

## 📊 Statistiques

- **Use Cases implémentés:** 23
- **Endpoints API REST:** 24
- **Tests totaux:** 246 tests
  - Tests unitaires (Use Cases): 94 tests
  - Tests unitaires (Domain): 96 tests
  - Tests d'intégration (Repositories): 26 tests
  - Tests API (Supertest): 56 tests
    - Players API: 12 tests
    - Teams API: 14 tests
    - Games API: 18 tests
    - Stats API: 12 tests
- **Test Suites:** 32 suites
- **Coverage:** ~70%
- **Tous les tests:** ✅ **PASSING**

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
│   │       └── stats/       # Tests use cases Stats (25 tests)
│   └── domain/              # Tests entités domaine (96 tests)
├── integration/             # Tests repositories MongoDB (26 tests)
│   ├── MongoPlayerRepository.test.ts
│   ├── MongoTeamRepository.test.ts
│   ├── MongoGameRepository.test.ts
│   └── MongoGameStatsRepository.test.ts
└── api/                     # Tests API avec Supertest (56 tests)
    ├── players.api.test.ts  # Tests endpoints /api/players
    ├── teams.api.test.ts    # Tests endpoints /api/teams
    ├── games.api.test.ts    # Tests endpoints /api/games
    ├── stats.api.test.ts    # Tests endpoints /api/stats
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

**Documentation interactive:** http://localhost:3000/api-docs (Swagger UI)

---

## 🔄 Flux typique d'utilisation

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
# Créer une équipe
POST /api/teams
{ "name": "Wild Cats" }

# Ajouter des joueurs
POST /api/players
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
