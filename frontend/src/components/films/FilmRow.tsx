import * as React from 'react';
import * as redux from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import { deleteFilm, IDeleteProps } from '../../actions/films/DeleteFilmAction';

export type Props = {
    film: IFilm;
    page: number;
};

type ConnectedState = {};

type ConnectedDispatch = {
    deleteFilm: (props: IDeleteProps) => void;
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
                <td style={{ display: 'flex', flexFlow: 'row-reverse' }}>
                    <button className="btn btn-sm btn-danger" onClick={onDelete}>
                        <i className="fa fa-trash" style={{ fontSize: '14px' }} />
                    </button>
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    deleteFilm: (props: IDeleteProps) => dispatch(deleteFilm(props))
});

const FilmRow: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(FilmRowComponent);
export default FilmRow;