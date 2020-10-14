#!/bin/sh

yarn build
yarn cdk:deploy
yarn getenv