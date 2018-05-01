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
            <meta property="og:type" content="website" />
            <meta property="og:url" content={props.realLink} />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.description} />
            <meta property="og:site_name" content={commonText.siteName[config.LANG()]} />
            <meta property="og:image" content={`${config.EXTERNAL_ORIGIN}/real/client/home-page-hero.jpg`} />
            <meta property="og:image:alt" content={props.description} />
            <meta property="fb:app_id" content={config.FACEBOOK_APP_ID} />
        </Helmet>
    );
}

interface TwitterCardProps {
    title: string;
    description: string;
}

export function TwitterCard(props: TwitterCardProps) {
    return (
        <Helmet>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={props.title} />
            <meta name="twitter:description" content={props.description} />
            <meta name="twitter:creator" content={`${config.SEO_TWITTER_HANDLE}`} />
            <meta name="twitter:site" content={`${config.SEO_TWITTER_HANDLE}`} />
            <meta name="twitter:image" content={`${config.EXTERNAL_ORIGIN}/real/client/home-page-hero.jpg`} />
        </Helmet>
    );
}


interface MicrodataOrganizationProps {
}

export function MicrodataOrganization(_props: MicrodataOrganizationProps) {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'http://schema.org',
                    '@type': 'Organization',
                    'name': config.STYLE_APPLICATION_NAME,
                    'url': config.EXTERNAL_ORIGIN,
                    'logo': `${config.EXTERNAL_ORIGIN}${config.STYLE_LOGO_URI}`,
                    'sameAs': [
                        `https://facebook.com/${config.SEO_FACEBOOK_HANDLE}`,
                        `https://twitter.com/${config.SEO_TWITTER_HANDLE}`
                    ]
                })}
            </script>
        </Helmet>
    );
}

interface MicrodataBreadcrumnsProps {
    items: { url: string, name: string }[]
}

export function MicrodataBreadcrumbs(props: MicrodataBreadcrumnsProps) {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'http://schema.org',
                    '@type': 'BreadcrumbList',
                    'itemListElement': props.items.map((item, index) => {
                        return {
                            '@type': 'ListItem',
                            'position': index + 1,
                            'item': {
                                '@id': item.url,
                                'name': item.name
                            }
                        }
                    })
                })}
            </script>
        </Helmet>
    );
}
