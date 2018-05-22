import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import FilmRow from './FilmRow';
import IFilm from '../../models/IFilm';
import { getNodeItems } from '../../utilities/mapping';
import { ScreenSize } from '../../models/IDeviceInfo';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    films: IFilm[];
    screenSize: ScreenSize;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmListComponent extends React.Component<CombinedProps> {
    public render() {
        const { films, page, total, pageSize } = this.props;
        const pager = <Pager uri="/films" total={total} page={page} pageSize={pageSize} />;
        const rows = films.map((film: IFilm) => {
            return (<FilmRow film={film} key={film.id} page={page} />);
        });

        const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <div>
                {pager}
                <Table className="table-borderless" striped hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            {full && <th>Year</th>}
                            {full && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                {pager}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    return {
        total: state.sealed.films.count,
        pageSize: state.sealed.films.pageSize,
        screenSize: state.deviceInfo.screenSize,
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
