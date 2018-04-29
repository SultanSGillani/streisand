import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../store';
import { showError } from '../actions/ErrorAction';
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
            <div className="well">
                <form className="form-horizontal" onKeyPress={changePassword}>
                    <fieldset>
                        <legend>Change your password</legend>
                        <div className="form-group">
                            <label htmlFor="inputOldPassword1" className="col-lg-2 control-label">Current password</label>
                            <div className="col-lg-10">
                                <input type="password" className="form-control" id="inputOldPassword1" autoComplete="current-password"
                                    placeholder="Current password" value={this.state.oldPassword}
                                    onChange={(event) => this.setState({ oldPassword: event.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputNewPassword1" className="col-lg-2 control-label">New Password</label>
                            <div className="col-lg-10">
                                <input type="password" className="form-control" id="inputNewPassword1" autoComplete="new-password"
                                    placeholder="New password" value={this.state.newPassword}
                                    onChange={(event) => this.setState({ newPassword: event.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputConfirmation1" className="col-lg-2 control-label">New password confirmation</label>
                            <div className="col-lg-10">
                                <input type="password" className="form-control" id="inputConfirmation1" autoComplete="off"
                                    placeholder="New password" value={this.state.confirmation}
                                    onChange={(event) => this.setState({ confirmation: event.target.value })} />
                            </div>
                        </div>
                    </fieldset>
                </form>
                <div>
                    <button className="btn btn-primary" onClick={() => changePassword()}>Submit</button>
                </div>
            </div>
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
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    showError: (message) => dispatch(showError(message)),
    changePassword: (oldPassword: string, newPassword: string) => dispatch(changePassword(oldPassword, newPassword))
});

const ChangePasswordPage: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(ChangePasswordComponent);
export default ChangePasswordPage;
