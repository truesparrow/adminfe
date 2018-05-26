import * as React from 'react'

import { Event, UpdateEventOptions } from '@truesparrow/content-sdk-js'

import { AboutUsEditor, AboutUsEventOptions } from './about-us-editor'
import * as config from './config'
import { EventEditor, EventEventOptions } from './event-editor'
import { SiteEditor, SiteEventOptions } from './site-editor'

import * as text from './event-setup-wizard.text'


enum Page {
    PICTURES = "pictures",
    EVENT = "event",
    SITE = "site"
}

interface Props {
    event: Event;
    onDone: (eventOptions: UpdateEventOptions) => void;
    onSkip: () => void;
}

interface State {
    currentPage: Page;
    aboutUsOptions: AboutUsEventOptions;
    aboutUsOptionsValid: boolean;
    eventOptions: EventEventOptions;
    eventOptionsValid: boolean;
    siteOptions: SiteEventOptions;
    siteOptionsValid: boolean;
}

export class EventSetupWizard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentPage: Page.PICTURES,
            aboutUsOptions: {
                pictureSet: props.event.pictureSet
            },
            aboutUsOptionsValid: true,
            eventOptions: {
                title: props.event.title,
                subEventDetails: props.event.subEventDetails
            },
            eventOptionsValid: true,
            siteOptions: {
                subDomain: props.event.subDomain
            },
            siteOptionsValid: true
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
                        <AboutUsEditor
                            aboutUsOptions={this.state.aboutUsOptions}
                            onChange={newAboutUsOptions => this._handleAboutUsOptionsChanged(newAboutUsOptions)}
                            onError={() => this._handleAboutUsOptionsError()} />
                        <div className="button-bar">
                            <button
                                className="sign-up"
                                type="button"
                                onClick={_ => this._handleSkip()}>
                                {text.skip[config.LANG()]}
                            </button>
                        </div>
                    </div >
                );
            case Page.EVENT:
                return (
                    <div className="event-setup-wizard">
                        <p className="fill-out-details">
                            {text.fillOut[config.LANG()]}
                        </p>
                        <EventEditor
                            eventOptions={this.state.eventOptions}
                            onChange={newEventOptions => this._handleEventOptionsChanged(newEventOptions)}
                            onError={() => this._handleEventOptionsError()} />
                        <div className="button-bar">
                            <button
                                className="sign-up"
                                type="button"
                                disabled={!this.state.eventOptionsValid}
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
                        <SiteEditor
                            siteOptions={this.state.siteOptions}
                            onChange={newSiteOptions => this._handleSiteOptionsChanged(newSiteOptions)}
                            onError={() => this._handleSiteOptionsError()} />
                        <div className="button-bar">
                            <button
                                className="sign-up"
                                type="button"
                                disabled={!this.state.siteOptionsValid}
                                onClick={_ => this._handlePrev()}>
                                {text.prev[config.LANG()]}
                            </button>
                            <button
                                className="sign-up"
                                type="button"
                                disabled={!this.state.siteOptionsValid}
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

    private _handleAboutUsOptionsChanged(newAboutUsOptions: AboutUsEventOptions): void {
        this.setState({
            currentPage: nextPage(this.state.currentPage),
            aboutUsOptions: newAboutUsOptions,
            aboutUsOptionsValid: true
        });
    }

    private _handleAboutUsOptionsError(): void {
        this.setState({
            aboutUsOptionsValid: false
        });
    }

    private _handleEventOptionsChanged(newEventOptions: EventEventOptions): void {
        this.setState({
            eventOptions: newEventOptions,
            eventOptionsValid: true
        });
    }

    private _handleEventOptionsError(): void {
        this.setState({
            eventOptionsValid: false
        });
    }

    private _handleSiteOptionsChanged(newSiteOptions: SiteEventOptions): void {
        this.setState({
            siteOptions: newSiteOptions,
            siteOptionsValid: true
        });
    }

    private _handleSiteOptionsError(): void {
        this.setState({
            siteOptionsValid: false
        });
    }

    private _handlePrev() {
        this.setState({ currentPage: prevPage(this.state.currentPage) });
    }

    private _handleNext() {
        this.setState({ currentPage: nextPage(this.state.currentPage) });
    }

    private _handleDone() {
        if (!this.state.aboutUsOptionsValid || !this.state.eventOptionsValid || !this.state.siteOptionsValid) {
            throw new Error('Invalid state for done');
        }

        const newEventOptions = {
            pictureSet: this.state.aboutUsOptions.pictureSet,
            title: this.state.eventOptions.title,
            subEventDetails: this.state.eventOptions.subEventDetails,
            subDomain: this.state.siteOptions.subDomain
        };

        this.props.onDone(newEventOptions);
    }

    private _handleSkip() {
        this.props.onSkip();
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
