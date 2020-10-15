import { Construct, Duration, Stack, StackProps } from '@aws-cdk/core'
import { InstanceType, IVpc, SubnetType } from '@aws-cdk/aws-ec2'
import { Cluster, ICluster } from '@aws-cdk/aws-ecs'
import { Unit } from '@aws-cdk/aws-cloudwatch'
import { NamespaceType } from '@aws-cdk/aws-servicediscovery'

export interface ComputeStackProps extends StackProps {
    vpc: IVpc
}

export class ClusterStack extends Stack {
    public readonly cluster: ICluster

    public constructor(scope: Construct, id: string, { vpc, ...props }: ComputeStackProps) {
        super(scope, id, props)

        const cluster = new Cluster(this, 'Cluster', { vpc })
        cluster.addDefaultCloudMapNamespace({
            name: 'todos.service',
            type: NamespaceType.DNS_PRIVATE,
        })

        const autoScalingGroup = cluster.addCapacity('Default', {
            instanceType: new InstanceType('t3a.nano'),
            minCapacity: 2,
            maxCapacity: 16,
            spotInstanceDraining: true,
            taskDrainTime: Duration.minutes(1),
            spotPrice: '0.002',
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
        })
        autoScalingGroup.scaleToTrackMetric('MemoryTarget', {
            metric: cluster.metricMemoryReservation({
                period: Duration.minutes(1),
                unit: Unit.PERCENT,
                statistic: 'Average',
            }),
            targetValue: 50,
        })
        autoScalingGroup.scaleToTrackMetric('CpuTarget', {
            metric: cluster.metricCpuReservation({
                period: Duration.minutes(1),
                unit: Unit.PERCENT,
                statistic: 'Average',
            }),
            targetValue: 70,
        })

        this.cluster = cluster
    }
}
