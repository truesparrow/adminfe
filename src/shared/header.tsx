import * as React from 'react'

import * as config from './config'

import * as text from './header.text'


export function Header() {
    return (
        <div className="header">
            <h1 className="logo-name">
                {text.logoName[config.LANG()]}
            </h1>
            <button className="sign-up">
                {text.signUp[config.LANG()]}
            </button>
        </div>
    );
}
