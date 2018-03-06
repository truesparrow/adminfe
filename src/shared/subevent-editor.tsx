import * as React from 'react'
import * as Datetime from 'react-datetime'
import * as moment from 'moment'

import { MessageWith0Arg } from '@truesparrow/common-js'
import {
    AddressErrorReason,
    AddressMarshaller,
    SubEventDetails,
    SubEventDisplayInfo
} from '@truesparrow/content-sdk-js'

const PlacesAutocomplete = require('react-places-autocomplete').default;

import * as config from './config'

import * as text from './subevent-editor.text'


interface Props {
    details: SubEventDetails;
    onDetailsChange: (newDetails: SubEventDetails) => void;
    onDetailsWithErrors: () => void;
}

interface State {
    haveEvent: boolean;
    title: MessageWith0Arg;
    slug: string;
    addressError: AddressErrorReason,
    address: string;
    coordinates: [number, number];
    dateAndTimeValid: boolean;
    dateAndTime: moment.Moment | string;
    display: SubEventDisplayInfo;
}

export class SubEventEditor extends React.Component<Props, State> {
    private readonly _addressMarshaller: AddressMarshaller;

    constructor(props: Props) {
        super(props);
        this._addressMarshaller = new AddressMarshaller();
        this.state = this._stateFromProps(props);
    }

    componentWillReceiveProps(newProps: Props): void {
        if (!this._canAcceptProps()) {
            return;
        }

        this.setState(this._stateFromProps(newProps));
    }

    render() {
        const addressItem = (arg: any) => {
            const formattedSuggestion: any = arg.formattedSuggestion;

            return (
                <div className="suggestion">
                    <strong className="main">{formattedSuggestion.mainText}</strong>
                    <small className="secondary">{formattedSuggestion.secondaryText}</small>
                </div>
            );
        }

        const addressFooter = () => {
            return <span className="powered-by-google"></span>;
        }

        const addressShouldFetchSuggestions = (foo: any) => foo.value.length > 3;

        return (
            <form className="admin-form subevent-editor">
                <label className="admin-form-group horz">
                    <span className="have-event">
                        {text.haveEvent[config.LANG()]}
                    </span>
                    <input
                        className="have-event"
                        type="checkbox"
                        checked={this.state.haveEvent}
                        onChange={e => this._handleHaveEvent(e)} />
                </label>
                {this.props.details.haveEvent &&
                    <React.Fragment>
                        <label className="admin-form-group address">
                            <span
                                className="admin-form-label">
                                {text.address[config.LANG()]}
                                <span
                                    className="admin-form-error">
                                    {this.state.addressError == AddressErrorReason.TooShort ? text.addressTooShort[config.LANG()] : ''}
                                </span>
                            </span>
                            <PlacesAutocomplete
                                onSelect={(e: string) => this._handleAddress(e)}
                                onEnterKeyDown={(e: string) => this._handleAddress(e)}
                                onError={this._handleAddressOnError.bind(this)}
                                highlightFirstSuggestion={true}
                                renderSuggestion={addressItem}
                                renderFooter={addressFooter}
                                shouldFetchSuggestions={addressShouldFetchSuggestions}
                                inputProps={{
                                    value: this.state.address,
                                    type: 'text',
                                    placeholder: 'The Marriot',
                                    disabled: !this.state.haveEvent,
                                    onChange: (e: string) => this._handleAddress(e)
                                }}
                                classNames={{
                                    root: 'address-root',
                                    input: 'address-input' + (this.state.addressError != AddressErrorReason.OK ? ' admin-form-input-error' : ''),
                                    autocompleteContainer: 'address-container',
                                    autocompleteItem: 'address-item',
                                    autocompleteItemActive: 'address-item-active'
                                }} />
                        </label>
                        <label className="admin-form-group">
                            <span className="admin-form-label">
                                {text.timeAndDate[config.LANG()]}
                                <span
                                    className="admin-form-error">
                                    {!this.state.dateAndTimeValid ? text.dateAndTimeInvalid[config.LANG()] : ''}
                                </span>
                            </span>
                            <Datetime
                                value={this.state.dateAndTime}
                                onChange={e => this._handleDateAndTime(e)}
                                locale={config.LANG()}
                                inputProps={{
                                    className: 'admin-form-input' + (!this.state.dateAndTimeValid ? ' admin-form-input-error' : ''),
                                    disabled: !this.state.haveEvent
                                }} />
                        </label>
                    </React.Fragment>}
            </form>
        );
    }

    private _handleHaveEvent(e: React.FormEvent<HTMLInputElement>): void {
        this.setState({
            haveEvent: e.currentTarget.checked
        }, this._updateOwner);
    }

    private _handleAddress(e: string): void {
        const error = this._addressMarshaller.verify(e);

        this.setState({
            addressError: error,
            address: e
        }, this._updateOwner);
    }

    private _handleAddressOnError(status: any, clearSuggestions: any) {
        console.log(
            'Error happened while fetching suggestions from Google Maps API',
            status
        )
        clearSuggestions()
    }

    private _handleDateAndTime(e: React.FormEvent<HTMLInputElement> | moment.Moment | string): void {
        let newDateAndTime: moment.Moment | string | null = null;
        if (typeof e == 'object' && e.hasOwnProperty('bubbles')) {
            newDateAndTime = (e as any).currentTarget.value;
        } else {
            newDateAndTime = e as (moment.Moment | string);
        }

        this.setState({
            dateAndTimeValid: e instanceof moment,
            dateAndTime: newDateAndTime as (moment.Moment | string)
        }, this._updateOwner);
    }

    private _updateOwner() {
        if (this.state.addressError != AddressErrorReason.OK) {
            this.props.onDetailsWithErrors();
            return;
        }

        if (!this.state.dateAndTimeValid) {
            this.props.onDetailsWithErrors();
            return;
        }

        const newDetails = new SubEventDetails();
        newDetails.haveEvent = this.state.haveEvent;
        newDetails.title = this.state.title;
        newDetails.slug = this.state.slug;
        newDetails.address = this.state.address;
        newDetails.coordinates = this.state.coordinates;
        newDetails.dateAndTime = (this.state.dateAndTime as moment.Moment).toDate();
        newDetails.display = this.state.display;

        this.props.onDetailsChange(newDetails);
    }

    private _canAcceptProps(): boolean {
        if (this.state.addressError != AddressErrorReason.OK) {
            return false;
        }

        if (!this.state.dateAndTimeValid) {
            return false;
        }

        return true;
    }

    private _stateFromProps(props: Props): State {
        const { details } = props;

        return {
            haveEvent: details.haveEvent,
            title: details.title,
            slug: details.slug,
            addressError: this._addressMarshaller.verify(details.address),
            address: details.address,
            coordinates: details.coordinates,
            dateAndTimeValid: true,
            dateAndTime: moment(details.dateAndTime),
            display: details.display
        };
    }
}
