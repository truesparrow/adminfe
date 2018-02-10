import * as Rollbar from 'rollbar'

import { ContentPrivateClient } from '@truesparrow/content-sdk-js'


let contentPrivateClient: ContentPrivateClient | null;
let rollbarClient: Rollbar | null = null;

export const CONTENT_PRIVATE_CLIENT: () => ContentPrivateClient = () => {
    if (contentPrivateClient == null) {
        throw new Error('Content private client not provided');
    }

    return contentPrivateClient;
}

export const ROLLBAR_CLIENT: () => Rollbar = () => {
    if (rollbarClient == null) {
        throw new Error('Rollbar client not provided');
    }

    return rollbarClient;
};

export function setServices(newContentPrivateClient: ContentPrivateClient, newRollbarClient: Rollbar): void {
    contentPrivateClient = newContentPrivateClient;
    rollbarClient = newRollbarClient;
}
