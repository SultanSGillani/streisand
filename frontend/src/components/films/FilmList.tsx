import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import FilmRow from './FilmRow';
import IFilm from '../../models/IFilm';
import { getNodeItems } from '../../utilities/mapping';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    films: IFilm[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmListComponent extends React.Component<CombinedProps> {
    public render() {
        const { films, page, total } = this.props;
        const rows = films.map((film: IFilm) => {
            return (<FilmRow film={film} key={film.id} page={page} />);
        });
        return (
            <div>
                <Pager uri="/films" total={total} page={page} />
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Year</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <Pager uri="/films" total={total} page={page} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    return {
        total: state.sealed.films.count,
        films: getNodeItems({
            page: ownProps.page,
            byId: state.sealed.films.byId,
            pages: state.sealed.films.pages
        })
    };
};

const FilmList: React.ComponentClass<Props> =
    connect(mapStateToProps)(FilmListComponent);
export default FilmList;
