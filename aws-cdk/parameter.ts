interface AppParameter {
  envName: string;
  sourceRepository: string;
}

export const devParameter: AppParameter = {
  envName: 'DEV',
  sourceRepository: 'takiguchi-yu/cognito-google-federation-example',
};
