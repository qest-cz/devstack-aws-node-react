import { App, CfnOutput, Duration, Stack } from '@aws-cdk/core'
import { Source } from '@aws-cdk/aws-s3-deployment'
import { Code, Runtime } from '@aws-cdk/aws-lambda'
import { FrontEndStack } from '../src/frontend/aws/FrontEndStack'
import { RestApiStack } from '../src/backend/Todos/RestApi/aws/RestApiStack'

const app = new App()

const frontendStack = new FrontEndStack(app, 'DemoFrontEnd', {
    sourceAsset: Source.asset('./dist-web'),
})

const todosApiStack = new RestApiStack(app, 'DemoRestApi', {
    apiHandlerProps: {
        runtime: Runtime.NODEJS_12_X,
        code: Code.fromAsset('./dist/api-handler'),
        handler: 'index.handler',
        memorySize: 512,
        timeout: Duration.seconds(10),
    },
})

const outputs = new Stack(app, 'DemoOutputs', {})

new CfnOutput(outputs, 'WebsiteUrl', { value: frontendStack.websiteBucket.bucketWebsiteUrl })
new CfnOutput(outputs, 'TodoApiUrl', { value: todosApiStack.restApi.url })
new CfnOutput(outputs, 'TodosTableName', { value: todosApiStack.todosTable.tableName })
