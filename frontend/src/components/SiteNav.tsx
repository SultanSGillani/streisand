import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';

import Store from '../store';
import CurrentUserLink from './users/CurrentUserLink';

export type Props = {};

type ConnectedState = {
    isAuthenticated: boolean;
};

type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class SiteNavComponent extends React.Component<CombinedProps> {
    public render() {
        const isAuthenticated = this.props.isAuthenticated;

        return (
            <Navbar fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Phoenix</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    { isAuthenticated && this._getLinks() }
                    <Nav pullRight>
                        <CurrentUserLink />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    private _getLinks() {
        return (
            <Nav>
                <li role="presentation"><Link role="button" to="/films">Films</Link></li>
                <li role="presentation"><Link role="button" to="/torrents">Torrents</Link></li>
                <li role="presentation"><Link role="button" to="/wikis">Wikis</Link></li>
                <li role="presentation"><Link role="button" to="/forum">Forum</Link></li>
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