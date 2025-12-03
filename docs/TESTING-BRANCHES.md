# Testing Branches in Test Projects

Guide voor het testen van verschillende branches (zoals `develop`) in een test project voordat je ze integreert in de hoofdtak.

## 🎯 Doel

Test wijzigingen in een apart project zonder de hoofdcodebase te beïnvloeden. Dit is essentieel voor:
- ✅ Nieuwe features testen
- ✅ Bugfixes verifiëren
- ✅ Breaking changes evalueren
- ✅ Regressies voorkomen

---

## 📋 Methode 1: Submodule naar Specifieke Branch Switchen

### Stap 1: Navigeer naar Submodule Directory

```bash
# Vanuit je test project root
cd ai-toolkit-shared
# Of als je submodule anders heet:
cd /path/to/your/submodule
```

### Stap 2: Check Status en Beschikbare Branches

```bash
# Zie huidige branch
git branch

# Zie alle branches (lokaal + remote)
git branch -a

# Fetch laatste updates van remote
git fetch origin
```

### Stap 3: Switch naar Develop Branch

```bash
# Checkout develop branch
git checkout develop

# Of als develop nog niet lokaal bestaat:
git checkout -b develop origin/develop

# Pull laatste wijzigingen
git pull origin develop
```

### Stap 4: Test in Je Project

```bash
# Terug naar project root
cd ..

# Test de sync
bun ai-toolkit-shared/scripts/sync.js

# Valideer configuratie
bun ai-toolkit-shared/scripts/validate.js

# Test alle functionaliteit die je wilt verifiëren
```

### Stap 5: Terug naar Master (Na Testing)

```bash
cd ai-toolkit-shared
git checkout master
git pull origin master
cd ..
```

---

## 📋 Methode 2: Submodule Pinnen naar Specifieke Branch

Als je de submodule permanent naar een branch wilt laten wijzen:

### Stap 1: Configureer Submodule om Branch te Volgen

```bash
cd ai-toolkit-shared

# Checkout naar develop
git checkout develop

# Configureer submodule om develop branch te volgen
git config branch.develop.remote origin
git config branch.develop.merge refs/heads/develop

# Pull laatste wijzigingen
git pull origin develop
```

### Stap 2: Update Parent Project (Optioneel)

Als je wilt dat het parent project deze branch gebruikt:

```bash
# Terug naar project root
cd ..

# Commit de submodule wijziging
git add ai-toolkit-shared
git commit -m "test: switch submodule to develop branch for testing"

# Of als je dit lokaal wilt houden zonder te committen:
# Skip deze stap
```

---

## 📋 Methode 3: Tijdelijke Test Setup (Aanbevolen)

Voor een geïsoleerde test zonder je main project te beïnvloeden:

### Stap 1: Maak Test Branch in Submodule

```bash
cd ai-toolkit-shared

# Fetch alle branches
git fetch origin

# Checkout develop branch
git checkout develop

# Maak lokale test branch vanaf develop
git checkout -b test/develop-$(date +%Y%m%d)

# Of direct develop gebruiken
# git checkout develop
```

### Stap 2: Test Uitgebreid

```bash
cd ..

# Test alle functionaliteit
bun ai-toolkit-shared/scripts/sync.js
bun ai-toolkit-shared/scripts/validate.js

# Test je eigen features die gebruik maken van de toolkit
# ...

# Verifieer dat alles werkt zoals verwacht
```

### Stap 3: Documenteer Bevindingen

Noteer:
- ✅ Wat werkt
- ⚠️ Wat niet werkt
- 🐛 Gevonden bugs
- 💡 Verbeteringen

### Stap 4: Schoonmaken

```bash
cd ai-toolkit-shared

# Terug naar master
git checkout master
git pull origin master

# Verwijder test branch (optioneel)
# git branch -D test/develop-YYYYMMDD

cd ..
```

---

## 🔄 Snel Switchen Script

Maak een handig script voor snel switchen:

### `scripts/dev/test-branch.sh`

**Note:** This is a developer utility script located in `scripts/dev/` for toolkit contributors.

```bash
#!/bin/bash

# Usage: ./scripts/dev/test-branch.sh [branch-name]

BRANCH=${1:-develop}
SUBMODULE="ai-toolkit-shared"

echo "🔄 Switching submodule to ${BRANCH} branch..."

cd "${SUBMODULE}" || exit 1

# Fetch latest
git fetch origin

# Checkout branch
if git show-ref --verify --quiet refs/heads/"${BRANCH}"; then
    echo "✓ Local branch ${BRANCH} exists"
    git checkout "${BRANCH}"
else
    echo "✓ Creating local branch from origin/${BRANCH}"
    git checkout -b "${BRANCH}" "origin/${BRANCH}"
fi

# Pull latest
git pull origin "${BRANCH}"

echo "✅ Switched to ${BRANCH} branch"
echo ""
echo "To test:"
echo "  cd .. && bun ${SUBMODULE}/scripts/sync.js"
echo ""
echo "To switch back to master:"
echo "  cd ${SUBMODULE} && git checkout master"
```

**Gebruik:**
```bash
chmod +x scripts/dev/test-branch.sh
./scripts/dev/test-branch.sh develop
./scripts/dev/test-branch.sh feature/new-feature
```

---

## 📋 Methode 4: Meerdere Test Projecten

Voor parallelle testing van verschillende branches:

### Project Structuur

```
test-projects/
├── test-develop/          # Test project voor develop branch
│   └── ai-toolkit-shared/ # Submodule pointing to develop
├── test-master/           # Test project voor master branch
│   └── ai-toolkit-shared/ # Submodule pointing to master
└── test-feature-x/        # Test project voor feature branch
    └── ai-toolkit-shared/ # Submodule pointing to feature/x
```

### Setup Script

```bash
#!/bin/bash

# Maak test projecten voor verschillende branches

BRANCHES=("master" "develop" "feature/fix-sync-issues")

for BRANCH in "${BRANCHES[@]}"; do
    PROJECT_NAME="test-${BRANCH//\//-}"

    echo "Creating test project: ${PROJECT_NAME}"

    # Maak directory
    mkdir -p "test-projects/${PROJECT_NAME}"
    cd "test-projects/${PROJECT_NAME}"

    # Initialiseer git repo
    git init

    # Voeg submodule toe
    git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

    # Switch submodule naar specifieke branch
    cd ai-toolkit-shared
    git fetch origin
    git checkout -b "${BRANCH}" "origin/${BRANCH}" 2>/dev/null || git checkout "${BRANCH}"
    cd ..

    echo "✅ Created ${PROJECT_NAME} with ${BRANCH} branch"
    cd ../..
done
```

---

## 🧪 Testing Checklist

Voordat je een branch merge naar master, test:

- [ ] **Sync werkt correct**
  ```bash
  bun ai-toolkit-shared/scripts/sync.js
  ```

- [ ] **Validatie werkt**
  ```bash
  bun ai-toolkit-shared/scripts/validate.js
  ```

- [ ] **Alle directories worden aangemaakt**
  - `.cursor/rules/` directory
  - `.claude/` directory structuur
  - `.claude/skills/` directory
  - `.claude/hooks/` directory

- [ ] **Configuratie files worden gegenereerd**
  - `.cursorrules`
  - `CLAUDE.md`
  - `.claude/settings.json`
  - `AGENTS.md`

- [ ] **Geen breaking changes**
  - Bestaande configuraties werken nog
  - Backward compatibility behouden

- [ ] **Geen nieuwe errors**
  - Check console output
  - Check log files
  - Check voor warnings

---

## 🔧 Troubleshooting

### Submodule blijft op oude commit

```bash
cd ai-toolkit-shared
git fetch origin
git checkout develop
git pull origin develop
cd ..
git add ai-toolkit-shared
```

### Branch bestaat niet lokaal

```bash
cd ai-toolkit-shared
git fetch origin
git checkout -b develop origin/develop
```

### Conflicts bij switchen

```bash
cd ai-toolkit-shared
git stash  # Sla lokale wijzigingen op
git checkout develop
git stash pop  # Haal wijzigingen terug (als nodig)
```

### Reset naar clean state

```bash
cd ai-toolkit-shared
git reset --hard origin/develop
git clean -fd  # Verwijder untracked files
```

---

## 📝 Best Practices

1. **Test altijd in apart project eerst**
   - Nooit direct in productie project
   - Gebruik test/development omgeving

2. **Documenteer je bevindingen**
   - Wat werkt
   - Wat niet werkt
   - Issues gevonden

3. **Test alle edge cases**
   - Lege configuraties
   - Complexe configuraties
   - Verschillende project types

4. **Houd branches up-to-date**
   ```bash
   cd ai-toolkit-shared
   git fetch origin
   git pull origin develop
   ```

5. **Clean up na testing**
   - Switch terug naar master
   - Verwijder test branches
   - Update parent project (als nodig)

---

## 🚀 Quick Reference

### Switch naar develop
```bash
cd ai-toolkit-shared && git checkout develop && git pull origin develop && cd ..
```

### Test sync
```bash
bun ai-toolkit-shared/scripts/sync.js
```

### Terug naar master
```bash
cd ai-toolkit-shared && git checkout master && git pull origin master && cd ..
```

### Check huidige branch
```bash
cd ai-toolkit-shared && git branch && cd ..
```

---

**💡 Tip:** Gebruik een aparte test directory voor branch testing om je main project clean te houden!
