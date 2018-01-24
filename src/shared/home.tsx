import * as React from 'react'

import * as config from './config'

import * as commonText from './common.text'
import * as text from './home.text'


export function Pricing() {
    return (
        <div className="pricing">
            <div className="heading">
                <h3 className="main-title">{text.pricing[config.LANG()]}</h3>
                <h4 className="subtitle">{text.pricingSubtitle[config.LANG()]}</h4>
            </div>

            <div className="options">
                <div className="option">
                    <p className="name">{text.quickStarter[config.LANG()]}</p>

                    <p className="price">{text.quickStarterPrice[config.LANG()]}</p>

                    <ul className="features">
                        <li className="feature">✓ {text.unlimitedPhotos[config.LANG()]}</li>
                        <li className="feature">✓ {text.hostedSite[config.LANG()]}</li>
                        <li className="feature">✓ {text.inviteFriends[config.LANG()]}</li>
                        <li className="feature">✓ {text.monthlyInvoice[config.LANG()]}</li>
                    </ul>

                    <button className="sign-up compensate">{commonText.signUp[config.LANG()]}</button>
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

                    <button className="sign-up">{commonText.signUp[config.LANG()]}</button>
                </div>
            </div>
        </div>
    );
}


export function HomePage() {
    return (
        <div>
            {text.homePage[config.LANG()]}
            <Pricing />
        </div>
    );
}
