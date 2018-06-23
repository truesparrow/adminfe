import * as React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { Event, UpdateEventOptions } from '@truesparrow/content-sdk-js'

import * as commonText from './common.text'
import * as config from './config'
import { EventEditor, EventEventOptions } from './event-editor'
import { EventState, OpState, StatePart } from './store'
import * as services from './services'
import { FacebookOpenGraph, TwitterCard } from './web-metadata'

import * as text from './admin-event-page.text'


interface Props {
    event: Event;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
    modified: boolean;
    eventOptions: EventEventOptions;
    eventOptionsValid: boolean;
}


class _AdminEventPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = this._stateFromProps(props);
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState(this._stateFromProps(newProps));
    }

    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/admin/event`;
        return (
            <div className="admin-event-page">
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
                <EventEditor
                    eventOptions={this.state.eventOptions}
                    onChange={eventOptions => this._handleEventOptionsChange(eventOptions)}
                    onError={() => this._handleEventOptionsError()} />
                <div className="action-buttons">
                    <button
                        className="sign-up"
                        disabled={!this.state.modified || !this.state.eventOptionsValid}
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

    private _handleEventOptionsChange(eventOptions: EventEventOptions) {
        this.setState({
            modified: true,
            eventOptions: eventOptions,
            eventOptionsValid: true
        });
    }

    private _handleEventOptionsError() {
        this.setState({
            modified: true,
            eventOptionsValid: false
        });
    }

    private async _handleSave() {
        if (!this.state.modified || !this.state.eventOptionsValid) {
            throw new Error('Unallowed call to save');
        }

        this.props.onEventLoading();

        try {
            const updateOptions: UpdateEventOptions = {
                title: this.state.eventOptions.title,
                subEventDetails: this.state.eventOptions.subEventDetails
            };

            const event = await services.CONTENT_PRIVATE_CLIENT().updateEvent(config.SESSION(), updateOptions);
            this.props.onEventReady(false, event);
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

    private _handleReset(): void {
        this.setState(this._stateFromProps(this.props));
    }

    private _stateFromProps(props: Props): State {
        const { event } = props;

        return {
            modified: false,
            eventOptions: {
                title: event.title,
                subEventDetails: event.subEventDetails
            },
            eventOptionsValid: true
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
        onEventReady: (eventIsDeleted: boolean, event: Event | null) => dispatch({ part: StatePart.Event, type: OpState.Ready, eventIsDeleted: eventIsDeleted, event: event }),
        onEventFailed: (errorMessage: string) => dispatch({ part: StatePart.Event, type: OpState.Failed, errorMessage })
    };
}

export const AdminEventPage = connect(stateToProps, dispatchToProps)(_AdminEventPage);
