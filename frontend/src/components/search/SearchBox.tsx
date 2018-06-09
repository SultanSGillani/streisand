import * as React from 'react';
import { connect } from 'react-redux';
import { Target } from 'react-popper';
import { Dropdown, DropdownMenu, DropdownItem, Input } from 'reactstrap';

import Store from '../../store';
import { debounce } from '../../utilities/async';
import { IDispatch } from '../../actions/ActionTypes';
import FilmResults, { hasFilmResults } from './FilmResults';
import { IFilmSearchProps, searchFilm } from '../../actions/films/FilmsSearchAction';

export type Props = {};
type State = {
    searchText: string;
    dropdownOpen: boolean;
};

type ConnectedState = {
    hasFilmResults: boolean;
};

type ConnectedDispatch = {
    searchFilm: (props: IFilmSearchProps) => void;
};

interface ISearchResultsSection {
    key: string;
    hasResults: boolean;
    getComponent: () => JSX.Element;
}

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
        const toggle = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });
        const results = this._getResults().filter(r => r.hasResults).map(this._mapResults.bind(this));
        return (
            <Dropdown isOpen={this.state.dropdownOpen && results.length > 0} toggle={toggle}>
                <div className="container mt-1">
                    <Target>
                        <div className="input-group input-group-sm">
                            <Input type="search" name="allSearch" id="allSearch" placeholder="Search site"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded={this.state.dropdownOpen}
                                onFocus={() => this.setState({ dropdownOpen: true })}
                                value={this.state.searchText} onChange={(event) => this._onChange(event.target.value)} />
                        </div>
                    </Target>
                </div>
                <DropdownMenu style={{ maxWidth: '310px' }}>
                    {results}
                </DropdownMenu>
            </Dropdown>
        );
    }

    private _getResults(): ISearchResultsSection[] {
        return [
            {
                key: 'films',
                hasResults: this.props.hasFilmResults,
                getComponent: () => <FilmResults />
            }
        ];
    }

    private _mapResults(result: ISearchResultsSection, index: number, array: ISearchResultsSection[]): JSX.Element {
        const needDivider = index !== array.length - 1;
        return (
            <React.Fragment key={result.key}>
                {result.getComponent()}
                {needDivider && <DropdownItem divider />}
            </React.Fragment>
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

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => ({
    hasFilmResults: hasFilmResults(state)
});

const SearchBox: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(SearchBoxComponent);
export default SearchBox;