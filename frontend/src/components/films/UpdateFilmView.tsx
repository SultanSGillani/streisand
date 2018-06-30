import * as React from 'react';
import { connect } from 'react-redux';

import FilmForm, { IFilmFormData } from './FilmForm';
import { IDispatch } from '../../actions/ActionTypes';
import IFilm, { IFilmUpdate } from '../../models/IFilm';
import { updateFilm } from '../../actions/films/UpdateFilmAction';

export type Props = {
    film: IFilm;
};

type ConnectedState = { };

type ConnectedDispatch = {
    updateFilm: (id: number, film: Partial<IFilmUpdate>) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class UpdateFilmViewComponent extends React.Component<CombinedProps> {
    public render() {
        const film = this.props.film;
        const onUpdateFilm = (data: IFilmFormData) => {
            const { duration, ...update } = data;
            this.props.updateFilm(film.id, {
                ...update,
                durationInMinutes: duration
            });
        };
        const data: IFilmFormData = {
            description: film.description,
            duration: film.durationInMinutes,
            imdbId: film.imdbId,
            posterUrl: film.posterUrl,
            title: film.title,
            tmdbId: film.tmdbId,
            trailerUrl: film.trailerUrl,
            year: film.year
        };
        return (
            <div>
                <h1>{film.title}</h1>
                <FilmForm onSubmit={onUpdateFilm} intialValues={data} processing={false} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    updateFilm: (id: number, film: Partial<IFilmUpdate>) => dispatch(updateFilm(id, film))
});

const UpdateFilmView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(UpdateFilmViewComponent);
export default UpdateFilmView;
