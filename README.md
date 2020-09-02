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

* `yarn code:fix` to fix/detect linting issues
* `yarn build`
   * react app to `dist-web/`
   * lambda handlers to `dist/handler-name/index.js`
* `yarn deploy` to deploy both web and backend resources
* `yarn getenv` to get environment variables from deployed stacks output
* `yarn dev path/to/entry.ts` to run file with environment variables set
* `yarn dev:api` to run express app locally