import { MarshalFrom } from 'raynor'

import { Context, Env } from '@truesparrow/common-js'
import { Auth0ClientConfig, PathMatch, Session } from '@truesparrow/identity-sdk-js'

import { ClientConfig } from '../shared/client-data'


const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();

const clientConfig = clientConfigMarshaller.extract((window as any).__TRUESPARROW_CLIENT_CONFIG);
delete (window as any).__TRUESPARROW_CLIENT_CONFIG;


export const ENV: Env = clientConfig.env;
export const CONTEXT: Context = Context.Client;
export const NAME: string = 'adminfe';
export const INTERNAL_ORIGIN: string = clientConfig.internalOrigin;
export const EXTERNAL_ORIGIN: string = clientConfig.externalOrigin;
export const SEO_TWITTER_HANDLE: string = clientConfig.seoTwitterHandle;
export const CONTACT_EMAIL: string = clientConfig.contactEmail;
export const DEMO_SITE_URI: string = clientConfig.demoSiteUri;
export const STYLE_APPLICATION_NAME: string = clientConfig.styleApplicationName;

export const CONTENT_SERVICE_HOST: string = clientConfig.contentServiceHost;
export const CONTENT_SERVICE_PORT: number = clientConfig.contentServicePort;
export const SITEFE_EXTERNAL_HOST: string = clientConfig.siteFeExternalHost;

export const AUTH0_CLIENT_CONFIG: Auth0ClientConfig = {
    clientId: clientConfig.auth0ClientId,
    domain: clientConfig.auth0Domain,
    loginCallbackUri: clientConfig.auth0LoginCallbackUri,
    styleApplicationName: clientConfig.styleApplicationName,
    styleLogoUri: clientConfig.styleLogoUri,
    stylePrimaryColor: clientConfig.stylePrimaryColor
};

export const FACEBOOK_APP_ID: string = clientConfig.facebookAppId;
export const GOOGLE_ANALYTICS_ACCOUNT_ID: string = clientConfig.googleAnalyticsAccountId;
export const FILESTACK_API_KEY: string = clientConfig.fileStackApiKey;
export const ROLLBAR_CLIENT_TOKEN: string | null = clientConfig.rollbarClientToken;

export const ALLOWED_PATHS: PathMatch[] = clientConfig.allowedPaths;
export const LOGOUT_ROUTE_PATH: string = clientConfig.logoutRoutePath;

// * Per-session "globals".

export const SESSION: () => Session = () => clientConfig.session;
export const LANG: () => string = () => clientConfig.language;
