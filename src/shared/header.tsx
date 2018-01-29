import * as React from 'react'
import { Link } from 'react-router-dom'

import * as config from './config'

import * as commonText from './common.text'


export function Header() {
    return (
        <header className="header">
            <h1 className="logo-name">
                {commonText.siteName[config.LANG()]}
            </h1>
            <Link className="sign-up" to="/admin" role="button">
                {commonText.signUp[config.LANG()]}
            </Link>
        </header>
    );
}
