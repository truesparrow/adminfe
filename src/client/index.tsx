import { MarshalFrom } from 'raynor'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import * as Rollbar from 'rollbar'

import {
    ApiGatewayWebFetcher,
    isOnServer,
    envToString
} from '@truesparrow/common-js'
import { newContentPrivateClient } from '@truesparrow/content-sdk-js'

import * as config from './config'
import './index.less'
import { AppFrame } from '../shared/app-frame'
import { ClientInitialState } from '../shared/client-data'
import * as services from '../shared/services'
import { createStoreFromInitialState, reducers } from '../shared/store'

const clientInitialStateMarshaller = new (MarshalFrom(ClientInitialState))();

const webFetcher = new ApiGatewayWebFetcher(config.ORIGIN);

const contentPrivateClient = newContentPrivateClient(
    config.ENV, config.ORIGIN, config.CONTENT_SERVICE_HOST, webFetcher);

const rollbar = new Rollbar({
    accessToken: isOnServer(config.ENV) ? (config.ROLLBAR_CLIENT_TOKEN as string) : 'FAKE_TOKEN_WONT_BE_USED_IN_LOCAL_OR_TEST',
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

services.setServices(contentPrivateClient, rollbar);

const clientInitialState = clientInitialStateMarshaller.extract((window as any).__TRUESPARROW_CLIENT_INITIAL_STATE);
delete (window as any).__TRUESPARROW_INITIAL_STATE;

const store = createStoreFromInitialState(reducers, clientInitialState);

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <AppFrame />
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
