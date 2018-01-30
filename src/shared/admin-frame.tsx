import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AdminAccountPage } from './admin-account-page'
import { AdminEventPage } from './admin-event-page'
import { AdminMainPage } from './admin-main-page'
import * as config from './config'

import * as text from './admin-frame.text'


interface Props {
    location: Location;
    children: React.ReactNode;
}

export class AdminFrame extends React.Component<Props, {}> {
    async componentDidMount() {
        if (!config.SESSION().hasUser()) {
            const auth0LockModule = await import(/* webpackChunkName: "auth0-lock" */ '@truesparrow/auth0-lock');
            const auth0Lock = new auth0LockModule.Auth0Lock(config.ALLOWED_PATHS, config.AUTH0_CLIENT_CONFIG);
            auth0Lock.showLock(this.props.location, false);
        }
    }

    render() {
        if (!config.SESSION().hasUser()) {
            return <div>{text.shouldBeLoggedIn[config.LANG()]}</div>;
        }

        return (
            <div>
                <Switch>
                    <Route exact path="/admin" component={AdminMainPage} />
                    <Route path="/admin/main" component={AdminMainPage} />
                    <Route path="/admin/event" component={AdminEventPage} />
                    <Route path="/admin/account" component={AdminAccountPage} />
                </Switch>
            </div>
        );
    }
}
