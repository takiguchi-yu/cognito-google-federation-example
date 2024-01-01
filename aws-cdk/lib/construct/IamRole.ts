import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface IamRoleProps extends cdk.StackProps {
  account: string;
  sourceRepository: string;
  prefix: string;
}

export class IamRole extends Construct {
  constructor(scope: Construct, id: string, props: IamRoleProps) {
    super(scope, id);

    new iam.Role(this, "GithubActionsAssumeRole", {
      roleName: `${props.prefix}-githubactions-assume-role`,
      assumedBy: new iam.WebIdentityPrincipal(
        `arn:aws:iam::${props.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringEquals: {
            ["token.actions.githubusercontent.com:aud"]: "sts.amazonaws.com",
          },
          StringLike: {
            ["token.actions.githubusercontent.com:sub"]: `repo:${props.sourceRepository}:*`,
          },
        }
      ),
    }).addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    );
  }
}
