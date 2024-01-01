import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

export const getParameterValue = async (parameterName: string) => {
  const ssmClient = new SSMClient({});

  try {
    const getParamCommand = new GetParameterCommand({
      Name: parameterName,
      WithDecryption: true,
    });
    const response = await ssmClient.send(getParamCommand);
    const parameterValue = response.Parameter?.Value;
    if (!parameterValue) {
      throw new Error(`Can not find SSM parameter with name ${parameterName}`);
    }
    return parameterValue;
  } catch (error) {
    throw new Error(
      `An unexpected error occurred while getting SSM parameter with name ${parameterName}`
    );
  }
};
