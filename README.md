# AWS Typescript Devstack

## Prerequisites

Requirements:

- Node.js 12
- AWS environment setup with aws-cli, providing `aws` command
- latest `aws-cdk` package installed globally, providing `cdk` command

Make sure to bootstrap your AWS environment first using `cdk bootstrap` command:
```
➜  ~ aws sts get-caller-identity
{
    "UserId": "AIDAXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/name"
}
➜  ~ cdk bootstrap aws://123456789012/eu-west-1
 ⏳  Bootstrapping environment aws://123456789012/eu-west-1...
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://123456789012/eu-west-1 bootstrapped (no changes).
```

## Commands

This repo contains examples running in AWS Lambda and in an ECS cluster. 
Use corresponding command to interact with the correct CDK app.

* `yarn code:fix` to fix/detect linting issues
* `yarn build` or `yarn build:ecs`
   * react app to `dist-web/`
   * lambda handlers to `dist/handler-name/index.js`
   * `tsc` output `dist-ecs/`
* `yarn deploy` or `yarn deploy-ecs` to build & deploy both web and backend resources
* `yarn cdk:app` or `yarn cdk:app-ecs` access to `cdk` command with `--app` parameter preset
* `yarn getenv` to get environment variables from deployed stacks output
* `yarn dev path/to/entry.ts` to run file with environment variables set
* `yarn dev:server` to run express app locally

## TODOS

- [ ] Proper webpack setup for frontend dev
- [x] An external configuration for react app
- [ ] module-specific configs/containers
- [ ] Complete module isolation (monorepo setup)
- [ ] AppSync GraphQl api example
- [ ] AWS tooling (local invoke etc.)
- [ ] Live reload for react app
- [ ] Automatic handler path resolution for Lambda functions
- [ ] Dynamic webpack configuration for Lambda functions