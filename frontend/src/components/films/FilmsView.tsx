import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import FilmRow from './FilmRow';
import IFilm from '../../models/IFilm';
import { getItems } from '../../utilities/mapping';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    films: IFilm[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const films = this.props.films;
        const rows = films.map((film: IFilm) => {
            return (<FilmRow film={film} key={film.id} />);
        });
        return (
            <div>
                <Pager uri="/films" total={this.props.total} page={this.props.page} />
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <Pager uri="/films" total={this.props.total} page={this.props.page} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    return {
        total: state.sealed.films.count,
        films: getItems({
            page: ownProps.page,
            byId: state.sealed.films.byId,
            pages: state.sealed.films.pages
        })
    };
};

const FilmsView: React.ComponentClass<Props> =
    connect(mapStateToProps)(FilmsViewComponent);
export default FilmsView;
