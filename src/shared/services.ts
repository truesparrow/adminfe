import * as Rollbar from 'rollbar'

import {
    ApiGatewayWebFetcher,
    isOnServer,
    envToString
} from '@truesparrow/common-js'
import { ContentPrivateClient, newContentPrivateClient } from '@truesparrow/content-sdk-js'

import * as config from './config'


const webFetcher = new ApiGatewayWebFetcher(config.ORIGIN);

const contentPrivateClient = newContentPrivateClient(
    config.ENV, config.ORIGIN, `${config.CONTENT_SERVICE_HOST}:${config.CONTENT_SERVICE_PORT}`, webFetcher);

const rollbarClient = new Rollbar({
    accessToken: 'FAKE_TOKEN_WONT_BE_USED_IN_LOCAL_OR_TEST',
    logLevel: 'warning',
    reportLevel: 'warning',
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: isOnServer(config.ENV),
    payload: {
        // TODO: fill in the person field!
        serviceName: config.NAME,
        environment: envToString(config.ENV)
    }
});

export function CONTENT_PRIVATE_CLIENT(): ContentPrivateClient {
    return contentPrivateClient;
}

export async function AUTH0_LOCK() /* : Promise<Auth0Lock> */ {
    const auth0LockModule = await import(/* webpackChunkName: "auth0-lock" */ '@truesparrow/auth0-lock');
    return new auth0LockModule.Auth0Lock(config.ALLOWED_PATHS, config.AUTH0_CLIENT_CONFIG);
}

export async function FILE_STACK_CLIENT() /* : Promise<FileStackPicker> */ {
    const fileStackPickerModule = await import(/* webpackChunkName: "filestack-picker" */ '@truesparrow/filestack-picker');
    return new fileStackPickerModule.FileStackPicker(config.FILESTACK_API_KEY);
}

export function ROLLBAR_CLIENT(): Rollbar {
    return rollbarClient;
};
