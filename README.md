# AWS Typescript Devstack

## Prerequisites

Requirements:

-   Node.js 12
-   AWS environment setup with aws-cli, providing `aws` command
-   latest `aws-cdk` package installed globally, providing `cdk` command

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

## Quickstart

This repository uses a monorepo structure and uses [Lerna](https://github.com/lerna/lerna) and [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). You can read more about those before going to bed...

### Local development

1. `yarn bootstrap` to link the local packages, install `node_modules` and build the packages
2. `yarn dev` for local development (see the command output for further info)

### Running scripts

The only difference from a standard repository is that you can use lerna to run commands across all packages and you have multiple packages available in a single repo.
- Use `lerna run` to run a script in all registered packages

### How to install a dependency

-   You can install dependencies to specific packages (e.g. the `packages/backend/showcase`) by navigating to that directory (`cd`) and executing the `yarn add` command
    - You want to do this most of the time...
    - Note that the added package might get hoisted to the root `node_nodules` folder [see here for more info](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)
-   You can install dependencies to the root package by executing the `yarn add` command in the root of this repository
    -   This might be useful for some development packages (like prettier and eslint) or packages that are used in scripts

### Deployment

-   Either run the `yarn deploy` or `yarn deploy-ecs` [see commands](#available-commands) for more info

## The structure

```bash
.
├── lerna.json
    # Lerna publishing configuration is kept here https://github.com/lerna/lerna#lernajson
├── package.json
    # You can use "lerna run" to run commands (scripts) across all packages
    # You can add shared development! packages and commands to the workspace root
    # The yarn workspace configuration is kept here
├── node_modules
    # A lot of packages will endup here because of hoisting
    # Node module resolution (https://nodejs.org/dist/latest-v10.x/docs/api/modules.html#modules_all_together) will try to load modules from this folder when you are working on some specific package (e.g. packages/backend/showcase)
├── ...
├── packages
    # All the npm packages are kept here
    # The packages are currently all private and not published to the registry
│   ├── common
|   |   ├── ...
|   |   └── deployment
        # This package defines the deployment commands "deploy" and "deploy-ecs", which can be run from the workspace root for convenience (see root package.json)
        # Its role is to deploy the "backend/showcase" and "frontend/showcase" packages (required in its package.json dependencies)
│   ├── backend
│   │   ├── ...
│   │   └── showcase
│           ├── ...
│           ├── package.json
│           └── node_modules
│   └── frontend
│       ├── ...
│       └── showcase
│           ├── ...
│           ├── package.json
│           └── node_modules
├── packages_base
│   ├── package.shared.json
        # You can define shared "scripts" and other package.json properties and run the "update-package-jsons.ts" script to distribute the shared properties to all workspace registered "packages/**/*.json" files
│   ├── ...
│   └── update-package-jsons.ts
        # Distributes the package.shared.json to the registered workspace packages
└── yarn.lock
    # The one and only lockfile
```

## Available commands

This repo contains examples running in AWS Lambda and in an ECS cluster.
Use corresponding command to interact with the correct CDK app.

**Note that you can run commands from specific packages or from the workspace root**

### Workspace root commands

-   `yarn bootstrap` to link packages together, build them and install node_modules in all packages (including the root)
-   `dev` fro local FE and BE development
-   `dev:be` for local backend development
-   `dev:fe` for local frontend development
-   `dev:_...` internal shortcut commands
-   `build` to build all packages,
-   `build:watch` to build all packages in watch mode
-   `code:check` checks the linter, typescript and formatter for errors
-   `code:fix` to fix all linting and formatting issues,
-   `clean` removes all "dist" folders
-   `clean:all` same as clean, but also removes all node_module folders
-   `update-package-jsons` distribute the shared `package.shared.json` ([see structure](#structure)) properties
-   `deploy` deploys the backend and frontend showcase packages. The backend will be deployed to AWS Lambda environment
-   `deploy-ecs`: deploys the backend and frontend showcase packages. The backend will be deployed to an ECS Cluster

### Specific package commands

You can see the appropriate `packages/**/*.package.json` file for the specific commands

## Build lifecycle

The local private packages depend on the compiled code of each other (`import ... from 'fe-showcase/dist/...'`) so **all of the packages have to be compiled so they can work together correctly**. 

**When running build commands (`yarn build`) Lerna creates a topology of packages and runs the commands in-order to solve this issue.**

## Creating a brand new package

1. `yarn lerna create <package-name> <scope>` where scope can be for instance `packages/common` or `packages/frontend` (you can create the package manually too, there are no special steps required)
2. Now you can link this package to other packages by editing the corresponding package.json and adding it as a dependency
3. `yarn clean:all` after adding the dependency I like to clean the workspace completely
4. `yarn bootstrap` to link everything together and install dependencies
