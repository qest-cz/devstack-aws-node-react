import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { HostedZone, IHostedZone } from '@aws-cdk/aws-route53'
import { DnsValidatedCertificate, ICertificate } from '@aws-cdk/aws-certificatemanager'

export interface EnvironmentStackProps extends StackProps {
    hzName: string
}

export class EnvironmentStack extends Stack {
    public readonly hostedZone: IHostedZone
    public readonly certificate: ICertificate

    public constructor(scope: Construct, id: string, { hzName, ...props }: EnvironmentStackProps) {
        super(scope, id, props)

        const hostedZone = new HostedZone(this, 'HostedZone', { zoneName: hzName })
        const certificate = new DnsValidatedCertificate(this, 'Certificate', {
            hostedZone,
            domainName: hzName,
            subjectAlternativeNames: [`*.${hzName}`],
        })

        this.hostedZone = hostedZone
        this.certificate = certificate
    }
}
