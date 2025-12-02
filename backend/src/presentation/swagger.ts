import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StatCoach Pro API',
      version: '1.0.0',
      description: 'API REST pour le suivi statistique de basketball en temps réel',
      contact: {
        name: 'StatCoach Pro Support',
        email: 'support@statcoach.pro',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
      {
        url: 'https://basketball-stats-coach-production.up.railway.app',
        description: 'Serveur de production',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentification et gestion des utilisateurs',
      },
      {
        name: 'Players',
        description: 'Gestion des joueurs (🔒 Requiert authentification)',
      },
      {
        name: 'Teams',
        description: 'Gestion des équipes (🔒 Requiert authentification)',
      },
      {
        name: 'Games',
        description: 'Gestion des matchs (🔒 Requiert authentification)',
      },
      {
        name: 'Stats',
        description: 'Gestion des statistiques (🔒 Requiert authentification)',
      },
      {
        name: 'Health',
        description: "Santé de l'API",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via /api/auth/login ou /api/auth/register',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            id: {
              type: 'string',
              description: 'Identifiant unique de l\'utilisateur',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email (unique, case-insensitive)',
            },
            name: {
              type: 'string',
              description: 'Nom complet de l\'utilisateur',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Player: {
          type: 'object',
          required: ['firstName', 'lastName', 'teamId'],
          properties: {
            id: {
              type: 'string',
              description: 'Identifiant unique du joueur',
            },
            userId: {
              type: 'string',
              description: 'Identifiant de l\'utilisateur propriétaire (automatiquement ajouté)',
            },
            firstName: {
              type: 'string',
              description: 'Prénom du joueur',
            },
            lastName: {
              type: 'string',
              description: 'Nom du joueur',
            },
            teamId: {
              type: 'string',
              description: "Identifiant de l'équipe",
            },
            nickname: {
              type: 'string',
              description: 'Surnom du joueur',
            },
            position: {
              type: 'string',
              enum: ['Guard', 'Forward', 'Center'],
              description: 'Position du joueur',
            },
            height: {
              type: 'number',
              description: 'Taille en cm',
            },
            weight: {
              type: 'number',
              description: 'Poids en kg',
            },
            age: {
              type: 'number',
              description: 'Âge du joueur',
            },
            gender: {
              type: 'string',
              enum: ['M', 'F'],
              description: 'Genre du joueur',
            },
            grade: {
              type: 'string',
              description: 'Niveau scolaire',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Team: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              description: "Identifiant unique de l'équipe",
            },
            userId: {
              type: 'string',
              description: 'Identifiant de l\'utilisateur propriétaire (automatiquement ajouté)',
            },
            name: {
              type: 'string',
              description: "Nom de l'équipe",
            },
            coach: {
              type: 'string',
              description: "Nom de l'entraîneur",
            },
            season: {
              type: 'string',
              description: 'Saison (ex: 2024-2025)',
            },
            league: {
              type: 'string',
              description: 'Ligue ou championnat',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Game: {
          type: 'object',
          required: ['teamId', 'opponent'],
          properties: {
            id: {
              type: 'string',
              description: 'Identifiant unique du match',
            },
            userId: {
              type: 'string',
              description: 'Identifiant de l\'utilisateur propriétaire (automatiquement ajouté)',
            },
            teamId: {
              type: 'string',
              description: "Identifiant de l'équipe",
            },
            opponent: {
              type: 'string',
              description: "Nom de l'adversaire",
            },
            gameDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date du match',
            },
            location: {
              type: 'string',
              description: 'Lieu du match',
            },
            notes: {
              type: 'string',
              description: 'Notes sur le match',
            },
            status: {
              type: 'string',
              enum: ['not_started', 'in_progress', 'completed'],
              description: 'Statut du match',
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de début du match',
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de fin du match',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        GameStats: {
          type: 'object',
          properties: {
            gameId: {
              type: 'string',
              description: 'Identifiant du match',
            },
            playerId: {
              type: 'string',
              description: 'Identifiant du joueur',
            },
            userId: {
              type: 'string',
              description: 'Identifiant de l\'utilisateur propriétaire (automatiquement ajouté)',
            },
            freeThrowsMade: {
              type: 'number',
              description: 'Lancers francs réussis',
            },
            freeThrowsAttempted: {
              type: 'number',
              description: 'Lancers francs tentés',
            },
            twoPointsMade: {
              type: 'number',
              description: 'Paniers à 2 points réussis',
            },
            twoPointsAttempted: {
              type: 'number',
              description: 'Tirs à 2 points tentés',
            },
            threePointsMade: {
              type: 'number',
              description: 'Paniers à 3 points réussis',
            },
            threePointsAttempted: {
              type: 'number',
              description: 'Tirs à 3 points tentés',
            },
            offensiveRebounds: {
              type: 'number',
              description: 'Rebonds offensifs',
            },
            defensiveRebounds: {
              type: 'number',
              description: 'Rebonds défensifs',
            },
            assists: {
              type: 'number',
              description: 'Passes décisives',
            },
            steals: {
              type: 'number',
              description: 'Interceptions',
            },
            blocks: {
              type: 'number',
              description: 'Contres',
            },
            turnovers: {
              type: 'number',
              description: 'Pertes de balle',
            },
            personalFouls: {
              type: 'number',
              description: 'Fautes personnelles',
            },
          },
        },
        CareerStats: {
          type: 'object',
          properties: {
            playerId: {
              type: 'string',
            },
            gamesPlayed: {
              type: 'number',
            },
            totalPoints: {
              type: 'number',
            },
            totalRebounds: {
              type: 'number',
            },
            totalAssists: {
              type: 'number',
            },
            averagePoints: {
              type: 'number',
            },
            averageRebounds: {
              type: 'number',
            },
            averageAssists: {
              type: 'number',
            },
            fieldGoalPercentage: {
              type: 'number',
            },
            freeThrowPercentage: {
              type: 'number',
            },
            threePointPercentage: {
              type: 'number',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: "Message d'erreur",
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: [
    './src/presentation/routes/*.ts',
    './src/presentation/app.ts',
    './dist/src/presentation/routes/*.js',
    './dist/src/presentation/app.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
