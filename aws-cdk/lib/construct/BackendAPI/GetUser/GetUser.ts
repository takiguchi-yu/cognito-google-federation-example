import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as path from "path";

export interface GetUserProps {
  restApi: apigateway.IRestApi;
  path: string;
  uniquePrefix: string;
  cognitoUserPoolsAuthorizer: apigateway.CognitoUserPoolsAuthorizer;
}

export class GetUser extends Construct {
  constructor(scope: Construct, id: string, props: GetUserProps) {
    super(scope, id);

    const getUserFunction = new nodejs.NodejsFunction(this, "NodejsFunction", {
      description: "Google ユーザー情報取得処理実装例",
      entry: path.resolve(__dirname, "GetUser.lambda.ts"),
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      logRetention: logs.RetentionDays.ONE_WEEK,
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ["ssm:getParameter"],
          resources: ["*"],
        }),
      ],
      bundling: {
        minify: true,
      },
      environment: {
        PARAMETER_STORE_PREFIX: props.uniquePrefix,
      },
    });

    props.restApi.root.resourceForPath(props.path).addMethod("GET", new apigateway.LambdaIntegration(getUserFunction), {
      authorizer: props.cognitoUserPoolsAuthorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
  }
}
