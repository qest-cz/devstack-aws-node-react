import { CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { Function, FunctionProps } from '@aws-cdk/aws-lambda'
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb'
import { WebsiteBucket } from '../../constructs/WebsiteBucket'

export interface TodosApiStackProps extends StackProps {
    apiHandlerProps: FunctionProps
}

export class TodosApiStack extends Stack {
    public readonly restApiHandler: Function
    public readonly restApi: LambdaRestApi
    public readonly todosTable: Table

    public constructor(
        scope: Construct,
        id: string,
        { apiHandlerProps, ...props }: TodosApiStackProps,
    ) {
        super(scope, id, props)

        const handler = new Function(this, 'ApiHandler', apiHandlerProps)
        const todosApi = new LambdaRestApi(this, 'TodosApi', { handler })
        const todosTable = new Table(this, 'TodosTable', {
            partitionKey: { type: AttributeType.STRING, name: 'id' },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY,
        })
        const imagesBucket = new WebsiteBucket(this, 'Images', {
            removalPolicy: RemovalPolicy.DESTROY,
        })

        todosTable.grantReadWriteData(handler)
        handler.addEnvironment('TODOS_TABLE_NAME', todosTable.tableName)
        handler.addEnvironment('IMAGES_BUCKET_NAME', imagesBucket.bucketName)

        this.restApi = todosApi
        this.restApiHandler = handler
        this.todosTable = todosTable

        new CfnOutput(this, 'TodosApiUrl', { value: todosApi.url })
        new CfnOutput(this, 'TodosTableName', { value: todosTable.tableName })
        new CfnOutput(this, 'ImagesBucketName', { value: imagesBucket.bucketName })
    }
}
