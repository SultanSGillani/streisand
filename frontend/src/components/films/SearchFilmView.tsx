import * as React from 'react';
import { connect } from 'react-redux';
import { Card, Form, CardBody, CardFooter, Button, CardTitle } from 'reactstrap';

import Store from '../../store';
import FilmList from './FilmList';
import { IDispatch } from '../../actions/ActionTypes';
import { StringInput } from '../generic/inputs/StringInput';
import { NumericInput } from '../generic/inputs/NumericInput';
import { searchFilm, IFilmSearchProps } from '../../actions/films/FilmsSearchAction';

export type Props = {};

type ConnectedState = {};

type ConnectedDispatch = {
    searchFilm: (props: IFilmSearchProps) => void;
};

type State = {
    title: string;
    description: string;
    year?: number;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class SearchFilmViewComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            title: '',
            description: ''
        };
    }

    public render() {
        const onSearchFilm = this._createFilm.bind(this);

        return (
            <div>
                <Card className="mb-2">
                    <CardBody>
                        <CardTitle>Search films</CardTitle>
                        <Form onKeyPress={onSearchFilm} autoComplete="off">
                            <StringInput id="title" label="Title" placeholder="Film title"
                                value={this.state.title} setValue={(value: string) => this.setState({ title: value })} />
                            <StringInput id="description" label="Description" placeholder="Film description"
                                value={this.state.description} setValue={(value: string) => this.setState({ description: value })} />
                            <NumericInput id="year" label="Year of release"
                                value={this.state.year} setValue={(value: number) => this.setState({ year: value })} />
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <div className="row m-0 justify-content-end">
                            <Button className="col-auto" color="primary" onClick={() => onSearchFilm()}>Search</Button>
                        </div>
                    </CardFooter>
                </Card>
                <FilmList page={1} search={true} />
            </div>
        );
    }

    private _createFilm(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        const { title, description, year } = this.state;
        this.props.searchFilm({
            title, description, year,
            advanced: true,
            page: 1
        });
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => ({
    creating: state.sealed.wiki.creating
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    searchFilm: (props: IFilmSearchProps) => dispatch(searchFilm(props))
});

const SearchFilmView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(SearchFilmViewComponent);
export default SearchFilmView;
