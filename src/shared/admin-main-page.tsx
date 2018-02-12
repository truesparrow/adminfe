import * as React from 'react'
import { connect } from 'react-redux'

import {
    Event,
    Picture,
    PictureSet,
    UpdateEventOptions
} from '@truesparrow/content-sdk-js'

import * as commonText from './common.text'
import * as config from './config'
import * as services from './services'
import { EventState, OpState, StatePart } from './store'

import * as text from './admin-main-page.text'


interface Props {
    event: Event;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
    hasSelectPictureError: boolean;
    modified: boolean;
    pictures: Picture[];
}

class _AdminMainPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasSelectPictureError: false,
            modified: false,
            pictures: props.event.pictureSet.pictures
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            hasSelectPictureError: false,
            modified: false,
            pictures: newProps.event.pictureSet.pictures
        });
    }

    render() {
        const pictureRegion = this.state.pictures.map((pic: Picture) => {
            return <div key={pic.position}><img src={pic.uri} width="100px" height="100px" /></div>;
        })

        return (
            <div>
                {text.adminMainPage[config.LANG()]}
                <button onClick={_ => this._handleAddImage()}>Add Image</button>
                {pictureRegion}
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

    private async _handleAddImage(): Promise<void> {
        try {
            const fileStackPicker = await services.FILE_STACK_CLIENT();
            const newPicture = await fileStackPicker.selectImageWithWidget(this.state.pictures.length + 1);
            const newPictures = this.state.pictures.concat(newPicture);

            this.setState({
                hasSelectPictureError: false,
                modified: true,
                pictures: newPictures
            });
        } catch (e) {
            // If the user canceled the dialog, we don't do anything.
            if (e.hasOwnProperty('FPError') && e.hasOwnProperty('code') && e.code == 101) {
                return;
            }

            console.log(e);
            services.ROLLBAR_CLIENT().error(e);

            // TODO: update state here with failures
            this.setState({
                hasSelectPictureError: true,
                modified: false
            });
        }
    }

    private async _handleSave() {
        this.props.onEventLoading();

        try {
            const pictureSet = new PictureSet();
            pictureSet.pictures = this.state.pictures;

            const updateOptions: UpdateEventOptions = {
                pictureSet: pictureSet
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
            hasSelectPictureError: false,
            modified: false,
            pictures: this.props.event.pictureSet.pictures
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

export const AdminMainPage = connect(stateToProps, dispatchToProps)(_AdminMainPage);
