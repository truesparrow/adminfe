import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AdminFrame } from './admin-frame'
import {
    CompanyAboutPage,
    CompanyTermsPage,
    CompanyPrivacyPage,
    CompanyCookiesPage,
    CompanyContactPage
} from './company-views'
import { Footer } from './footer'
import { Header } from './header'
import { HomePage } from './home-page'
import { NotFoundPage } from './not-found-page'


export interface Props {
}

export interface State {
}

export class AppFrame extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <Header />
                <main>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/admin" component={AdminFrame} />
                        <Route path="/company/about" component={CompanyAboutPage} />
                        <Route path="/company/tos" component={CompanyTermsPage} />
                        <Route path="/company/privacy" component={CompanyPrivacyPage} />
                        <Route path="/company/cookies" component={CompanyCookiesPage} />
                        <Route path="/company/contact" component={CompanyContactPage} />
                        <Route path="*" component={NotFoundPage} />
                    </Switch>
                </main>
                <Footer />
            </div>
        );
    }
}
