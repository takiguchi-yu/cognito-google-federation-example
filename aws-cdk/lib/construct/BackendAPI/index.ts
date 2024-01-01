import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cforigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { GetToken } from "./GetToken/GetToken";
import { GetUser } from "./GetUser/GetUser";
import { Login } from "./Login/Login";

export interface BackendAPIProps {
  region: string;
  uniquePrefix: string;
  userPool: cognito.IUserPool;
  distribution: cloudfront.Distribution;
}
export class BackendAPI extends Construct {
  constructor(scope: Construct, id: string, props: BackendAPIProps) {
    super(scope, id);

    const cognitoUserPoolsAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(this, "CognitoUserPoolsAuthorizer", {
      cognitoUserPools: [props.userPool],
      resultsCacheTtl: cdk.Duration.seconds(0),
    });

    // API Gateway
    const api = new apigateway.RestApi(this, "RestApi", {
      restApiName: "CognitoGoogleFederationExampleRestApi",
      description: "Cognito の Google 認証実装例",
      deployOptions: {
        cacheTtl: cdk.Duration.seconds(0),
        throttlingBurstLimit: 1,
        throttlingRateLimit: 1,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // CloudFront の Origin に API Gateway を追加
    props.distribution.addBehavior("prod/*", new cforigins.HttpOrigin(`${api.restApiId}.execute-api.${props.region}.amazonaws.com`), {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
    });

    new Login(this, "Login", {
      restApi: api,
      path: "/auth/login",
      uniquePrefix: props.uniquePrefix,
    });

    new GetToken(this, "GetToken", {
      restApi: api,
      path: "/auth/token",
      uniquePrefix: props.uniquePrefix,
    });

    new GetUser(this, "GetUser", {
      restApi: api,
      path: "/user",
      uniquePrefix: props.uniquePrefix,
      cognitoUserPoolsAuthorizer: cognitoUserPoolsAuthorizer,
    });
  }
}
