#!/bin/sh

NAME=$1
if [ -z "$NAME" ]; then
  echo "Usage: $0 <package-name>"
  exit 1
fi

PKG_PATH="packages/$NAME"
mkdir $PKG_PATH
rsync -a --exclude=node_modules \
  --exclude=.vite-root \
  --exclude=dist \
  packages/base/ \
  $PKG_PATH

cd $PKG_PATH

NS=nwbm

npm pkg set name=$NS/$NAME
npm pkg set repository.directory=packages/$NAME

echo "# $NAME" > README.md
