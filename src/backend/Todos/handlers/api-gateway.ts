import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import awsServerlessExpress from 'aws-serverless-express'
import { todosApi } from '../RestApi/express-app'

const server = awsServerlessExpress.createServer(todosApi)

export const handler = (event: APIGatewayProxyEvent, context: Context): void => {
    awsServerlessExpress.proxy(server, event, context)
}
