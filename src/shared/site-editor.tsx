import * as React from 'react'

import {
    SubDomainErrorReason,
    SubDomainMarshaller,
    UpdateEventOptions
} from '@truesparrow/content-sdk-js'

import * as config from './config'
import * as services from './services'

import * as text from './site-editor.text'


interface Props {
    updateOptions: UpdateEventOptions;
    onChange: (updateOptions: UpdateEventOptions) => void;
    onError: () => void;
}

interface State {
    subDomainError: SubDomainErrorReason;
    subDomainAvailable: boolean | null;
    subDomainCheckError: boolean | null;
    subDomain: string;
}


export class SiteEditor extends React.Component<Props, State> {
    private static readonly CHANGE_TIMEOUT_IN_MS: number = 1000;

    private _subDomainChangeTimeoutId: number | null;
    private readonly _subDomainMarshaller: SubDomainMarshaller;

    constructor(props: Props) {
        super(props);
        this.state = this._stateFromProps(props);
        this._subDomainChangeTimeoutId = null;
        this._subDomainMarshaller = new SubDomainMarshaller();
    }

    componentWillReceiveProps(newProps: Props) {
        if (!this._canAcceptProps()) {
            return;
        }

        this.setState(this._stateFromProps(newProps));
    }

    render() {
        return (
            <div className="site-editor">
                <form className="admin-form subdomain">
                    <label className="admin-form-group">
                        <span
                            className="admin-form-label">
                            {text.subDomain[config.LANG()]}
                            <span className="admin-form-error">
                                {this.state.subDomainError == SubDomainErrorReason.TooShort ? text.subDomainTooShort[config.LANG()] :
                                    this.state.subDomainError == SubDomainErrorReason.TooLong ? text.subDomainTooLong[config.LANG()] :
                                        this.state.subDomainError == SubDomainErrorReason.InvalidCharacters ? text.subDomainInvalidCharacters[config.LANG()] :
                                            this.state.subDomainError == SubDomainErrorReason.OK ?
                                                (this.state.subDomainAvailable == false ? text.subDomainNotAvailable[config.LANG()] : '') : ''}
                                {this.state.subDomainCheckError == true && text.checkError[config.LANG()]}
                            </span>
                            {this.state.subDomainError == SubDomainErrorReason.OK &&
                                (this.state.subDomainAvailable == true ? text.subDomainAvailable[config.LANG()] :
                                    this.state.subDomainAvailable == null ? text.subDomainChecking[config.LANG()] : '')}
                        </span>
                        <span className="subdomain-part-input">
                            <input
                                className={"admin-form-input" + (this.state.subDomainError != SubDomainErrorReason.OK ? " admin-form-input-error" : "")}
                                type="text"
                                value={this.state.subDomain}
                                onChange={e => this._handleChangeSubDomain(e)}
                                onBlur={e => this._handleLeaveSubDomainEdit(e)}
                                placeholder={text.subDomainPlaceholder[config.LANG()]}
                                required={true}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                                autoCapitalize="off"
                                minLength={SubDomainMarshaller.SUBDOMAIN_MIN_SIZE}
                                maxLength={SubDomainMarshaller.SUBDOMAIN_MAX_SIZE} />
                            <span className="sitefe-reference">
                                {text.siteFeDomain[config.LANG()](config.SITEFE_EXTERNAL_HOST)}
                            </span>
                        </span>
                    </label>
                </form>
            </div>
        );
    }

    private _handleChangeSubDomain(e: React.FormEvent<HTMLInputElement>): void {
        // Sorry for the gnarly logic here.
        if (this._subDomainChangeTimeoutId != null) {
            window.clearTimeout(this._subDomainChangeTimeoutId);
        }

        const error = this._subDomainMarshaller.verify(e.currentTarget.value);

        this.setState({
            subDomainError: error,
            subDomainAvailable: null,
            subDomain: e.currentTarget.value
        }, () => {
            if (error != SubDomainErrorReason.OK) {
                this.props.onError();
            }

            this._subDomainChangeTimeoutId = window.setTimeout(async () => {
                try {
                    const available = await services.CONTENT_PRIVATE_CLIENT().checkSubDomainAvailable(this.state.subDomain);
                    this.setState({
                        subDomainCheckError: null,
                        subDomainAvailable: available
                    }, () => {
                        const updateOptions: UpdateEventOptions = {
                            subDomain: this.state.subDomain
                        };
                        this.props.onChange(updateOptions);
                    });
                } catch (e) {
                    this.setState({
                        subDomainCheckError: true,
                        subDomainAvailable: null
                    }, () => this.props.onError());
                }
            }, SiteEditor.CHANGE_TIMEOUT_IN_MS);
        });
    }

    private async _handleLeaveSubDomainEdit(_e: React.FormEvent<HTMLInputElement>): Promise<void> {
        // If we've not modified the field, or if we've modified it but with an error, don't do
        // the check here.
        if (this.state.subDomainError != SubDomainErrorReason.OK) {
            return void this.props.onError();
        }

        try {
            const available = await services.CONTENT_PRIVATE_CLIENT().checkSubDomainAvailable(this.state.subDomain);
            this.setState({
                subDomainCheckError: null,
                subDomainAvailable: available
            }, () => {
                const updateOptions: UpdateEventOptions = {
                    subDomain: this.state.subDomain
                };
                this.props.onChange(updateOptions);
            });
        } catch (e) {
            this.setState({
                subDomainCheckError: true,
                subDomainAvailable: null
            }, () => this.props.onError());
        }
    }

    private _canAcceptProps(): boolean {
        if (this.state.subDomainError != SubDomainErrorReason.OK) {
            return false;
        }

        return true;
    }

    private _stateFromProps(props: Props): State {
        return {
            modified: false,
            subDomainError: SubDomainErrorReason.OK,
            subDomainAvailable: true,
            subDomainCheckError: null,
            subDomain: props.updateOptions.subDomain as string
        };
    }
}
