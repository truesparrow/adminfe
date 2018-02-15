import * as React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'

import { isClient } from '@truesparrow/common-js'
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

const Dragula = isClient(config.CONTEXT) ? require('react-dragula') : undefined;


interface Props {
    event: Event;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
    hasSelectPictureError: boolean;
    modified: boolean;
    pictures: List<Picture>;
    /*
     * A counter incremented every time a new drag and drop event occurs. This is used as a sort of
     * cache-buster for the React DOM diff algorithm and ensures that the elements in the gallery
     * have a new key prop after every drag and drop event. React won't try to do any
     * funny business and will just redraw stuff in the order given by the pictures.
     * Don't alter this! It took me the better part of a day to figure out.
     */
    dragAndDropGeneration: number;
}

class _AdminMainPage extends React.Component<Props, State> {
    private _drake: any = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasSelectPictureError: false,
            modified: false,
            pictures: List(props.event.pictureSet.pictures),
            dragAndDropGeneration: 0
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            hasSelectPictureError: false,
            modified: false,
            pictures: List(newProps.event.pictureSet.pictures)
        });
    }

    render() {
        const pictureRegion = this.state.pictures.map((pic: Picture) => {
            return (
                <div
                    key={`${this.state.dragAndDropGeneration}${pic.position}`}
                    data-generation={this.state.dragAndDropGeneration}
                    data-position={pic.position}
                    className="picture">
                    <div className="picture-container">
                        <img
                            className="thumbnail"
                            src={pic.thumbnailImage.uri}
                            width={`${Picture.THUMBNAIL_WIDTH}`}
                            height={`${Picture.THUMBNAIL_HEIGHT}`} />
                        <button
                            className="remove-picture"
                            onClick={_ => this._handleRemovePicture(pic.position)}>
                            x
                        </button>
                    </div>
                </div>
            );
        })

        return (
            <div className="admin-main-page">
                {this.state.hasSelectPictureError && <div>{text.errorUploadingImage[config.LANG()]} </div>}
                <p className="fill-out-details">
                    {text.fillOut[config.LANG()]}
                </p>
                <div className="big-editor">
                    <button
                        className="sign-up"
                        type="button"
                        onClick={_ => this._handleAddImage()}>
                        {text.addImage[config.LANG()]}
                    </button>
                </div>
                <div className="pictures-section" ref={this._decorateForDragula.bind(this)}>
                    {pictureRegion}
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

    private _decorateForDragula(picturesSectionElement: HTMLDivElement | null) {
        if (!isClient(config.CONTEXT)) {
            return;
        }

        // Whatever happens here we need to clear the drake and possibly create a new one.
        if (this._drake != null) {
            this._drake.destroy();
            this._drake = null;
        }

        // This is null when the refed element is unmounting. Either because the page
        // is switched by the router, or rendering needed to read it to the scene.
        if (picturesSectionElement != null) {
            this._drake = Dragula([picturesSectionElement]);
            this._drake.on('drop', this._handleMovePictureViaDragula.bind(this));
        }
    }

    private async _handleAddImage(): Promise<void> {
        try {
            const fileStackPicker = await services.FILE_STACK_CLIENT();
            const newPicture = await fileStackPicker.selectImageWithWidget(this.state.pictures.size + 1);
            const newPictures = this.state.pictures.push(newPicture);

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

            this.setState({
                hasSelectPictureError: true,
                modified: false
            });
        }
    }

    private _handleRemovePicture(position: number): void {
        const newPictures = this.state.pictures
            .remove(position - 1)
            .map((pic: Picture, position: number) => Object.assign({}, pic, { position: position + 1 }))
            .toList();
        this.setState({
            hasSelectPictureError: false,
            modified: true,
            pictures: newPictures
        });
    }

    private _handleMovePictureViaDragula(_el: HTMLDivElement, target: HTMLDivElement, _sibling: HTMLDivElement, _source: HTMLDivElement): void {
        // Need to correct the positions of elements.
        const newPictures: Picture[] = [];
        let position = 1;
        for (let ch of target.childNodes) {
            const originalPosition = Number.parseInt((ch as HTMLDivElement).getAttribute('data-position') as string);
            const picture = this.state.pictures.get(originalPosition - 1);
            newPictures.push(Object.assign({}, picture, { position }));
            position++;
        }

        // It is _super_ important to do this in a separate tick. Otherwise the setState is likely
        // to trigger a render, which will trigger a removal of the pictures section
        // div, which will trigger a call to _decorateForDragula, which will call
        // destroy, which will call this function all over again and cause all manner
        // of niceties.
        setTimeout(() => {
            this.setState({
                modified: true,
                pictures: List(newPictures),
                dragAndDropGeneration: this.state.dragAndDropGeneration + 1
            });
        }, 0);
    }

    private async _handleSave(): Promise<void> {
        this.props.onEventLoading();

        try {
            const pictureSet = new PictureSet();
            pictureSet.pictures = this.state.pictures.toArray();

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
            pictures: List(this.props.event.pictureSet.pictures)
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
