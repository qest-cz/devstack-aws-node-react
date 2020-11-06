import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { GatewayVpcEndpointAwsService, SubnetType, Vpc } from '@aws-cdk/aws-ec2'

export class NetworkStack extends Stack {
    public readonly vpc: Vpc

    public constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const vpc = new Vpc(this, 'Vpc', {
            subnetConfiguration: [
                {
                    subnetType: SubnetType.PUBLIC,
                    name: 'Public',
                },
                {
                    subnetType: SubnetType.ISOLATED,
                    name: 'Isolated',
                },
            ],
            maxAzs: 3,
            natGateways: 0,
        })
        vpc.addGatewayEndpoint('S3Endpoint', {
            service: GatewayVpcEndpointAwsService.S3,
        })
        vpc.addGatewayEndpoint('DDBEndpoint', {
            service: GatewayVpcEndpointAwsService.DYNAMODB,
        })

        this.vpc = vpc
    }
}
