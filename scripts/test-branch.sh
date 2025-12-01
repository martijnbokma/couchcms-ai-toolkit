#!/bin/bash

# Quick script to switch submodule to a specific branch for testing
# Usage: ./scripts/test-branch.sh [branch-name]

BRANCH=${1:-develop}
SUBMODULE="ai-toolkit-shared"

echo "🔄 Switching submodule to ${BRANCH} branch..."

# Check if we're in the right directory
if [ ! -d "${SUBMODULE}" ]; then
    echo "❌ Error: ${SUBMODULE} directory not found"
    echo "   Run this script from your project root"
    exit 1
fi

cd "${SUBMODULE}" || exit 1

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "detached")
echo "📋 Current branch: ${CURRENT_BRANCH}"

# Fetch latest changes
echo "⬇️  Fetching latest changes..."
git fetch origin

# Checkout branch
if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
    echo "✓ Local branch ${BRANCH} exists"
    git checkout "${BRANCH}"
elif git show-ref --verify --quiet "refs/remotes/origin/${BRANCH}"; then
    echo "✓ Creating local branch from origin/${BRANCH}"
    git checkout -b "${BRANCH}" "origin/${BRANCH}"
else
    echo "❌ Error: Branch ${BRANCH} not found"
    echo "   Available branches:"
    git branch -r | grep -v HEAD | sed 's/origin\///' | sed 's/^/   - /'
    exit 1
fi

# Pull latest
echo "⬇️  Pulling latest changes..."
git pull origin "${BRANCH}"

# Show current status
echo ""
echo "✅ Switched to ${BRANCH} branch"
echo "   Latest commit: $(git log -1 --oneline)"
echo ""
echo "📋 Next steps:"
echo "   1. Test sync:"
echo "      cd .. && bun ${SUBMODULE}/scripts/sync.js"
echo ""
echo "   2. Test validation:"
echo "      bun ${SUBMODULE}/scripts/validate.js"
echo ""
echo "   3. Switch back to master:"
echo "      cd ${SUBMODULE} && git checkout master && cd .."
echo ""
