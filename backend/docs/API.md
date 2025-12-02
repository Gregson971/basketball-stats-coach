# API Documentation - StatCoach Pro

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Authentication](#authentication)
- [Format des réponses](#format-des-réponses)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Authentication](#authentication-authentification)
  - [Players](#players-joueurs)
  - [Teams](#teams-équipes)
  - [Games](#games-matchs)
  - [Stats](#stats-statistiques)

---

## Vue d'ensemble

**Base URL**:

- **Développement**: `http://localhost:3000`
- **Production**: `https://basketball-stats-coach-production.up.railway.app`

**Format**: JSON

**Documentation interactive (Swagger UI)**:

- **Développement**: `http://localhost:3000/api-docs`
- **Production**: `https://basketball-stats-coach-production.up.railway.app/api-docs`

Tous les endpoints de l'API retournent des réponses JSON avec un format standardisé incluant un champ `success` pour indiquer le succès ou l'échec de la requête.

---

## Authentication

**Type**: Bearer Token (JWT)

**Routes protégées**: Tous les endpoints sauf `/health` et `/api/auth/*` nécessitent un token JWT valide.

### Obtenir un token

Pour accéder aux routes protégées, vous devez :

1. Créer un compte avec `POST /api/auth/register`
2. Ou vous connecter avec `POST /api/auth/login`

Les deux endpoints retournent un token JWT à inclure dans l'en-tête `Authorization` de vos requêtes.

### Utilisation du token

```bash
curl -H "Authorization: Bearer <votre-token-jwt>" \
     http://localhost:3000/api/players
```

### Durée de validité

Les tokens JWT sont valides pendant **7 jours** après leur émission.

### Sécurité

- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les tokens sont signés avec une clé secrète (variable `JWT_SECRET`)
- Les emails ne sont pas sensibles à la casse
- **Isolation des données**: Chaque utilisateur ne peut accéder qu'à ses propres données (équipes, joueurs, matchs, statistiques)
- Le `userId` est automatiquement extrait du token JWT et appliqué à toutes les opérations

---

## Format des réponses

### Succès

```json
{
  "success": true,
  "data": {
    /* ... */
  }
}
```

### Erreur

```json
{
  "success": false,
  "error": "Message d'erreur descriptif"
}
```

---

## Gestion des erreurs

### Codes HTTP

- **200 OK**: Requête réussie
- **201 Created**: Ressource créée avec succès
- **400 Bad Request**: Erreur de validation ou paramètres manquants
- **401 Unauthorized**: Token manquant, invalide ou expiré
- **404 Not Found**: Ressource non trouvée
- **500 Internal Server Error**: Erreur serveur

### Format des erreurs de validation

```json
{
  "success": false,
  "error": "Missing required fields",
  "missingFields": ["firstName", "lastName"]
}
```

---

## Endpoints

### Health Check

#### Vérifier l'état de l'API

```
GET /health
```

**Réponse (200)**:

```json
{
  "success": true,
  "message": "StatCoach Pro API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Authentication (Authentification)

### Créer un compte

```
POST /api/auth/register
```

**Accès**: Public (pas de token requis)

**Body (required)**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Champs requis**: `email`, `password` (min 6 caractères), `name`

**Réponse (201)**:

```json
{
  "success": true,
  "user": {
    "id": "user-abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreur (400)** - Email déjà utilisé:

```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

**Erreur (400)** - Validation:

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

---

### Se connecter

```
POST /api/auth/login
```

**Accès**: Public (pas de token requis)

**Body (required)**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Champs requis**: `email`, `password`

**Réponse (200)**:

```json
{
  "success": true,
  "user": {
    "id": "user-abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreur (401)** - Identifiants invalides:

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

## Players (Joueurs)

**🔒 Routes protégées** - Nécessite un token JWT

### Créer un joueur

```
POST /api/players
```

**Body (required)**:

```json
{
  "firstName": "Michael",
  "lastName": "Jordan",
  "teamId": "team-123",
  "nickname": "MJ",
  "position": "Guard",
  "height": 198,
  "weight": 98,
  "age": 23,
  "gender": "M",
  "grade": "Senior"
}
```

**Champs requis**: `firstName`, `lastName`, `teamId`

**Note**: Le champ `userId` est automatiquement ajouté à partir du token JWT. Il ne doit pas être fourni dans le body.

**Valeurs autorisées**:

- `position`: `Guard`, `Forward`, `Center`
- `gender`: `M`, `F`

**Réponse (201)**:

```json
{
  "success": true,
  "player": {
    "id": "player-abc123",
    "firstName": "Michael",
    "lastName": "Jordan",
    "teamId": "team-123",
    "nickname": "MJ",
    "position": "Guard",
    "height": 198,
    "weight": 98,
    "age": 23,
    "gender": "M",
    "grade": "Senior",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Obtenir un joueur par ID

```
GET /api/players/:id
```

**Paramètres URL**:

- `id` (string): ID du joueur

**Réponse (200)**:

```json
{
  "success": true,
  "player": {
    "id": "player-abc123",
    "firstName": "Michael",
    "lastName": "Jordan",
    "teamId": "team-123",
    ...
  }
}
```

**Erreur (404)**:

```json
{
  "success": false,
  "error": "Player not found"
}
```

---

### Obtenir tous les joueurs

```
GET /api/players
```

**Réponse (200)**:

```json
{
  "success": true,
  "players": [
    {
      "id": "player-abc123",
      "firstName": "Michael",
      "lastName": "Jordan",
      ...
    },
    {
      "id": "player-def456",
      "firstName": "LeBron",
      "lastName": "James",
      ...
    }
  ]
}
```

---

### Obtenir les joueurs d'une équipe

```
GET /api/players/team/:teamId
```

**Paramètres URL**:

- `teamId` (string): ID de l'équipe

**Réponse (200)**:

```json
{
  "success": true,
  "players": [
    {
      "id": "player-abc123",
      "firstName": "Michael",
      "lastName": "Jordan",
      "teamId": "team-123",
      ...
    }
  ]
}
```

---

### Mettre à jour un joueur

```
PUT /api/players/:id
```

**Paramètres URL**:

- `id` (string): ID du joueur

**Body** (tous les champs optionnels):

```json
{
  "firstName": "Michael",
  "lastName": "Jordan",
  "nickname": "Air Jordan",
  "position": "Guard",
  "height": 198,
  "weight": 98,
  "age": 24,
  "gender": "M",
  "grade": "Senior"
}
```

**Réponse (200)**:

```json
{
  "success": true,
  "player": {
    "id": "player-abc123",
    "firstName": "Michael",
    "lastName": "Jordan",
    "nickname": "Air Jordan",
    ...
  }
}
```

---

### Supprimer un joueur

```
DELETE /api/players/:id
```

**Paramètres URL**:

- `id` (string): ID du joueur

**Réponse (200)**:

```json
{
  "success": true,
  "message": "Player deleted successfully"
}
```

---

## Teams (Équipes)

**🔒 Routes protégées** - Nécessite un token JWT

### Créer une équipe

```
POST /api/teams
```

**Body (required)**:

```json
{
  "name": "Chicago Bulls",
  "coach": "Phil Jackson",
  "season": "2024-2025",
  "league": "NBA"
}
```

**Champs requis**: `name`

**Note**: Le champ `userId` est automatiquement ajouté à partir du token JWT. Il ne doit pas être fourni dans le body.

**Réponse (201)**:

```json
{
  "success": true,
  "team": {
    "id": "team-abc123",
    "name": "Chicago Bulls",
    "coach": "Phil Jackson",
    "season": "2024-2025",
    "league": "NBA",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Obtenir une équipe par ID

```
GET /api/teams/:id
```

**Paramètres URL**:

- `id` (string): ID de l'équipe

**Réponse (200)**:

```json
{
  "success": true,
  "team": {
    "id": "team-abc123",
    "name": "Chicago Bulls",
    "coach": "Phil Jackson",
    ...
  }
}
```

---

### Obtenir toutes les équipes

```
GET /api/teams
```

**Réponse (200)**:

```json
{
  "success": true,
  "teams": [
    {
      "id": "team-abc123",
      "name": "Chicago Bulls",
      ...
    },
    {
      "id": "team-def456",
      "name": "LA Lakers",
      ...
    }
  ]
}
```

---

### Mettre à jour une équipe

```
PUT /api/teams/:id
```

**Paramètres URL**:

- `id` (string): ID de l'équipe

**Body** (tous les champs optionnels):

```json
{
  "name": "Chicago Bulls",
  "coach": "New Coach",
  "season": "2025-2026",
  "league": "NBA"
}
```

**Réponse (200)**:

```json
{
  "success": true,
  "team": {
    "id": "team-abc123",
    "name": "Chicago Bulls",
    "coach": "New Coach",
    ...
  }
}
```

---

### Supprimer une équipe

```
DELETE /api/teams/:id
```

**Paramètres URL**:

- `id` (string): ID de l'équipe

**Réponse (200)**:

```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

---

## Games (Matchs)

**🔒 Routes protégées** - Nécessite un token JWT

### Créer un match

```
POST /api/games
```

**Body (required)**:

```json
{
  "teamId": "team-123",
  "opponent": "Los Angeles Lakers",
  "gameDate": "2024-12-25T19:00:00Z",
  "location": "United Center",
  "notes": "Match important pour les playoffs"
}
```

**Champs requis**: `teamId`, `opponent`

**Note**: Le champ `userId` est automatiquement ajouté à partir du token JWT. Il ne doit pas être fourni dans le body.

**Réponse (201)**:

```json
{
  "success": true,
  "game": {
    "id": "game-abc123",
    "teamId": "team-123",
    "opponent": "Los Angeles Lakers",
    "gameDate": "2024-12-25T19:00:00Z",
    "location": "United Center",
    "notes": "Match important pour les playoffs",
    "status": "not_started",
    "startedAt": null,
    "completedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Statuts possibles**: `not_started`, `in_progress`, `completed`

---

### Obtenir un match par ID

```
GET /api/games/:id
```

**Paramètres URL**:

- `id` (string): ID du match

**Réponse (200)**:

```json
{
  "success": true,
  "game": {
    "id": "game-abc123",
    "teamId": "team-123",
    "opponent": "Los Angeles Lakers",
    "status": "in_progress",
    ...
  }
}
```

---

### Obtenir les matchs d'une équipe

```
GET /api/games/team/:teamId
```

**Paramètres URL**:

- `teamId` (string): ID de l'équipe

**Réponse (200)**:

```json
{
  "success": true,
  "games": [
    {
      "id": "game-abc123",
      "teamId": "team-123",
      "opponent": "Lakers",
      ...
    }
  ]
}
```

---

### Obtenir les matchs par statut

```
GET /api/games/status/:status
```

**Paramètres URL**:

- `status` (string): Statut du match (`not_started`, `in_progress`, `completed`)

**Réponse (200)**:

```json
{
  "success": true,
  "games": [
    {
      "id": "game-abc123",
      "status": "in_progress",
      ...
    }
  ]
}
```

---

### Mettre à jour un match

```
PUT /api/games/:id
```

**Paramètres URL**:

- `id` (string): ID du match

**Body** (tous les champs optionnels):

```json
{
  "opponent": "Golden State Warriors",
  "gameDate": "2024-12-26T20:00:00Z",
  "location": "Oracle Arena",
  "notes": "Match de revanche"
}
```

**Réponse (200)**:

```json
{
  "success": true,
  "game": {
    "id": "game-abc123",
    "opponent": "Golden State Warriors",
    ...
  }
}
```

---

### Supprimer un match

```
DELETE /api/games/:id
```

**Paramètres URL**:

- `id` (string): ID du match

**Réponse (200)**:

```json
{
  "success": true,
  "message": "Game deleted successfully"
}
```

---

### Démarrer un match

```
POST /api/games/:id/start
```

**Paramètres URL**:

- `id` (string): ID du match

**Description**: Change le statut du match à `in_progress` et enregistre l'heure de début.

**Réponse (200)**:

```json
{
  "success": true,
  "game": {
    "id": "game-abc123",
    "status": "in_progress",
    "startedAt": "2024-01-15T19:00:00.000Z",
    ...
  }
}
```

**Erreur (400)**:

```json
{
  "success": false,
  "error": "Game already started"
}
```

---

### Terminer un match

```
POST /api/games/:id/complete
```

**Paramètres URL**:

- `id` (string): ID du match

**Description**: Change le statut du match à `completed` et enregistre l'heure de fin. Le match doit être en cours (`in_progress`).

**Réponse (200)**:

```json
{
  "success": true,
  "game": {
    "id": "game-abc123",
    "status": "completed",
    "startedAt": "2024-01-15T19:00:00.000Z",
    "completedAt": "2024-01-15T21:30:00.000Z",
    ...
  }
}
```

**Erreur (400)**:

```json
{
  "success": false,
  "error": "Game not in progress"
}
```

---

## Stats (Statistiques)

**🔒 Routes protégées** - Nécessite un token JWT

### Enregistrer une action de jeu

```
POST /api/stats/games/:gameId/actions
```

**Paramètres URL**:

- `gameId` (string): ID du match

**Body (required)**:

```json
{
  "playerId": "player-123",
  "actionType": "twoPoint",
  "made": true
}
```

**Champs requis**: `playerId`, `actionType`

**Types d'actions possibles**:

- `freeThrow` - Lancer franc (nécessite `made: true/false`)
- `twoPoint` - Panier à 2 points (nécessite `made: true/false`)
- `threePoint` - Panier à 3 points (nécessite `made: true/false`)
- `offensiveRebound` - Rebond offensif
- `defensiveRebound` - Rebond défensif
- `assist` - Passe décisive
- `steal` - Interception
- `block` - Contre
- `turnover` - Perte de balle
- `foul` - Faute personnelle

**Réponse (201)**:

```json
{
  "success": true,
  "gameStats": {
    "gameId": "game-abc123",
    "playerId": "player-123",
    "freeThrowsMade": 0,
    "freeThrowsAttempted": 0,
    "twoPointsMade": 1,
    "twoPointsAttempted": 1,
    "threePointsMade": 0,
    "threePointsAttempted": 0,
    "offensiveRebounds": 0,
    "defensiveRebounds": 0,
    "assists": 0,
    "steals": 0,
    "blocks": 0,
    "turnovers": 0,
    "personalFouls": 0
  }
}
```

**Erreur (400)**:

```json
{
  "success": false,
  "error": "Game not in progress"
}
```

---

### Annuler la dernière action d'un joueur

```
DELETE /api/stats/games/:gameId/actions/:playerId
```

**Paramètres URL**:

- `gameId` (string): ID du match
- `playerId` (string): ID du joueur

**Description**: Annule la dernière action enregistrée pour le joueur dans le match.

**Réponse (200)**:

```json
{
  "success": true,
  "gameStats": {
    "gameId": "game-abc123",
    "playerId": "player-123",
    "twoPointsMade": 0,
    "twoPointsAttempted": 0,
    ...
  }
}
```

**Erreur (400)**:

```json
{
  "success": false,
  "error": "No actions to undo"
}
```

---

### Obtenir les statistiques d'un joueur pour un match

```
GET /api/stats/games/:gameId/players/:playerId
```

**Paramètres URL**:

- `gameId` (string): ID du match
- `playerId` (string): ID du joueur

**Réponse (200)**:

```json
{
  "success": true,
  "gameStats": {
    "gameId": "game-abc123",
    "playerId": "player-123",
    "freeThrowsMade": 8,
    "freeThrowsAttempted": 10,
    "twoPointsMade": 12,
    "twoPointsAttempted": 20,
    "threePointsMade": 3,
    "threePointsAttempted": 8,
    "offensiveRebounds": 2,
    "defensiveRebounds": 8,
    "assists": 5,
    "steals": 3,
    "blocks": 1,
    "turnovers": 2,
    "personalFouls": 3
  }
}
```

**Calculs disponibles**:

- **Points totaux**: `(freeThrowsMade * 1) + (twoPointsMade * 2) + (threePointsMade * 3)`
- **Rebonds totaux**: `offensiveRebounds + defensiveRebounds`
- **FG%**: `(twoPointsMade + threePointsMade) / (twoPointsAttempted + threePointsAttempted) * 100`
- **FT%**: `freeThrowsMade / freeThrowsAttempted * 100`
- **3P%**: `threePointsMade / threePointsAttempted * 100`

---

### Obtenir les statistiques de carrière d'un joueur

```
GET /api/stats/players/:playerId/career
```

**Paramètres URL**:

- `playerId` (string): ID du joueur

**Description**: Récupère les statistiques agrégées de tous les matchs du joueur.

**Réponse (200)**:

```json
{
  "success": true,
  "stats": {
    "playerId": "player-123",
    "gamesPlayed": 15,
    "totalPoints": 345,
    "totalRebounds": 120,
    "totalAssists": 75,
    "averagePoints": 23.0,
    "averageRebounds": 8.0,
    "averageAssists": 5.0,
    "fieldGoalPercentage": 48.5,
    "freeThrowPercentage": 85.2,
    "threePointPercentage": 38.7
  }
}
```

---

## Exemples de workflows

### Workflow complet d'un match

```bash
# 1. S'inscrire ou se connecter
POST /api/auth/register
{ "email": "coach@example.com", "password": "password123", "name": "Coach Smith" }
# Retourne: { "token": "eyJhbGciOi..." }

# 2. Créer une équipe (avec le token)
POST /api/teams
Header: Authorization: Bearer eyJhbGciOi...
{ "name": "Bulls", "coach": "Coach Smith" }

# 3. Créer des joueurs
POST /api/players
Header: Authorization: Bearer eyJhbGciOi...
{ "firstName": "Michael", "lastName": "Jordan", "teamId": "team-123" }

# 4. Créer un match
POST /api/games
Header: Authorization: Bearer eyJhbGciOi...
{ "teamId": "team-123", "opponent": "Lakers" }

# 5. Démarrer le match
POST /api/games/game-abc123/start
Header: Authorization: Bearer eyJhbGciOi...

# 6. Enregistrer des actions
POST /api/stats/games/game-abc123/actions
Header: Authorization: Bearer eyJhbGciOi...
{ "playerId": "player-123", "actionType": "twoPoint", "made": true }

POST /api/stats/games/game-abc123/actions
Header: Authorization: Bearer eyJhbGciOi...
{ "playerId": "player-123", "actionType": "threePoint", "made": true }

# 7. Voir les stats du joueur
GET /api/stats/games/game-abc123/players/player-123
Header: Authorization: Bearer eyJhbGciOi...

# 8. Terminer le match
POST /api/games/game-abc123/complete
Header: Authorization: Bearer eyJhbGciOi...

# 9. Voir les stats de carrière
GET /api/stats/players/player-123/career
Header: Authorization: Bearer eyJhbGciOi...
```

---

## Notes importantes

1. **Authentification**: Tous les endpoints nécessitent un token JWT valide sauf `/health` et `/api/auth/*`.

2. **Isolation des données par utilisateur**:
   - Chaque utilisateur authentifié ne peut accéder qu'à ses propres données
   - Le `userId` est automatiquement extrait du token JWT
   - Impossible d'accéder aux données d'un autre utilisateur
   - Toutes les opérations (lecture, création, modification, suppression) sont filtrées par `userId`

3. **Validation**: Tous les champs requis doivent être fournis, sinon l'API retournera une erreur 400 avec les champs manquants.

4. **ID auto-générés**: Tous les ID sont générés automatiquement par le système.

5. **Timestamps**: Les champs `createdAt` et `updatedAt` sont gérés automatiquement.

6. **Actions de match**: Les actions ne peuvent être enregistrées que lorsque le match est en cours (`status: "in_progress"`).

7. **Undo**: La fonction d'annulation ne supprime que la dernière action pour le joueur spécifié.

8. **Stats de carrière**: Les statistiques de carrière sont calculées en temps réel à partir de tous les matchs du joueur.

9. **Sécurité des mots de passe**: Les mots de passe ne sont jamais retournés dans les réponses API et sont hashés avant stockage.

10. **Suppression en cascade**: La suppression d'un utilisateur supprime automatiquement toutes ses données associées (équipes, joueurs, matchs, statistiques).

---

## Support et contact

Pour plus d'informations, consultez:

- **Documentation Swagger interactive**: http://localhost:3000/api-docs
- **Architecture**: Voir [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/Gregson971/basketball-stats-coach/issues)
