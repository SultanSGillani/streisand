import * as React from 'react';

export interface IEmptyProps {
    loading: boolean;
}

const center = {
    'display': 'flex',
    'justify-content': 'center'
};

function Empty(props: IEmptyProps) {
    if (props.loading) {
        return (<div className="well well-sm" style={center}>Loading...</div>);
    }

    return (<div className="well well-sm" style={center}>Nothing found :(</div>);
}

export default Empty;