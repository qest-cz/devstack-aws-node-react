import * as path from 'path'
import { App } from '@aws-cdk/core'
import { ContainerImage } from '@aws-cdk/aws-ecs'
import { EnvironmentStack } from '../aws/stacks/EcsBackend/EnvironmentStack'
import { ClusterStack } from '../aws/stacks/EcsBackend/ClusterStack'
import { TodosApiStack } from '../aws/stacks/EcsBackend/TodosApiStack'
import { NetworkStack } from '../aws/stacks/EcsBackend/NetworkStack'
import { UsersApiStack } from '../aws/stacks/EcsBackend/UsersApiStack'
import { SettingsApiStack } from '../aws/stacks/EcsBackend/SettingsApiStack'
import { AppStacks } from '../aws/constants'

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
})
const { certificate, hostedZone } = environmentStack

const networkStack = new NetworkStack(app, AppStacks.EcsNetworkStack)
const { vpc } = networkStack

const computeStack = new ClusterStack(app, AppStacks.EcsClusterStack, { vpc })
const { cluster } = computeStack

/**
 * UsersApi ECS service
 */
const usersApiStack = new UsersApiStack(app, AppStacks.EcsUsersApiStack, {
    cluster,
    hostedZone,
    certificate,
    serviceTask: {
        containerPort: 8080,
        image: ContainerImage.fromAsset(path.join(__dirname, '..', 'dist-ecs'), {
            buildArgs: {
                ENTRY_PATH: 'src/backend/UsersApi/handlers/ecs.js',
            },
        }),
    },
    databaseCredentials: {
        user: 'root',
        password: 'testtest',
        databaseName: 'testdb',
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
        image: ContainerImage.fromAsset(path.join(__dirname, '..', 'dist-ecs'), {
            buildArgs: {
                ENTRY_PATH: 'src/backend/TodosApi/handlers/ecs.js',
            },
        }),
    },
})

/**
 * SettingsApi ECS service
 */
const settingsApiStack = new SettingsApiStack(app, AppStacks.EcsSettingsApiStack, {
    cluster,
    serviceTask: {
        containerPort: 8080,
        image: ContainerImage.fromAsset(path.join(__dirname, '..', 'dist-ecs'), {
            buildArgs: {
                ENTRY_PATH: 'src/backend/SettingsApi/handlers/ecs.js',
            },
        }),
    },
})
