### Setting up Google

1. Go to the [Google Developers console](https://console.cloud.google.com/) and create a new project.

[Click here for more info](https://docs.aws.amazon.com/cognito/latest/developerguide/google.html#set-up-google-1.javascript)

<img src="./readme-docs/images/gcp-project.png" width="500px">
<img src="./readme-docs/images/api-and-services.png" width="500px">

### Building AWS

```
npm install
npx cdk deploy \
    --context prefix=[UNIQUE_PREFIX] \
    --context google-client-id=[GOOGLE_CLIENT_ID] \
    --context google-client-secret=[GOOGLE_CLIENT_SECRET]
```
