import * as React from 'react'
import { connect } from 'react-redux'

import {
    Event,
    SubEventDetails,
    UpdateEventOptions,
    TitleErrorReason,
    TitleMarshaller
} from '@truesparrow/content-sdk-js'

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
    titleError: TitleErrorReason,
    title: string;
    civilCeremonyDetailsValid: boolean;
    civilCeremonyDetails: SubEventDetails;
    religiousCeremonyDetailsValid: boolean;
    religiousCeremonyDetails: SubEventDetails;
    receptionDetailsValid: boolean;
    receptionDetails: SubEventDetails;
}


class _AdminEventPage extends React.Component<Props, State> {
    private readonly _titleMarshaller: TitleMarshaller;

    constructor(props: Props) {
        super(props);
        this.state = this._stateFromProps(props);
        this._titleMarshaller = new TitleMarshaller();
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState(this._stateFromProps(newProps));
    }

    render() {
        return (
            <div className="admin-event-page">
                <p className="fill-out-details">
                    {text.fillOut[config.LANG()]}
                </p>
                <form className="admin-form">
                    <label className="admin-form-group">
                        <span
                            className="admin-form-label">
                            {text.eventTitle[config.LANG()]}
                            <span
                                className="admin-form-error">
                                {this.state.titleError == TitleErrorReason.TooShort ? text.titleTooShort[config.LANG()] :
                                    this.state.titleError == TitleErrorReason.TooLong ? text.titleTooLong[config.LANG()] : ''}
                            </span>
                        </span>
                        <input
                            className={"admin-form-input" + (this.state.titleError != TitleErrorReason.OK ? " admin-form-input-error" : "")}
                            type="text"
                            value={this.state.title}
                            onChange={e => this._handleChangeTitle(e)}
                            placeholder={text.titlePlaceholder[config.LANG()]}
                            required={true}
                            minLength={TitleMarshaller.TITLE_MIN_SIZE}
                            maxLength={TitleMarshaller.TITLE_MAX_SIZE} />
                    </label>
                </form>
                <h2 className="subevents">{text.subEvents[config.LANG()]}</h2>
                <div className="admin-section">
                    <h3 className="admin-title">{this.state.civilCeremonyDetails.title[config.LANG()]}</h3>
                    <SubEventEditor
                        details={this.state.civilCeremonyDetails}
                        onDetailsChange={newDetails => this._handleCivilCeremonyDetails(newDetails)}
                        onDetailsWithErrors={() => this.setState({ civilCeremonyDetailsValid: false })} />
                </div>
                <div className="admin-section">
                    <h3 className="admin-title">{this.state.religiousCeremonyDetails.title[config.LANG()]}</h3>
                    <SubEventEditor
                        details={this.state.religiousCeremonyDetails}
                        onDetailsChange={newDetails => this._handleReligiousCeremonyDetails(newDetails)}
                        onDetailsWithErrors={() => this.setState({ religiousCeremonyDetailsValid: false })} />
                </div>
                <div className="admin-section">
                    <h3 className="admin-title">{this.state.receptionDetails.title[config.LANG()]}</h3>
                    <SubEventEditor
                        details={this.state.receptionDetails}
                        onDetailsChange={newDetails => this._handleReceptionDetails(newDetails)}
                        onDetailsWithErrors={() => this.setState({ receptionDetailsValid: false })} />
                </div>
                <div className="action-buttons">
                    <button
                        className="sign-up"
                        disabled={
                            !this.state.modified ||
                            this.state.titleError != TitleErrorReason.OK ||
                            !this.state.civilCeremonyDetailsValid ||
                            !this.state.religiousCeremonyDetailsValid ||
                            !this.state.receptionDetailsValid}
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

    private _handleChangeTitle(e: React.FormEvent<HTMLInputElement>): void {
        const error = this._titleMarshaller.verify(e.currentTarget.value);

        this.setState({
            modified: true,
            titleError: error,
            title: e.currentTarget.value
        });
    }

    private _handleCivilCeremonyDetails(newDetails: SubEventDetails): void {
        this.setState({
            modified: true,
            civilCeremonyDetailsValid: true,
            civilCeremonyDetails: newDetails
        });
    }

    private _handleReligiousCeremonyDetails(newDetails: SubEventDetails): void {
        this.setState({
            modified: true,
            religiousCeremonyDetailsValid: true,
            religiousCeremonyDetails: newDetails
        });
    }

    private _handleReceptionDetails(newDetails: SubEventDetails): void {
        this.setState({
            modified: true,
            receptionDetailsValid: true,
            receptionDetails: newDetails
        });
    }

    private async _handleSave() {
        if (!this.state.modified ||
            this.state.titleError != TitleErrorReason.OK ||
            !this.state.civilCeremonyDetailsValid ||
            !this.state.religiousCeremonyDetailsValid ||
            !this.state.receptionDetailsValid) {
            throw new Error('Unallowed call to save');
        }

        this.props.onEventLoading();

        try {
            const updateOptions: UpdateEventOptions = {
                title: this.state.title,
                subEventDetails: [
                    this.state.civilCeremonyDetails,
                    this.state.religiousCeremonyDetails,
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
        this.setState(this._stateFromProps(this.props));
    }

    private _stateFromProps(props: Props): State {
        const { event } = props;

        return {
            modified: false,
            titleError: TitleErrorReason.OK,
            title: event.title,
            civilCeremonyDetailsValid: true,
            civilCeremonyDetails: event.subEventDetails[0],
            religiousCeremonyDetailsValid: true,
            religiousCeremonyDetails: event.subEventDetails[1],
            receptionDetailsValid: true,
            receptionDetails: event.subEventDetails[2]
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

export const AdminEventPage = connect(stateToProps, dispatchToProps)(_AdminEventPage);
