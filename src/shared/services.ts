import * as Rollbar from 'rollbar'

import { ContentPrivateClient } from '@truesparrow/content-sdk-js'

import { FileStorageClient } from './file-storage-client'


let contentPrivateClient: ContentPrivateClient | null;
let fileStorageClient: FileStorageClient | null;
let rollbarClient: Rollbar | null = null;

export const CONTENT_PRIVATE_CLIENT: () => ContentPrivateClient = () => {
    if (contentPrivateClient == null) {
        throw new Error('Content private client not provided');
    }

    return contentPrivateClient;
}

export const FILE_STORAGE_CLIENT: () => FileStorageClient = () => {
    if (fileStorageClient == null) {
        throw new Error('File storage client not provided');
    }

    return fileStorageClient;
}

export const ROLLBAR_CLIENT: () => Rollbar = () => {
    if (rollbarClient == null) {
        throw new Error('Rollbar client not provided');
    }

    return rollbarClient;
};

export function setServices(
    newContentPrivateClient: ContentPrivateClient,
    newFileStorageClient: FileStorageClient,
    newRollbarClient: Rollbar
): void {
    contentPrivateClient = newContentPrivateClient;
    fileStorageClient = newFileStorageClient;
    rollbarClient = newRollbarClient;
}
