## Overview

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend
    participant Cognito
    participant Google
    Frontend->>Backend: Request unique login URL (Cognito Hosted UI)
    Backend->>Cognito: Request unique login URL (Cognito Hosted UI)
    Cognito->>Backend: Return unique login URL (Cognito Hosted UI)
    Backend->>Frontend: Return unique login URL (Cognito Hosted UI)
    Frontend->>Cognito: Redirect to login URL (Cognito Hosted UI)
    Cognito->>Cognito: Check internally if user already authenticated with Google account recently
    Cognito->>Google: If authorization expired or never happened,<br/> redirect to Google Hosted UI for authorization.<br/>User enters Google credentials and approves Cognito to read his Google email.
    Google->>Cognito: Internal redirect. <br/>Provisions the Google user to Cognito User Pool and map fields like "email" to Cognito user fields
    Cognito->>Frontend: Redirect with one-time AuthorizationCode in query parameter
    Frontend->>Backend: Pass one-time AuthorizationCode<br/>Request long lived credentials (IdToken, AccessToken, RefreshToken)
    Backend->>Cognito: Exchange AuthorizationCode for long lived credentials
    Backend->>Frontend: Return long lived credentials
    Frontend->>Frontend: Store long lived credentials<br/>(Cookie, LocalStorage, IndexedDB, etc)
    Frontend->>Backend: Make calls to authenticated resources using long lived credentials
```

## Technology Stack

- cdk with typescript
- backend nodejs with typescript
- frontend react with typescript

## Getting Started

### Setting up Google

1. Go to the [Google Developers console](https://console.cloud.google.com/) and create a new project.

[Click here for more info](https://docs.aws.amazon.com/cognito/latest/developerguide/google.html#set-up-google-1.javascript)

<img src="./readme-docs/images/gcp-project.png" width="500px">
<img src="./readme-docs/images/api-and-services.png" width="500px">

```
npm install
npx cdk deploy \
    --context prefix=[UNIQUE_PREFIX] \
    --context google-client-id=[GOOGLE_CLIENT_ID] \
    --context google-client-secret=[GOOGLE_CLIENT_SECRET]
```

# Appendix

https://github.com/awesome-cdk/cognito-google-federation-example
