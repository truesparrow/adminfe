import * as React from 'react'
import { List, Repeat } from 'immutable'

import { isClient } from '@truesparrow/common-js'
import {
    Picture,
    PictureSet
} from '@truesparrow/content-sdk-js'

import * as config from './config'
import * as services from './services'
import { PictureCarousel } from './picture-carousel'

import * as text from './about-us-editor.text'

const Dragula = isClient(config.CONTEXT) ? require('react-dragula') : undefined;


export interface AboutUsEventOptions {
    pictureSet: PictureSet;
}


interface Props {
    aboutUsOptions: AboutUsEventOptions;
    onChange: (aboutUsOptions: AboutUsEventOptions) => void;
    onError: () => void;
}

interface State {
    hasSelectPictureError: boolean;
    pictures: List<Picture>;
    loadingPicturesCount: number;
    /*
     * A counter incremented every time a new drag and drop event occurs. This is used as a sort of
     * cache-buster for the React DOM diff algorithm and ensures that the elements in the gallery
     * have a new key prop after every drag and drop event. React won't try to do any
     * funny business and will just redraw stuff in the order given by the pictures.
     * Don't alter this! It took me the better part of a day to figure out.
     */
    dragAndDropGeneration: number;
    showCarousel: boolean;
    carouselPictureIndex: number | null;
}

export class AboutUsEditor extends React.Component<Props, State> {
    private _drake: any = null;

    constructor(props: Props) {
        super(props);
        this.state = this._stateFromProps(props);
    }

    componentWillReceiveProps(newProps: Props) {
        if (!this._canAcceptProps()) {
            return;
        }
        this.setState(this._stateFromProps(newProps));
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
                            height={`${Picture.THUMBNAIL_HEIGHT}`}
                            onClick={_ => this._handleOpenCarousel(pic)} />
                        <button
                            className="remove-picture"
                            onClick={_ => this._handleRemovePicture(pic.position)}>
                            x
                            </button>
                    </div>
                </div>
            );
        });

        const loadingPicturesRegion = this.state.loadingPicturesCount > 0 && Repeat('x', this.state.loadingPicturesCount).map((_, key) => {
            const realKey = this.state.pictures.size + (key as number);
            return (
                <div
                    key={`${this.state.dragAndDropGeneration}${realKey}`}
                    data-generation={this.state.dragAndDropGeneration}
                    data-position={realKey}
                    className="picture">
                    <div className="picture-container">
                        <img
                            className="thumbnail"
                            src={config.STYLE_LOADING_IMAGE_BASE + config.LANG() + '.png'} // Sigh
                            width={`${Picture.THUMBNAIL_WIDTH}`}
                            height={`${Picture.THUMBNAIL_HEIGHT}`} />
                    </div>
                </div>
            );
        });

        return (
            <div className="about-us-editor">
                <div className="big-editor">
                    <button
                        className="sign-up"
                        type="button"
                        onClick={_ => this._handleAddImage()}>
                        {text.addImage[config.LANG()]}
                    </button>
                </div>
                {this.state.hasSelectPictureError && <div>{text.errorUploadingImage[config.LANG()]} </div>}
                <div className="pictures-section" ref={this._decorateForDragula.bind(this)}>
                    {pictureRegion}
                    {loadingPicturesRegion}
                </div>
                {this.state.showCarousel &&
                    <PictureCarousel
                        pictures={this.state.pictures}
                        initialIndex={this.state.carouselPictureIndex as number}
                        onCloseCarousel={() => this._handleCloseCarousel()} />}
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
            const addedPictures = await fileStackPicker.selectImageWithWidget(this.state.pictures.size + 1, count => this._handleImagesSelected(count));
            const newPictures = this.state.pictures.push(...addedPictures);

            this.setState({
                hasSelectPictureError: false,
                pictures: newPictures,
                loadingPicturesCount: 0,
                showCarousel: false
            }, this._updateOwner);
        } catch (e) {
            // If the user canceled the dialog, we don't do anything.
            if (e.hasOwnProperty('FPError') && e.hasOwnProperty('code') && e.code == 101) {
                return;
            }

            console.log(e);
            services.ROLLBAR_CLIENT().error(e);

            this.setState({
                hasSelectPictureError: true,
                showCarousel: false
            });
        }
    }

    private _handleImagesSelected(count: number): void {
        this.setState({
            loadingPicturesCount: count
        });
    }

    private _handleRemovePicture(position: number): void {
        if (confirm(text.reallyRemoveImage[config.LANG()])) {
            const newPictures = this.state.pictures
                .remove(position - 1)
                .map((pic: Picture, position: number) => Object.assign({}, pic, { position: position + 1 }))
                .toList();
            this.setState({
                hasSelectPictureError: false,
                pictures: newPictures,
                showCarousel: false
            }, this._updateOwner);
        }
    }

    private _handleMovePictureViaDragula(_el: HTMLDivElement, target: HTMLDivElement, _sibling: HTMLDivElement, _source: HTMLDivElement): void {
        // Need to correct the positions of elements.
        const newPictures: Picture[] = [];
        for (let position = 1; position <= target.childNodes.length; position++) {
            const originalPosition = Number.parseInt((target.childNodes.item(position - 1) as HTMLDivElement).getAttribute('data-position') as string);
            const picture = this.state.pictures.get(originalPosition - 1);
            newPictures.push(Object.assign({}, picture, { position }));
        }

        // It is _super_ important to do this in a separate tick. Otherwise the setState is likely
        // to trigger a render, which will trigger a removal of the pictures section
        // div, which will trigger a call to _decorateForDragula, which will call
        // destroy, which will call this function all over again and cause all manner
        // of niceties.
        setImmediate(() => {
            this.setState({
                pictures: List(newPictures),
                dragAndDropGeneration: this.state.dragAndDropGeneration + 1,
                showCarousel: false
            }, this._updateOwner);
        });
    }

    private _handleOpenCarousel(picture: Picture): void {
        this.setState({
            showCarousel: true,
            carouselPictureIndex: picture.position - 1
        });
    }

    private _handleCloseCarousel(): void {
        this.setState({
            showCarousel: false,
            carouselPictureIndex: null
        });
    }

    private _canAcceptProps(): boolean {
        return true;
    }

    private _stateFromProps(props: Props) {
        return {
            hasSelectPictureError: false,
            pictures: List(props.aboutUsOptions.pictureSet.pictures),
            loadingPicturesCount: 0,
            dragAndDropGeneration: 0,
            showCarousel: false,
            carouselPictureIndex: null
        };
    }

    private _updateOwner(): void {
        if (!this._canAcceptProps()) {
            return void this.props.onError();
        }

        const newPictureSet = new PictureSet();
        newPictureSet.pictures = this.state.pictures.toArray();

        const newAboutUsOptions = {
            pictureSet: newPictureSet
        };

        this.props.onChange(newAboutUsOptions);
    }
}
