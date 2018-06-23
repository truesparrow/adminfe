import * as React from 'react'
import { Helmet } from 'react-helmet'

import * as config from './config'
import * as services from './services'
import { FacebookOpenGraph, TwitterCard } from './web-metadata'

import * as text from './admin-account-page.text'


interface Props {
    location: Location;
}

interface State {
    isClosingAccount: boolean;
}


export class AdminAccountPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isClosingAccount: false
        };
    }

    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/admin/account`;
        return (
            <div className="admin-account-page">
                <Helmet>
                    <title>{text.pageTitle[config.LANG()]}</title>
                    <meta name="description" content={text.pageDescription[config.LANG()]} />
                    <link rel="canonical" href={realLink} />
                </Helmet>
                <FacebookOpenGraph
                    realLink={realLink}
                    title={text.pageTitle[config.LANG()]}
                    description={text.pageDescription[config.LANG()]} />
                <TwitterCard
                    title={text.pageTitle[config.LANG()]}
                    description={text.pageDescription[config.LANG()]} />
                <p className="fill-out-details">
                    {text.fillOut[config.LANG()]}
                </p>
                {this.state.isClosingAccount && <p>{text.closingAccount[config.LANG()]}</p>}
                {!this.state.isClosingAccount && (
                    <div>
                        <button
                            className="sign-up wide"
                            type="button"
                            onClick={_ => this._handleCloseAccount()}>
                            {text.closeAccount[config.LANG()]}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    private async _handleCloseAccount(): Promise<void> {
        if (confirm(text.reallyCloseAccount[config.LANG()])) {
            this.setState({ isClosingAccount: true });

            await services.CONTENT_PRIVATE_CLIENT().deleteEvent(config.SESSION());

            location.assign(config.LOGOUT_ROUTE_PATH);
        }
    }
}
