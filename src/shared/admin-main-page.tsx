import * as React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { Event, UpdateEventOptions } from '@truesparrow/content-sdk-js'

import { AboutUsEditor, AboutUsEventOptions } from './about-us-editor'
import * as config from './config'
import * as services from './services'
import { EventState, OpState, StatePart } from './store'
import { FacebookOpenGraph, TwitterCard } from './web-metadata'

import * as text from './admin-main-page.text'


interface Props {
    event: Event;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
    aboutUsOptions: AboutUsEventOptions;
    aboutUsOptionsValid: boolean;
}

class _AdminMainPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = this._stateFromProps(props);
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState(this._stateFromProps(newProps));
    }

    render() {
        const realLink = `${config.EXTERNAL_ORIGIN}/admin/main`;

        return (
            <div className="admin-main-page">
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
                <AboutUsEditor
                    aboutUsOptions={this.state.aboutUsOptions}
                    onChange={aboutUsOptions => this._handleUpdateOptions(aboutUsOptions)}
                    onError={() => this._handleUpdateOptionsError()} />
            </div>
        );
    }

    private _handleUpdateOptions(newAboutUsOptions: AboutUsEventOptions): void {
        this.setState({
            aboutUsOptions: newAboutUsOptions,
            aboutUsOptionsValid: true
        }, this._updateServer);
    }

    private _handleUpdateOptionsError(): void {
        this.setState({
            aboutUsOptionsValid: false
        });
    }

    private _stateFromProps(props: Props): State {
        return {
            aboutUsOptions: {
                pictureSet: props.event.pictureSet
            },
            aboutUsOptionsValid: true
        };
    }

    private async _updateServer(): Promise<void> {
        if (!this.state.aboutUsOptionsValid) {
            throw new Error('Unallowed call to update server');
        }

        this.props.onEventLoading();

        try {
            const updateOptions: UpdateEventOptions = {
                pictureSet: this.state.aboutUsOptions.pictureSet
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

export const AdminMainPage = connect(stateToProps, dispatchToProps)(_AdminMainPage);
