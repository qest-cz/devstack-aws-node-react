import { Construct, Stack, StackProps } from '@aws-cdk/core'
import {
    Compatibility,
    ContainerImage,
    Ec2Service,
    ICluster,
    LogDriver,
    TaskDefinition,
} from '@aws-cdk/aws-ecs'
import { Port } from '@aws-cdk/aws-ec2'

export interface SettingsApiStackProps extends StackProps {
    cluster: ICluster
    serviceTask: {
        image: ContainerImage
        containerPort: number
    }
}

export class SettingsApiStack extends Stack {
    public readonly settingsApiService: Ec2Service

    public constructor(
        scope: Construct,
        id: string,
        { cluster, serviceTask, ...props }: SettingsApiStackProps,
    ) {
        super(scope, id, props)

        const { image, containerPort } = serviceTask

        const settingsApiTask = new TaskDefinition(this, 'SettingsApiTask', {
            memoryMiB: '128',
            cpu: '512',
            compatibility: Compatibility.EC2,
        })
        settingsApiTask
            .addContainer('Container', {
                image,
                environment: {
                    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
                    AWS_REGION: 'eu-west-1',
                },
                memoryLimitMiB: 128,
                cpu: 512,
                logging: LogDriver.awsLogs({
                    streamPrefix: `SettingsApi`,
                }),
            })
            .addPortMappings({ containerPort })

        const settingsApiService = new Ec2Service(this, 'SettingsApi', {
            desiredCount: 2,
            cluster,
            taskDefinition: settingsApiTask,
            cloudMapOptions: {
                cloudMapNamespace: cluster.defaultCloudMapNamespace,
                name: 'settings',
            },
        })

        settingsApiService.connections.allowFrom(
            cluster.connections,
            Port.allTcp(),
            'allow access to settings service',
        )

        const scaling = settingsApiService.autoScaleTaskCount({
            minCapacity: 2,
            maxCapacity: 10,
        })
        scaling.scaleOnCpuUtilization('Cpu', {
            targetUtilizationPercent: 70,
        })
        scaling.scaleOnMemoryUtilization('Memory', {
            targetUtilizationPercent: 80,
        })

        this.settingsApiService = settingsApiService
    }
}
