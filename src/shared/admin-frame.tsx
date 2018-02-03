import * as React from 'react'
import { NavLink, Route, Switch } from 'react-router-dom'

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
            <div className="admin-frame">
                <div className="side-menu">
                    <ul className="side-menu-list">
                        <li>
                            <span className="menu-icon my-cause"></span>
                            <NavLink to="/admin/main">{text.main[config.LANG()]}</NavLink>
                        </li>
                        <li>
                            <span className="menu-icon cause-analytics"></span>
                            <NavLink to="/admin/event">{text.event[config.LANG()]}</NavLink>
                        </li>
                        <li>
                            <span className="menu-icon account"></span>
                            <NavLink to="/admin/account">{text.account[config.LANG()]}</NavLink>
                        </li>
                    </ul>
                </div>
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
