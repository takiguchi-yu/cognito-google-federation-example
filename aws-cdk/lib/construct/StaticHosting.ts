import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cforigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class StaticHosting extends Construct {
  distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // S3
    const authenticationBucket = new s3.Bucket(this, "AuthenticationBucket", {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Cloudfront
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, "CloudfrontOAI");
    authenticationBucket.grantRead(cloudfrontOAI);
    const origin = new cforigins.S3Origin(authenticationBucket, { originAccessIdentity: cloudfrontOAI });
    this.distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      errorResponses: [
        {
          httpStatus: 404,
          responsePagePath: "/index.html",
          responseHttpStatus: 200,
        },
      ],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: origin,
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });
    new cdk.CfnOutput(this, "CloudfrontURL", { value: `https://${this.distribution.distributionDomainName}` });
  }
}
