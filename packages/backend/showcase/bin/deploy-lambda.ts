import { App, Duration } from '@aws-cdk/core'
import { Source } from '@aws-cdk/aws-s3-deployment'
import { Code, Runtime } from '@aws-cdk/aws-lambda'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { FrontEndStack } from '../aws/stacks/FrontEndStack'
import { TodosApiStack } from '../aws/stacks/LambdaBackend/TodosApiStack'
import { AppStacks } from '../aws/constants'

const app = new App()

const todosApiStack = new TodosApiStack(app, AppStacks.BackEnd, {
    apiHandlerProps: {
        runtime: Runtime.NODEJS_12_X,
        code: Code.fromAsset('./dist/todos-api'),
        handler: 'index.handler',
        memorySize: 512,
        timeout: Duration.seconds(10),
        logRetention: RetentionDays.ONE_WEEK,
    },
})

const frontendStack = new FrontEndStack(app, AppStacks.FrontEnd, {
    sourceAsset: Source.asset('./dist-web'),
    apiBaseUrl: todosApiStack.restApi.url,
})