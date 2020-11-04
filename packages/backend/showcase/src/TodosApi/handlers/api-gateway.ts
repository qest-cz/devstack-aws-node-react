import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import awsServerlessExpress from 'aws-serverless-express'
import app from '../express-app'

const server = awsServerlessExpress.createServer(app)

export const handler = (event: APIGatewayProxyEvent, context: Context): void => {
    awsServerlessExpress.proxy(server, event, context)
}
