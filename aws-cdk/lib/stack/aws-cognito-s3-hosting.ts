import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AwsCognitoS3HostingStack extends cdk.Stack {
  userPoolClientSecret: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const uniquePrefix = this.node.tryGetContext('prefix') as string;

    const googleClientId = this.node.tryGetContext('google-client-id') as string;
    const googleClientSecret = this.node.tryGetContext('google-client-secret') as string;

    if (!uniquePrefix) {
      cdk.Annotations.of(this).addError(`The context variable "prefix" is not defined. It is used as a unique prefix for your Cognito User Pool's Hosted UI domain and a few other things in the infrastructure. It needs to be defined and globally unique (just like S3 bucket names).`);
    }

    if (!googleClientId || !googleClientSecret) {
      cdk.Annotations.of(this).addError(`The context variable "google-client-id" or "google-client-secret" are not defined`);
    }

    const userPool = new cognito.UserPool(this, 'UserPool', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const provider = new cognito.UserPoolIdentityProviderGoogle(this, 'Google', {
      clientId: googleClientId,
      clientSecretValue: cdk.SecretValue.unsafePlainText(googleClientSecret),
      userPool: userPool,
      scopes: ['email'],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
      },
    });

    const userPoolDomain = userPool.addDomain('default', {
      cognitoDomain: {
        domainPrefix: uniquePrefix,
      },
    });
  }
}
