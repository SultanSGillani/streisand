import * as React from 'react';
import { connect } from 'react-redux';
import { Form, Card, CardBody, CardFooter, Button } from 'reactstrap';

import Store from '../../store';
import { IFilmUpdate } from '../../models/IFilm';
import { IDispatch } from '../../actions/ActionTypes';
import { StringInput, NumericInput } from '../generic/inputs';
import { createFilm } from '../../actions/films/CreateFilmAction';

export type Props = {};

type ConnectedState = {
    creating: boolean;
};

type ConnectedDispatch = {
    createFilm: (film: IFilmUpdate) => void;
};

type State = {
    title: string;
    description: string;
    duration?: number;
    imdbId: string;
    posterUrl: string;
    tmdbId?: number;
    trailerUrl: string;
    year: number;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CreateFilmViewComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            title: '',
            description: '',
            duration: undefined,
            imdbId: '',
            posterUrl: '',
            tmdbId: undefined,
            trailerUrl: '',
            year: (new Date()).getFullYear()
        };
    }

    public render() {
        const canCreateFilm = this._canCreateFilm();
        const onCreateFilm = this._createFilm.bind(this);
        const buttonText = this.props.creating ? 'creating film...' : 'Create';
        return (
            <div>
                <h1>Create a new film</h1>
                <Card>
                    <CardBody>
                        <Form onKeyPress={onCreateFilm} autoComplete="off">
                            <StringInput id="imdb" label="IMDB identifier" placeholder="Corresponding imdb identifier"
                                value={this.state.imdbId} setValue={(value: string) => this.setState({ imdbId: value })} />
                            <NumericInput id="tmdb" label="TMDB identifier"
                                value={this.state.tmdbId} setValue={(value: number) => this.setState({ tmdbId: value })} />
                            <StringInput id="title" label="Title" placeholder="Film title"
                                value={this.state.title} setValue={(value: string) => this.setState({ title: value })} />
                            <StringInput id="description" label="Description" placeholder="Film description"
                                value={this.state.description} setValue={(value: string) => this.setState({ description: value })} />
                            <StringInput id="poster" label="Poster url" placeholder="Film poster"
                                value={this.state.posterUrl} setValue={(value: string) => this.setState({ posterUrl: value })} />
                            <StringInput id="trailer" label="Trailer url" placeholder="Youtube url or identifier"
                                value={this.state.trailerUrl} setValue={(value: string) => this.setState({ trailerUrl: value })} />
                            <NumericInput id="duration" label="Duration (in minutes)"
                                value={this.state.duration} setValue={(value: number) => this.setState({ duration: value })} />
                            <NumericInput id="year" label="Year of release"
                                value={this.state.year} setValue={(value: number) => this.setState({ year: value })} />
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <div className="row m-0 justify-content-end">
                            <Button className="col-auto" color="primary" disabled={!canCreateFilm} onClick={() => onCreateFilm()}>{buttonText}</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    private _canCreateFilm(): boolean {
        const { title, description, duration, imdbId, posterUrl, tmdbId, trailerUrl, year } = this.state;
        return !!(title && description && duration && duration > 0 && imdbId && posterUrl && tmdbId && tmdbId > 0 && trailerUrl && year > 1800);
    }

    private _createFilm(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        const { title, description, duration, imdbId, posterUrl, tmdbId, trailerUrl, year } = this.state;
        if (this._canCreateFilm() && duration && tmdbId) {
            this.props.createFilm({
                title, description, imdbId, posterUrl, tmdbId, trailerUrl, year,
                durationInMinutes: duration,
                fanartUrl: '',
                moderationNotes: '',
                lists: [],
                trailerType: 'YouTube',
                genreTags: []
            });
        }
        return false;
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => ({
    creating: state.sealed.wiki.creating
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createFilm: (film: IFilmUpdate) => dispatch(createFilm(film))
});

const CreateFilmView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CreateFilmViewComponent);
export default CreateFilmView;
