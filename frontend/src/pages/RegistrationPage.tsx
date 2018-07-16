import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Form, FormGroup, Input, Label, CardBody, CardFooter, Button, CardTitle } from 'reactstrap';

import { IDispatch } from '../state/actions/ActionTypes';
import { showError } from '../state/message/actions/MessageAction';
import { StringInput } from '../components/generic/inputs/StringInput';
import { register, IActionProps } from '../actions/auth/RegisterAction';

export type Props = {
    params: {
        key?: string;
    }
};

type ConnectedDispatch = {
    showError: (message: string) => void;
    register: (props: IActionProps) => void;
};

type State = {
    key: string;
    email: string;
    username: string;
    password: string;
    confirmation: string;
};

type CombinedProps = Props & ConnectedDispatch;
class RegistrationPageComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            key: '',
            email: '',
            username: '',
            password: '',
            confirmation: ''
        };
    }

    public render() {
        const register = this._register.bind(this);
        const { key, email, username, password, confirmation } = this.state;
        const inviteKey = this.props.params.key || key;
        const canRegister = inviteKey && email && username && password && confirmation;
        return (
            <Card>
                <CardBody>
                    <CardTitle>Create an account</CardTitle>
                    <Form onKeyPress={register}>
                        <FormGroup>
                            <Label for="keyInput">Invite key</Label>
                            <Input type="text" name="keyInput" id="keyInput" placeholder="Invite key"
                                disabled={!!this.props.params.key} value={inviteKey}
                                onChange={(event) => this.setState({ key: event.target.value })} />
                        </FormGroup>
                        <StringInput type="email" id="inviteEmail" label="Email address" placeholder="Email address"
                            value={email} setValue={(value: string) => this.setState({ email: value })} />
                        <StringInput id="username" label="Username" placeholder="Username"
                            value={username} setValue={(value: string) => this.setState({ username: value })} />
                        <FormGroup>
                            <Label for="inputNewPassword">Password</Label>
                            <Input type="password" name="newPassword" id="inputNewPassword" placeholder="New password" autoComplete="new-password"
                                value={password} onChange={(event) => this.setState({ password: event.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputConfirmation">Password confirmation</Label>
                            <Input type="password" name="passwordConfirmation" id="inputConfirmation" placeholder="New password" autoComplete="off"
                                value={confirmation} onChange={(event) => this.setState({ confirmation: event.target.value })} />
                        </FormGroup>
                    </Form>
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" disabled={!canRegister} onClick={() => register()}>Register</Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    private _register(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        const { key, email, username, password, confirmation } = this.state;
        const inviteKey = this.props.params.key || key;
        if (password !== confirmation) {
            this.props.showError(`"Password" does not match "Password confirmation"`);
        } else if (inviteKey && email && username && password && confirmation) {
                this.props.register({
                    email, username, password,
                    key: inviteKey
                });
            }
        return false;
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    showError: (message) => dispatch(showError(message)),
    register: (props: IActionProps) => dispatch(register(props))
});

const RegistrationPage: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(RegistrationPageComponent);
export default RegistrationPage;
