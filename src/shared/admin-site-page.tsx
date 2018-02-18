import * as React from 'react'
import { connect } from 'react-redux'

import { Event, UpdateEventOptions } from '@truesparrow/content-sdk-js'

import * as commonText from './common.text'
import * as config from './config'
import { EventState, OpState, StatePart } from './store'
import * as services from './services'

import * as text from './admin-site-page.text'


interface Props {
    event: Event;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
    modified: boolean;
    subDomain: string;
}

class _AdminSitePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            modified: false,
            subDomain: props.event.subDomain
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            modified: false,
            subDomain: newProps.event.subDomain
        });
    }

    render() {
        return (
            <div
                className="admin-site-page">
                <p className="fill-out-details">
                    {text.fillOut[config.LANG()]}
                </p>
                {text.spite[config.LANG()]}
                <div className="action-buttons">
                    <button
                        className="sign-up"
                        disabled={!this.state.modified}
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

    private async _handleSave() {
        this.props.onEventLoading();

        try {
            const updateOptions: UpdateEventOptions = {
                subDomain: this.state.subDomain
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
        this.setState({
            modified: false,
            subDomain: this.props.event.subDomain
        });
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
