import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Event } from '@truesparrow/content-sdk-js'

import * as config from './config'
import { EventState, OpState } from './store'

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

                    <Link className="sign-up" to="/admin" role="button">
                        {event == null ? commonText.signUp[config.LANG()] : text.goToAdmin[config.LANG()]}
                    </Link>
                </div>

                <div className="hero-image">
                    <img src="https://dummyimage.com/600x400/ede6ed/fff" alt={text.hero[config.LANG()]} />
                </div>
            </div>
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
        return (
            <div>
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
