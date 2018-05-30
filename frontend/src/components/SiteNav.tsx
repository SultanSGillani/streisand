import * as React from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavbarBrand, NavLink } from 'reactstrap';

import Store from '../store';
import CurrentUserLink from './users/CurrentUserLink';
import SearchBox from './SearchBox';

export type Props = {};
type State = {
    isOpen: boolean;
};

type ConnectedState = {
    isAuthenticated: boolean;
};

type ConnectedDispatch = {};

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
                {isAuthenticated && <SearchBox />}
            </div>
        );
    }

    private _getLinks() {
        return (
            <Nav className="mr-auto" navbar>
                <NavItem><LinkContainer to="/films"><NavLink>Films</NavLink></LinkContainer></NavItem>
                <NavItem><LinkContainer to="/torrents"><NavLink>Torrents</NavLink></LinkContainer></NavItem>
                <NavItem><LinkContainer to="/wikis"><NavLink>Wikis</NavLink></LinkContainer></NavItem>
                <NavItem><LinkContainer to="/forum"><NavLink>Forum</NavLink></LinkContainer></NavItem>
            </Nav>
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    isAuthenticated: state.sealed.auth.isAuthenticated
});

const SiteNav: React.ComponentClass<Props> =
    connect(mapStateToProps)(SiteNavComponent);
export default SiteNav;