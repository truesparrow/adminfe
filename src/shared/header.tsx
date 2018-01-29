import * as React from 'react'
import { Link } from 'react-router-dom'

import * as config from './config'

import * as commonText from './common.text'
import * as text from './header.text'


export function Header() {
    return (
        <header className="header">
            <h1 className="logo-name">
                {commonText.siteName[config.LANG()]}
            </h1>
            {
                config.SESSION().hasUser()
                ? <a className="sign-up" href={config.LOGOUT_ROUTE_PATH} role="button">
                    {text.logout[config.LANG()]}
                </a>
                : <Link className="sign-up" to="/admin" role="button">
                    {commonText.signUp[config.LANG()]}
                </Link>
            }
        </header>
    );
}
