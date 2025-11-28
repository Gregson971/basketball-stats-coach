# 🔄 CI/CD Workflows - Vue d'ensemble

## 📊 Architecture CI/CD

```
┌─────────────────────────────────────────────────────────────────┐
│                         DÉVELOPPEMENT                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Feature Branch │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Pull Request  │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  pr-checks   │    │  backend-ci  │
            │              │    │              │
            │ • Quality    │    │ • Lint       │
            │ • Tests      │    │ • Tests      │
            │ • Coverage   │    │ • Coverage   │
            │ • Security   │    │ • Build      │
            └──────────────┘    └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Merge to main   │
                    └─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  backend-ci  │    │  backend-cd  │
            │              │    │              │
            │ • Full tests │    │ • Build      │
            │ • Docker img │    │ • Deploy     │
            └──────────────┘    └──────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Create tag      │
                    │   (v1.0.0)        │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │    release      │
                    │                 │
                    │ • GitHub Release│
                    │ • Docker Hub    │
                    │ • Changelog     │
                    └─────────────────┘
```

---

## 🚀 Workflows détaillés

### 1. Backend CI (Intégration Continue)

**Fichier** : `.github/workflows/backend-ci.yml`

**Triggers** :
- Push sur `main` ou `develop` (chemin `backend/**`)
- Pull Request vers `main` ou `develop`

**Jobs** :

| Job | Description | Temps | Status |
|-----|-------------|-------|--------|
| **lint** | Vérification ESLint | ~30s | ✅ Required |
| **test** | Tests (Node 18 & 20) | ~2m | ✅ Required |
| **coverage** | Couverture de code | ~1m | ℹ️ Informational |
| **build** | Compilation TypeScript | ~45s | ✅ Required |
| **docker** | Build images Docker | ~3m | ℹ️ Main only |

**Artifacts** :
- `dist/` - Code compilé (7 jours)
- Coverage reports → Codecov

---

### 2. Pull Request Checks

**Fichier** : `.github/workflows/pr-checks.yml`

**Triggers** :
- Ouverture de PR
- Nouveau commit sur PR
- Réouverture de PR

**Jobs** :

| Job | Description | Checks |
|-----|-------------|--------|
| **quality-checks** | Qualité du code | TypeScript compilation, ESLint, Prettier |
| **tests** | Tests par catégorie | Unit, Integration, API (parallèle) |
| **coverage-report** | Rapport de couverture | Commentaire automatique sur PR |
| **build-check** | Vérification build | TypeScript build + taille |
| **dependency-review** | Revue dépendances | Vulnérabilités et licences |
| **security-audit** | Audit sécurité | npm audit |
| **pr-summary** | Résumé | Statut global des checks |

**Protection de branche recommandée** :
```yaml
required_status_checks:
  - quality-checks
  - tests (unit)
  - tests (integration)
  - tests (api)
  - build-check
```

---

### 3. Backend CD (Déploiement Continu)

**Fichier** : `.github/workflows/backend-cd.yml`

**Triggers** :
- Push sur `main` (automatique)
- Déclenchement manuel

**Environments** :

| Environment | Branch | Approval | URL |
|-------------|--------|----------|-----|
| **Staging** | `develop` | Auto | À configurer |
| **Production** | `main` | Manual | À configurer |

**Jobs** :

| Job | Environment | Platform |
|-----|-------------|----------|
| **deploy-staging** | Staging | Railway/Render/Heroku |
| **deploy-production** | Production | Railway/Render/Heroku |

**Configuration requise** :
- Décommenter la plateforme choisie
- Configurer les secrets (tokens, IDs)
- Activer les environments dans GitHub

---

### 4. Release & Publish

**Fichier** : `.github/workflows/release.yml`

**Triggers** :
- Push de tag `v*.*.*` (ex: `v1.0.0`)

**Jobs** :

| Job | Description | Output |
|-----|-------------|--------|
| **create-release** | Création release GitHub | Release notes + changelog |
| **publish-docker** | Publication Docker Hub | Multi-arch (amd64, arm64) |
| **publish-npm** | GitHub Packages | Optionnel |

**Tags Docker créés** :
- `username/statcoach-backend:latest`
- `username/statcoach-backend:v1.0.0`
- `username/statcoach-backend:dev`
- `username/statcoach-backend:dev-v1.0.0`

**Workflow de release** :
```bash
# 1. Créer le tag
git tag -a v1.0.0 -m "Release v1.0.0"

# 2. Pusher le tag
git push origin v1.0.0

# 3. GitHub Actions :
#    - Génère le changelog automatiquement
#    - Crée la release GitHub
#    - Publie les images Docker
#    - Archive les artifacts
```

---

## 🤖 Dependabot

**Fichier** : `.github/dependabot.yml`

**Configuration** :

| Ecosystem | Fréquence | Groupes |
|-----------|-----------|---------|
| npm (backend) | Hebdomadaire (Lundi 9h) | TypeScript, ESLint, Jest, Swagger |
| GitHub Actions | Mensuel | - |
| Docker | Mensuel | - |

**Limites** :
- 10 PR ouvertes max
- Ignore les mises à jour majeures de Mongoose et Express
- Auto-assign aux reviewers configurés

**Labels automatiques** :
- `dependencies`
- `backend` / `ci/cd` / `docker`

---

## 📊 Métriques et monitoring

### Temps d'exécution moyens

| Workflow | Temps moyen | Coût (minutes) |
|----------|-------------|----------------|
| Backend CI (complet) | ~5-7 min | 5-7 |
| PR Checks | ~4-6 min | 4-6 |
| Backend CD | ~8-10 min | 8-10 |
| Release | ~6-8 min | 6-8 |

**Total mensuel estimé** :
- ~100 PR/mois × 5min = 500 min
- ~20 merges/mois × 7min = 140 min
- ~4 releases/mois × 8min = 32 min
- **Total : ~672 minutes/mois** (gratuit sur plan GitHub Free : 2000 min/mois)

### Success rate attendu

- ✅ CI : >95% (tests stables)
- ✅ PR Checks : >90% (dépend des PR)
- ✅ CD : >98% (déploiements fiables)
- ✅ Release : 100% (contrôlé manuellement)

---

## 🔐 Secrets requis par plateforme

### Railway
```
RAILWAY_TOKEN
```

### Render
```
RENDER_TOKEN
RENDER_STAGING_SERVICE_ID
RENDER_PRODUCTION_SERVICE_ID
```

### Heroku
```
HEROKU_API_KEY
HEROKU_EMAIL
```

### Docker Hub
```
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

### Codecov (optionnel)
```
CODECOV_TOKEN
```

---

## 🎯 Bonnes pratiques

### Commits

```bash
# Format recommandé : Conventional Commits
feat(api): add player search endpoint
fix(db): correct MongoDB connection timeout
chore(deps): update TypeScript to 5.9.3
docs(readme): update CI/CD section
test(unit): add tests for GameStats entity
```

### Branches

```
main          → Production (protégée)
develop       → Staging (protégée)
feature/*     → Nouvelles fonctionnalités
fix/*         → Corrections de bugs
hotfix/*      → Corrections urgentes
```

### Tags

```bash
# Semantic Versioning : MAJOR.MINOR.PATCH
v1.0.0        → Release majeure
v1.1.0        → Nouvelle fonctionnalité
v1.1.1        → Correction de bug
```

---

## 🚦 Status checks pour merge

Recommandations pour protéger `main` :

**Required status checks** :
- ✅ `lint`
- ✅ `test (unit)`
- ✅ `test (integration)`
- ✅ `test (api)`
- ✅ `build`
- ✅ `quality-checks`

**Optionnel** :
- ℹ️ `coverage` (informatif)
- ℹ️ `security-audit` (peut échouer)
- ℹ️ `dependency-review`

---

## 📈 Amélioration continues

### Phase 1 (Actuel)
- ✅ CI/CD complet
- ✅ Tests automatisés
- ✅ Docker builds
- ✅ Dependabot

### Phase 2 (À venir)
- [ ] Performance benchmarks
- [ ] E2E tests avec Playwright
- [ ] Visual regression tests
- [ ] Automatic changelog generation

### Phase 3 (Future)
- [ ] Canary deployments
- [ ] Blue-green deployment
- [ ] Load testing (k6)
- [ ] Infrastructure as Code (Terraform)

---

## 🆘 Support et troubleshooting

### Workflow échoue sur CI mais pas localement

1. Vérifier la version Node.js (18 ou 20)
2. Nettoyer le cache : `npm ci`
3. Vérifier les variables d'environnement

### Déploiement bloqué

1. Vérifier les secrets GitHub
2. Vérifier les environments (approval)
3. Consulter les logs détaillés

### Docker build échoue

1. Tester localement : `docker build -t test .`
2. Vérifier le Dockerfile
3. Vérifier `.dockerignore`

---

## 📚 Documentation complète

- [README CI/CD](.github/README.md) - Documentation détaillée
- [Backend CI](.github/workflows/backend-ci.yml) - Workflow CI
- [Backend CD](.github/workflows/backend-cd.yml) - Workflow CD
- [PR Checks](.github/workflows/pr-checks.yml) - Checks PR
- [Release](.github/workflows/release.yml) - Releases
- [Dependabot](.github/dependabot.yml) - Mises à jour auto
