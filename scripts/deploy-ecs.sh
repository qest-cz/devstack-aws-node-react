#!/bin/sh

yarn build:ecs
yarn cdk:app-ecs deploy '*' --require-approval never
yarn getenv