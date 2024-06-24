export const envs = (useGoogleOAuth: boolean) => ({
  NEXTAUTH_URL: 'https://localhost:3000',

  EMAIL_FROM: '',
  EMAIL_SERVER_HOST: '',
  EMAIL_SERVER_PORT: 587,
  EMAIL_SERVER_USER: '',
  EMAIL_SERVER_PASSWORD: '',
  ...(useGoogleOAuth
    ? {
        AUTH_GOOGLE_ID: '',
        AUTH_GOOGLE_SECRET: '',
      }
    : {}),

  AUTH_SECRET: '',

  AUTH_DATABASE_HOST: 'localhost',
  AUTH_DATABASE_PORT: 5432,
  AUTH_DATABASE_NAME: '',
  AUTH_DATABASE_USER: 'postgres',
  AUTH_DATABASE_PASSWORD: 'password',
});

export default function env(envs: Record<string, string | number | undefined>) {
  let envString: string = '';

  for (const key in envs) {
    envString += `${key}='${envs[key]}'\n`;
  }
  return envString;
}
