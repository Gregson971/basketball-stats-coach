# 🔄 CI/CD Workflows - Vue d'ensemble

## 📊 Architecture CI/CD Simplifiée

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
                              ▼
                    ┌─────────────────┐
                    │   backend-ci    │
                    │                 │
                    │ • Lint          │
                    │ • Tests         │
                    │ • Coverage      │
                    │ • Build         │
                    │ • Docker (main) │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Merge to main   │
                    └─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  backend-ci  │    │   Railway    │
            │              │    │              │
            │ • Full tests │    │ • Auto-build │
            │ • Docker img │    │ • Auto-deploy│
            └──────────────┘    └──────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PRODUCTION    │
                    └─────────────────┘
```

---

## 🚀 Workflow Backend CI

**Fichier** : `.github/workflows/backend-ci.yml`

### Triggers

- **Push** sur `main` ou `develop` (chemin `backend/**`)
- **Pull Request** vers `main` ou `develop`

### Jobs

| Job | Description | Temps | Status |
|-----|-------------|-------|--------|
| **lint** | Vérification ESLint | ~30s | ✅ Required |
| **test** | Tests (Node 18 & 20) | ~2m | ✅ Required |
| **coverage** | Couverture de code | ~1m | ℹ️ Informational |
| **build** | Compilation TypeScript | ~45s | ✅ Required |
| **docker** | Build images Docker | ~3m | ℹ️ Main only |

### Détails des jobs

#### 1. Lint
- Exécute ESLint sur tout le code backend
- Valide le respect des standards de code
- **Échec si** : Erreurs de linting détectées

#### 2. Test
- Exécute la suite complète de tests (246 tests)
- Tests unitaires, d'intégration et API
- Matrices : Node.js 18 et 20
- **Échec si** : Au moins un test échoue

#### 3. Coverage
- Génère les rapports de couverture de code
- Upload vers Codecov (optionnel)
- Crée un rapport HTML des tests
- **Informatif** : N'empêche pas le merge

#### 4. Build
- Compile le code TypeScript vers JavaScript
- Crée le dossier `dist/`
- Upload des artifacts (conservés 7 jours)
- **Échec si** : Erreurs de compilation

#### 5. Docker
- Build des images Docker (production + dev)
- **Uniquement sur la branche `main`**
- Optionnel : Push vers Docker Hub (décommenté)
- **Informatif** : N'empêche pas le merge

---

## 🚂 Déploiement avec Railway

### Configuration automatique

Railway est configuré pour déployer automatiquement depuis GitHub :

1. **Connexion GitHub ↔ Railway** : Votre projet Railway surveille le repository
2. **Détection automatique** : Railway détecte les push sur `main`
3. **Build automatique** : Railway utilise Nixpacks pour compiler TypeScript
4. **Déploiement automatique** : L'application est déployée automatiquement

### Fichiers de configuration Railway

| Fichier | Rôle |
|---------|------|
| `backend/railway.json` | Configuration build et déploiement |
| `backend/nixpacks.toml` | Instructions de build TypeScript |
| `backend/.railwayignore` | Exclusions de déploiement |

### Processus de déploiement

```
Push sur main
    │
    ├─► GitHub Actions (backend-ci)
    │   ├─► Lint ✓
    │   ├─► Tests ✓
    │   ├─► Build ✓
    │   └─► Docker ✓
    │
    └─► Railway (auto-detect)
        ├─► Pull from GitHub
        ├─► npm ci (install dependencies)
        ├─► npm run build (compile TypeScript)
        ├─► npm start (start server)
        └─► Deploy ✓ → Production URL
```

---

## 📊 Métriques

### Temps d'exécution moyens

| Workflow | Temps moyen | Coût (minutes) |
|----------|-------------|----------------|
| Backend CI (complet) | ~5-7 min | 5-7 |
| Railway Deploy | ~3-5 min | 0 (gratuit) |

**Total mensuel estimé (GitHub Actions)** :
- ~50 PR/mois × 5min = 250 min
- ~20 merges/mois × 7min = 140 min
- **Total : ~390 minutes/mois** (gratuit sur plan GitHub Free : 2000 min/mois)

### Success rate attendu

- ✅ CI : >95% (tests stables)
- ✅ Railway Deploy : >98% (déploiements fiables)

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
develop       → Développement (optionnel)
feature/*     → Nouvelles fonctionnalités
fix/*         → Corrections de bugs
hotfix/*      → Corrections urgentes
```

---

## 🚦 Status checks pour merge

Recommandations pour protéger `main` :

**Required status checks** :
- ✅ `lint`
- ✅ `test (18.x)`
- ✅ `test (20.x)`
- ✅ `build`

**Optionnel** :
- ℹ️ `coverage` (informatif)
- ℹ️ `docker` (main uniquement)

### Configuration dans GitHub

Settings → Branches → Branch protection rules → `main` :

```yaml
Require status checks to pass before merging: ✓
  - lint
  - test (18.x)
  - test (20.x)
  - build

Require branches to be up to date before merging: ✓
Require pull request reviews before merging: ✓
Include administrators: ✓
```

---

## 🆘 Troubleshooting

### Les tests échouent sur CI mais pas localement

```bash
# Vérifier la version Node.js
node --version  # Doit être 18 ou 20

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm test
```

### Le workflow GitHub Actions est lent

- Les jobs `test` et `coverage` s'exécutent en parallèle
- Le job `docker` ne s'exécute que sur `main`
- Vérifiez que vos tests ne font pas d'appels réseau inutiles

### Railway ne déploie pas

1. **Vérifier la connexion GitHub ↔ Railway** :
   - Railway → Settings → GitHub → Reconnect if needed

2. **Vérifier les fichiers de configuration** :
   ```bash
   ls backend/railway.json backend/nixpacks.toml backend/.railwayignore
   ```

3. **Consulter les logs Railway** :
   - Railway Dashboard → Deployments → Cliquer sur le déploiement

### Erreur "Cannot find module '/app/dist/index.js'" sur Railway

**Cause** : TypeScript non compilé
**Solution** : Vérifiez que `railway.json` contient :

```json
{
  "build": {
    "buildCommand": "npm ci && npm run build"
  }
}
```

---

## 📚 Documentation complémentaire

### Liens utiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Documentation](https://docs.railway.app/)
- [Nixpacks Documentation](https://nixpacks.com/docs)
- [Workflows syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

### Documentation du projet

- [README CI/CD](.github/README.md) - Documentation détaillée
- [Backend CI Workflow](.github/workflows/backend-ci.yml) - Configuration du workflow
- [Backend README](../backend/README.md) - Documentation backend
- [API Documentation](../backend/docs/API.md) - Endpoints REST

---

## 🔄 Workflow de développement quotidien

### 1. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 2. Développer et tester localement

```bash
npm test           # Tests
npm run lint       # Linting
npm run build      # Build
```

### 3. Commit et push

```bash
git add .
git commit -m "feat(api): add new feature"
git push origin feature/ma-nouvelle-fonctionnalite
```

### 4. Créer une Pull Request

- Allez sur GitHub
- Créez une PR vers `main`
- Le workflow `backend-ci` se déclenche automatiquement
- Vérifiez que tous les checks passent

### 5. Merger la PR

- Une fois les reviews approuvées et les checks passés
- Merge vers `main`
- Le workflow `backend-ci` s'exécute sur `main`
- Railway déploie automatiquement

### 6. Vérifier le déploiement

- Consultez les logs sur Railway Dashboard
- Testez l'API déployée sur l'URL Railway
- Vérifiez les métriques et logs

---

## 📈 Évolution future

### Phase 1 (Actuel) ✅
- ✅ CI automatique avec tests
- ✅ Build Docker
- ✅ Déploiement Railway auto

### Phase 2 (À venir)
- [ ] Tests E2E avec Playwright
- [ ] Performance benchmarks
- [ ] Monitoring et alertes (Sentry)
- [ ] Gestion des releases (tags + changelog)

### Phase 3 (Future)
- [ ] Multiple environnements (staging + production)
- [ ] Blue-green deployment
- [ ] Load testing (k6)
- [ ] Infrastructure as Code

---

**Dernière mise à jour** : 2024-11-28
