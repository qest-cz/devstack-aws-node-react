import fs from 'fs'
import path from 'path'
import AWS from 'aws-sdk'
import { constantCase } from 'change-case'
import { AppStacks } from '../src/constants'

const cf = new AWS.CloudFormation({
    region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'eu-west-1',
})

const getEnvironment = async (stackName: string): Promise<string> =>
    cf
        .describeStacks({ StackName: stackName })
        .promise()
        .then((res: any) => res.Stacks.pop())
        .then((stack) => stack.Outputs)
        .then((envs) =>
            envs.reduce(
                (acc: any, curr: any) =>
                    `${acc}${constantCase(curr.OutputKey)}=${curr.OutputValue}\n`,
                '',
            ),
        )
        .catch((err) => {
            console.log(
                `${stackName} stack not found. Make sure its deployed and AWS credentials are set: ${err.message}`,
            )

            return ''
        })

const writeEnvs = (envFilePath: string, envStr: string) => fs.writeFileSync(envFilePath, envStr)
const appendEnvs = (envFilePath: string, envStr: string) => fs.appendFileSync(envFilePath, envStr)

export const createDevEnvFile = async (envFilePath: string) => {
    if (!envFilePath) {
        throw new Error(`The env file path has to be provided to the createDevEnvFile`)
    }

    const dirPath = path.dirname(envFilePath)
    fs.mkdirSync(dirPath, {
        recursive: true,
    })

    writeEnvs(envFilePath, 'AWS_NODEJS_CONNECTION_REUSE_ENABLED=1\n')
    appendEnvs(envFilePath, 'AWS_SDK_LOAD_CONFIG=1\n')

    try {
        for (const stackName of Object.values(AppStacks)) {
            appendEnvs(envFilePath, await getEnvironment(stackName))
        }
    } catch (err) {
        console.log(err)
    }

    console.log(`\nResulting env file ${envFilePath}:\n`)
    return fs.readFileSync(envFilePath).toString()
}

createDevEnvFile(process.argv[2]).then(console.log).catch(console.error)
