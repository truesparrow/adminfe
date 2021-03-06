import * as React from 'react'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import * as qs from 'query-string'

import { Event, EventPlan, UpdateEventOptions } from '@truesparrow/content-sdk-js'

import { AdminAccountPage } from './admin-account-page'
import { AdminEventPage } from './admin-event-page'
import { AdminMainPage } from './admin-main-page'
import { EventSetupWizard } from './event-setup-wizard'
import { AdminSitePage } from './admin-site-page'
import * as config from './config'
import * as services from './services'
import { EventState, OpState, StatePart } from './store'

import * as text from './admin-frame.text'
import * as commonText from './common.text'


interface Props {
    location: Location;
    isPreloaded: boolean;
    isLoading: boolean;
    isReady: boolean;
    isFailed: boolean;
    eventIsDeleted: boolean;
    event: Event | null;
    chargebeeManageAccountUri?: string;
    errorMessage: string | null;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null, chargebeeManageAccountUri?: string) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
}

class _AdminFrame extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
        if (!config.SESSION().hasUser()) {
            const auth0Lock = await services.AUTH0_LOCK();
            auth0Lock.showLock(this.props.location, false);
            return;
        }

        if (this.props.isPreloaded) {
            return;
        }

        this.props.onEventLoading();

        try {
            const event = await services.CONTENT_PRIVATE_CLIENT().getEvent();
            const chargebeeManageAccountUri = await services.CONTENT_PRIVATE_CLIENT().getChargebeeManagePageUri();
            this.props.onEventReady(false, event, chargebeeManageAccountUri);
        } catch (e) {
            if (e.name == 'EventNotFoundError') {
                try {
                    const plan = qs.parse(this.props.location.search).plan as EventPlan;
                    const event = await services.CONTENT_PRIVATE_CLIENT().createEvent(config.SESSION(), plan);
                    const chargebeeManageAccountUri = await services.CONTENT_PRIVATE_CLIENT().getChargebeeManagePageUri();
                    this.props.onEventReady(false, event, chargebeeManageAccountUri);
                } catch (e) {
                    console.log(e);
                    services.ROLLBAR_CLIENT().error(e);
                    this.props.onEventFailed('Could not load event for user');
                }
            } else if (e.name == 'EventRemovedError') {
                this.props.onEventReady(true, null);
            } else {
                console.log(e);
                services.ROLLBAR_CLIENT().error(e);
                this.props.onEventFailed('Could not load event for user');
            }
        }
    }

    render() {
        if (!config.SESSION().hasUser()) {
            return <div>{text.shouldBeLoggedIn[config.LANG()]}</div>;
        }

        const helmet =
            <Helmet>
                <meta name="robots" content="noindex,nofollow" />
            </Helmet>;

        if (this.props.isLoading) {
            return (
                <div className="loading">
                    {helmet}
                    <span className="message">{commonText.loading[config.LANG()]}</span>
                </div>
            );
        } else if (this.props.isFailed) {
            return (
                <div className="failed">
                    {helmet}
                    <span className="message">{commonText.loadingFailed[config.LANG()]}</span>
                </div>
            );
        } else if (this.props.eventIsDeleted) {
            return (
                <div className="event-deleted">
                    {helmet}
                    <span className="message">{text.eventIsDeleted[config.LANG()]}</span>
                </div>
            );
        } else if ((this.props.event as Event).uiState.showSetupWizard) {
            return (
                <div className="admin-frame">
                    {helmet}
                    <EventSetupWizard
                        event={this.props.event as Event}
                        onDone={newEventOptions => this._handleSetupDone(newEventOptions)}
                        onSkip={() => this._handleSetupSkipped()} />
                </div>
            );
        } else {
            return (
                <div className="admin-frame">
                    {helmet}
                    <div className="side-menu">
                        <ul className="side-menu-list">
                            <li>
                                <span className="menu-icon main"></span>
                                <NavLink to="/admin/main">{text.aboutUs[config.LANG()]}</NavLink>
                            </li>
                            <li>
                                <span className="menu-icon event"></span>
                                <NavLink to="/admin/event">{text.event[config.LANG()]}</NavLink>
                            </li>
                            <li>
                                <span className="menu-icon site"></span>
                                <NavLink to="/admin/site">{text.site[config.LANG()]}</NavLink>
                            </li>
                            <li>
                                <span className="menu-icon billing"></span>
                                <a href={this.props.chargebeeManageAccountUri} target="_blank">{text.billing[config.LANG()]}</a>
                            </li>
                            <li>
                                <span className="menu-icon account"></span>
                                <NavLink to="/admin/account">{text.account[config.LANG()]}</NavLink>
                            </li>
                        </ul>
                    </div>
                    <Switch>
                        <Route exact path="/admin" component={AdminMainPage} />
                        <Route path="/admin/main" component={AdminMainPage} />
                        <Route path="/admin/event" component={AdminEventPage} />
                        <Route path="/admin/site" component={AdminSitePage} />
                        <Route path="/admin/account" component={AdminAccountPage} />
                    </Switch>
                </div>
            );
        }
    }

    private async _handleSetupDone(newEventOptions: UpdateEventOptions): Promise<void> {
        this.props.onEventLoading();

        try {
            const event = await services.CONTENT_PRIVATE_CLIENT().updateEvent(config.SESSION(), newEventOptions);
            let chargebeeManageAccountUri = this.props.chargebeeManageAccountUri;
            if (this.props.chargebeeManageAccountUri == null) {
                chargebeeManageAccountUri = await services.CONTENT_PRIVATE_CLIENT().getChargebeeManagePageUri();
            }
            this.props.onEventReady(false, event, chargebeeManageAccountUri);
        } catch (e) {
            if (e.name == 'DeletedEventForUserError') {
                this.props.onEventReady(true, null);
            } else {
                console.log(e);
                services.ROLLBAR_CLIENT().error(e);
                this.props.onEventFailed('Could not load event for user');
            }
        }
    }

    private async _handleSetupSkipped(): Promise<void> {
        this.props.onEventLoading();

        try {
            const event = await services.CONTENT_PRIVATE_CLIENT().uiMarkSkippedSetupWizard(config.SESSION());
            let chargebeeManageAccountUri = this.props.chargebeeManageAccountUri;
            if (this.props.chargebeeManageAccountUri == null) {
                chargebeeManageAccountUri = await services.CONTENT_PRIVATE_CLIENT().getChargebeeManagePageUri();
            }
            this.props.onEventReady(false, event, chargebeeManageAccountUri);
        } catch (e) {
            if (e.name == 'DeletedEventForUserError') {
                this.props.onEventReady(true, null);
            } else {
                console.log(e);
                services.ROLLBAR_CLIENT().error(e);
                this.props.onEventFailed('Could not load event for user');
            }
        }
    }
}

function stateToProps(state: any) {
    return {
        isPreloaded: state.event.type == OpState.Preloaded,
        isLoading: state.event.type == OpState.Init || state.event.type == OpState.Loading,
        isReady: state.event.type == OpState.Ready,
        isFailed: state.event.type == OpState.Failed,
        eventIsDeleted: state.event.type == OpState.Ready || state.event.type == OpState.Preloaded ? state.event.eventIsDeleted : false,
        event: state.event.type == OpState.Ready || state.event.type == OpState.Preloaded ? state.event.event : null,
        chargebeeManageAccountUri: state.event.type == OpState.Ready || state.event.type == OpState.Preloaded ? state.event.chargebeeManageAccountUri : null,
        errorMessage: state.event.type == OpState.Failed ? state.event.errorMessage : null
    };
}

function dispatchToProps(dispatch: (newState: EventState) => void) {
    return {
        onEventLoading: () => dispatch({ part: StatePart.Event, type: OpState.Loading }),
        onEventReady: (eventIsDeleted: boolean, event: Event | null, chargebeeManageAccountUri?: string) => dispatch({ part: StatePart.Event, type: OpState.Ready, eventIsDeleted: eventIsDeleted, event: event, chargebeeManageAccountUri }),
        onEventFailed: (errorMessage: string) => dispatch({ part: StatePart.Event, type: OpState.Failed, errorMessage })
    };
}


export const AdminFrame = withRouter(connect(stateToProps, dispatchToProps)(_AdminFrame as any));
