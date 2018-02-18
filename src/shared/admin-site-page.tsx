import * as React from 'react'
import { connect } from 'react-redux'

import { Event } from '@truesparrow/content-sdk-js'

import * as config from './config'
import { EventState, OpState, StatePart } from './store'

import * as text from './admin-site-page.text'


interface Props {
    event: Event;
    onEventLoading: () => void;
    onEventReady: (eventIsDeleted: boolean, event: Event | null) => void;
    onEventFailed: (errorMessage: string) => void;
}

interface State {
    subDomain: string;
}

class _AdminSitePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            subDomain: props.event.subDomain
        };
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState({
            subDomain: newProps.event.subDomain
        });
    }

    render() {
        return (
            <div
                className="admin-site-page">
                {text.spite[config.LANG()]}
            </div>
        );
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
