import * as React from 'react'


interface Props {
}

interface State {
}

export class AdminSitePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(_newProps: Props) {
        this.setState({});
    }

    render() {
        return <div>Spite</div>;
    }
}
