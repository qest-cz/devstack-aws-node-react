import { CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { BucketDeployment, CacheControl, ISource } from '@aws-cdk/aws-s3-deployment'
import { Bucket } from '@aws-cdk/aws-s3'
import { WebsiteBucket } from '../constructs/WebsiteBucket'
import { S3File } from '../constructs/S3File/S3File'

export interface FrontEndStackProps extends StackProps {
    sourceAsset: ISource
    apiBaseUrl: string
}

export class FrontEndStack extends Stack {
    public readonly websiteBucket: Bucket

    public constructor(
        scope: Construct,
        id: string,
        { sourceAsset, apiBaseUrl, ...props }: FrontEndStackProps,
    ) {
        super(scope, id, props)

        const websiteBucket = new WebsiteBucket(this, 'WebsiteBucket', {
            removalPolicy: RemovalPolicy.DESTROY,
        })

        new BucketDeployment(this, 'DeployWebsite', {
            sources: [sourceAsset],
            prune: false,
            destinationBucket: websiteBucket,
            cacheControl: [CacheControl.noCache(), CacheControl.mustRevalidate()],
        })

        new S3File(this, 'Config', {
            bucket: websiteBucket,
            contents: `var Conf = ${JSON.stringify({
                apiBaseUrl,
            })}`,
            objectKey: 'config.js',
            public: true,
            contentType: 'application/javascript',
        })

        this.websiteBucket = websiteBucket

        new CfnOutput(this, 'WebsiteUrl', { value: websiteBucket.bucketWebsiteUrl })
    }
}
