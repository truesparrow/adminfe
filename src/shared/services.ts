import * as Rollbar from 'rollbar'


export let ROLLBAR_CLIENT: () => Rollbar;

let rollbarClient: Rollbar | null = null;

ROLLBAR_CLIENT = () => {
    if (rollbarClient == null) {
        throw new Error('Rollbar client not provided');
    }

    return rollbarClient;
};

export function setServices(newRollbarClient: Rollbar): void {
    rollbarClient = newRollbarClient;
}
