import { Construct, Duration, RemovalPolicy, SecretValue, Stack, StackProps } from '@aws-cdk/core'
import {
    AuroraCapacityUnit,
    Credentials,
    DatabaseClusterEngine,
    ServerlessCluster,
} from '@aws-cdk/aws-rds'
import { ContainerImage, ICluster } from '@aws-cdk/aws-ecs'
import { IHostedZone } from '@aws-cdk/aws-route53'
import { ApplicationLoadBalancedEc2Service } from '@aws-cdk/aws-ecs-patterns'
import { ICertificate } from '@aws-cdk/aws-certificatemanager'
import { Port, SubnetType } from '@aws-cdk/aws-ec2'

export interface UsersApiStackProps extends StackProps {
    cluster: ICluster
    hostedZone: IHostedZone
    certificate: ICertificate
    serviceTask: {
        image: ContainerImage
        containerPort: number
    }
    databaseCredentials: {
        user: string
        password: string
        databaseName: string
    }
}

export class UsersApiStack extends Stack {
    public constructor(
        scope: Construct,
        id: string,
        {
            cluster,
            databaseCredentials,
            hostedZone,
            certificate,
            serviceTask,
            ...props
        }: UsersApiStackProps,
    ) {
        super(scope, id, props)

        /**
         * MySql Aurora Serverless cluster
         */
        const { password, user, databaseName } = databaseCredentials
        const credentials = Credentials.fromUsername(user, {
            password: SecretValue.plainText(password),
        })
        const database = new ServerlessCluster(this, 'RdsDatabase', {
            credentials,
            vpc: cluster.vpc,
            defaultDatabaseName: databaseName,
            removalPolicy: RemovalPolicy.DESTROY,
            engine: DatabaseClusterEngine.AURORA_MYSQL,
            enableHttpEndpoint: true,
            vpcSubnets: {
                subnetType: SubnetType.ISOLATED,
            },
            scaling: {
                autoPause: Duration.minutes(5),
                minCapacity: AuroraCapacityUnit.ACU_1,
                maxCapacity: AuroraCapacityUnit.ACU_1,
            },
        })

        /**
         * ECS service
         */
        const { containerPort, image } = serviceTask
        const usersApiService = new ApplicationLoadBalancedEc2Service(this, 'UsersApi', {
            cluster,
            certificate,
            domainZone: hostedZone,
            domainName: `users.${hostedZone.zoneName}`,
            memoryLimitMiB: 128,
            cpu: 512,
            desiredCount: 2,
            redirectHTTP: true,
            taskImageOptions: {
                image,
                environment: {
                    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
                    AWS_REGION: 'eu-west-1',
                    MYSQL_HOST: database.clusterEndpoint.hostname,
                    MYSQL_PORT: '3306',
                    MYSQL_USER: user,
                    MYSQL_PASSWORD: password,
                    MYSQL_DATABASE: databaseName,
                },
                containerPort,
            },
        })
        usersApiService.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '10')
        const scaling = usersApiService.service.autoScaleTaskCount({
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
            targetGroup: usersApiService.targetGroup,
        })

        database.connections.allowFrom(usersApiService.service, Port.tcp(3306))
        usersApiService.service.connections.allowTo(database, Port.tcp(3306))
    }
}
