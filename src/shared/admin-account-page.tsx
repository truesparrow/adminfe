import * as React from 'react'
import { Helmet } from 'react-helmet'

import * as config from './config'
import { FacebookOpenGraph } from './web-metadata'

import * as text from './admin-account-page.text'


export const AdminAccountPage = () => {
    const realLink = `${config.EXTERNAL_ORIGIN}/admin/account`;
    return (<div>
        <Helmet>
            <title>{text.pageTitle[config.LANG()]}</title>
            <meta name="description" content={text.pageDescription[config.LANG()]} />
            <link rel="canonical" href={realLink} />
        </Helmet>
        <FacebookOpenGraph
            realLink={realLink}
            title={text.pageTitle[config.LANG()]}
            description={text.pageDescription[config.LANG()]} />
        {text.adminAccountPage[config.LANG()]}
    </div>);
}
