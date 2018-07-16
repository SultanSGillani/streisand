import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Form, FormGroup, Input, Label, CardBody, CardFooter, Button, CardTitle } from 'reactstrap';

import { IDispatch } from '../state/actions/ActionTypes';
import { showError } from '../state/message/actions/MessageAction';
import { changePassword } from '../actions/auth/ChangePasswordAction';

export type Props = {};

type ConnectedDispatch = {
    showError: (message: string) => void;
    changePassword: (oldPassword: string, newPassword: string) => void;
};

type State = {
    oldPassword: string;
    newPassword: string;
    confirmation: string;
};

type CombinedProps = Props & ConnectedDispatch;
class ChangePasswordComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmation: ''
        };
    }

    public render() {
        const changePassword = this._changePassword.bind(this);
        return (
            <Card>
                <CardBody>
                    <CardTitle>Change your password</CardTitle>
                    <Form onKeyPress={changePassword}>
                        <FormGroup>
                            <Label for="inputOldPassword">Current password</Label>
                            <Input type="password" id="inputOldPassword" placeholder="Current password" autoComplete="current-password"
                                value={this.state.oldPassword} onChange={(event) => this.setState({ oldPassword: event.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputNewPassword">New Password</Label>
                            <Input type="password" name="newPassword" id="inputNewPassword" placeholder="New password" autoComplete="new-password"
                                value={this.state.newPassword} onChange={(event) => this.setState({ newPassword: event.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputConfirmation">New password confirmation</Label>
                            <Input type="password" name="passwordConfirmation" id="inputConfirmation" placeholder="New password" autoComplete="off"
                                value={this.state.confirmation} onChange={(event) => this.setState({ confirmation: event.target.value })} />
                        </FormGroup>
                    </Form>
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" onClick={() => changePassword()}>Submit</Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    private _changePassword(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        if (this.state.newPassword !== this.state.confirmation) {
            this.props.showError(`"New password" does not match "New password confirmation"`);
        } else if (this.state.oldPassword && this.state.newPassword) {
            this.props.changePassword(this.state.oldPassword, this.state.newPassword);
        }
        return false;
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    showError: (message) => dispatch(showError(message)),
    changePassword: (oldPassword: string, newPassword: string) => dispatch(changePassword(oldPassword, newPassword))
});

const ChangePasswordPage: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(ChangePasswordComponent);
export default ChangePasswordPage;
