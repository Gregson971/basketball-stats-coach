# GitHub Actions CI/CD

Configuration complète de CI/CD pour StatCoach Pro Backend avec GitHub Actions.

## 📋 Table des matières

- [Workflows disponibles](#workflows-disponibles)
- [Configuration requise](#configuration-requise)
- [Badges de statut](#badges-de-statut)
- [Utilisation](#utilisation)
- [Secrets requis](#secrets-requis)

---

## 🔄 Workflows disponibles

### 1. Backend CI (`backend-ci.yml`)

**Déclenché sur:**

- Push sur `main` ou `develop` (dossier `backend/`)
- Pull request vers `main` ou `develop` (dossier `backend/`)

**Jobs:**

- ✅ **Lint** : Vérification du code avec ESLint
- ✅ **Test** : Exécution de tous les tests (Node 18 & 20)
  - Tests unitaires
  - Tests d'intégration
  - Tests API
- ✅ **Coverage** : Génération du rapport de couverture
  - Upload vers Codecov
- ✅ **Build** : Compilation TypeScript
  - Upload des artifacts de build
- 🐳 **Docker** : Construction des images Docker (production + dev)
  - Uniquement sur `main`

### 2. Backend CD (`backend-cd.yml`)

**Déclenché sur:**

- Push sur `main` (dossier `backend/`)
- Déclenchement manuel (`workflow_dispatch`)

**Jobs:**

- 🚀 **Deploy Staging** : Déploiement sur l'environnement de staging
  - Uniquement sur `develop`
- 🚀 **Deploy Production** : Déploiement en production
  - Uniquement sur `main`
  - Nécessite l'approbation manuelle

**Plateformes supportées** (à configurer) :

- Railway
- Render
- Heroku
- AWS / DigitalOcean / etc.

### 3. Pull Request Checks (`pr-checks.yml`)

**Déclenché sur:**

- Ouverture, synchronisation ou réouverture d'une PR

**Jobs:**

- 🔍 **Quality Checks** : Vérifications de qualité du code
  - Compilation TypeScript
  - Linting ESLint
  - Formatting (Prettier)
- 🧪 **Tests** : Exécution des tests par catégorie
- 📊 **Coverage Report** : Rapport de couverture dans la PR
- 🏗️ **Build Check** : Vérification du build
- 🔒 **Dependency Review** : Revue des dépendances
- 🛡️ **Security Audit** : Audit de sécurité npm
- 📝 **PR Summary** : Résumé des vérifications

### 4. Release & Publish (`release.yml`)

**Déclenché sur:**

- Push de tags de version (`v*.*.*`)

**Jobs:**

- 📦 **Create Release** : Création de la release GitHub
  - Génération automatique du changelog
- 🐳 **Publish Docker** : Publication des images Docker
  - Docker Hub (multi-arch: amd64, arm64)
  - Tags: `latest`, `dev`, version spécifique
- 📦 **Publish npm** : Publication sur GitHub Packages (optionnel)

---

## ⚙️ Configuration requise

### Secrets GitHub

Aucun secret GitHub n'est requis pour le workflow CI actuel.

#### Pour Docker Hub (optionnel)

Si vous souhaitez activer la publication automatique des images Docker sur Docker Hub :

| Secret               | Description                  |
| -------------------- | ---------------------------- |
| `DOCKERHUB_USERNAME` | Nom d'utilisateur Docker Hub |
| `DOCKERHUB_TOKEN`    | Token d'accès Docker Hub     |

Décommentez ensuite la section Docker dans `backend-ci.yml`.

#### Pour Codecov (optionnel)

| Secret          | Description                                   |
| --------------- | --------------------------------------------- |
| `CODECOV_TOKEN` | Token Codecov pour les rapports de couverture |

### Variables d'environnement

Les workflows utilisent automatiquement :

- `GITHUB_TOKEN` : Fourni automatiquement par GitHub
- `GITHUB_REF` : Référence git (branche/tag)
- `GITHUB_SHA` : Hash du commit

---

## 📛 Badges de statut

Ajoutez ces badges à votre README principal :

```markdown
![Backend CI](https://github.com/Gregson971/basketball-stats-coach/workflows/Backend%20CI/badge.svg)
![Coverage](https://codecov.io/gh/Gregson971/basketball-stats-coach/branch/main/graph/badge.svg)
![Tests](https://img.shields.io/badge/tests-246%20passing-success)
![Docker](https://img.shields.io/docker/pulls/gregson97/statcoach-backend)
```

---

## 🚀 Utilisation

### Développement quotidien

1. **Créer une branche** :

   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

2. **Développer et tester localement** :

   ```bash
   npm test
   npm run lint
   npm run build
   ```

3. **Pusher et créer une PR** :

   ```bash
   git push origin feature/ma-fonctionnalite
   ```

   → Le workflow `backend-ci.yml` se déclenche automatiquement pour valider le code

4. **Merger la PR** :
   → Le workflow `backend-ci.yml` se déclenche sur `main` et Railway déploie automatiquement

### Vérifier le déploiement

1. **Suivre les workflows GitHub Actions** :
   - Actions → Backend CI → Voir les résultats des tests

2. **Vérifier le déploiement Railway** :
   - Connectez-vous à Railway
   - Surveillez les logs de déploiement
   - Testez l'API déployée

---

## 🔧 Configuration Railway

### Configuration initiale

1. **Créer un compte Railway** : https://railway.app
2. **Créer un nouveau projet** : New Project → Deploy from GitHub repo
3. **Connecter votre repository GitHub** : Sélectionner `basketball-stats-coach`
4. **Configurer le service** :
   - Root Directory : `backend`
   - Build Command : (Auto-détecté via `railway.json`)
   - Start Command : (Auto-détecté via `railway.json`)

### Configuration de MongoDB

1. **Ajouter une base de données MongoDB** :
   - Dans votre projet Railway : New → Database → Add MongoDB

2. **Configurer les variables d'environnement** :
   - Railway génère automatiquement `MONGO_URL`
   - Ajoutez les autres variables nécessaires :
     - `PORT` : 3000
     - `NODE_ENV` : production

### Auto-deploy

Railway détecte automatiquement les push sur votre branche principale et déclenche un nouveau déploiement :

1. Push sur `main` → GitHub Actions exécute les tests
2. Si les tests passent → Railway build et déploie automatiquement
3. Vous recevez une URL de production Railway (ex: `https://yourapp.up.railway.app`)

### Fichiers de configuration Railway

Trois fichiers configurent le déploiement Railway (déjà présents dans `backend/`) :

- **`railway.json`** : Configuration du build et du déploiement
- **`nixpacks.toml`** : Instructions de build TypeScript
- **`.railwayignore`** : Fichiers à exclure du déploiement

---

## 📊 Monitoring et logs

### Voir les workflows actifs

```bash
# Via GitHub CLI
gh run list --workflow=backend-ci.yml

# Voir les logs d'un workflow
gh run view <run-id> --log
```

### Statut des jobs

- ✅ **Success** : Toutes les vérifications passent
- ⚠️ **Warning** : Vérifications passent avec avertissements
- ❌ **Failed** : Au moins une vérification a échoué
- ⏸️ **Cancelled** : Workflow annulé manuellement

---

## 🔒 Sécurité

### Protection des branches

Recommandations pour `main` :

- ✅ Require pull request reviews
- ✅ Require status checks to pass (tous les workflows CI)
- ✅ Require branches to be up to date
- ✅ Include administrators

### Gestion des environnements

Les environnements sont gérés directement dans Railway :

- Créez des projets Railway séparés pour staging et production
- Configurez Railway pour déployer depuis différentes branches (`develop` pour staging, `main` pour production)

---

## 🆘 Dépannage

### Les tests échouent sur CI mais pas localement

```bash
# Vérifier les versions Node.js
node --version  # Doit être 18 ou 20

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm test
```

### Le build Docker échoue

```bash
# Tester le build localement
cd backend
docker build -t test-build .

# Vérifier les logs
docker build --no-cache -t test-build .
```

### Le déploiement Railway échoue

```bash
# Vérifier les logs Railway
# 1. Connectez-vous à Railway
# 2. Ouvrez votre projet
# 3. Consultez l'onglet "Deployments"
# 4. Cliquez sur le déploiement échoué pour voir les logs

# Erreur commune : "Cannot find module '/app/dist/index.js'"
# Solution : Vérifiez que railway.json et nixpacks.toml sont présents
```

### Variables d'environnement manquantes

Vérifier dans Railway → Variables que toutes les variables sont configurées :
- `MONGODB_URI` ou `MONGO_URL`
- `PORT`
- `NODE_ENV`

---

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflows syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Railway Documentation](https://docs.railway.app/)
- [Nixpacks Documentation](https://nixpacks.com/docs)
- [Docker Actions](https://github.com/docker/build-push-action)

---

## 🤝 Contribution

Pour ajouter ou modifier des workflows :

1. Tester localement avec [act](https://github.com/nektos/act)
2. Créer une PR avec les modifications
3. Vérifier que les workflows existants passent
4. Documenter les changements dans ce README
