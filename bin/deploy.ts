import { App, CfnOutput, Duration } from '@aws-cdk/core'
import { Source } from '@aws-cdk/aws-s3-deployment'
import { Code, Runtime } from '@aws-cdk/aws-lambda'
import { FrontEndStack } from '../aws/stacks/FrontEndStack'
import { RestApiStack } from '../aws/stacks/RestApiStack'
import { AppStacks } from '../aws/constants'

const stackPrefix = 'Demo'

const app = new App()

const frontendStack = new FrontEndStack(app, `${stackPrefix}${AppStacks.FrontEnd}`, {
    sourceAsset: Source.asset('./dist-web'),
})

const todosApiStack = new RestApiStack(app, `${stackPrefix}${AppStacks.BackEnd}`, {
    apiHandlerProps: {
        runtime: Runtime.NODEJS_12_X,
        code: Code.fromAsset('./dist/api-handler'),
        handler: 'index.handler',
        memorySize: 512,
        timeout: Duration.seconds(10),
    },
})

new CfnOutput(frontendStack, 'WebsiteUrl', { value: frontendStack.websiteBucket.bucketWebsiteUrl })
new CfnOutput(todosApiStack, 'TodoApiUrl', { value: todosApiStack.restApi.url })
new CfnOutput(todosApiStack, 'TodosTableName', { value: todosApiStack.todosTable.tableName })
