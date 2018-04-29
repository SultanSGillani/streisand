import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Empty from '../Empty';
import Store from '../../store';
import FilmRow from './FilmRow';
import IFilm from '../../models/IFilm';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    films: IFilm[];
    loading: boolean;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const films = this.props.films;
        if (!films.length) {
            return <Empty loading={this.props.loading} />;
        }
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
    const page = state.sealed.films.pages[ownProps.page];
    return {
        total: state.sealed.films.count,
        loading: page ? page.loading : false,
        films: page ? page.items : []
    };
};

const FilmsView: React.ComponentClass<Props> =
    connect(mapStateToProps)(FilmsViewComponent);
export default FilmsView;
