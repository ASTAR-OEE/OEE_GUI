const KEYCLOAK_URL = 'https://172.20.105.242/';
export const addonEnvironment = {
  isMobile: true,
  SSO_ENDPOINT: 'https://127.0.0.1:4000/api/auth',
  API_ROOT: 'https://127.0.0.1:4000',
  APP_ROOT: 'https://127.0.0.1:4000',
  TEST_AUTH_FLOW_COMPLETE: false,
  i18n: {
    isSelectionEnabled: false,
    default: 'en',
    supported: [
      {text: 'English', value: 'en'},
      {text: 'Chinese', value: 'cn'}
    ]
  },
  KEYCLOAK_URL: KEYCLOAK_URL + 'auth',
  KEYCLOAK_REALM: 'demo1',
  KEYCLOAK_CLIENT: 'DEMO_CLIENT',
  DEV_TEST_USER: {
    id: 'Dev User 1',
    username: 'devuser1',
    email: 'devuser1@test.com',
    firstName: 'dev',
    lastName: 'user',
    enabled: true,
    emailVerified: true,
    totp: true
  },
};
