# 🚀 Guide de Déploiement

Documentation complète pour déployer StatCoach Pro Backend sur Railway.

---

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Configuration Railway](#configuration-railway)
- [Variables d'environnement](#variables-denvironnement)
- [Processus de déploiement](#processus-de-déploiement)
- [Vérification](#vérification)
- [Dépannage](#dépannage)
- [Rollback](#rollback)

---

## Prérequis

### Compte Railway

1. Créer un compte sur [Railway](https://railway.app)
2. Connecter votre compte GitHub
3. Avoir accès au repository `basketball-stats-coach`

### Configuration locale

- Node.js 18+ ou 20+
- Git configuré
- Tests qui passent localement (`npm test`)

---

## Configuration Railway

### 1. Créer un nouveau projet

```bash
# Via Railway CLI (optionnel)
npm install -g @railway/cli
railway login
railway init
```

Ou via l'interface web :
1. Railway Dashboard → **New Project**
2. **Deploy from GitHub repo**
3. Sélectionner `basketball-stats-coach`

### 2. Configuration du service

#### Service Settings

- **Root Directory** : `backend`
- **Builder** : Dockerfile
- **Watch Paths** : `backend/**`

#### Build Configuration

Railway utilise automatiquement le `Dockerfile` présent dans `/backend`:

```dockerfile
# Multi-stage build
# Stage 1: Builder - Compile TypeScript
# Stage 2: Production - Run compiled JS
```

Commandes exécutées :
```bash
# Build
npm ci          # Install dependencies
npm run build   # Compile TypeScript

# Start
npm start       # Run dist/src/index.js
```

### 3. Base de données MongoDB

#### Ajouter MongoDB

1. Dans votre projet Railway : **New** → **Database** → **Add MongoDB**
2. Railway génère automatiquement la variable `MONGO_URL`

#### Configuration automatique

Railway crée et configure automatiquement :
- `MONGO_URL` : URL de connexion complète
- Port interne MongoDB
- Credentials sécurisés

---

## Variables d'environnement

### Variables requises

Configurer dans **Railway → Variables** :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `MONGODB_URI` | `${{MONGO_URL}}` | URL MongoDB (auto-générée) |
| `PORT` | `3000` | Port de l'application |
| `NODE_ENV` | `production` | Environnement |

### Variables optionnelles

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret pour JWT (si authentification) |
| `LOG_LEVEL` | Niveau de logs (`info`, `debug`, `error`) |

### Configuration

```bash
# Via Railway CLI
railway variables set MONGODB_URI=${{MONGO_URL}}
railway variables set PORT=3000
railway variables set NODE_ENV=production

# Ou via l'interface web
# Railway Dashboard → Variables → + New Variable
```

---

## Processus de déploiement

### Déploiement automatique (Recommandé)

Railway est configuré pour déployer automatiquement à chaque push sur `main`.

#### Workflow

```
1. Développement local
   ├─ Créer une branche feature
   ├─ Développer et tester
   └─ Commit et push

2. Pull Request
   ├─ Créer PR vers main
   ├─ GitHub Actions exécute les tests
   └─ Review et approbation

3. Merge sur main
   ├─ GitHub Actions: CI (tests + build)
   └─ Railway: Détection automatique

4. Déploiement Railway
   ├─ Pull du code depuis GitHub
   ├─ Build Docker (multi-stage)
   │   ├─ Stage builder: npm run build
   │   └─ Stage production: npm start
   ├─ Healthcheck (/health)
   └─ Mise en production
```

### Déploiement manuel

Via l'interface Railway :

1. **Deployments** → **Deploy**
2. Sélectionner la branche
3. Cliquer sur **Deploy**

Via Railway CLI :

```bash
railway up
```

---

## Vérification

### 1. Vérifier le build

Logs à surveiller :

```
=========================
Using Detected Dockerfile
=========================

builder: RUN npm run build
> tsc
✓ TypeScript compilation complete

production: COPY --from=builder /app/dist ./dist
✓ Dist folder copied

Starting Container
✓ Server started on port 3000
```

### 2. Vérifier le déploiement

#### Healthcheck

```bash
curl https://basketball-stats-coach-production.up.railway.app/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2024-11-28T..."
}
```

#### API Documentation

Ouvrir : https://basketball-stats-coach-production.up.railway.app/api-docs

Vérifier que toutes les routes sont visibles :
- ✅ Players (6 endpoints)
- ✅ Teams (5 endpoints)
- ✅ Games (8 endpoints)
- ✅ Stats (4 endpoints)
- ✅ Health (1 endpoint)

#### Test d'une route

```bash
curl https://basketball-stats-coach-production.up.railway.app/api/players
```

### 3. Vérifier les logs

Railway Dashboard → **Deployments** → Dernier déploiement → **View Logs**

Rechercher :
```
✓ MongoDB connected
✓ Server listening on port 3000
✓ Swagger UI available at /api-docs
```

---

## Dépannage

### Erreur : "Cannot find module '/app/dist/index.js'"

**Cause** : TypeScript non compilé ou mauvais chemin

**Solution** :
1. Vérifier `package.json` :
   ```json
   "start": "node dist/src/index.js"
   ```
2. Vérifier le `CMD` du Dockerfile :
   ```dockerfile
   CMD ["node", "dist/src/index.js"]
   ```

### Erreur : Swagger UI vide (pas de routes)

**Cause** : swagger-jsdoc ne trouve pas les fichiers `.js` compilés

**Solution** : Vérifier `swagger.ts` :
```typescript
apis: [
  './src/presentation/routes/*.ts',      // Dev
  './dist/src/presentation/routes/*.js'  // Production
]
```

### Erreur : MongoDB connection failed

**Causes possibles** :
1. Variable `MONGODB_URI` non définie
2. MongoDB service non démarré
3. Mauvais credentials

**Solutions** :
```bash
# Vérifier les variables
railway variables

# Vérifier MongoDB
railway logs --service mongodb

# Redémarrer MongoDB
railway restart --service mongodb
```

### Build lent ou timeout

**Cause** : Cache Docker invalide

**Solutions** :
1. Invalider le cache manuellement :
   - Railway Dashboard → Settings → **Clear Build Cache**

2. Forcer un rebuild :
   ```bash
   railway up --force
   ```

### Healthcheck failed

**Causes** :
1. Application ne démarre pas
2. Route `/health` non accessible
3. Port incorrect

**Vérifications** :
```bash
# Consulter les logs de démarrage
railway logs

# Vérifier le port
railway variables | grep PORT

# Tester localement
docker build -t test .
docker run -p 3000:3000 test
curl localhost:3000/api/health
```

---

## Rollback

### Via Railway UI

1. **Deployments** → Sélectionner un déploiement précédent
2. **⋮** (3 points) → **Redeploy**

### Via Git

1. Identifier le commit à restaurer :
   ```bash
   git log --oneline
   ```

2. Revenir au commit :
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. Railway déploie automatiquement le revert

### Rollback d'urgence

Pour un rollback rapide sans Git :

```bash
# Via Railway CLI
railway rollback <deployment-id>
```

---

## URLs de production

### API

- **Base URL** : https://basketball-stats-coach-production.up.railway.app
- **API Docs** : https://basketball-stats-coach-production.up.railway.app/api-docs
- **Health** : https://basketball-stats-coach-production.up.railway.app/api/health

### Endpoints principaux

```
POST   /api/players           # Créer un joueur
GET    /api/players           # Liste des joueurs
GET    /api/players/:id       # Obtenir un joueur
PUT    /api/players/:id       # Mettre à jour
DELETE /api/players/:id       # Supprimer

POST   /api/teams             # Créer une équipe
GET    /api/teams             # Liste des équipes
GET    /api/teams/:id         # Obtenir une équipe
PUT    /api/teams/:id         # Mettre à jour
DELETE /api/teams/:id         # Supprimer

POST   /api/games             # Créer un match
GET    /api/games             # Liste des matchs
GET    /api/games/:id         # Obtenir un match
PUT    /api/games/:id         # Mettre à jour
DELETE /api/games/:id         # Supprimer
POST   /api/games/:id/start   # Démarrer un match
POST   /api/games/:id/complete # Terminer un match

POST   /api/stats/record      # Enregistrer une action
POST   /api/stats/undo        # Annuler la dernière action
GET    /api/stats/game/:gameId/player/:playerId  # Stats du match
GET    /api/stats/career/:playerId                # Stats carrière
```

---

## Monitoring

### Métriques Railway

Railway Dashboard → **Metrics** :
- CPU usage
- Memory usage
- Network traffic
- Response times

### Logs en temps réel

```bash
railway logs --follow
```

### Alertes (optionnel)

Configurer des alertes pour :
- Déploiement failed
- Healthcheck failed
- High error rate
- Memory/CPU limits

---

## Sécurité

### Bonnes pratiques

- ✅ Ne jamais commit les secrets
- ✅ Utiliser les variables d'environnement Railway
- ✅ Activer HTTPS (automatique sur Railway)
- ✅ Limiter les CORS aux domaines autorisés
- ✅ Valider toutes les entrées utilisateur

### Secrets

Tous les secrets sont gérés via Railway Variables :
- Chiffrés at rest
- Accessibles uniquement au runtime
- Non exposés dans les logs

---

## Support

### Documentation

- [Railway Docs](https://docs.railway.app/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Production Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

### Aide

- Railway Discord
- GitHub Issues du projet
- Railway Support (plan payant)

---

**Dernière mise à jour** : 2024-11-28
