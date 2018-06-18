import * as React from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import Store from '../../store';
import IUser from '../../models/IUser';
import { getItem } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';
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
        return (
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>{user ? user.username : 'Settings'}</DropdownToggle>
                <DropdownMenu right>
                    {user && <LinkContainer to={`/user/${user.id}`}><DropdownItem>Profile</DropdownItem></LinkContainer>}
                    <LinkContainer to={`/themes`}><DropdownItem>Themes</DropdownItem></LinkContainer>
                    {isAuthenticated && <DropdownItem divider />}
                    {isAuthenticated && <LinkContainer to={`/tools`}><DropdownItem>Tools</DropdownItem></LinkContainer>}
                    {user && <DropdownItem divider />}
                    {isAuthenticated && <LinkContainer to={`/changepassword`}><DropdownItem>Change password</DropdownItem></LinkContainer>}
                    {isAuthenticated && <DropdownItem onClick={() => { this.props.logout(); }}>Logout</DropdownItem>}
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    loading: state.sealed.currentUser.loading,
    isAuthenticated: state.sealed.auth.isAuthenticated,
    currentUser: getItem({
        id: state.sealed.currentUser.id,
        byId: state.sealed.user.byId
    })
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getCurrentUser: () => dispatch(getCurrentUser()),
    logout: () => {
        dispatch(logout());
        dispatch(replace('/login'));
    }
});

const CurrentUserLink: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CurrentUserLinkComponent);
export default CurrentUserLink;