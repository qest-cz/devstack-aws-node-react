#!/bin/sh

yarn build
yarn cdk:app deploy '*' --require-approval never
yarn getenv