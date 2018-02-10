import * as React from 'react'
import * as Datetime from 'react-datetime'
import * as moment from 'moment'

import { SubEventDetails } from '@truesparrow/content-sdk-js'

const PlacesAutocomplete = require('react-places-autocomplete').default;

import * as config from './config'

import * as text from './subevent-editor.text'


interface Props {
    details: SubEventDetails;
    onDetailsChange: (newDetails: SubEventDetails) => void;
}

interface State {
    haveEvent: boolean;
    address: string;
    addressIsValid: boolean;
    coordinates: [number, number];
    dateAndTime: moment.Moment | string;
    dateAndTimeIsValid: boolean;
}

export class SubEventEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = this._stateFromProps(props);
    }

    componentWillReceiveProps(newProps: Props): void {
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
            <div className="subevent-editor">
                <form>
                    <div className="have-event">
                        <label>
                            <span className="label-text">{text.haveEvent[config.LANG()]}</span>
                            <input
                                type="checkbox"
                                checked={this.state.haveEvent}
                                onChange={e => this._handleHaveEvent(e)} />
                        </label>
                    </div>
                    {this.props.details.haveEvent
                        ? <div>
                            <div className="address">
                                <label>
                                    <span className="label-text">{text.address[config.LANG()]}</span>
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
                                            input: 'address-input',
                                            autocompleteContainer: 'address-container',
                                            autocompleteItem: 'address-item',
                                            autocompleteItemActive: 'address-item-active'
                                        }} />
                                </label>
                            </div>
                            <div className="time-and-date">
                                <label>
                                    <span className="label-text">{text.timeAndDate[config.LANG()]}</span>
                                    <Datetime
                                        className="datetime"
                                        value={this.state.dateAndTime}
                                        onChange={e => this._handleDateAndTime(e)}
                                        locale={config.LANG()}
                                        inputProps={{ disabled: !this.state.haveEvent }} />
                                </label>
                            </div>
                        </div>
                        : <span></span>}
                </form>
            </div>);
    }

    private _stateFromProps(props: Props): State {
        const { details } = props;

        return {
            haveEvent: details.haveEvent,
            address: details.address,
            addressIsValid: true,
            coordinates: details.coordinates,
            dateAndTime: moment(details.dateAndTime),
            dateAndTimeIsValid: true
        };
    }

    private _handleHaveEvent(e: React.FormEvent<HTMLInputElement>): void {
        this.setState({
            haveEvent: e.currentTarget.checked
        }, this._updateOwner);
    }

    private _handleAddress(e: string): void {
        this.setState({
            address: e,
            addressIsValid: true
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
        let newDateAndTime = null;
        if (typeof e == 'object' && e.hasOwnProperty('bubbles')) {
            newDateAndTime = (e as any).currentTarget.value;
        } else {
            newDateAndTime = e as moment.Moment | string;
        }

        this.setState({
            dateAndTime: newDateAndTime,
            dateAndTimeIsValid: e instanceof moment
        }, this._updateOwner);
    }

    private _updateOwner() {
        if (!this.state.addressIsValid) {
            return;
        }

        if (!this.state.dateAndTimeIsValid) {
            return;
        }

        const newDetails = new SubEventDetails();
        newDetails.haveEvent = this.state.haveEvent;
        newDetails.address = this.state.address;
        newDetails.coordinates = this.state.coordinates;
        newDetails.dateAndTime = (this.state.dateAndTime as moment.Moment).toDate();

        this.props.onDetailsChange(newDetails);
    }
}
