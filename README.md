# 🛠️ GamingStore: Panel de administración

Panel para el **personal** de GamingStore. Permite gestionar el catálogo de videojuegos (crear, editar y eliminar). El acceso está protegido con un user pool de **Amazon Cognito** separado del de clientes.

Proyecto de la asignatura **Desarrollo Cloud Native I (DSY1107)**, DuocUC.

## Stack

- React + Vite
- AWS Amplify (Auth) + `@aws-amplify/ui-react`
- Amazon Cognito (user pool de personal)
- API REST en Spring Boot detrás de API Gateway con authorizer JWT

## Funcionalidades

- Login del personal con Cognito
- CRUD de videojuegos:
  - `GET /api/videojuegos`
  - `POST /api/videojuegos`
  - `PUT /api/videojuegos/{id}`
  - `DELETE /api/videojuegos/{id}`
- Cada request lleva el token JWT de la sesión

Repo relacionado: [frontend de la tienda](https://github.com/Truquitos212/Claud_Nativo1_Front_End_GamingStore)

## Cómo correrlo

```bash
npm install
cp .env.example .env   # completar con los datos del user pool de personal y la API
npm run dev
```

| Variable | Descripción |
|---|---|
| `VITE_COGNITO_USER_POOL_ID` | ID del user pool de personal |
| `VITE_COGNITO_CLIENT_ID` | ID del app client |
| `VITE_API_URL` | URL base de la API |
