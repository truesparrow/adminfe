import * as React from 'react'

import * as config from './config'

import * as commonText from './common.text'


export function Header() {
    return (
        <div className="header">
            <h1 className="logo-name">
                {commonText.siteName[config.LANG()]}
            </h1>
            <button className="sign-up">
                {commonText.signUp[config.LANG()]}
            </button>
        </div>
    );
}
