export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || 'us-east-1_mock',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || 'mockclient',
      signUpVerificationMethod: 'code',
    }
  }
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';