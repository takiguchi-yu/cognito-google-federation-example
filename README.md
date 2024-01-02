## Overview

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend
    participant Cognito
    participant Google
    Frontend->>Backend: /auth/login<br>Request unique login URL (Cognito Hosted UI)
    Backend->>Cognito: /oauth2/authorize<br>Request unique login URL (Cognito Hosted UI)
    Cognito->>Backend: Return unique login URL (Cognito Hosted UI)
    Backend->>Frontend: Return unique login URL (Cognito Hosted UI)
    Frontend->>Cognito: Redirect to login URL (Cognito Hosted UI)
    Cognito->>Cognito: Check internally if user already authenticated with Google account recently
    Cognito->>Google: If authorization expired or never happened,<br/> redirect to Google Hosted UI for authorization.<br/>User enters Google credentials and approves Cognito to read his Google email.
    Google->>Cognito: Internal redirect. <br/>Provisions the Google user to Cognito User Pool and map fields like "email" to Cognito user fields
    Cognito->>Frontend: Redirect with one-time AuthorizationCode in query parameter
    Frontend->>Backend: /auth/token & /user<br />Pass one-time AuthorizationCode<br/>Request long lived credentials (IdToken, AccessToken, RefreshToken)
    Backend->>Cognito: Exchange AuthorizationCode for long lived credentials
    Backend->>Frontend: Return long lived credentials
    Frontend->>Frontend: Store long lived credentials<br/>(Cookie, LocalStorage, IndexedDB, etc)
    Frontend->>Backend: Make calls to authenticated resources using long lived credentials
```

## 技術スタック

- Frontend
  - language: typescript
  - styling: tailwindcss
  - library: react
  - build tool: vite
- Backend
  - language: nodejs(typescript)
- infrastructure
  - AWS

## AWS 環境構築

- [AWS 環境構築](./readme-docs/environment.md)

## 参考情報

- 参考にしたソースコード: https://github.com/awesome-cdk/cognito-google-federation-example
- ユーザープールのフェデレーションエンドポイント: https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/federation-endpoints.html
- ユーザープールにソーシャルサインインを追加する: https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-user-pools-configuring-federation-with-social-idp.html
