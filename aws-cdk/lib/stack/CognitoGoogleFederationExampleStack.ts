import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { BackendAPI } from "../construct/BackendAPI";
import { CognitoUserPool } from "../construct/CognitoUserPool";
import { IamRole } from "../construct/IamRole";
import { ParameterStore } from "../construct/ParameterStore";
import { StaticHosting } from "../construct/StaticHosting";

export interface CognitoGoogleFederationExampleStackProps extends cdk.StackProps {
  sourceRepository: string;
}

export class CognitoGoogleFederationExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CognitoGoogleFederationExampleStackProps) {
    super(scope, id, props);

    const uniquePrefix = this.node.tryGetContext("prefix") as string;
    const googleClientId = this.node.tryGetContext("google-client-id") as string;
    const googleClientSecret = this.node.tryGetContext("google-client-secret") as string;

    if (!uniquePrefix) {
      cdk.Annotations.of(this).addError(`The context variable "prefix" is not defined. It is used as a unique prefix for your Cognito User Pool's Hosted UI domain and a few other things in the infrastructure. It needs to be defined and globally unique (just like S3 bucket names).`);
    }

    if (!googleClientId || !googleClientSecret) {
      cdk.Annotations.of(this).addError(`The context variable "google-client-id" or "google-client-secret" are not defined`);
    }

    // Github Actions から AWS を操作するための Assume Role
    new IamRole(this, "IamRole", {
      account: this.account,
      sourceRepository: props.sourceRepository,
      prefix: uniquePrefix,
    });

    // 静的ホスティング（CloudFront + S3）
    const staticHosting = new StaticHosting(this, "StaticHosting");

    // Sign in with Google（Cognito）
    const userPool = new CognitoUserPool(this, "CognitoUserPool", {
      domainPrefix: uniquePrefix,
      googleClientId: googleClientId,
      googleClientSecret: googleClientSecret,
      distribution: staticHosting.distribution,
    });

    // バックエンドAPI（API Gateway + Lambda）
    new BackendAPI(this, "BackendAPI", {
      region: this.region,
      uniquePrefix: uniquePrefix,
      userPool: userPool.userPool,
      distribution: staticHosting.distribution,
    });

    // パラメータストア
    new ParameterStore(this, "ParameterStore", {
      region: this.region,
      uniquePrefix: uniquePrefix,
      userPoolClient: userPool.userPoolClient,
      distribution: staticHosting.distribution,
    });
  }
}
