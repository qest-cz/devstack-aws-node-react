import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { Function, FunctionProps } from '@aws-cdk/aws-lambda'
import { Table } from '@aws-cdk/aws-dynamodb'
export interface TodosApiStackProps extends StackProps {
    apiHandlerProps: FunctionProps
}
export declare class TodosApiStack extends Stack {
    readonly restApiHandler: Function
    readonly restApi: LambdaRestApi
    readonly todosTable: Table
    constructor(scope: Construct, id: string, { apiHandlerProps, ...props }: TodosApiStackProps)
}
//# sourceMappingURL=TodosApiStack.d.ts.map
