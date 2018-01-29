import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Auth0Lock } from '@truesparrow/auth0-lock'

import { AdminPage } from './admin'
import * as config from './config'

import * as text from './admin-frame.text'


interface Props {
    location: Location;
    children: React.ReactNode;
}

export class AdminFrame extends React.Component<Props, {}> {
    componentDidMount() {
        if (!config.SESSION().hasUser()) {
            const auth0Lock = new Auth0Lock(config.ALLOWED_PATHS, config.AUTH0_CLIENT_CONFIG);
            auth0Lock.showLock(this.props.location, false);
        }
    }

    render() {
        if (!config.SESSION().hasUser()) {
            return <div>{text.shouldBeLoggedIn[config.LANG()]}</div>;
        } else {
            return (
                <div>
                    <Switch>
                        <Route path="/admin/main" component={AdminPage} />
                    </Switch>
                </div>
            );
        }
    }
}
