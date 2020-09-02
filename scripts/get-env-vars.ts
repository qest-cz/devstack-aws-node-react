import fs from 'fs'
import AWS from 'aws-sdk'
import { constantCase } from 'change-case'

const ENV_FILE_PATH = 'env/.env.dev'

const cf = new AWS.CloudFormation({ region: 'eu-west-1' })

const writeEnvs = (envStr: string) => fs.writeFileSync(ENV_FILE_PATH, envStr)
const appendEnvs = (envStr: string) => fs.appendFileSync(ENV_FILE_PATH, envStr)

const getEnvironment = async (stackName: string): Promise<string> =>
    cf
        .describeStacks({ StackName: stackName })
        .promise()
        .then((res: any) => res.Stacks.pop())
        .then((stack) => stack.Outputs)
        .then((envs) =>
            envs.reduce((acc: any, curr: any) => `${acc}${constantCase(curr.OutputKey)}=${curr.OutputValue}\n`, ''),
        )
        .catch((err) => {
            console.log(
                `${stackName} stack not found. Make sure its deployed and AWS credentials are set: ${err.message}`,
            )

            throw err
        })

const createDevEnvFile = async (stackName: string) => {
    writeEnvs('AWS_NODEJS_CONNECTION_REUSE_ENABLED=1\n')
    appendEnvs('AWS_SDK_LOAD_CONFIG=1\n')

    try {
        appendEnvs(await getEnvironment(stackName))
    } catch (err) {
        console.log(err)
    }

    console.log(`\nResulting env file ${ENV_FILE_PATH}:\n`)
    return fs.readFileSync(ENV_FILE_PATH).toString()
}

createDevEnvFile(process.argv[2] || '')
    .then(console.log)
    .catch(console.log)
