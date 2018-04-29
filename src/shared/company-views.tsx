import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import { Helmet } from 'react-helmet'

import * as config from './config'
import { FacebookOpenGraph } from './web-metadata'

import * as commonText from './common.text'
import * as text from './company-views.text'


interface Props {
}


export class CompanyAboutPage extends React.Component<Props, {}> {
    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/company/about`;
        return (
            <div>
                <Helmet>
                    <title>{text.aboutPageTitle[config.LANG()]}</title>
                    <meta name="description" content={text.aboutPageDescription[config.LANG()]} />
                    <link rel="canonical" href={realLink} />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content={text.aboutPageTitle[config.LANG()]} />
                    <meta name="twitter:description" content={text.aboutPageDescription[config.LANG()]} />
                    <meta name="twitter:creator" content={commonText.siteName[config.LANG()]} />
                    <meta name="twitter:site" content={config.EXTERNAL_ORIGIN} />
                    <meta name="robots" content="index,follow" />
                </Helmet>
                <FacebookOpenGraph
                    realLink={realLink}
                    title={text.aboutPageTitle[config.LANG()]}
                    description={text.aboutPageDescription[config.LANG()]} />
                <ReactMarkdown
                    escapeHtml={true}
                    source={text.about[config.LANG()]} />
            </div>
        );
    }
}


export class CompanyTermsPage extends React.Component<Props, {}> {
    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/company/tos`;
        return (
            <div>
                <Helmet>
                    <title>{text.termsPageTitle[config.LANG()]}</title>
                    <meta name="description" content={text.termsPageDescription[config.LANG()]} />
                    <link rel="canonical" href={realLink} />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content={text.termsPageTitle[config.LANG()]} />
                    <meta name="twitter:description" content={text.termsPageDescription[config.LANG()]} />
                    <meta name="twitter:creator" content={commonText.siteName[config.LANG()]} />
                    <meta name="twitter:site" content={config.EXTERNAL_ORIGIN} />
                    <meta name="robots" content="index,follow" />
                </Helmet>
                <FacebookOpenGraph
                    realLink={realLink}
                    title={text.termsPageTitle[config.LANG()]}
                    description={text.termsPageDescription[config.LANG()]} />
                <ReactMarkdown
                    escapeHtml={true}
                    source={text.terms[config.LANG()]} />
            </div>
        );
    }
}


export class CompanyPrivacyPage extends React.Component<Props, {}> {
    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/company/privacy`;
        return (
            <div>
                <Helmet>
                    <title>{text.privacyPageTitle[config.LANG()]}</title>
                    <meta name="description" content={text.privacyPageDescription[config.LANG()]} />
                    <link rel="canonical" href={realLink} />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content={text.privacyPageTitle[config.LANG()]} />
                    <meta name="twitter:description" content={text.privacyPageDescription[config.LANG()]} />
                    <meta name="twitter:creator" content={commonText.siteName[config.LANG()]} />
                    <meta name="twitter:site" content={config.EXTERNAL_ORIGIN} />
                    <meta name="robots" content="index,follow" />
                </Helmet>
                <FacebookOpenGraph
                    realLink={realLink}
                    title={text.privacyPageTitle[config.LANG()]}
                    description={text.privacyPageDescription[config.LANG()]} />
                <ReactMarkdown
                    escapeHtml={true}
                    source={text.privacy[config.LANG()]} />
            </div>
        );
    }
}


export class CompanyCookiesPage extends React.Component<Props, {}> {
    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/company/cookies`;
        return (
            <div>
                <Helmet>
                    <title>{text.cookiesPageTitle[config.LANG()]}</title>
                    <meta name="description" content={text.cookiesPageDescription[config.LANG()]} />
                    <link rel="canonical" href={realLink} />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content={text.cookiesPageTitle[config.LANG()]} />
                    <meta name="twitter:description" content={text.cookiesPageDescription[config.LANG()]} />
                    <meta name="twitter:creator" content={commonText.siteName[config.LANG()]} />
                    <meta name="twitter:site" content={config.EXTERNAL_ORIGIN} />
                    <meta name="robots" content="index,follow" />
                </Helmet>
                <FacebookOpenGraph
                    realLink={realLink}
                    title={text.cookiesPageTitle[config.LANG()]}
                    description={text.cookiesPageDescription[config.LANG()]} />
                <ReactMarkdown
                    escapeHtml={true}
                    source={text.cookies[config.LANG()]} />
            </div>
        );
    }
}

export class CompanyContactPage extends React.Component<Props, {}> {
    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/company/contact`;
        return (
            <div>
                <Helmet>
                    <title>{text.contactPageTitle[config.LANG()]}</title>
                    <meta name="description" content={text.contactPageDescription[config.LANG()]} />
                    <link rel="canonical" href={realLink} />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content={text.contactPageTitle[config.LANG()]} />
                    <meta name="twitter:description" content={text.contactPageDescription[config.LANG()]} />
                    <meta name="twitter:creator" content={commonText.siteName[config.LANG()]} />
                    <meta name="twitter:site" content={config.EXTERNAL_ORIGIN} />
                    <meta name="robots" content="index,follow" />
                </Helmet>
                <FacebookOpenGraph
                    realLink={realLink}
                    title={text.contactPageTitle[config.LANG()]}
                    description={text.contactPageDescription[config.LANG()]} />
                <ReactMarkdown
                    escapeHtml={true}
                    source={text.contactUs[config.LANG()]} />
            </div>
        );
    }
}
