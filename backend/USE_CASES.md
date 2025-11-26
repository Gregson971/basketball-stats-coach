# StatCoach Pro - Use Cases

Liste complète des use cases implémentés avec TDD.

## ✅ Player Use Cases (6/6)

### 1. CreatePlayer
**Fichier:** `src/application/use-cases/player/CreatePlayer.ts`
**Tests:** `tests/unit/application/use-cases/player/CreatePlayer.test.ts` ✅ 6 tests
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
**Tests:** `tests/unit/application/use-cases/player/UpdatePlayer.test.ts` ✅ 6 tests
**Description:** Mettre à jour les informations d'un joueur

**Paramètres:**
- `playerId` (required)
- Champs à modifier (partial)

**Champs immutables:** `id`, `teamId`, `createdAt`

---

### 3. DeletePlayer
**Fichier:** `src/application/use-cases/player/DeletePlayer.ts`
**Tests:** `tests/unit/application/use-cases/player/DeletePlayer.test.ts` ✅ 2 tests
**Description:** Supprimer un joueur

**Paramètres:**
- `playerId` (required)

---

### 4. GetPlayer
**Fichier:** `src/application/use-cases/player/GetPlayer.ts`
**Tests:** `tests/unit/application/use-cases/player/GetPlayer.test.ts` ✅ 2 tests
**Description:** Récupérer un joueur par son ID

**Paramètres:**
- `playerId` (required)

---

### 5. GetPlayersByTeam
**Fichier:** `src/application/use-cases/player/GetPlayersByTeam.ts`
**Tests:** `tests/unit/application/use-cases/player/GetPlayersByTeam.test.ts` ✅ 2 tests
**Description:** Récupérer tous les joueurs d'une équipe

**Paramètres:**
- `teamId` (required)

---

## ✅ Team Use Cases (5/5)

### 1. CreateTeam
**Fichier:** `src/application/use-cases/team/CreateTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/CreateTeam.test.ts` ✅ 5 tests
**Description:** Créer une nouvelle équipe

**Paramètres:**
- `name` (required)
- `coach`, `season`, `league` (optional)

---

### 2. UpdateTeam
**Fichier:** `src/application/use-cases/team/UpdateTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/UpdateTeam.test.ts` ✅ 7 tests
**Description:** Mettre à jour les informations d'une équipe

**Paramètres:**
- `teamId` (required)
- Champs à modifier (partial)

**Champs immutables:** `id`, `createdAt`

---

### 3. DeleteTeam
**Fichier:** `src/application/use-cases/team/DeleteTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/DeleteTeam.test.ts` ✅ 2 tests
**Description:** Supprimer une équipe

**Paramètres:**
- `teamId` (required)

---

### 4. GetTeam
**Fichier:** `src/application/use-cases/team/GetTeam.ts`
**Tests:** `tests/unit/application/use-cases/team/GetTeam.test.ts` ✅ 2 tests
**Description:** Récupérer une équipe par son ID

**Paramètres:**
- `teamId` (required)

---

### 5. GetAllTeams
**Fichier:** `src/application/use-cases/team/GetAllTeams.ts`
**Tests:** `tests/unit/application/use-cases/team/GetAllTeams.test.ts` ✅ 2 tests
**Description:** Récupérer toutes les équipes

**Paramètres:** Aucun

---

## ✅ Game Use Cases (8/8)

### 1. CreateGame
**Fichier:** `src/application/use-cases/game/CreateGame.ts`
**Tests:** `tests/unit/application/use-cases/game/CreateGame.test.ts` ✅ 7 tests
**Description:** Créer un nouveau match

**Paramètres:**
- `teamId` (required)
- `opponent` (required)
- `gameDate`, `location`, `notes` (optional)

---

### 2. UpdateGame
**Fichier:** `src/application/use-cases/game/UpdateGame.ts`
**Tests:** `tests/unit/application/use-cases/game/UpdateGame.test.ts` ✅ 8 tests
**Description:** Mettre à jour les informations d'un match

**Paramètres:**
- `gameId` (required)
- Champs à modifier (partial)

**Champs immutables:** `id`, `teamId`, `createdAt`, `startedAt`, `completedAt`

---

### 3. DeleteGame
**Fichier:** `src/application/use-cases/game/DeleteGame.ts`
**Tests:** `tests/unit/application/use-cases/game/DeleteGame.test.ts` ✅ 2 tests
**Description:** Supprimer un match

**Paramètres:**
- `gameId` (required)

---

### 4. GetGame
**Fichier:** `src/application/use-cases/game/GetGame.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGame.test.ts` ✅ 2 tests
**Description:** Récupérer un match par son ID

**Paramètres:**
- `gameId` (required)

---

### 5. GetGamesByTeam
**Fichier:** `src/application/use-cases/game/GetGamesByTeam.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGamesByTeam.test.ts` ✅ 3 tests
**Description:** Récupérer tous les matchs d'une équipe

**Paramètres:**
- `teamId` (required)

---

### 6. GetGamesByStatus
**Fichier:** `src/application/use-cases/game/GetGamesByStatus.ts`
**Tests:** `tests/unit/application/use-cases/game/GetGamesByStatus.test.ts` ✅ 4 tests
**Description:** Récupérer tous les matchs par statut

**Paramètres:**
- `status` (required): 'not_started' | 'in_progress' | 'completed'

---

### 7. StartGame
**Fichier:** `src/application/use-cases/game/StartGame.ts`
**Tests:** `tests/unit/application/use-cases/game/StartGame.test.ts` ✅ 4 tests
**Description:** Démarrer un match (change status → in_progress)

**Paramètres:**
- `gameId` (required)

---

### 8. CompleteGame
**Fichier:** `src/application/use-cases/game/CompleteGame.ts`
**Tests:** `tests/unit/application/use-cases/game/CompleteGame.test.ts` ✅ 3 tests
**Description:** Terminer un match (change status → completed)

**Paramètres:**
- `gameId` (required)

---

## ✅ GameStats Use Cases (4/4)

### 1. RecordGameAction
**Fichier:** `src/application/use-cases/stats/RecordGameAction.ts`
**Tests:** `tests/unit/application/use-cases/stats/RecordGameAction.test.ts` ✅ 9 tests
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
  | 'freeThrow'      // Lancer franc
  | 'twoPoint'       // Panier à 2 points
  | 'threePoint'     // Panier à 3 points
  | 'offensiveRebound'  // Rebond offensif
  | 'defensiveRebound'  // Rebond défensif
  | 'assist'         // Passe décisive
  | 'steal'          // Interception
  | 'block'          // Contre
  | 'turnover'       // Perte de balle
  | 'personalFoul'   // Faute personnelle
```

---

### 2. UndoLastGameAction
**Fichier:** `src/application/use-cases/stats/UndoLastGameAction.ts`
**Tests:** `tests/unit/application/use-cases/stats/UndoLastGameAction.test.ts` ✅ 6 tests
**Description:** Annuler la dernière action enregistrée

**Paramètres:**
- `gameId` (required)
- `playerId` (required)

---

### 3. GetPlayerGameStats
**Fichier:** `src/application/use-cases/stats/GetPlayerGameStats.ts`
**Tests:** `tests/unit/application/use-cases/stats/GetPlayerGameStats.test.ts` ✅ 8 tests
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
**Tests:** `tests/unit/application/use-cases/stats/GetPlayerCareerStats.test.ts` ✅ 2 tests
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
- **Tests totaux:** 190 tests
  - Player: 18 tests
  - Team: 18 tests
  - Game: 33 tests
  - Stats: 25 tests
  - Domain: 89 tests
  - Integration: 7 tests
- **Test Suites:** 28 suites
- **Coverage:** ~90%
- **Tous les tests:** ✅ **PASSING**

---

## 🏗️ Architecture des Tests

Les tests sont maintenant organisés par domaine fonctionnel:

```
tests/
├── unit/
│   ├── application/
│   │   └── use-cases/
│   │       ├── player/      # Tests use cases Player
│   │       ├── team/        # Tests use cases Team
│   │       ├── game/        # Tests use cases Game
│   │       └── stats/       # Tests use cases Stats
│   └── domain/              # Tests entités domaine
└── integration/             # Tests repositories MongoDB
```

---

## 🔄 Flux typique d'utilisation

### 1. Configuration initiale
```typescript
// Créer une équipe
CreateTeam({ name: "Wild Cats" })

// Ajouter des joueurs
CreatePlayer({ firstName: "Ryan", lastName: "Evans", teamId: "..." })
CreatePlayer({ firstName: "Lilly", lastName: "Evans", teamId: "..." })
```

### 2. Début de match
```typescript
// Créer un match
CreateGame({ teamId: "...", opponent: "Tigers" })

// Démarrer le match
StartGame(gameId)
```

### 3. Pendant le match
```typescript
// Enregistrer les actions en temps réel
RecordGameAction({
  gameId,
  playerId,
  actionType: "twoPoint",
  made: true
})

// Si erreur, annuler
UndoLastGameAction({ gameId, playerId })
```

### 4. Fin de match
```typescript
// Terminer le match
CompleteGame(gameId)

// Consulter les stats
GetPlayerGameStats({ gameId, playerId })
GetPlayerCareerStats({ playerId })
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
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
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
