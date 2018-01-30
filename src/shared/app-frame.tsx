import * as React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { AdminFrame } from './admin-frame'
import {
    CompanyAboutPage,
    CompanyTermsPage,
    CompanyPrivacyPage,
    CompanyCookiesPage
} from './company-views'
import * as config from './config'
import { Footer } from './footer'
import { Header } from './header'
import { HomePage } from './home-page'
import { NotFoundPage } from './not-found-page'
import { FooState } from './store'


import * as text from './app-frame.text'


export interface Props {
    fooText: string;
}

export interface State {
}

class _AppFrame extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{text.pageTitle[config.LANG()]}</title>
                </Helmet>
                <Header />
                <main>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/admin" component={AdminFrame} />
                        <Route path="/company/about" component={CompanyAboutPage} />
                        <Route path="/company/tos" component={CompanyTermsPage} />
                        <Route path="/company/privacy" component={CompanyPrivacyPage} />
                        <Route path="/company/cookies" component={CompanyCookiesPage} />
                        <Route path="*" component={NotFoundPage} />
                    </Switch>
                </main>
                <Footer />
            </div>
        );
    }
}


function stateToProps(state: any) {
    return {
        fooText: state.foo.text
    };
}


function dispatchToProps(_dispatch: (newState: FooState) => void) {
    return {};
}


export const AppFrame = withRouter(connect(stateToProps, dispatchToProps)(_AppFrame));
