import { APIGatewayProxyHandler } from "aws-lambda";
import axios from "axios";
import * as querystring from "querystring";
import { getParameterValue } from "../lambdas/shared/getParameterValue";

export const handler: APIGatewayProxyHandler = async (event) => {
  const userPoolClientId = await getParameterValue(`/${String(process.env.PARAMETER_STORE_PREFIX)}/userpool/client_id`);
  const userPoolClientSecret = await getParameterValue(`/${String(process.env.PARAMETER_STORE_PREFIX)}/userpool/client_secret`);
  const userPoolDomainName = await getParameterValue(`/${String(process.env.PARAMETER_STORE_PREFIX)}/userpool/domain_prefix`);
  const userPoolRegion = await getParameterValue(`/${String(process.env.PARAMETER_STORE_PREFIX)}/userpool/region`);
  const redirectUri = await getParameterValue(`/${String(process.env.PARAMETER_STORE_PREFIX)}/userpool/callback_url`);

  try {
    const code = event.queryStringParameters!.code;

    const data = querystring.stringify({
      userPoolClientId,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });
    const authorizationEncoded = Buffer.from(`${userPoolClientId}:${userPoolClientSecret}`).toString("base64");
    const result = await axios.post(`https://${userPoolDomainName}.auth.${userPoolRegion}.amazoncognito.com/oauth2/token`, data, {
      headers: {
        Authorization: `Basic ${authorizationEncoded}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result.data,
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e, null, 2),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  }
};
