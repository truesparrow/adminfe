import * as React from 'react'
import { connect } from 'react-redux'

import {
    Event,
    UpdateEventOptions,
    SubDomainErrorReason,
    SubDomainMarshaller
} from '@truesparrow/content-sdk-js'

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
    subDomainError: SubDomainErrorReason;
    subDomain: string;
}

class _AdminSitePage extends React.Component<Props, State> {
    private readonly _subDomainMarshaller: SubDomainMarshaller;

    constructor(props: Props) {
        super(props);
        this.state = {
            modified: false,
            subDomainError: SubDomainErrorReason.OK,
            subDomain: props.event.subDomain
        };

        this._subDomainMarshaller = new SubDomainMarshaller();
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            modified: false,
            subDomainError: SubDomainErrorReason.OK,
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
                <div className="admin-section">
                    <h3 className="admin-title">{text.dns[config.LANG()]}</h3>
                    <div className="subdomain">
                        <label>
                            <span
                                className="label-text">
                                {text.subDomain[config.LANG()]}
                            </span>
                            <input
                                className="subdomain-input"
                                type="text"
                                value={this.state.subDomain}
                                onChange={e => this._handleChangeSubDomain(e)}
                                onBlur={e => this._handleLeaveSubDomainEdit(e)}
                                placeholder={text.subDomainPlaceholder[config.LANG()]}
                                required={true}
                                minLength={Event.SUBDOMAIN_MIN_SIZE}
                                maxLength={Event.SUBDOMAIN_MAX_SIZE} />
                            <span className="sitefe-reference">
                                {text.siteFeDomain[config.LANG()](config.SITEFE_EXTERNAL_HOST)}
                            </span>
                            <span className="error">
                                {this.state.subDomainError == SubDomainErrorReason.TooShort ? text.subDomainTooShort[config.LANG()] :
                                    this.state.subDomainError == SubDomainErrorReason.TooLong ? text.subDomainTooLong[config.LANG()] :
                                        this.state.subDomainError == SubDomainErrorReason.InvalidCharacters ? text.subDomainInvalidCharacters[config.LANG()] : ''}
                            </span>
                        </label>
                    </div>
                </div>
                <div className="action-buttons">
                    <button
                        className="sign-up"
                        disabled={!this.state.modified || this.state.subDomainError != SubDomainErrorReason.OK}
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

    private _handleChangeSubDomain(e: React.FormEvent<HTMLInputElement>) {
        this.setState({
            modified: true,
            subDomainError: this._subDomainMarshaller.verify(e.currentTarget.value),
            subDomain: e.currentTarget.value
        });
    }

    private _handleLeaveSubDomainEdit(_e: React.FormEvent<HTMLInputElement>) {
        console.log('here');
    }

    private async _handleSave() {
        if (!this.state.modified || this.state.subDomainError != SubDomainErrorReason.OK) {
            throw new Error('Unallowed call to save');
        }

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
            subDomainError: SubDomainErrorReason.OK,
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
