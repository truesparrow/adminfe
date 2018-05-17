import * as React from 'react'

import {
    SubEventDetails,
    TitleErrorReason,
    TitleMarshaller
} from '@truesparrow/content-sdk-js'

import * as config from './config'
import { SubEventEditor } from './subevent-editor'

import * as text from './event-editor.text'


export interface EventEventOptions {
    title: string;
    subEventDetails: SubEventDetails[]
}

interface Props {
    eventOptions: EventEventOptions;
    onChange: (eventOptions: EventEventOptions) => void;
    onError: () => void;
}

interface State {
    titleError: TitleErrorReason,
    title: string;
    civilCeremonyDetailsValid: boolean;
    civilCeremonyDetails: SubEventDetails;
    religiousCeremonyDetailsValid: boolean;
    religiousCeremonyDetails: SubEventDetails;
    receptionDetailsValid: boolean;
    receptionDetails: SubEventDetails;
}

export class EventEditor extends React.Component<Props, State> {
    private readonly _titleMarshaller: TitleMarshaller;

    constructor(props: Props) {
        super(props);
        this.state = this._stateFromProps(props);
        this._titleMarshaller = new TitleMarshaller();
    }

    componentWillReceiveProps(newProps: Props) {
        if (!this._canAcceptProps()) {
            return;
        }

        this.setState(this._stateFromProps(newProps));
    }

    render() {
        return (
            <div className="event-editor">
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
            </div>
        );
    }

    private _handleChangeTitle(e: React.FormEvent<HTMLInputElement>): void {
        const error = this._titleMarshaller.verify(e.currentTarget.value);

        this.setState({
            titleError: error,
            title: e.currentTarget.value
        }, () => this._updateOwner());
    }

    private _handleCivilCeremonyDetails(newDetails: SubEventDetails): void {
        this.setState({
            civilCeremonyDetailsValid: true,
            civilCeremonyDetails: newDetails
        }, () => this._updateOwner());
    }

    private _handleReligiousCeremonyDetails(newDetails: SubEventDetails): void {
        this.setState({
            religiousCeremonyDetailsValid: true,
            religiousCeremonyDetails: newDetails
        }, () => this._updateOwner());
    }

    private _handleReceptionDetails(newDetails: SubEventDetails): void {
        this.setState({
            receptionDetailsValid: true,
            receptionDetails: newDetails
        }, () => this._updateOwner());
    }

    private _updateOwner(): void {
        if (!this._canAcceptProps()) {
            return void this.props.onError();
        }

        const newEventOptions = {
            title: this.state.title,
            subEventDetails: [
                this.state.civilCeremonyDetails,
                this.state.religiousCeremonyDetails,
                this.state.receptionDetails
            ]
        };

        this.props.onChange(newEventOptions);
    }

    private _canAcceptProps(): boolean {
        if (this.state.titleError != TitleErrorReason.OK) {
            return false;
        }

        if (!this.state.civilCeremonyDetailsValid) {
            return false;
        }

        if (!this.state.religiousCeremonyDetailsValid) {
            return false;
        }

        if (!this.state.receptionDetailsValid) {
            return false;
        }

        return true;
    }

    private _stateFromProps(props: Props): State {
        const { eventOptions } = props;

        return {
            titleError: TitleErrorReason.OK,
            title: eventOptions.title,
            civilCeremonyDetailsValid: true,
            civilCeremonyDetails: eventOptions.subEventDetails[0],
            religiousCeremonyDetailsValid: true,
            religiousCeremonyDetails: eventOptions.subEventDetails[1],
            receptionDetailsValid: true,
            receptionDetails: eventOptions.subEventDetails[2]
        };
    }
}
