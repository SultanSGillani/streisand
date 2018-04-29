import * as React from 'react';
import * as redux from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { NavDropdown, MenuItem } from 'react-bootstrap';

import Store from '../../store';
import IUser from '../../models/IUser';
import { logout } from '../../actions/auth/LogoutAction';
import { getCurrentUser } from '../../actions/users/CurrentUserAction';

export type Props = {};

type ConnectedState = {
    loading: boolean;
    currentUser?: IUser;
    isAuthenticated: boolean;
};

type ConnectedDispatch = {
    logout: () => void;
    getCurrentUser: () => void;
};

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class CurrentUserLinkComponent extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (this.props.isAuthenticated && !this.props.loading && !this.props.currentUser) {
            this.props.getCurrentUser();
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        if (props.isAuthenticated && !props.loading && !props.currentUser) {
            props.getCurrentUser();
        }
    }

    public render() {
        const user = this.props.currentUser;
        const isAuthenticated = this.props.isAuthenticated;

        const title = user ? user.username : 'Settings';
        const profile = user && <li role="presentation"><Link role="button" to={`/user/${user.id}`}>Profile</Link></li>;
        const logout = isAuthenticated && <MenuItem onClick={() => { this.props.logout(); }}>Logout</MenuItem>;
        return (
            <NavDropdown title={title} id="basic-nav-dropdown">
                {profile}
                <li role="presentation"><Link role="menuitem" to="/themes">Themes</Link></li>
                {user && <MenuItem divider />}
                {isAuthenticated && <li role="presentation"><Link role="menuitem" to="/changepassword">Change password</Link></li>}
                {logout}
            </NavDropdown>
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    loading: state.sealed.currentUser.loading,
    isAuthenticated: state.sealed.auth.isAuthenticated,
    currentUser: state.sealed.users.byId[state.sealed.currentUser.id as number] as IUser
});

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getCurrentUser: () => dispatch(getCurrentUser()),
    logout: () => {
        dispatch(logout());
        dispatch(replace('/login'));
    }
});

const CurrentUserLink: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CurrentUserLinkComponent);
export default CurrentUserLink;