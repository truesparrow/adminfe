import { getNamespace } from 'continuation-local-storage'
import { config } from 'dotenv'

import { Context, Env, parseContext, parseEnv, isOnServer } from '@truesparrow/common-js'
import { getFromEnv } from '@truesparrow/common-server-js'
import {
    Auth0ClientConfig,
    Auth0ServerConfig,
    PathMatch,
    serverToClient,
    Session
} from '@truesparrow/identity-sdk-js'

config();

// Common to all services

export const ENV: Env = parseEnv(getFromEnv('COMMON_ENV'));
export const CONTEXT: Context = parseContext(getFromEnv('COMMON_CONTEXT'));

export const IDENTITY_SERVICE_HOST: string = getFromEnv('COMMON_IDENTITY_SERVICE_HOST');
export const CONTENT_SERVICE_HOST: string = getFromEnv('COMMON_CONTENT_SERVICE_HOST');
export const SITEFE_EXTERNAL_HOST: string = getFromEnv('COMMON_SITEFE_EXTERNAL_HOST');

export const FILESTACK_API_KEY = getFromEnv('COMMON_FILESTACK_API_KEY');
export const GOOGLE_MAPS_API_KEY = getFromEnv('COMMON_GOOGLE_MAPS_API_KEY');
export const LOGGLY_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('COMMON_LOGGLY_TOKEN') : null;
export const LOGGLY_SUBDOMAIN: string | null = isOnServer(ENV) ? getFromEnv('COMMON_LOGGLY_SUBDOMAIN') : null;
export const ROLLBAR_SERVER_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('COMMON_ROLLBAR_SERVER_TOKEN') : null;
export const ROLLBAR_CLIENT_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('COMMON_ROLLBAR_CLIENT_TOKEN') : null;

// Specific to adminfe service

export const NAME: string = 'adminfe';
export const ADDRESS: string = getFromEnv('ADMINFE_ADDRESS');
export const PORT: number = parseInt(getFromEnv('ADMINFE_PORT'), 10);
export const ORIGIN: string = getFromEnv('ADMINFE_ORIGIN');

export const AUTH0_SERVER_CONFIG: Auth0ServerConfig = {
    clientId: getFromEnv('ADMINFE_AUTH0_CLIENT_ID'),
    clientSecret: getFromEnv('ADMINFE_AUTH0_CLIENT_SECRET'),
    domain: getFromEnv('ADMINFE_AUTH0_DOMAIN'),
    loginCallbackUri: getFromEnv('ADMINFE_AUTH0_LOGIN_CALLBACK_URI')
};
export const AUTH0_CLIENT_CONFIG: Auth0ClientConfig = serverToClient(AUTH0_SERVER_CONFIG);

export const CLS_NAMESPACE_NAME: string = 'truesparrow.request';
export const ALLOWED_PATHS: PathMatch[] = [
    { path: '/', mode: 'full' },
    { path: '/admin', mode: 'full' },
    { path: '/admin/', mode: 'prefix' }
];
export const LOGOUT_ROUTE_PATH: string = '/real/auth0-auth-flow/logout';

// * Per-session "globals".

export const SESSION: () => Session = () => {
    const namespace = getNamespace(CLS_NAMESPACE_NAME);
    const session = namespace.get('SESSION');
    return session;
};
export const LANG: () => string = () => {
    const namespace = getNamespace(CLS_NAMESPACE_NAME);
    const lang = namespace.get('LANG');
    return lang;
};
