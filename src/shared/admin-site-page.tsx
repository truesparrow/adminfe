import * as React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import {
    Event,
    UpdateEventOptions
} from '@truesparrow/content-sdk-js'


import * as commonText from './common.text'
import * as config from './config'
import * as services from './services'
import { SiteEditor } from './site-editor'
import { EventState, OpState, StatePart } from './store'
import { FacebookOpenGraph, TwitterCard } from './web-metadata'

import * as text from './admin-site-page.text'


interface Props {
    event: Event;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
    modified: boolean;
    updateOptions: UpdateEventOptions;
    updateOptionsValid: boolean;
}

class _AdminSitePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = this._stateFromProps(props);
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState(this._stateFromProps(newProps));
    }

    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/admin/site`;
        return (
            <div
                className="admin-site-page">
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
                <div className="admin-section">
                    <h3 className="admin-title">{text.dns[config.LANG()]}</h3>
                    <SiteEditor
                        updateOptions={this.state.updateOptions}
                        onChange={updateOptions => this._handleUpdateOptions(updateOptions)}
                        onError={() => this._handleUpdateOptionsError()} />
                </div>
                <div className="action-buttons">
                    <button
                        className="sign-up"
                        disabled={!this.state.modified || !this.state.updateOptionsValid}
                        type="button"
                        onClick={_ => this._handleSave()}>
                        {commonText.save[config.LANG()]}
                    </button>
                    <button
                        className="sign-up"
                        disabled={!this.state.modified}
                        type="button"
                        onClick={_ => this._handleReset()}>
                        {commonText.reset[config.LANG()]}
                    </button>
                </div>
            </div>
        );
    }

    private _handleUpdateOptions(updateOptions: UpdateEventOptions) {
        this.setState({ modified: true, updateOptions: updateOptions, updateOptionsValid: true });
    }

    private _handleUpdateOptionsError() {
        this.setState({ updateOptionsValid: false });
    }

    private async _handleSave() {
        console.log('there');

        if (!this.state.modified || !this.state.updateOptionsValid) {
            throw new Error('Unallowed call to save');
        }

        try {
            const event = await services.CONTENT_PRIVATE_CLIENT().updateEvent(config.SESSION(), this.state.updateOptions);
            this.props.onEventReady(false, event);
        } catch (e) {
            if (e.name == 'DeletedEventForUserError') {
                this.props.onEventReady(true, null);
            } else if (e.name == 'SubDomainInUseError') {
                this.props.onEventFailed('Subdomain was reserved in the meantime');
            } else {
                console.log(e);
                services.ROLLBAR_CLIENT().error(e);
                this.props.onEventFailed('Could not load event for user');
            }
        }
    }

    private _handleReset(): void {
        this.setState(this._stateFromProps(this.props));
    }

    private _stateFromProps(props: Props): State {
        return {
            modified: false,
            updateOptions: {
                subDomain: props.event.subDomain,
            },
            updateOptionsValid: true
        };
    }
}

function stateToProps(state: any) {
    if (state.event.type != OpState.Preloaded && state.event.type != OpState.Ready) {
        throw new Error('Should not mount this component when things are not ready');
    }

    return {
        event: state.event.event as Event
    };
}

function dispatchToProps(dispatch: (newState: EventState) => void) {
    return {
        onEventLoading: () => dispatch({ part: StatePart.Event, type: OpState.Loading }),
        onEventReady: (eventIsDeleted: boolean, event: Event) => dispatch({ part: StatePart.Event, type: OpState.Ready, eventIsDeleted: eventIsDeleted, event: event }),
        onEventFailed: (errorMessage: string) => dispatch({ part: StatePart.Event, type: OpState.Failed, errorMessage })
    };
}

export const AdminSitePage = connect(stateToProps, dispatchToProps)(_AdminSitePage);
