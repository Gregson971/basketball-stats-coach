# 🚀 StatCoach Pro - Guide de Démarrage Rapide

## Prérequis

- ✅ Node.js 20+
- ✅ Docker & Docker Compose
- ✅ npm ou yarn

## Installation en 3 minutes ⏱️

### 1. Cloner et installer

```bash
cd backend
npm install
```

### 2. Démarrer MongoDB avec Docker

```bash
# Démarrer MongoDB
npm run docker:up

# Vérifier que MongoDB est actif
docker ps | grep statcoach
```

### 3. Configurer l'environnement

```bash
# Le fichier .env est déjà configuré pour Docker
# Aucune modification nécessaire !
```

### 4. Lancer les tests

```bash
npm test
```

✅ **115 tests devraient passer !**

## Commandes utiles

### MongoDB (Docker)

```bash
# Démarrer MongoDB
npm run docker:up

# Voir les logs
npm run docker:logs

# Arrêter MongoDB
npm run docker:down

# Nettoyer (⚠️ supprime les données)
npm run docker:clean

# Accéder au shell MongoDB
docker exec -it statcoach-mongodb mongosh -u statcoach -p statcoach_secret --authenticationDatabase admin
```

### Tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Développement (quand l'API sera prête)

```bash
# Mode développement avec hot reload
npm run dev

# Build production
npm run build

# Lancer en production
npm start
```

## Structure actuelle

```
✅ Domain Layer (Entités + Repositories)
✅ Application Layer (Use Cases)
✅ Infrastructure Layer (MongoDB implémentation)
✅ Tests (115 tests : 89 unitaires + 26 intégration)
✅ Configuration Docker
⏳ Presentation Layer (API REST) - À venir
⏳ Système de synchronisation hors-ligne - À venir
```

## Troubleshooting

### MongoDB ne démarre pas

```bash
# Nettoyer et redémarrer
npm run docker:clean
npm run docker:up

# Vérifier les logs
npm run docker:logs
```

### Les tests échouent

```bash
# Vérifier que MongoDB tourne
docker ps | grep statcoach

# Relancer les tests
npm test
```

### Port 27017 déjà utilisé

```bash
# Trouver le processus
lsof -i :27017

# Ou changer le port dans docker-compose.yml
ports:
  - "27018:27017"  # Utilise 27018 au lieu de 27017
```

## Prochaines étapes

1. ✅ Backend avec Clean Architecture
2. ✅ MongoDB avec Docker
3. ⏳ API REST (Express + contrôleurs)
4. ⏳ Système de synchronisation offline
5. ⏳ Frontend React Native
