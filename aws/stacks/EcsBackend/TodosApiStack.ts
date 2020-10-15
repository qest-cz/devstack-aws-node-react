import { CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { ApplicationLoadBalancedEc2Service } from '@aws-cdk/aws-ecs-patterns'
import { ContainerImage, ICluster } from '@aws-cdk/aws-ecs'
import { ICertificate } from '@aws-cdk/aws-certificatemanager'
import { IHostedZone } from '@aws-cdk/aws-route53'
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb'
import { Bucket } from '@aws-cdk/aws-s3'
import { WebsiteBucket } from '../../constructs/WebsiteBucket'

export interface TodosApiStackProps extends StackProps {
    cluster: ICluster
    certificate: ICertificate
    hostedZone: IHostedZone
    serviceTask: {
        image: ContainerImage
        containerPort: number
    }
}

export class TodosApiStack extends Stack {
    public readonly todosApiService: ApplicationLoadBalancedEc2Service
    public readonly todosTable: Table
    public readonly imagesBucket: Bucket

    public constructor(
        scope: Construct,
        id: string,
        { cluster, certificate, hostedZone, serviceTask, ...props }: TodosApiStackProps,
    ) {
        super(scope, id, props)

        const todosTable = new Table(this, 'Todos', {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY,
        })
        const imagesBucket = new WebsiteBucket(this, 'Images', {
            removalPolicy: RemovalPolicy.DESTROY,
        })

        const { image, containerPort } = serviceTask
        const todosApiService = new ApplicationLoadBalancedEc2Service(this, 'TodosApi', {
            cluster,
            certificate,
            domainZone: hostedZone,
            domainName: `todos.${hostedZone.zoneName}`,
            memoryLimitMiB: 128,
            cpu: 512,
            desiredCount: 2,
            redirectHTTP: true,
            taskImageOptions: {
                image,
                containerPort,
                environment: {
                    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
                    AWS_REGION: 'eu-west-1',
                    TODOS_TABLE_NAME: todosTable.tableName,
                    IMAGES_BUCKET_NAME: imagesBucket.bucketName,
                },
            },
        })
        todosApiService.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '10')
        const scaling = todosApiService.service.autoScaleTaskCount({
            minCapacity: 2,
            maxCapacity: 10,
        })
        scaling.scaleOnCpuUtilization('Cpu', {
            targetUtilizationPercent: 70,
        })
        scaling.scaleOnMemoryUtilization('Memory', {
            targetUtilizationPercent: 80,
        })
        scaling.scaleOnRequestCount('Requests', {
            requestsPerTarget: 600, // 10 req/sec
            targetGroup: todosApiService.targetGroup,
        })

        todosTable.grantReadWriteData(todosApiService.taskDefinition.taskRole)
        imagesBucket.grantReadWrite(todosApiService.taskDefinition.taskRole)

        this.todosApiService = todosApiService
        this.todosTable = todosTable
        this.imagesBucket = imagesBucket

        new CfnOutput(this, 'TodosTableName', { value: todosTable.tableName })
        new CfnOutput(this, 'ImagesBucketName', { value: imagesBucket.bucketName })
    }
}
