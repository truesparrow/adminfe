import * as React from 'react'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { AdminPage } from './admin'
import * as config from './config'
import { Footer } from './footer'
import { Header } from './header'
import { HomePage } from './home'
import { NotFound } from './not-found'
import { FooState } from './store'

import * as text from './app.text'


export interface Props {
    fooText: string;
}

export interface State {
}

class _App extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{text.pageTitle[config.LANG()]}</title>
                </Helmet>
                <Header />
                <header>
                    <NavLink to="/" exact>{text.home[config.LANG()]}</NavLink>
                    <NavLink to="/admin">{text.admin[config.LANG()]}</NavLink>
                </header>
                <main>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/admin" component={AdminPage} />
                        <Route path="*" component={NotFound} />
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


export const App = withRouter(connect(stateToProps, dispatchToProps)(_App));
