import * as React from 'react'

import * as config from './config'

import * as text from './header.text'


export function Header() {
    return <div>{text.header[config.LANG()]}</div>;
}
