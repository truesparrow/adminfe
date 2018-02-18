import * as React from 'react'
import { Link } from 'react-router-dom'

import { User } from '@truesparrow/identity-sdk-js'

import * as config from './config'

import * as commonText from './common.text'
import * as text from './header.text'




interface Props {
}


interface State {
    showMenu: boolean;
}


class LoggedInMenu extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showMenu: false
        };
    }

    render() {
        const user = config.SESSION().user as User;

        if (this.state.showMenu) {
            return (
                <div className="logged-in-menu">
                    <div id="overlay-menu">
                        <div className="container1">
                            <div className="container2">
                                <div className="actions">
                                    <span>
                                        <span className="menu-icon main"></span>
                                        <Link
                                            onClick={_ => this._handleCloseMenu()}
                                            to="/admin/main">
                                            {text.aboutUs[config.LANG()]}
                                        </Link>
                                    </span>
                                    <span>
                                        <span className="menu-icon event"></span>
                                        <Link
                                            onClick={_ => this._handleCloseMenu()}
                                            to="/admin/event">
                                            {text.event[config.LANG()]}
                                        </Link>
                                    </span>
                                    <span>
                                        <span className="menu-icon site"></span>
                                        <Link
                                            onClick={_ => this._handleCloseMenu()}
                                            to="/admin/site">
                                            {text.site[config.LANG()]}
                                        </Link>
                                    </span>
                                    <span>
                                        <span className="menu-icon account"></span>
                                        <Link
                                            onClick={_ => this._handleCloseMenu()}
                                            to="/admin/account">
                                            {text.account[config.LANG()]}
                                        </Link>
                                    </span>
                                </div>
                                <div>
                                    <button
                                        className="menu-open"
                                        onClick={_ => this._handleCloseMenu()}>
                                    </button>
                                </div>
                            </div>
                            <a className="sign-up logout" href={config.LOGOUT_ROUTE_PATH} role="button">
                                {text.logout[config.LANG()]}
                            </a>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="logged-in-menu">
                    <img className="avatar" src={user.pictureUri} alt={text.avatar[config.LANG()]} />
                    <button
                        className="menu-closed"
                        onClick={this._handleOpenMenu.bind(this)}>
                    </button>
                </div>
            );
        }
    }

    private _handleOpenMenu() {
        this.setState({ showMenu: true });
    }

    private _handleCloseMenu() {
        this.setState({ showMenu: false });
    }
}

export function Header() {
    return (
        <header className="header">
            <h1 className="logo-name">
                {commonText.siteName[config.LANG()]}
            </h1>
            {
                config.SESSION().hasUser()
                    ? <LoggedInMenu />
                    : <Link className="sign-up" to="/admin" role="button">
                        {commonText.signUp[config.LANG()]}
                    </Link>
            }
        </header>
    );
}
