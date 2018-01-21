import * as React from 'react'

import * as config from './config'

import * as text from './header.text'


export function Header() {
    return (
        <div className="header">
            {text.header[config.LANG()]}
        </div>
    );
}
