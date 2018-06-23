import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Event, EventState as EntityEventState } from '@truesparrow/content-sdk-js'
import { User } from '@truesparrow/identity-sdk-js'

import * as config from './config'
import { EventState, OpState } from './store'

import * as commonText from './common.text'
import * as text from './header.text'


interface LoggedInMenuProps {
    chargebeeManageAccountUri: string | null;
}


interface LoggedInMenuState {
    showMenu: boolean;
}


class LoggedInMenu extends React.Component<LoggedInMenuProps, LoggedInMenuState> {
    constructor(props: LoggedInMenuProps) {
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
                                    {this.props.chargebeeManageAccountUri &&
                                        <span>
                                            <span className="menu-icon billing"></span>
                                            <a href={this.props.chargebeeManageAccountUri} target="_blank">{text.billing[config.LANG()]}</a>
                                        </span>
                                    }
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

interface HeaderProps {
    event: Event | null;
    chargebeeManageAccountUri: string | null;
}

interface HeaderState {

}

class _Header extends React.Component<HeaderProps, HeaderState> {
    render() {
        return (
            <header className="header">
                <h1 className="logo-name">
                    <Link className="logo-name-link" to="/" role="button">
                        <img src="/real/client/logo-big.jpg" alt={commonText.siteName[config.LANG()]} />
                    </Link>
                </h1>

                {
                    this.props.event != null &&
                    this.props.event.state == EntityEventState.Active &&
                    <div className="preview">
                        <a
                            className="sign-up"
                            role="button"
                            target="_blank"
                            href={this.props.event.homeUri(config.ENV, config.SITEFE_EXTERNAL_HOST)} >
                            <span>{text.preview[config.LANG()]}</span>
                            <span className="menu-icon open-in-new-tab"></span>
                        </a>
                    </div>
                }

                {
                    config.SESSION().hasUser()
                        ? <LoggedInMenu chargebeeManageAccountUri={this.props.chargebeeManageAccountUri} />
                        : <Link className="sign-up anonymous" to="/admin" role="button">
                            {commonText.signUp[config.LANG()]}
                        </Link>
                }
            </header>
        );
    }
}

function stateToProps(state: any) {
    return {
        event: state.event.type == OpState.Ready || state.event.type == OpState.Preloaded ? state.event.event : null,
        chargebeeManageAccountUri: state.event.type == OpState.Ready || state.event.type == OpState.Preloaded ? state.event.chargebeeManageAccountUri : null
    };
}

function dispatchToProps(_dispatch: (newState: EventState) => void) {
    return {};
}

export const Header = connect(stateToProps, dispatchToProps)(_Header);
