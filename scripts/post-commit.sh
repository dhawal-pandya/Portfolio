#!/usr/bin/env bash
#
# post-commit hook — auto-deploy to GitHub Pages on every commit to master
#
# SETUP (run once per machine):
#   cp scripts/post-commit.sh .git/hooks/post-commit
#   chmod +x .git/hooks/post-commit
#
# Git hooks live in .git/hooks/ which is not tracked, so this file is the
# source of truth. Copy it into .git/hooks/ on any new machine to activate.

# Only deploy on master
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "master" ]; then
  exit 0
fi

# Verify GitHub SSH access before attempting a deploy that will silently fail
if ! ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
  echo ""
  echo "⚠️  Deploy skipped — no GitHub SSH access on this machine."
  echo ""
  echo "   This hook auto-deploys on every commit to master, but it needs"
  echo "   an SSH key that is authorised for github.com."
  echo ""
  echo "   To fix:"
  echo "     1. Generate a key:  ssh-keygen -t ed25519 -C \"your@email.com\""
  echo "     2. Add it to GitHub: https://github.com/settings/keys"
  echo "     3. Test it:         ssh -T git@github.com"
  echo ""
  echo "   To deploy manually once SSH is set up:  npm run deploy"
  exit 0
fi

echo ""
echo "🚀  Deploying to GitHub Pages..."
npm run deploy
