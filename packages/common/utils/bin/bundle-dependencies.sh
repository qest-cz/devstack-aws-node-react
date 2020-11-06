#!/usr/bin/env bash

BASEDIR="$(dirname "$(readlink -f "$0")")"

# Transpile on the run, so we do not have to compile the script beforehand
exec "$BASEDIR/../node_modules/.bin/ts-node" -T "$BASEDIR/../scripts/bundle-dependencies.ts" "$@"
