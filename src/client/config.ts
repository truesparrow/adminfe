import { MarshalFrom } from 'raynor'

import { Env } from '@truesparrow/common-js'
import { Auth0ClientConfig, PathMatch } from '@truesparrow/identity-sdk-js'

import { ClientConfig } from '../shared/client-data'


const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();

const clientConfig = clientConfigMarshaller.extract((window as any).__TRUESPARROW_CLIENT_CONFIG);
delete (window as any).__TRUESPARROW_CLIENT_CONFIG;


export const NAME: string = 'adminfe';
export const ALLOWED_PATHS: PathMatch[] = clientConfig.allowedPaths;
export const LOGOUT_ROUTE_PATH: string = clientConfig.logoutRoutePath;
export const ENV: Env = clientConfig.env;
export const ORIGIN: string = clientConfig.origin;
export const AUTH0_CLIENT_CONFIG: Auth0ClientConfig = {
    clientId: clientConfig.auth0ClientId,
    domain: clientConfig.auth0Domain,
    loginCallbackUri: clientConfig.auth0LoginCallbackUri
};

export const ROLLBAR_CLIENT_TOKEN: string | null = clientConfig.rollbarClientToken;
export const SESSION = () => clientConfig.session;
export const LANG = () => clientConfig.language;
