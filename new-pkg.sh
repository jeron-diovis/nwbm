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
  packages/core/ \
  $PKG_PATH

cd $PKG_PATH
npm pkg set name=@yai/$NAME
