import * as React from 'react'
import { Helmet } from 'react-helmet'

import * as config from './config'

import * as commonText from './common.text'


interface FacebookOpenGraphProps {
    realLink: string;
    title: string;
    description: string;
}

export function FacebookOpenGraph(props: FacebookOpenGraphProps) {
    return (
        <Helmet>
            <meta property="og:url" content={props.realLink} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.description} />
            <meta property="og:site_name" content={commonText.siteName[config.LANG()]} />
            <meta property="og:image" content={`${config.EXTERNAL_ORIGIN}/real/client/home-page-hero.jpg`} />
            <meta property="og:locale" content={config.LANG()} />
            <meta property="fb:app_id" content={config.FACEBOOK_APP_ID} />
        </Helmet>
    );
}
