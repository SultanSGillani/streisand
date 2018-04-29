import * as React from 'react';
import { Link } from 'react-router';

import IFilm from '../../models/IFilm';

export type Props = {
    film: IFilm;
};

export default function FilmRow(props: Props) {
    const film = props.film;
    return (
        <tr>
            <td>
                <img src={film.posterUrl} width="80px" />
            </td>
            <td>
                <Link to={'/film/' + film.id} title={film.title}>{film.title}</Link>
            </td>
            <td>
                {film.year}
            </td>
        </tr>
    );
}
