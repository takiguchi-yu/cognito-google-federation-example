import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

export interface ParameterStoreProps {
  region: string;
  uniquePrefix: string;
  userPoolClient: cognito.IUserPoolClient;
  distribution: cloudfront.IDistribution;
}

export class ParameterStore extends Construct {
  constructor(scope: Construct, id: string, props: ParameterStoreProps) {
    super(scope, id);

    new ssm.StringParameter(this, "UserPoolClientId", {
      parameterName: `/${props.uniquePrefix}/userpool/client_id`,
      stringValue: props.userPoolClient.userPoolClientId,
    });
    new ssm.StringParameter(this, "UserPoolClientSecret", {
      parameterName: `/${props.uniquePrefix}/userpool/client_secret`,
      stringValue: props.userPoolClient.userPoolClientSecret.unsafeUnwrap(),
    });
    new ssm.StringParameter(this, "UserPoolDomainPrefix", {
      parameterName: `/${props.uniquePrefix}/userpool/domain_prefix`,
      stringValue: props.uniquePrefix,
    });
    new ssm.StringParameter(this, "UserPoolRegion", {
      parameterName: `/${props.uniquePrefix}/userpool/region`,
      stringValue: props.region,
    });
    new ssm.StringParameter(this, "UserPoolClientCallbackURL", {
      parameterName: `/${props.uniquePrefix}/userpool/callback_url`,
      stringValue: `https://${props.distribution.distributionDomainName}`,
    });
  }
}
