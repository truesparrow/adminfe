import { getNamespace } from 'continuation-local-storage'
import { config } from 'dotenv'

import { Context, Env, parseContext, parseEnv } from '@truesparrow/common-js'
import { getFromEnv } from '@truesparrow/common-server-js'
import {
    Auth0ClientConfig,
    Auth0ServerConfig,
    PathMatch,
    serverToClient,
    Session
} from '@truesparrow/identity-sdk-js'

config({ path: 'config/env.adminfe' });

export const ENV: Env = parseEnv(getFromEnv('ENV'));
export const CONTEXT: Context = parseContext(getFromEnv('CONTEXT'));

export const NAME: string = 'adminfe';
export const HOST: string = getFromEnv('HOST');
export const PORT: number = parseInt(getFromEnv('PORT'), 10);
export const INTERNAL_ORIGIN: string = `http://${HOST}:${PORT}`;
export const EXTERNAL_ORIGIN: string = getFromEnv('EXTERNAL_ORIGIN');

export const IDENTITY_SERVICE_HOST: string = getFromEnv('IDENTITY_SERVICE_HOST');
export const IDENTITY_SERVICE_PORT: number = parseInt(getFromEnv('IDENTITY_SERVICE_PORT'), 10);
export const CONTENT_SERVICE_HOST: string = getFromEnv('CONTENT_SERVICE_HOST');
export const CONTENT_SERVICE_PORT: number = parseInt(getFromEnv('CONTENT_SERVICE_PORT'), 10);
export const SITEFE_EXTERNAL_HOST: string = getFromEnv('SITEFE_EXTERNAL_HOST');

export const AUTH0_SERVER_CONFIG: Auth0ServerConfig = {
    clientId: getFromEnv('AUTH0_CLIENT_ID'),
    clientSecret: getFromEnv('AUTH0_CLIENT_SECRET'),
    domain: getFromEnv('AUTH0_DOMAIN'),
    loginCallbackUri: getFromEnv('AUTH0_LOGIN_CALLBACK_URI')
};
export const AUTH0_CLIENT_CONFIG: Auth0ClientConfig = serverToClient(AUTH0_SERVER_CONFIG);

export const FILESTACK_API_KEY = getFromEnv('FILESTACK_API_KEY');
export const GOOGLE_MAPS_API_KEY = getFromEnv('GOOGLE_MAPS_API_KEY');


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
