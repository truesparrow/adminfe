import * as React from 'react'

import { SubEventDetails } from '@truesparrow/content-sdk-js'

import * as config from './config'

import * as text from './admin-event-page.text'
import { SubEventEditor } from './subevent-editor'

interface Props {
}

interface State {
    modified: boolean;
    civilCeremonyDetails: SubEventDetails;
    religiousCeremonyDetails: SubEventDetails;
    receptionDetails: SubEventDetails;
}


export class AdminEventPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const initialCivilCeremonyDetails = new SubEventDetails();
        initialCivilCeremonyDetails.haveEvent = true;
        initialCivilCeremonyDetails.address = '';
        initialCivilCeremonyDetails.coordinates = [0, 0];
        initialCivilCeremonyDetails.dateAndTime = new Date('2018-10-1 10:00 UTC');

        const initialReligiousCeremonyDetails = new SubEventDetails();
        initialReligiousCeremonyDetails.haveEvent = true;
        initialReligiousCeremonyDetails.address = '';
        initialReligiousCeremonyDetails.coordinates = [0, 0];
        initialReligiousCeremonyDetails.dateAndTime = new Date('2018-10-1 12:00 UTC');

        const initialReceptionDetails = new SubEventDetails();
        initialReceptionDetails.haveEvent = true;
        initialReceptionDetails.address = '';
        initialReceptionDetails.coordinates = [0, 0];
        initialReceptionDetails.dateAndTime = new Date('2018-10-1 18:00 UTC');

        this.state = {
            modified: false,
            civilCeremonyDetails: initialCivilCeremonyDetails,
            religiousCeremonyDetails: initialReligiousCeremonyDetails,
            receptionDetails: initialReceptionDetails
        };
    }

    render() {
        return (
            <div className="admin-event-page">
                <div>
                    {text.fillOut[config.LANG()]}
                </div>
                <div>
                    <h3>Civil Ceremony</h3>
                    <SubEventEditor
                        details={this.state.civilCeremonyDetails}
                        onDetailsChange={newDetails => this._handleCivilCeremonyDetails(newDetails)} />
                </div>
                <div>
                    <h3>Religious Ceremony</h3>
                    <SubEventEditor
                        details={this.state.religiousCeremonyDetails}
                        onDetailsChange={newDetails => this._handleReligiousCeremonyDetails(newDetails)} />
                </div>
                <div>
                    <h3>Reception</h3>
                    <SubEventEditor
                        details={this.state.receptionDetails}
                        onDetailsChange={newDetails => this._handleReceptionDetails(newDetails)} />
                </div>
                <button
                    disabled={!this.state.modified}
                    type="button">
                    Save
                </button>
                <button disabled={!this.state.modified}
                    type="reset">
                    Reset
                </button>
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
}