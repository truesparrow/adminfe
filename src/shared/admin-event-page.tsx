import * as React from 'react'
import { connect } from 'react-redux'

import { Event, SubEventDetails, UpdateEventOptions } from '@truesparrow/content-sdk-js'

import * as commonText from './common.text'
import * as config from './config'
import { SubEventEditor } from './subevent-editor'
import { EventState, OpState, StatePart } from './store'
import * as services from './services'

import * as text from './admin-event-page.text'


interface Props {
    event: Event;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
    modified: boolean;
    civilCeremonyDetails: SubEventDetails;
    religiousCeremonyDetails: SubEventDetails;
    receptionDetails: SubEventDetails;
}


class _AdminEventPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            modified: false,
            civilCeremonyDetails: this.props.event.subEventDetails[0],
            religiousCeremonyDetails: this.props.event.subEventDetails[1],
            receptionDetails: this.props.event.subEventDetails[2]
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            modified: false,
            civilCeremonyDetails: newProps.event.subEventDetails[0],
            religiousCeremonyDetails: newProps.event.subEventDetails[1],
            receptionDetails: newProps.event.subEventDetails[2]
        });
    }

    render() {
        return (
            <div className="admin-event-page">
                <p className="fill-out-details">
                    {text.fillOut[config.LANG()]}
                </p>
                <div className="subevent-section">
                    <h3 className="subevent-title">{text.civilCeremony[config.LANG()]}</h3>
                    <SubEventEditor
                        details={this.state.civilCeremonyDetails}
                        onDetailsChange={newDetails => this._handleCivilCeremonyDetails(newDetails)} />
                </div>
                <div className="subevent-section">
                    <h3 className="subevent-title">{text.religiousCeremony[config.LANG()]}</h3>
                    <SubEventEditor
                        details={this.state.religiousCeremonyDetails}
                        onDetailsChange={newDetails => this._handleReligiousCeremonyDetails(newDetails)} />
                </div>
                <div className="subevent-section">
                    <h3 className="subevent-title">{text.reception[config.LANG()]}</h3>
                    <SubEventEditor
                        details={this.state.receptionDetails}
                        onDetailsChange={newDetails => this._handleReceptionDetails(newDetails)} />
                </div>
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

    private _handleCivilCeremonyDetails(newDetails: SubEventDetails): void {
        this.setState({
            modified: true,
            civilCeremonyDetails: newDetails
        });
    }

    private _handleReligiousCeremonyDetails(newDetails: SubEventDetails): void {
        this.setState({
            modified: true,
            religiousCeremonyDetails: newDetails
        });
    }

    private _handleReceptionDetails(newDetails: SubEventDetails): void {
        this.setState({
            modified: true,
            receptionDetails: newDetails
        });
    }

    private async _handleSave() {
        try {
            const updateOptions: UpdateEventOptions = {
                subEventDetails: [
                    this.state.religiousCeremonyDetails,
                    this.state.civilCeremonyDetails,
                    this.state.receptionDetails
                ]
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
            civilCeremonyDetails: this.props.event.subEventDetails[0],
            religiousCeremonyDetails: this.props.event.subEventDetails[1],
            receptionDetails: this.props.event.subEventDetails[2]
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

export const AdminEventPage = connect(stateToProps, dispatchToProps)(_AdminEventPage);
