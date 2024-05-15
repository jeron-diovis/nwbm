#!/bin/sh

function add_eslint() {
  echo Install eslint

  # have to pin it to make eslint@8 and vite-plugin-checker a friends
  npm pkg set resolutions.meow="^9.0.0"
  echo .eslintcache >> .gitignore

  # Pin eslint to v8, because v9 seems to be incompatible with vite-plugin-checker@0.6.4
  yarn add -D eslint@^8.0.0 \
    @typescript-eslint/eslint-plugin \
    @typescript-eslint/parser \
    eslint-plugin-react-hooks \
    eslint-plugin-react \
    eslint-plugin-import \
    eslint-plugin-react-refresh \
    prettier \
    eslint-plugin-prettier \
    eslint-config-prettier
}

function add_styles() {
  echo Install stylelint and CSS preprocessor
  echo .stylelintcache >> .gitignore
  yarn add -D sass \
    stylelint \
    stylelint-config-css-modules \
    stylelint-config-standard-scss \
    typescript-plugin-css-modules \
    postcss-nested \
    postcss-mixins \
    postcss-custom-selectors
}

function add_jsx_if() {
  echo Install jsx-control-statements
  yarn add -D eslint-plugin-jsx-control-statements babel-plugin-jsx-control-statements @babel/plugin-transform-react-jsx
}

function add_vite_plugins() {
  echo Install Vite quality-of-life plugins
  yarn add -D @vitejs/plugin-react \
    vite-split-config \
    vite-plugin-checker \
    vite-plugin-importus \
    vite-plugin-mock-dev-server \
    vite-plugin-chunk-split \
    vite-plugin-svgr \
    vite-plugin-time-reporter \
    rollup-plugin-visualizer \
    rollup-plugin-module-replacement \
    rollup-plugin-node-polyfills \
    vite-plugin-node-polyfills

  echo '/// <reference types="vite-plugin-svgr/client" />' >> vite-end.d.ts
}

function add_musthave_packages() {
  echo Install must-have utility packages
  yarn add lodash-es date-fns \
    clsx axios query-string utility-types
  yarn add -D @types/lodash-es @types/node
}

function add_precommit() {
  echo Install git-hooks tools
  yarn add -D 'husky@^7.0.0' lint-staged
  ./init-git-hooks.sh
}

function add_tests() {
  echo Install testing utilities
  yarn add -D vitest \
    @vitest/ui \
    @testing-library/react \
    @testing-library/jest-dom
}

function add_npm_scripts() {
  echo Add npm scripts to package.json
  npm pkg set 'scripts.stat'='./view-stats.sh'
  npm pkg set "scripts.lint:js"="eslint src --ext .cjs,.js,.jsx,.ts,.tsx"
  npm pkg set "scripts.lint:ts"="tsc --noEmit && cd mock && tsc --noEmit"
  npm pkg set "scripts.lint:css"="stylelint \"src/**/*.{s,}css\""
  npm pkg set "scripts.lint"="yarn lint:js && yarn lint:ts && yarn lint:css"
  npm pkg set "scripts.fix"="yarn lint:js --fix && yarn lint:css --fix"
  npm pkg set "scripts.test"="vitest"
}

function edit_ts_config() {
  echo Adjust tsconfig with types and plugins
  yarn add -D dot-json

  # remove comments (which may be added by Vite's scaffolder, for example)
  # Because any json-parsers will break at comment lines
  sed -i '' -e '/\/\*.*\*\//d' tsconfig.json
  sed -i '' -e '/\/\*.*\*\//d' tsconfig.node.json

  dot-json tsconfig.json -j compilerOptions.plugins '[{ "name": "typescript-plugin-css-modules" }]'
  dot-json tsconfig.json -j compilerOptions.types '["vitest", "vitest/globals", "vitest/importMeta", "@testing-library/jest-dom"]'
  dot-json tsconfig.node.json -j include '["vite.config.ts", ".vite/**/*.ts", "package.json"]'
}

function main() {
  add_precommit
  add_eslint
  add_styles
  add_jsx_if
  add_vite_plugins
  add_musthave_packages
  add_tests
  edit_ts_config
  add_npm_scripts
}

main
