import * as React from 'react';
import { connect } from 'react-redux';
import { Alert, Badge } from 'reactstrap';

import Store from '../store';
import IMessage from '../models/IMessage';
import { IDispatch } from '../actions/ActionTypes';
import { removeError } from '../actions/MessageAction';

export type Props = {};
type State = { showMore: boolean };

type ConnectedState = {
    messages: IMessage[];
};

type ConnectedDispatch = {
    removeError: (id: string) => void;
};

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class MessageBannerComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);
        this.state = { showMore: false };
    }

    public render() {
        const messages = this.props.messages;
        if (!messages.length) {
            return null;
        }

        const message = messages[0];
        const onClose = () => { this.props.removeError(message.id); };
        const badge = messages.length > 1 ? <Badge className="float-right align-middle"> {messages.length - 1} more </Badge> : undefined;
        return (
            <Alert key={message.id} color={message.level} toggle={onClose} className="row no-gutters">
                <div className="col mr-auto">{message.content}</div>
                <div className="col-auto align-self-center">{badge}</div>
            </Alert>
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    messages: state.messages
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    removeError: (id: string) => dispatch(removeError(id))
});

const MessageBanner: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(MessageBannerComponent);
export default MessageBanner;