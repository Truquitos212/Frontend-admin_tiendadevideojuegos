// Configuracion de Cognito (pool de PERSONAL) leida desde el archivo .env
export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      loginWith: { email: true },
    },
  },
};

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';