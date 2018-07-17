import * as React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, Form, CardFooter, Button } from 'reactstrap';

import Store from '../../state/store';
import { IDispatch } from '../../state/actions/ActionTypes';
import { StringInput } from '../generic/inputs/StringInput';
import { sendInvite } from '../../state/invite/actions/CreateInviteAction';

export type Props = {};

type State = {
    email?: string;
};

type ConnectedState = { };

type ConnectedDispatch = {
    sendInvite: (email: string) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class InviteViewComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            email: ''
        };
    }

    public render() {
        const canSendInvite = !!this.state.email;
        const onSendInvite = this._sendInvite.bind(this);
        const buttonText = 'Send';
        return (
            <div>
                <h1>Send someone an invite</h1>
                <Card>
                    <CardBody>
                        <Form onKeyPress={onSendInvite} autoComplete="off">
                            <StringInput type="email" id="inviteEmail" label="Email address" placeholder="Email address to send the invite to"
                                value={this.state.email} setValue={(value: string) => this.setState({ email: value })} />
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <div className="row m-0 justify-content-end">
                            <Button className="col-auto" color="primary" disabled={!canSendInvite} onClick={() => onSendInvite()}>{buttonText}</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    private _sendInvite(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        const { email } = this.state;
        if (email) {
            this.props.sendInvite(email);
        }
        return false;
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return { };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    sendInvite: (email: string) => dispatch(sendInvite({ email }))
});

const InviteView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(InviteViewComponent);
export default InviteView;
