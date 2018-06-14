import * as React from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavbarBrand, NavLink } from 'reactstrap';

import Store from '../store';
import SearchBox from './search/SearchBox';
import CurrentUserLink from './users/CurrentUserLink';

export type Props = {};
type State = {
    isOpen: boolean;
};

type ConnectedState = {
    isAuthenticated: boolean;
    location: string;
};

type ConnectedDispatch = {};

const excludeSearch = [
    '/themes',
    '/changepassword',
    '/film/search',
    '/torrents/upload/'
];

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class SiteNavComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    public render() {
        const isAuthenticated = this.props.isAuthenticated;
        const includeSearch = isAuthenticated && this._includeSearch();
        const toggle = () => { this.setState({ isOpen: !this.state.isOpen }); };
        return (
            <div className="mb-2">
                <Navbar color="primary" dark expand="sm">
                    <div className="container">
                        <LinkContainer to="/"><NavbarBrand>Phoenix</NavbarBrand></LinkContainer>
                        <NavbarToggler onClick={toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            {isAuthenticated && this._getLinks()}
                            <Nav className="ml-auto" navbar>
                                <CurrentUserLink />
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
                {includeSearch && <SearchBox />}
            </div>
        );
    }

    private _getLinks() {
        return (
            <Nav className="mr-auto" navbar>
                <NavItem><LinkContainer to="/films"><NavLink>Films</NavLink></LinkContainer></NavItem>
                <NavItem><LinkContainer to="/wikis"><NavLink>Wikis</NavLink></LinkContainer></NavItem>
                <NavItem><LinkContainer to="/forum"><NavLink>Forum</NavLink></LinkContainer></NavItem>
            </Nav>
        );
    }

    private _includeSearch() {
        for (const pattern of excludeSearch) {
            if (this.props.location.indexOf(pattern) >= 0) {
                return false;
            }
        }
        return true;
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    isAuthenticated: state.sealed.auth.isAuthenticated,
    location: state.routing.locationBeforeTransitions.pathname
});

const SiteNav: React.ComponentClass<Props> =
    connect(mapStateToProps)(SiteNavComponent);
export default SiteNav;