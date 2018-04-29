import * as React from 'react'
import { Helmet } from 'react-helmet'

import * as config from './config'

import * as text from './admin-account-page.text'


export const AdminAccountPage = () =>
    <div>
        <Helmet>
            <title>{text.pageTitle[config.LANG()]}</title>
            <meta name="description" content={text.pageDescription[config.LANG()]} />
            <link rel="canonical" href={`${config.EXTERNAL_ORIGIN}/admin/account`} />
        </Helmet>
        {text.adminAccountPage[config.LANG()]}
    </div>;
