import { App } from '@aws-cdk/core'
import { ContainerImage } from '@aws-cdk/aws-ecs'
import { EnvironmentStack } from 'be-showcase/aws/stacks/EcsBackend/EnvironmentStack'
import { NetworkStack } from 'be-showcase/aws/stacks/EcsBackend/NetworkStack'
import { ClusterStack } from 'be-showcase/aws/stacks/EcsBackend/ClusterStack'
import { UsersApiStack } from 'be-showcase/aws/stacks/EcsBackend/UsersApiStack'
import { TodosApiStack } from 'be-showcase/aws/stacks/EcsBackend/TodosApiStack'
import { SettingsApiStack } from 'be-showcase/aws/stacks/EcsBackend/SettingsApiStack'
import { AppStacks, KnownPackages } from '../constants'

const domainName = process.env.HZ_NAME || ''
if (!domainName) {
    throw new Error('Specify hosted zone name as HZ_NAME env var')
}

const app = new App()

/**
 * Global resources - hosted zone, cert, networking, ECS cluster
 */
const environmentStack = new EnvironmentStack(app, AppStacks.EcsEnvironmentStack, {
    hzName: domainName,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
})
const { certificate, hostedZone } = environmentStack

const networkStack = new NetworkStack(app, AppStacks.EcsNetworkStack, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
})
const { vpc } = networkStack

const computeStack = new ClusterStack(app, AppStacks.EcsClusterStack, {
    vpc,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
})
const { cluster } = computeStack

const BACKEND_ECS_BUILD_DIR = `${KnownPackages.backendShowcase.relativePath}/dist-docker`

/**
 * UsersApi ECS service
 */
const usersApiStack = new UsersApiStack(app, AppStacks.EcsUsersApiStack, {
    cluster,
    hostedZone,
    certificate,
    serviceTask: {
        containerPort: 8080,
        image: ContainerImage.fromAsset(BACKEND_ECS_BUILD_DIR, {
            buildArgs: {
                ENTRY_PATH: 'src/UsersApi/handlers/ecs.js',
            },
        }),
    },
    databaseCredentials: {
        user: 'root',
        password: 'testtest',
        databaseName: 'testdb',
    },
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
})

/**
 * TodosApi ECS service
 */
const todosApiStack = new TodosApiStack(app, AppStacks.EcsTodosApiStack, {
    cluster,
    hostedZone,
    certificate,
    serviceTask: {
        containerPort: 8080,
        image: ContainerImage.fromAsset(BACKEND_ECS_BUILD_DIR, {
            buildArgs: {
                ENTRY_PATH: 'src/TodosApi/handlers/ecs.js',
            },
        }),
    },
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
})

/**
 * SettingsApi ECS service
 */
const settingsApiStack = new SettingsApiStack(app, AppStacks.EcsSettingsApiStack, {
    cluster,
    serviceTask: {
        containerPort: 8080,
        image: ContainerImage.fromAsset(BACKEND_ECS_BUILD_DIR, {
            buildArgs: {
                ENTRY_PATH: 'src/SettingsApi/handlers/ecs.js',
            },
        }),
    },
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
})
