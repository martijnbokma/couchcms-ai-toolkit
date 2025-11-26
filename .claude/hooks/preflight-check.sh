#!/bin/bash
# Pre-flight Check Hook for Claude Code
#
# This hook runs on Stop events and checks recently edited files
# for common issues based on skill-rules preflight checks.
#
# Part of CouchCMS AI Toolkit

# Configuration
EDIT_LOG="${CLAUDE_PROJECT_DIR:-.}/.claude/edit-tracker.log"
SKILL_RULES="${CLAUDE_PROJECT_DIR:-.}/.claude/skills/skill-rules.json"
ISSUES_FOUND=0
WARNINGS_FOUND=0

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛡️  PRE-FLIGHT CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if edit log exists
if [ ! -f "$EDIT_LOG" ]; then
    echo -e "${GREEN}✅ No recent edits to check${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
fi

# Get unique recently edited files
RECENT_FILES=$(tail -50 "$EDIT_LOG" | cut -d'|' -f2 | sort -u)

if [ -z "$RECENT_FILES" ]; then
    echo -e "${GREEN}✅ No files to check${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
fi

# Count files
FILE_COUNT=$(echo "$RECENT_FILES" | wc -l | tr -d ' ')
echo "📁 Checking $FILE_COUNT recently edited file(s)..."
echo ""

# Process each file
for FILE in $RECENT_FILES; do
    if [ ! -f "$FILE" ]; then
        continue
    fi

    FILE_HAS_ISSUES=0

    # Determine file type and run appropriate checks
    case "$FILE" in
        *.php|*.html)
            # CouchCMS Critical Checks

            # Check 1: <cms: tags in HTML comments (CRITICAL)
            if grep -q '<!--[^>]*<cms:' "$FILE" 2>/dev/null; then
                echo -e "${RED}⚠️  CRITICAL${NC}: $FILE"
                echo "   <cms: tags in HTML comments will EXECUTE!"
                echo "   Use [cms: for disabled tags instead."
                echo ""
                ISSUES_FOUND=$((ISSUES_FOUND + 1))
                FILE_HAS_ISSUES=1
            fi

            # Check 2: Paired <cms:else> tags (ERROR)
            if grep -q '<cms:else></cms:else>' "$FILE" 2>/dev/null; then
                echo -e "${RED}❌ ERROR${NC}: $FILE"
                echo "   <cms:else> is self-closing. Use <cms:else /> instead."
                echo ""
                ISSUES_FOUND=$((ISSUES_FOUND + 1))
                FILE_HAS_ISSUES=1
            fi

            # Check 3: Paired <cms:else_if> tags (ERROR)
            if grep -qE '<cms:else_if[^/]*></cms:else_if>' "$FILE" 2>/dev/null; then
                echo -e "${RED}❌ ERROR${NC}: $FILE"
                echo "   <cms:else_if> is self-closing. Use <cms:else_if ... /> instead."
                echo ""
                ISSUES_FOUND=$((ISSUES_FOUND + 1))
                FILE_HAS_ISSUES=1
            fi

            # Check 4: Hardcoded colors (WARNING - only for HTML)
            if grep -qE 'class="[^"]*bg-(white|black|gray-[0-9]+)' "$FILE" 2>/dev/null; then
                echo -e "${YELLOW}⚠️  WARNING${NC}: $FILE"
                echo "   Hardcoded background colors detected."
                echo "   Consider using theme-aware colors (base-100, base-content)."
                echo ""
                WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
            fi

            # Check 5: Inline styles (WARNING)
            if grep -qE 'style="[^"]*"' "$FILE" 2>/dev/null; then
                inline_count=$(grep -oE 'style="[^"]*"' "$FILE" 2>/dev/null | wc -l | tr -d ' ')
                if [ "$inline_count" -gt 3 ]; then
                    echo -e "${YELLOW}⚠️  WARNING${NC}: $FILE"
                    echo "   $inline_count inline styles detected."
                    echo "   Consider using Tailwind utility classes."
                    echo ""
                    WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
                fi
            fi
            ;;

        *.ts|*.tsx)
            # TypeScript Checks

            # Check 1: any type (WARNING)
            if grep -q ': any' "$FILE" 2>/dev/null; then
                any_count=$(grep -o ': any' "$FILE" 2>/dev/null | wc -l | tr -d ' ')
                echo -e "${YELLOW}⚠️  WARNING${NC}: $FILE"
                echo "   Found $any_count 'any' type(s). Consider using specific types."
                echo ""
                WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
            fi

            # Check 2: @ts-ignore (WARNING)
            if grep -q '@ts-ignore' "$FILE" 2>/dev/null; then
                echo -e "${YELLOW}⚠️  WARNING${NC}: $FILE"
                echo "   @ts-ignore found. Fix the underlying type issue if possible."
                echo ""
                WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
            fi

            # Check 3: console.log (INFO)
            if grep -q 'console\.log' "$FILE" 2>/dev/null; then
                log_count=$(grep -o 'console\.log' "$FILE" 2>/dev/null | wc -l | tr -d ' ')
                echo -e "${BLUE}ℹ️  INFO${NC}: $FILE"
                echo "   Found $log_count console.log statement(s)."
                echo "   Remove for production or use proper logging."
                echo ""
            fi
            ;;

        *.css)
            # CSS Checks - minimal, TailwindCSS handles most
            ;;
    esac
done

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ISSUES_FOUND -gt 0 ]; then
    echo -e "${RED}❌ Found $ISSUES_FOUND critical issue(s)${NC}"
    echo "   Please review and fix before proceeding."
elif [ $WARNINGS_FOUND -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $WARNINGS_FOUND warning(s)${NC}"
    echo "   Consider addressing these issues."
else
    echo -e "${GREEN}✅ All checks passed!${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Clear the edit log after checking
> "$EDIT_LOG"

# Exit with error code if critical issues found
if [ $ISSUES_FOUND -gt 0 ]; then
    exit 1
fi

exit 0
