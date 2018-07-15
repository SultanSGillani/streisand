import * as React from 'react';
import { Form, Card, CardBody, CardFooter, Button } from 'reactstrap';

import { StringInput } from '../generic/inputs/StringInput';
import { NumericInput } from '../generic/inputs/NumericInput';

export interface IFilmFormData {
    title: string;
    description: string;
    duration?: number;
    imdbId: string;
    posterUrl: string;
    tmdbId?: number;
    trailerUrl: string;
    year: number;
}

export type Props = {
    onSubmit: (update: IFilmFormData) => void;
    processing: boolean;
    intialValues?: IFilmFormData;
};

type State = IFilmFormData;

function getDefaultValues() {
    return {
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

export default class FilmForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = props.intialValues || getDefaultValues();
    }

    public render() {
        const canSubmit = this._canSubmit();
        const onSubmit = this._submit.bind(this);
        const isCreating = !this.props.intialValues;
        const buttonText = this.props.processing
            ? (isCreating ? 'creating film...' : 'updating film...')
            : (isCreating ? 'Create' : 'Update');
        return (
            <Card>
                <CardBody>
                    <Form onKeyPress={onSubmit} autoComplete="off">
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
                        <Button className="col-auto" color="primary" disabled={!canSubmit} onClick={() => onSubmit()}>{buttonText}</Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    private _canSubmit(): boolean {
        const { title, description, posterUrl, trailerUrl, year } = this.state;
        return !!(title && description && posterUrl && trailerUrl && year > 1800);
    }

    private _submit(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        if (this._canSubmit()) {
            this.props.onSubmit(this.state);
        }

        return false;
    }
}