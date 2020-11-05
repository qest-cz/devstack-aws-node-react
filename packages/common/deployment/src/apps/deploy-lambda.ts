import { App, Duration } from '@aws-cdk/core'
import { Code, Runtime } from '@aws-cdk/aws-lambda'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { TodosApiStack } from 'be-showcase/aws/stacks/LambdaBackend/TodosApiStack'
import { FrontEndStack } from 'fe-showcase/aws/stacks/FrontEndStack'
import { Source } from '@aws-cdk/aws-s3-deployment'
import { AppStacks, KnownPackages } from '../constants'

const app = new App()

const todosApiStack = new TodosApiStack(app, AppStacks.BackEnd, {
    apiHandlerProps: {
        runtime: Runtime.NODEJS_12_X,
        code: Code.fromAsset(`${KnownPackages.backendShowcase.relativePath}/dist/todos-api`),
        handler: 'index.handler',
        memorySize: 512,
        timeout: Duration.seconds(10),
        logRetention: RetentionDays.ONE_WEEK,
    },
})

const frontendStack = new FrontEndStack(app, AppStacks.FrontEnd, {
    sourceAsset: Source.asset(`${KnownPackages.backendShowcase.relativePath}/dist`),
    apiBaseUrl: todosApiStack.restApi.url,
})
