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

Pour activer tous les workflows, configurez ces secrets dans **Settings → Secrets and variables → Actions** :

#### Pour le déploiement (CD)

| Secret | Description | Requis pour |
|--------|-------------|-------------|
| `RAILWAY_TOKEN` | Token d'API Railway | Déploiement Railway |
| `RENDER_TOKEN` | Token d'API Render | Déploiement Render |
| `RENDER_STAGING_SERVICE_ID` | ID du service Render (staging) | Déploiement Render |
| `RENDER_PRODUCTION_SERVICE_ID` | ID du service Render (production) | Déploiement Render |
| `HEROKU_API_KEY` | Clé API Heroku | Déploiement Heroku |
| `HEROKU_EMAIL` | Email Heroku | Déploiement Heroku |

#### Pour Docker Hub

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Nom d'utilisateur Docker Hub |
| `DOCKERHUB_TOKEN` | Token d'accès Docker Hub |

#### Pour Codecov (optionnel)

| Secret | Description |
|--------|-------------|
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
![Docker](https://img.shields.io/docker/pulls/username/statcoach-backend)
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
   → Les workflows `pr-checks.yml` se déclenchent automatiquement

4. **Merger la PR** :
   → Le workflow `backend-ci.yml` se déclenche sur `main`

### Créer une release

1. **Créer et pusher un tag de version** :
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Le workflow `release.yml` se déclenche** :
   - Crée une release GitHub
   - Publie les images Docker
   - Génère le changelog automatiquement

### Déploiement manuel

1. **Via l'interface GitHub** :
   - Actions → Backend CD → Run workflow
   - Choisir la branche
   - Cliquer sur "Run workflow"

2. **Vérifier le déploiement** :
   - Suivre les logs dans Actions
   - Vérifier l'environnement déployé

---

## 🔧 Configuration des plateformes de déploiement

### Railway

1. Créer un projet Railway
2. Installer Railway CLI : `npm install -g @railway/cli`
3. Obtenir un token : `railway login`
4. Ajouter `RAILWAY_TOKEN` aux secrets GitHub
5. Décommenter la section Railway dans `backend-cd.yml`

### Render

1. Créer un service Web sur Render
2. Obtenir le token API : Settings → API Keys
3. Obtenir l'ID du service : URL du service
4. Ajouter les secrets à GitHub
5. Décommenter la section Render dans `backend-cd.yml`

### Heroku

1. Créer une app Heroku
2. Obtenir la clé API : Account Settings → API Key
3. Ajouter les secrets à GitHub
4. Décommenter la section Heroku dans `backend-cd.yml`

### Docker Hub

1. Créer un compte Docker Hub
2. Créer un Access Token : Account Settings → Security
3. Ajouter `DOCKERHUB_USERNAME` et `DOCKERHUB_TOKEN` aux secrets
4. Les images seront publiées automatiquement sur les releases

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

### Environments

Deux environnements configurés :
- **staging** : Déploiement automatique depuis `develop`
- **production** : Déploiement sur `main` avec approbation manuelle

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

### Secrets non configurés

Vérifier dans **Settings → Secrets and variables → Actions** que tous les secrets requis sont présents.

---

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflows syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Dependabot configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates)
- [Docker Actions](https://github.com/docker/build-push-action)

---

## 🤝 Contribution

Pour ajouter ou modifier des workflows :

1. Tester localement avec [act](https://github.com/nektos/act)
2. Créer une PR avec les modifications
3. Vérifier que les workflows existants passent
4. Documenter les changements dans ce README
