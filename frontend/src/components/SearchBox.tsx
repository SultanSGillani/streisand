import * as React from 'react';
import { connect } from 'react-redux';
import { Target } from 'react-popper';
import { Dropdown, DropdownMenu, DropdownItem, Input } from 'reactstrap';

import Store from '../store';
import { IFilmSearchProps, searchFilm } from '../actions/films/FilmsSearchAction';
import { IDispatch } from '../actions/ActionTypes';
import IFilm from '../models/IFilm';
import ILoadingStatus, { defaultStatus } from '../models/base/ILoadingStatus';
import { getNodeItems } from '../utilities/mapping';

export type Props = {};
type State = {
    searchText: string;
    dropdownOpen: boolean;
};

type ConnectedState = {
    films: IFilm[];
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    searchFilm: (props: IFilmSearchProps) => void;
};

const debounce = (callback: Function, time: number = 1000, interval: any = undefined) => (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => { callback(...args); }, time);
};

const debounced = debounce((callback: () => void) => callback());

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
        const items = this.props.films.map((film: IFilm) => {
            return <DropdownItem key={film.id} style={{ overflowX: 'hidden', textOverflow: 'ellipsis' }}>{film.title}</DropdownItem>;
        });
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
                    <DropdownItem header>Films</DropdownItem>
                    {items}
                    <DropdownItem divider />
                    <DropdownItem header>Forums</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }

    private _onChange(value: string) {
        this.setState({ searchText: value });
        this.setState({ dropdownOpen: !!value });
        if (value && value.length >= 2) {
            debounced(() => {
                this.props.searchFilm({ title: value, page: 1 });
            });
        }
    }
}
const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const page = state.sealed.film.search.pages[1];
    return {
        status: page ? page.status : defaultStatus,
        films: getNodeItems({
            page: 1,
            byId: state.sealed.film.byId,
            pages: state.sealed.film.search.pages
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    searchFilm: (props: IFilmSearchProps) => dispatch(searchFilm(props))
});

const SearchBox: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(SearchBoxComponent);
export default SearchBox;