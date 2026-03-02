#!/usr/bin/env sh
# Pre-commit hook to scan for log files containing path data

echo "🔍 Scanning for log files with sensitive path data..."

# Check for any *.log files in the staging area
staged_logs=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.log$' || true)

if [ -n "$staged_logs" ]; then
    echo "❌ ERROR: Log files detected in staging area:"
    echo "$staged_logs"
    echo ""
    echo "Log files should not be committed. Please:"
    echo "1. Remove them from git: git rm --cached <file>"
    echo "2. Add them to .gitignore if not already present"
    exit 1
fi

# Check for any new log files in working directory
new_logs=$(git ls-files --others --exclude-standard | grep -E '\.log$' || true)

if [ -n "$new_logs" ]; then
    echo "⚠️  WARNING: Untracked log files detected:"
    echo "$new_logs"
    echo ""
    echo "Consider adding these to .gitignore to prevent accidental commits."
fi

echo "✅ No log files detected in staging area"
exit 0
