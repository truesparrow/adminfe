import * as React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Event } from '@truesparrow/content-sdk-js'

import * as config from './config'
import { EventState, OpState } from './store'
import { FacebookOpenGraph, TwitterCard } from './web-metadata'

import * as commonText from './common.text'
import * as text from './home-page.text'

interface HeroProps {
    event: Event | null;
}


export class Hero extends React.Component<HeroProps, {}> {
    render() {
        const { event } = this.props;

        return (
            <div className="hero">
                <div className="cta">
                    <p className="big-title">{text.bigTitle[config.LANG()]}</p>

                    <p className="subtitle">{text.subTitle[config.LANG()]}</p>

                    <div className="cta-buttons">
                        <Link className="sign-up" to="/admin" role="button">
                            {event == null ? commonText.signUp[config.LANG()] : text.goToAdmin[config.LANG()]}
                        </Link>

                        <a className="sign-up" href={config.DEMO_SITE_URI} target="_blank" role="button">
                            {text.demo[config.LANG()]}
                        </a>
                    </div>
                </div>

                <div className="hero-image">
                    <img src="/real/client/home-page-hero.jpg" alt={text.hero[config.LANG()]} />


                    <a
                        className="hero-image-author"
                        href="https://unsplash.com/@bridgetkathleen?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={text.heroAuthorLink[config.LANG()]} >
                        <span style={{ 'display': 'inline-block', 'padding': '2px 3px' }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    'height': '12px',
                                    'width': 'auto',
                                    'position': 'relative',
                                    'verticalAlign': 'middle',
                                    'top': '-1px',
                                    'fill': 'white'
                                }}
                                viewBox="0 0 32 32" >
                                <title>unsplash-logo</title>
                                <path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path>
                            </svg>
                        </span>
                        <span style={{ 'display': 'inline-block', 'padding': '2px 3px' }}>
                            {text.heroAuthorName[config.LANG()]}
                        </span>
                    </a>
                </div>
            </div >
        );
    }
}


export function Features() {
    return (
        <div className="features">
            <div className="heading">
                <h3 className="main-title">{text.features[config.LANG()]}</h3>
                <h4 className="subtitle">{text.featuresSubtitle[config.LANG()]}</h4>
            </div>

            <div className="feature-set">
                <div className="feature">
                    <p className="name">{text.easyToUse[config.LANG()]}</p>
                    <p className="description">{text.easyToUseDesc[config.LANG()]}</p>
                </div>

                <div className="feature">
                    <p className="name">{text.galleries[config.LANG()]}</p>
                    <p className="description">{text.galleriesDesc[config.LANG()]}</p>
                </div>

                <div className="feature">
                    <p className="name">{text.inviteFriends[config.LANG()]}</p>
                    <p className="description">{text.inviteFriendsDesc[config.LANG()]}</p>
                </div>
            </div>
        </div>
    );
}


export function Pricing() {
    return (
        <div className="pricing">
            <div className="heading">
                <h3 className="main-title">{text.pricing[config.LANG()]}</h3>
                <h4 className="subtitle">{text.pricingSubtitle[config.LANG()]}</h4>
            </div>

            <div className="option-set">
                <div className="option">
                    <p className="name">{text.quickStarter[config.LANG()]}</p>

                    <p className="price">{text.quickStarterPrice[config.LANG()]}</p>

                    <ul className="features">
                        <li className="feature">✓ {text.unlimitedPhotos[config.LANG()]}</li>
                        <li className="feature">✓ {text.hostedSite[config.LANG()]}</li>
                        <li className="feature">✓ {text.inviteFriends[config.LANG()]}</li>
                        <li className="feature">✓ {text.monthlyInvoice[config.LANG()]}</li>
                    </ul>

                    <Link className="sign-up compensate" to="/admin" role="button">{commonText.signUp[config.LANG()]}</Link>
                </div>

                <div className="option">
                    <p className="name">{text.longTermThinker[config.LANG()]}</p>

                    <p className="price">{text.longTermThinkerPrice[config.LANG()]}</p>

                    <ul className="features">
                        <li className="feature">✓ {text.unlimitedPhotos[config.LANG()]}</li>
                        <li className="feature">✓ {text.hostedSite[config.LANG()]}</li>
                        <li className="feature">✓ {text.inviteFriends[config.LANG()]}</li>
                        <li className="feature">✓ {text.yearlyInvoice[config.LANG()]}</li>
                        <li className="feature">✓ <em>{text.save20Pc[config.LANG()]}</em></li>
                    </ul>

                    <Link className="sign-up" to="/admin" role="button">{commonText.signUp[config.LANG()]}</Link>
                </div>
            </div>
        </div>
    );
}


interface HomePageProps {
    event: Event | null;
}

interface HomePageState {
}


class _HomePage extends React.Component<HomePageProps, HomePageState> {
    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/`;

        return (
            <div>
                <Helmet>
                    <title>{text.homePageTitle[config.LANG()]}</title>
                    <meta name="description" content={text.homePageDescription[config.LANG()]} />
                    <link rel="canonical" href={realLink} />
                    <meta name="robots" content="index,follow" />

                </Helmet>
                <FacebookOpenGraph
                    realLink={realLink}
                    title={text.homePageTitle[config.LANG()]}
                    description={text.homePageDescription[config.LANG()]} />
                <TwitterCard
                    title={text.homePageTitle[config.LANG()]}
                    description={text.homePageDescription[config.LANG()]} />
                <Hero event={this.props.event} />
                <Features />
                <Pricing />
            </div>
        );
    }
}

function stateToProps(state: any) {
    return {
        event: state.event.type == OpState.Ready || state.event.type == OpState.Preloaded ? state.event.event : null
    };
}

function dispatchToProps(_dispatch: (newState: EventState) => void) {
    return {};
}

export const HomePage = connect(stateToProps, dispatchToProps)(_HomePage);
