import * as React from 'react'

import * as config from './config'

import * as text from './event-setup-wizard.text'


enum Page {
    PICTURES = "pictures",
    EVENT = "event",
    SITE = "site"
}

interface Props {
    onSetupDone: () => void;
}

interface State {
    currentPage: Page;
}

export class EventSetupWizard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: Page.PICTURES
        };
    }

    render() {
        switch (this.state.currentPage) {
            case Page.PICTURES:
                return (
                    <div className="event-setup-wizard">
                        <p className="fill-out-details">
                            {text.fillOut[config.LANG()]}
                        </p>
                        <div className="button-bar">
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handleNext()}>
                                {text.next[config.LANG()]}
                            </button>
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handleSkip()}>
                                {text.skip[config.LANG()]}
                            </button>
                        </div>
                    </div>
                );
            case Page.EVENT:
                return (
                    <div className="event-setup-wizard">
                        <p className="fill-out-details">
                            {text.fillOut[config.LANG()]}
                        </p>
                        <div className="button-bar">
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handlePrev()}>
                                {text.prev[config.LANG()]}
                            </button>
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handleNext()}>
                                {text.next[config.LANG()]}
                            </button>
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handleSkip()}>
                                {text.skip[config.LANG()]}
                            </button>
                        </div>
                    </div>
                );
            case Page.SITE:
                return (
                    <div className="event-setup-wizard">
                        <p className="fill-out-details">
                            {text.fillOut[config.LANG()]}
                        </p>
                        <div className="button-bar">
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handlePrev()}>
                                {text.prev[config.LANG()]}
                            </button>
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handleDone()}>
                                {text.done[config.LANG()]}
                            </button>
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handleSkip()}>
                                {text.skip[config.LANG()]}
                            </button>
                        </div>
                    </div>
                );
        }
    }

    private _handlePrev() {
        this.setState({ currentPage: prevPage(this.state.currentPage) });
    }

    private _handleNext() {
        this.setState({ currentPage: nextPage(this.state.currentPage) });
    }

    private _handleSkip() {
        this.props.onSetupDone();
    }

    private _handleDone() {
        this.props.onSetupDone();
    }
}

function nextPage(currentPage: Page) {
    switch (currentPage) {
        case Page.PICTURES:
            return Page.EVENT;
        case Page.EVENT:
            return Page.SITE;
        case Page.SITE:
            throw new Error('Invalid to move from SITE to next page');
    }
}

function prevPage(currentPage: Page) {
    switch (currentPage) {
        case Page.PICTURES:
            throw new Error('Invalid to move from PICTURES to prev page');
        case Page.EVENT:
            return Page.PICTURES;
        case Page.SITE:
            return Page.EVENT;
    }
}
