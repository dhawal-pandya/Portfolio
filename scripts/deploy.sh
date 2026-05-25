#!/usr/bin/env bash
#
# deploy.sh — build once, deploy to two GitHub Pages targets
#
# TARGET 1: gh-pages branch of this repo
#   → https://dhawal-pandya.github.io/Portfolio/
#   Uses git worktree so we never leave the current branch.
#
# TARGET 2: main branch of dhawal-pandya.github.io
#   → https://dhawal-pandya.github.io/
#   Uses a shallow clone since it's a different repo entirely.
#
# WHY base: './' IN vite.config.mjs
#   Relative asset paths (./assets/index.js) work for both targets:
#   - At root   → resolves to /assets/index.js        ✓
#   - At /Portfolio/ → resolves to /Portfolio/assets/index.js ✓
#   An absolute base ('/') would break the /Portfolio/ subdirectory deploy.
#
# ─────────────────────────────────────────────────────────────────────────────

set -e

PAGES_REPO="git@github.com:dhawal-pandya/dhawal-pandya.github.io.git"
WORKTREE_DIR=$(mktemp -d)
CLONE_DIR=$(mktemp -d)

cleanup() {
  git worktree remove --force "$WORKTREE_DIR" 2>/dev/null || true
  rm -rf "$CLONE_DIR"
}
trap cleanup EXIT

# ── Build (once) ──────────────────────────────────────────────────────────────
echo "🔨  Building..."
npm run build

# ── Target 1: Portfolio gh-pages (worktree) ───────────────────────────────────
echo ""
echo "📦  Deploying to Portfolio/gh-pages..."
git worktree prune

if git ls-remote --exit-code origin gh-pages &>/dev/null; then
  git fetch origin gh-pages:gh-pages --force 2>/dev/null || true
  git worktree add "$WORKTREE_DIR" gh-pages
else
  git branch -D gh-pages 2>/dev/null || true
  git worktree add --no-checkout "$WORKTREE_DIR" HEAD
  (cd "$WORKTREE_DIR" && git checkout --orphan gh-pages && git rm -rf . &>/dev/null || true)
fi

rsync -a --delete --exclude='.git' dist/ "$WORKTREE_DIR/"

(
  cd "$WORKTREE_DIR"
  git add -A
  if git diff --cached --quiet; then
    echo "  Nothing changed — skipping."
  else
    git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin gh-pages --force
    echo "  ✅  https://dhawal-pandya.github.io/Portfolio/"
  fi
)

# ── Target 2: dhawal-pandya.github.io main (clone) ───────────────────────────
echo ""
echo "📦  Deploying to dhawal-pandya.github.io..."
git clone --depth=1 "$PAGES_REPO" "$CLONE_DIR"
rsync -a --delete --exclude='.git' dist/ "$CLONE_DIR/"

(
  cd "$CLONE_DIR"
  git add -A
  if git diff --cached --quiet; then
    echo "  Nothing changed — skipping."
  else
    git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "  ✅  https://dhawal-pandya.github.io/"
  fi
)
