import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../store';
import { login } from '../actions/auth/AuthAction';

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
            <div className="well">
                <form className="form-horizontal" onKeyPress={login}>
                    <fieldset>
                        <legend>Sign in</legend>
                        <div className="form-group">
                            <label htmlFor="inputEmail" className="col-lg-2 control-label">Email</label>
                            <div className="col-lg-10">
                                <input type="text" className="form-control" id="inputEmail" placeholder="Email"
                                    value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
                            <div className="col-lg-10">
                                <input type="password" className="form-control" id="inputPassword" autoComplete="current-password"
                                    placeholder="Password" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} />
                            </div>
                        </div>
                    </fieldset>
                </form>
                <div>
                    <button className="btn btn-primary" onClick={() => login()}>Login</button>
                </div>
            </div>
        );
    }

    private _login(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        if (this.state.username && this.state.password) {
            this.props.login(this.state.username, this.state.password);
        }
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    login: (username: string, password: string) => dispatch(login(username, password))
});

const LoginPage: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(LoginComponent);
export default LoginPage;
