#!/bin/sh

# Expecting a husky@^7.0.0

HUSKY_DIR_NAME=".husky"

function install() {
  INSTALL_PATH=$1
  echo husky - Git root found at "'$(basename $INSTALL_PATH)'"
  npx husky install "$INSTALL_PATH/$HUSKY_DIR_NAME"
}

# ---
# Look for the git root to install husky

GIT_ROOT=0
DIRS=(".", "..", "../..")
for dir in "${DIRS[@]}"; do
  if [ -d "$dir/.git" ]; then
    cd "$dir"
    GIT_ROOT="$(pwd)"
    install "$GIT_ROOT"
    break
  fi
done

if [ $GIT_ROOT = 0 ]; then
  # If frontend folder is somewhere deeper in project, configure path manually
  # Looking for closest git root recursively is out of scope of this script
  echo $0: \
    "\n"Can\'t find git root folder to instal pre-commit hooks. \
    "\n"Please modify this script to point root repo manually.
  exit 1
fi

# ---
# Create actual hook script

PRE_COMMIT_PATH="$GIT_ROOT/$HUSKY_DIR_NAME/pre-commit"
npx husky add "$PRE_COMMIT_PATH"

PRE_COMMIT_SRC="#!/bin/sh

HUSKY_ROOT=\$(dirname \"\$0\")

. \"\$HUSKY_ROOT/_/husky.sh\"

npx lint-staged"

echo "$PRE_COMMIT_SRC" > "$PRE_COMMIT_PATH"

git add "$PRE_COMMIT_PATH"
