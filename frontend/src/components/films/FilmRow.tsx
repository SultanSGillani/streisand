import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import IFilm from '../../models/IFilm';
import DeleteCell from '../generic/DeleteCell';
import { IDispatch } from '../../actions/ActionTypes';
import { deleteFilm, IActionProps } from '../../actions/films/DeleteFilmAction';

export type Props = {
    film: IFilm;
    page: number;
};

type ConnectedState = {};

type ConnectedDispatch = {
    deleteFilm: (props: IActionProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmRowComponent extends React.Component<CombinedProps> {
    public render() {
        const film = this.props.film;
        const onDelete = () => {
            this.props.deleteFilm({
                id: film.id,
                currentPage: this.props.page
            });
        };
        return (
            <tr>
                <td className="align-middle"><img src={film.posterUrl} width="80px" /></td>
                <td className="align-middle"><Link to={'/film/' + film.id} title={film.title}>{film.title}</Link></td>
                <td className="align-middle">{film.year}</td>
                <DeleteCell onDelete={onDelete} />
            </tr>
        );
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteFilm: (props: IActionProps) => dispatch(deleteFilm(props))
});

const FilmRow: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(FilmRowComponent);
export default FilmRow;