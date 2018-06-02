import * as React from 'react';
import { connect } from 'react-redux';
import { Target } from 'react-popper';
import { Dropdown, DropdownMenu, DropdownItem, Input } from 'reactstrap';

import FilmResults from './FilmResults';
import { debounce } from '../../utilities/async';
import { IDispatch } from '../../actions/ActionTypes';
import { IFilmSearchProps, searchFilm } from '../../actions/films/FilmsSearchAction';

export type Props = {};
type State = {
    searchText: string;
    dropdownOpen: boolean;
};

type ConnectedState = {};

type ConnectedDispatch = {
    searchFilm: (props: IFilmSearchProps) => void;
};

const debounced = debounce((callback: () => void) => callback(), 1000);

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
        return (
            <Dropdown isOpen={this.state.dropdownOpen}>
                <div className="container mt-1">
                    <Target>
                        <div className="input-group input-group-sm">
                            <Input type="search" name="allSearch" id="allSearch" placeholder="Search site"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded={this.state.dropdownOpen}
                                value={this.state.searchText} onChange={(event) => this._onChange(event.target.value)} />
                        </div>
                    </Target>
                </div>
                <DropdownMenu style={{ maxWidth: '310px' }}>
                    <FilmResults />
                    <DropdownItem divider />
                    <DropdownItem header>Forums</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }

    private _onChange(value: string) {
        this.setState({ searchText: value });
        if (value && value.length >= 2) {
            debounced(() => {
                this.props.searchFilm({ title: value, page: 1 });
                this.setState({ dropdownOpen: true });
            });
        } else if (!value) {
            this.setState({ dropdownOpen: false });
        }
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    searchFilm: (props: IFilmSearchProps) => dispatch(searchFilm(props))
});

const SearchBox: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(SearchBoxComponent);
export default SearchBox;