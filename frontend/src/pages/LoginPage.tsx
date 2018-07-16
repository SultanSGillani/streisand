import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Form, FormGroup, Input, Label, CardBody, CardFooter, Button, CardTitle } from 'reactstrap';

import { IDispatch } from '../state/actions/ActionTypes';
import { login } from '../actions/auth/AuthenticateAction';

export type Props = {};

type ConnectedDispatch = {
    login: (username: string, password: string) => void;
};

type State = {
    username: string;
    password: string;
};

type CombinedProps = Props & ConnectedDispatch;
class LoginComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    }

    public render() {
        const login = this._login.bind(this);
        return (
            <Card>
                <CardBody>
                    <CardTitle>Sign in</CardTitle>
                    <Form onKeyPress={login}>
                        <FormGroup>
                            <Label for="inputUsername">Username</Label>
                            <Input type="text" id="inputUsername" placeholder="Username"
                                value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputPassword">Password</Label>
                            <Input type="password" id="inputPassword" placeholder="Password" autoComplete="current-password"
                                value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} />
                        </FormGroup>
                    </Form>
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" onClick={() => login()}>Login</Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    private _login(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        if (this.state.username && this.state.password) {
            this.props.login(this.state.username, this.state.password);
        }
        return false;
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    login: (username: string, password: string) => dispatch(login(username, password))
});

const LoginPage: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(LoginComponent);
export default LoginPage;
