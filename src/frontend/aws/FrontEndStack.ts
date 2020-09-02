import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { BucketDeployment, CacheControl, ISource } from '@aws-cdk/aws-s3-deployment'
import { Bucket } from '@aws-cdk/aws-s3'
import { WebsiteBucket } from '../../common/aws/constructs/WebsiteBucket'

export interface FrontEndStackProps extends StackProps {
    sourceAsset: ISource
}

export class FrontEndStack extends Stack {
    public readonly websiteBucket: Bucket

    public constructor(scope: Construct, id: string, { sourceAsset, ...props }: FrontEndStackProps) {
        super(scope, id, props)

        const websiteBucket = new WebsiteBucket(this, 'WebsiteBucket', { removalPolicy: RemovalPolicy.DESTROY })

        new BucketDeployment(this, 'DeployWebsite', {
            sources: [sourceAsset],
            destinationBucket: websiteBucket,
            cacheControl: [CacheControl.noCache(), CacheControl.mustRevalidate()],
        })

        this.websiteBucket = websiteBucket
    }
}
