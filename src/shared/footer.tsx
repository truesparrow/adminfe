import * as React from 'react'

import * as config from './config'

import * as text from './footer.text'

export function Footer() {
    return <div>
        <p>{text.footer[config.LANG()]}</p>
        <p>{text.copyright[config.LANG()]}</p>
    </div>;
}
