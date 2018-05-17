import * as React from 'react'
import { List } from 'immutable'

import { Picture } from '@truesparrow/content-sdk-js'


interface Props {
    pictures: List<Picture>;
    initialIndex: number;
    onCloseCarousel: () => void;
}

interface State {
    currentIndex: number;
}


export class PictureCarousel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentIndex: props.initialIndex
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            currentIndex: newProps.initialIndex
        });
    }

    render() {
        const { pictures } = this.props;
        const picture = pictures.get(this.state.currentIndex);

        return (
            <div className="picture-carousel">
                <div className="carousel-header">
                    <button
                        className="carousel-button close"
                        onClick={_ => this._handleClose()}>
                    </button>
                </div>
                <div className="carousel-big-picture">
                    <button
                        className="carousel-button backward"
                        onClick={_ => this._handleBackward()}>
                    </button>
                    <img
                        className="carousel-image"
                        src={picture.mainImage.uri}
                        width="800px"
                        height="450px" />
                    <button
                        className="carousel-button forward"
                        onClick={_ => this._handleForward()}>
                    </button>
                </div>
            </div>
        );
    }

    private _handleClose(): void {
        this.props.onCloseCarousel();
    }

    private _handleBackward(): void {
        this.setState({
            currentIndex: (this.state.currentIndex + 1) % this.props.pictures.size
        });
    }

    private _handleForward(): void {
        this.setState({
            currentIndex: (this.state.currentIndex - 1) % this.props.pictures.size
        });
    }
}
