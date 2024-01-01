import * as cdk from "aws-cdk-lib";
import { IDistribution } from "aws-cdk-lib/aws-cloudfront";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export interface CognitoProps {
  domainPrefix: string;
  googleClientId: string;
  googleClientSecret: string;
  distribution: IDistribution;
}

export class CognitoUserPool extends Construct {
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
  userPoolDomain: cognito.UserPoolDomain;

  constructor(scope: Construct, id: string, props: CognitoProps) {
    super(scope, id);

    this.userPool = new cognito.UserPool(this, "UserPool", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const provider = new cognito.UserPoolIdentityProviderGoogle(this, "Google", {
      userPool: this.userPool,
      clientId: props.googleClientId,
      clientSecretValue: cdk.SecretValue.unsafePlainText(props.googleClientSecret),
      scopes: ["email"],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
      },
    });

    this.userPoolDomain = this.userPool.addDomain("Domain", {
      cognitoDomain: {
        domainPrefix: props.domainPrefix,
      },
    });

    this.userPoolClient = this.userPool.addClient("Client", {
      supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.GOOGLE],
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        callbackUrls: ["http://localhost:5173", `https://${props.distribution.distributionDomainName}`],
        logoutUrls: ["http://localhost:5173", `https://${props.distribution.distributionDomainName}`],
      },
      generateSecret: true,
    });
    this.userPoolClient.node.addDependency(provider);
  }
}
