#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AwsCognitoS3HostingStack } from '../lib/stack/aws-cognito-s3-hosting';

const app = new cdk.App();
new AwsCognitoS3HostingStack(app, 'AwsCognitoS3HostingStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
