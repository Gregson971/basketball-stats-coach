# Architecture - StatCoach Pro Backend

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Clean Architecture](#clean-architecture)
- [Les 4 couches](#les-4-couches)
- [Flux de données](#flux-de-données)
- [Patterns et principes](#patterns-et-principes)
- [Organisation du code](#organisation-du-code)
- [Exemples concrets](#exemples-concrets)
- [Tests](#tests)

---

## Vue d'ensemble

StatCoach Pro Backend est construit selon les principes de **Clean Architecture** (Architecture Hexagonale) proposés par Robert C. Martin (Uncle Bob). Cette architecture assure:

- **Indépendance des frameworks**: La logique métier ne dépend pas d'Express, MongoDB ou autres frameworks
- **Testabilité**: Chaque couche peut être testée indépendamment
- **Indépendance de l'UI**: L'API peut être remplacée sans toucher à la logique métier
- **Indépendance de la DB**: MongoDB peut être remplacé par PostgreSQL sans toucher aux use cases
- **Maintenabilité**: Le code est organisé, découplé et facile à faire évoluer

---

## Clean Architecture

### Principe de dépendance

Le principe fondamental de Clean Architecture est la **règle de dépendance**:

```
Présentation → Application → Domain
Infrastructure → Application → Domain
```

**Les dépendances pointent toujours vers l'intérieur** (vers le Domain). Le domaine ne connaît rien des couches externes.

### Diagramme des couches

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                  │
│  (Controllers, Routes, Middleware)          │
│         Express.js / HTTP                   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┼───────────────────────────┐
│                 ↓                           │
│         Infrastructure Layer                │
│  (MongoDB Repositories, External Services)  │
│                                             │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│         Application Layer                   │
│         (Use Cases / DTOs)                  │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│         Domain Layer                        │
│     (Entities, Value Objects)               │
│     (Repository Interfaces)                 │
└─────────────────────────────────────────────┘
```

---

## Les 4 couches

### 1. Domain Layer (Cœur du système)

**Responsabilité**: Contenir la logique métier pure

**Contient**:

- **Entities**: Objets métier avec leur logique (Player, Team, Game, GameStats)
- **Value Objects**: Objets immuables représentant des concepts métier
- **Repository Interfaces**: Contrats pour la persistance des données

**Caractéristiques**:

- ❌ Pas de dépendances externes
- ❌ Ne connaît pas MongoDB, Express, etc.
- ✅ Purement TypeScript
- ✅ Logique métier réutilisable

**Exemple - Entité Player**:

```typescript
// src/domain/entities/Player.ts
export class Player {
  constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    public teamId: string,
    public nickname?: string,
    public position?: PlayerPosition
  ) // ...
  {}

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  updateProfile(data: Partial<PlayerProfile>): void {
    // Logique de validation métier
    if (data.firstName) this.firstName = data.firstName;
    if (data.lastName) this.lastName = data.lastName;
    // ...
  }
}
```

**Exemple - Repository Interface**:

```typescript
// src/domain/repositories/PlayerRepository.ts
export interface IPlayerRepository {
  create(player: Player): Promise<Player>;
  findById(id: string): Promise<Player | null>;
  findAll(): Promise<Player[]>;
  findByTeamId(teamId: string): Promise<Player[]>;
  update(id: string, player: Player): Promise<Player | null>;
  delete(id: string): Promise<boolean>;
}
```

---

### 2. Application Layer (Use Cases)

**Responsabilité**: Orchestrer la logique applicative

**Contient**:

- **Use Cases**: Actions métier (CreatePlayer, StartGame, RecordGameAction, etc.)
- **DTOs**: Objets de transfert de données

**Caractéristiques**:

- ✅ Utilise les entités du Domain
- ✅ Utilise les interfaces de repositories
- ❌ Ne connaît pas les détails d'implémentation (MongoDB, Express)
- ✅ Un use case = une action métier

**Exemple - Use Case CreatePlayer**:

```typescript
// src/application/use-cases/player/CreatePlayer.ts
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { Player } from '../../../domain/entities/Player';

interface CreatePlayerInput {
  firstName: string;
  lastName: string;
  teamId: string;
  nickname?: string;
  // ...
}

interface CreatePlayerOutput {
  success: boolean;
  player?: Player;
  error?: string;
}

export class CreatePlayer {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(input: CreatePlayerInput): Promise<CreatePlayerOutput> {
    // 1. Validation
    if (!input.firstName || !input.lastName || !input.teamId) {
      return {
        success: false,
        error: 'Missing required fields: firstName, lastName, teamId',
      };
    }

    // 2. Création de l'entité
    const player = new Player(
      crypto.randomUUID(),
      input.firstName,
      input.lastName,
      input.teamId,
      input.nickname
      // ...
    );

    // 3. Persistance via le repository
    const createdPlayer = await this.playerRepository.create(player);

    return {
      success: true,
      player: createdPlayer,
    };
  }
}
```

**Exemple de flux**:

```
Controller → Use Case → Repository Interface → Infrastructure
           ↓
        Validation
           ↓
    Création entité
           ↓
      Persistance
```

---

### 3. Infrastructure Layer (Implémentation)

**Responsabilité**: Implémenter les détails techniques

**Contient**:

- **Repository Implementations**: Implémentation MongoDB des interfaces
- **Database Configuration**: Configuration Mongoose
- **External Services**: Services tiers (email, notifications, etc.)
- **Sync System**: Système de synchronisation hors-ligne

**Caractéristiques**:

- ✅ Implémente les interfaces du Domain
- ✅ Utilise MongoDB, Mongoose
- ✅ Peut être remplacé sans toucher Application/Domain

**Exemple - MongoDB Repository**:

```typescript
// src/infrastructure/database/repositories/MongoPlayerRepository.ts
import { IPlayerRepository } from '../../../domain/repositories/PlayerRepository';
import { Player } from '../../../domain/entities/Player';
import { PlayerModel } from '../mongodb/models/PlayerModel';

export class MongoPlayerRepository implements IPlayerRepository {
  async create(player: Player): Promise<Player> {
    const playerDoc = new PlayerModel({
      _id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      teamId: player.teamId,
      // ...
    });

    await playerDoc.save();
    return this.toEntity(playerDoc);
  }

  async findById(id: string): Promise<Player | null> {
    const playerDoc = await PlayerModel.findById(id);
    if (!playerDoc) return null;
    return this.toEntity(playerDoc);
  }

  // Mapping Mongoose Document → Domain Entity
  private toEntity(doc: any): Player {
    return new Player(
      doc._id.toString(),
      doc.firstName,
      doc.lastName,
      doc.teamId,
      doc.nickname
      // ...
    );
  }

  // ... autres méthodes
}
```

---

### 4. Presentation Layer (API)

**Responsabilité**: Exposer l'API REST

**Contient**:

- **Controllers**: Gèrent les requêtes/réponses HTTP
- **Routes**: Définition des endpoints
- **Middleware**: Validation, gestion d'erreurs, etc.
- **Swagger**: Documentation OpenAPI

**Caractéristiques**:

- ✅ Utilise les use cases
- ✅ Gère HTTP, JSON
- ✅ Validation des requêtes
- ❌ Pas de logique métier

**Exemple - Controller**:

```typescript
// src/presentation/controllers/PlayerController.ts
import { Request, Response } from 'express';
import { CreatePlayer } from '../../application/use-cases/player/CreatePlayer';

export class PlayerController {
  constructor(private createPlayer: CreatePlayer) {}

  async create(req: Request, res: Response): Promise<void> {
    // 1. Récupérer les données de la requête
    const input = req.body;

    // 2. Appeler le use case
    const result = await this.createPlayer.execute(input);

    // 3. Retourner la réponse HTTP
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.error,
      });
      return;
    }

    res.status(201).json({
      success: true,
      player: result.player,
    });
  }
}
```

**Exemple - Routes avec Dependency Injection**:

```typescript
// src/presentation/routes/playerRoutes.ts
export const createPlayerRoutes = (playerRepository: IPlayerRepository): Router => {
  const router = Router();

  // Injection de dépendance
  const createPlayerUseCase = new CreatePlayer(playerRepository);
  const controller = new PlayerController(createPlayerUseCase);

  router.post('/', validateRequiredFields(['firstName', 'lastName', 'teamId']), asyncHandler(controller.create.bind(controller)));

  return router;
};
```

---

## Flux de données

### Exemple: Créer un joueur

```
1. Client HTTP
   POST /api/players
   { "firstName": "Michael", "lastName": "Jordan", "teamId": "team-123" }
         ↓
2. Express Router
   → Route: /api/players (POST)
         ↓
3. Middleware
   → validateRequiredFields(['firstName', 'lastName', 'teamId'])
   → asyncHandler (gestion erreurs async)
         ↓
4. PlayerController.create()
   → Reçoit req.body
         ↓
5. CreatePlayer Use Case
   → Validation métier
   → Création entité Player
   → Appel playerRepository.create(player)
         ↓
6. MongoPlayerRepository.create()
   → Mapping Entity → Mongoose Document
   → Sauvegarde MongoDB
   → Mapping Document → Entity
         ↓
7. Retour au Controller
   → Formatage réponse JSON
   → Status 201 Created
         ↓
8. Client HTTP
   Reçoit: { "success": true, "player": {...} }
```

---

## Patterns et principes

### Dependency Injection

Les dépendances sont injectées via les constructeurs:

```typescript
// ❌ Mauvais - dépendance directe
class CreatePlayer {
  async execute(input) {
    const repo = new MongoPlayerRepository(); // Couplage fort!
    await repo.create(...);
  }
}

// ✅ Bon - injection de dépendance
class CreatePlayer {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(input) {
    await this.playerRepository.create(...); // Interface!
  }
}
```

### Repository Pattern

Abstraction de la persistance des données:

```typescript
// Interface (Domain)
interface IPlayerRepository {
  create(player: Player): Promise<Player>;
  findById(id: string): Promise<Player | null>;
}

// Implémentation MongoDB (Infrastructure)
class MongoPlayerRepository implements IPlayerRepository { ... }

// Implémentation Mock pour tests (Tests)
class MockPlayerRepository implements IPlayerRepository { ... }
```

### Use Case Pattern

Un use case = une action métier:

```typescript
// Création
CreatePlayer.execute(input);

// Démarrage de match
StartGame.execute(gameId);

// Enregistrement d'action
RecordGameAction.execute(gameId, playerId, action);
```

### SOLID Principles

**S - Single Responsibility**: Chaque classe a une seule responsabilité

- `CreatePlayer`: créer un joueur
- `MongoPlayerRepository`: persister dans MongoDB
- `PlayerController`: gérer HTTP

**O - Open/Closed**: Ouvert à l'extension, fermé à la modification

- Nouvelles implémentations de repository sans toucher aux use cases

**L - Liskov Substitution**: Les interfaces peuvent être remplacées

- `MongoPlayerRepository` peut être remplacé par `PostgresPlayerRepository`

**I - Interface Segregation**: Interfaces spécifiques et ciblées

- `IPlayerRepository`, `IGameRepository` séparés

**D - Dependency Inversion**: Dépendre des abstractions, pas des implémentations

- Use cases dépendent de `IPlayerRepository`, pas de `MongoPlayerRepository`

---

## Organisation du code

### Structure des dossiers

```
src/
├── domain/                         # Couche Domain
│   ├── entities/                   # Entités métier
│   │   ├── Player.ts
│   │   ├── Team.ts
│   │   ├── Game.ts
│   │   └── GameStats.ts
│   ├── repositories/               # Interfaces de repositories
│   │   ├── PlayerRepository.ts
│   │   ├── TeamRepository.ts
│   │   ├── GameRepository.ts
│   │   └── GameStatsRepository.ts
│   └── value-objects/              # Value Objects
│
├── application/                    # Couche Application
│   ├── use-cases/
│   │   ├── player/                 # Use cases joueurs
│   │   │   ├── CreatePlayer.ts
│   │   │   ├── UpdatePlayer.ts
│   │   │   ├── DeletePlayer.ts
│   │   │   ├── GetPlayer.ts
│   │   │   └── GetPlayersByTeam.ts
│   │   ├── team/                   # Use cases équipes (5)
│   │   ├── game/                   # Use cases matchs (8)
│   │   └── stats/                  # Use cases statistiques (5)
│   └── dtos/                       # Data Transfer Objects
│
├── infrastructure/                 # Couche Infrastructure
│   ├── database/
│   │   ├── mongodb/                # Configuration MongoDB
│   │   │   ├── connection.ts
│   │   │   └── models/             # Mongoose models
│   │   └── repositories/           # Implémentations MongoDB
│   │       ├── MongoPlayerRepository.ts
│   │       ├── MongoTeamRepository.ts
│   │       ├── MongoGameRepository.ts
│   │       └── MongoGameStatsRepository.ts
│   └── sync/                       # Système de sync hors-ligne
│
└── presentation/                   # Couche Présentation
    ├── controllers/                # Contrôleurs HTTP
    │   ├── PlayerController.ts
    │   ├── TeamController.ts
    │   ├── GameController.ts
    │   └── StatsController.ts
    ├── routes/                     # Définition des routes
    │   ├── playerRoutes.ts
    │   ├── teamRoutes.ts
    │   ├── gameRoutes.ts
    │   ├── statsRoutes.ts
    │   └── index.ts
    ├── middleware/                 # Middlewares Express
    │   ├── asyncHandler.ts
    │   ├── errorHandler.ts
    │   └── validateRequest.ts
    ├── swagger.ts                  # Configuration OpenAPI
    └── app.ts                      # Application Express
```

---

## Exemples concrets

### Ajout d'une nouvelle fonctionnalité

**Besoin**: Ajouter une fonctionnalité "Suspendre un joueur"

**Étapes**:

1. **Domain** - Ajouter méthode à l'entité

```typescript
// src/domain/entities/Player.ts
export class Player {
  public suspended: boolean = false;

  suspend(reason: string): void {
    this.suspended = true;
    this.suspensionReason = reason;
  }

  unsuspend(): void {
    this.suspended = false;
    this.suspensionReason = undefined;
  }
}
```

2. **Application** - Créer le use case

```typescript
// src/application/use-cases/player/SuspendPlayer.ts
export class SuspendPlayer {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(playerId: string, reason: string) {
    const player = await this.playerRepository.findById(playerId);
    if (!player) return { success: false, error: 'Player not found' };

    player.suspend(reason);
    await this.playerRepository.update(playerId, player);

    return { success: true, player };
  }
}
```

3. **Presentation** - Ajouter l'endpoint

```typescript
// src/presentation/controllers/PlayerController.ts
async suspend(req: Request, res: Response) {
  const result = await this.suspendPlayer.execute(
    req.params.id,
    req.body.reason
  );
  // ...
}

// src/presentation/routes/playerRoutes.ts
router.post('/:id/suspend', controller.suspend);
```

**Aucune modification nécessaire dans Infrastructure!**

---

### Changement de base de données

**Besoin**: Passer de MongoDB à PostgreSQL

**Impact**:

- ✅ Domain: **Aucun changement**
- ✅ Application: **Aucun changement**
- ⚠️ Infrastructure: Nouvelle implémentation
- ✅ Presentation: **Aucun changement**

**Étapes**:

1. Créer `PostgresPlayerRepository` qui implémente `IPlayerRepository`
2. Changer l'injection de dépendance dans les routes
3. C'est tout!

```typescript
// Avant
const playerRepository = new MongoPlayerRepository();

// Après
const playerRepository = new PostgresPlayerRepository();

// Le reste du code reste identique!
```

---

## Tests

### Stratégie de tests

**Tests unitaires** (Domain + Application):

- Tests des entités
- Tests des use cases avec mock repositories
- Pas de dépendances externes

**Tests d'intégration** (Infrastructure):

- Tests des repositories avec MongoDB Memory Server
- Validation de la persistance

**Tests API** (Presentation):

- Tests des endpoints avec Supertest
- Mock repositories pour isolation

### Exemple de test unitaire

```typescript
// tests/unit/application/CreatePlayer.test.ts
describe('CreatePlayer Use Case', () => {
  it('should create a player', async () => {
    // Arrange
    const mockRepo: IPlayerRepository = {
      create: jest.fn().mockResolvedValue(expectedPlayer),
      findById: jest.fn(),
      // ...
    };
    const useCase = new CreatePlayer(mockRepo);

    // Act
    const result = await useCase.execute({
      firstName: 'Michael',
      lastName: 'Jordan',
      teamId: 'team-123',
    });

    // Assert
    expect(result.success).toBe(true);
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
```

### Avantages pour les tests

- ✅ Tests rapides (pas de DB réelle)
- ✅ Tests isolés (mocks)
- ✅ Couverture complète
- ✅ TDD facile

---

## Avantages de cette architecture

### 1. Maintenabilité

- Code organisé et prévisible
- Responsabilités claires
- Facile à naviguer

### 2. Testabilité

- Chaque couche testable indépendamment
- Mocks faciles avec les interfaces
- TDD naturel

### 3. Évolutivité

- Ajout de fonctionnalités sans casser l'existant
- Changement de technologie possible
- Équipes peuvent travailler en parallèle

### 4. Indépendance

- Logique métier protégée
- Pas de couplage aux frameworks
- Code réutilisable

### 5. Documentation vivante

- Le code exprime l'intention
- Use cases = documentation métier
- Architecture claire

---

## Ressources

- **Clean Architecture** - Robert C. Martin
- **Domain-Driven Design** - Eric Evans
- **Hexagonal Architecture** - Alistair Cockburn

---

## Conclusion

Cette architecture peut sembler complexe au début, mais elle apporte:

- **Clarté**: On sait toujours où mettre le code
- **Qualité**: Le code est testable et maintenable
- **Pérennité**: Le système peut évoluer facilement

C'est un investissement qui paye sur le long terme, surtout pour des applications destinées à grandir et évoluer.
