#!/bin/sh

case $1 in
  r) FILE="sunburst";; # r=radial
  g) FILE="network";;  # g=graph
  t) FILE="treemap";;  # t=tree
  *) FILE="treemap";;
esac

npx vite preview --open stats/$FILE
