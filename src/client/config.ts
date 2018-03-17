import { MarshalFrom } from 'raynor'

import { Context, Env } from '@truesparrow/common-js'
import { Auth0ClientConfig, PathMatch, Session } from '@truesparrow/identity-sdk-js'

import { ClientConfig } from '../shared/client-data'


const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();

const clientConfig = clientConfigMarshaller.extract((window as any).__TRUESPARROW_CLIENT_CONFIG);
delete (window as any).__TRUESPARROW_CLIENT_CONFIG;

// Common to all services

export const ENV: Env = clientConfig.env;
export const CONTEXT: Context = Context.Client;

export const SITEFE_EXTERNAL_HOST: string = clientConfig.siteFeExternalHost;
export const CONTENT_SERVICE_HOST: string = clientConfig.contentServiceHost;

export const FILESTACK_API_KEY: string = clientConfig.fileStackApiKey;
export const ROLLBAR_CLIENT_TOKEN: string | null = clientConfig.rollbarClientToken;

// Specific to adminfe service

export const NAME: string = 'adminfe';
export const ORIGIN: string = clientConfig.origin;

export const AUTH0_CLIENT_CONFIG: Auth0ClientConfig = {
    clientId: clientConfig.auth0ClientId,
    domain: clientConfig.auth0Domain,
    loginCallbackUri: clientConfig.auth0LoginCallbackUri
};

export const ALLOWED_PATHS: PathMatch[] = clientConfig.allowedPaths;
export const LOGOUT_ROUTE_PATH: string = clientConfig.logoutRoutePath;

// * Per-session "globals".

export const SESSION: () => Session = () => clientConfig.session;
export const LANG: () => string = () => clientConfig.language;
