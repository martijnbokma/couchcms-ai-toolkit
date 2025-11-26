#!/bin/bash
# Post-Edit Tracker Hook for Claude Code
#
# This hook runs after PostToolUse (Edit/Write operations)
# and tracks edited files for preflight checks.
#
# Part of CouchCMS AI Toolkit

# Configuration
EDIT_LOG="${CLAUDE_PROJECT_DIR:-.}/.claude/edit-tracker.log"
MAX_LOG_LINES=100
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Ensure log directory exists
mkdir -p "$(dirname "$EDIT_LOG")"

# Log the edited file if provided
if [ -n "$CLAUDE_EDITED_FILE" ]; then
    echo "$TIMESTAMP|$CLAUDE_EDITED_FILE" >> "$EDIT_LOG"
fi

# Also check for environment variables that Claude Code might use
if [ -n "$EDITED_FILE" ]; then
    echo "$TIMESTAMP|$EDITED_FILE" >> "$EDIT_LOG"
fi

# Trim log file if it gets too long
if [ -f "$EDIT_LOG" ]; then
    line_count=$(wc -l < "$EDIT_LOG")
    if [ "$line_count" -gt "$MAX_LOG_LINES" ]; then
        tail -n "$MAX_LOG_LINES" "$EDIT_LOG" > "${EDIT_LOG}.tmp"
        mv "${EDIT_LOG}.tmp" "$EDIT_LOG"
    fi
fi

exit 0
