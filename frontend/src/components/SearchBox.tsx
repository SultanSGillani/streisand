import * as React from 'react';
import { connect } from 'react-redux';
import { Target } from 'react-popper';
import { Dropdown, DropdownMenu, DropdownItem, Input } from 'reactstrap';

import Store from '../store';

export type Props = {};
type State = {
    searchText: string;
    dropdownOpen: boolean;
};

type ConnectedState = {
    isAuthenticated: boolean;
};

type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class SearchBoxComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            searchText: '',
            dropdownOpen: false
        };
    }

    public render() {
        const searchToggle = () => { this.setState({ dropdownOpen: !this.state.dropdownOpen }); };
        return (
                <Dropdown isOpen={this.state.dropdownOpen} toggle={searchToggle}>
                    <div className="container mt-1">
                        <Target>
                            <div className="input-group input-group-sm">
                                <Input type="search" name="allSearch" id="allSearch" placeholder="Search site"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded={this.state.dropdownOpen}
                                    value={this.state.searchText} onChange={(event) => {
                                        const value = event.target.value;
                                        this.setState({ searchText: value });
                                        if (value) {
                                            searchToggle();
                                        }
                                    }} />
                            </div>
                        </Target>
                    </div>
                    <DropdownMenu style={{ maxWidth: '310px'}}>
                        <DropdownItem header>Films</DropdownItem>
                        <DropdownItem style={{ overflowX: 'hidden', textOverflow: 'ellipsis' }}>Another Actionq wd qwoidn qwoidn qwoidnqowind oqwindoqiwnd oqiwndqowind oqiwnd oqiwndo qiwnd oqiwn</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem header>Forums</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    isAuthenticated: state.sealed.auth.isAuthenticated
});

const SearchBox: React.ComponentClass<Props> =
    connect(mapStateToProps)(SearchBoxComponent);
export default SearchBox;