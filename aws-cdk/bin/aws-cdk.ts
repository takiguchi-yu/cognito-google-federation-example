#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { CognitoGoogleFederationExampleStack } from '../lib/stack/CognitoGoogleFederationExampleStack';
import { devParameter } from '../parameter';

const app = new cdk.App();
new CognitoGoogleFederationExampleStack(app, 'CognitoGoogleFederationExampleStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  tags: {
    Environment: devParameter.envName,
    Repository: devParameter.sourceRepository,
  },
  sourceRepository: devParameter.sourceRepository,
});
