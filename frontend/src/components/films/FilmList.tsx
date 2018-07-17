import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import FilmRow from './FilmRow';
import Empty from '../generic/Empty';
import Store from '../../state/store';
import IFilm from '../../models/IFilm';
import Loading from '../generic/Loading';
import { getNodeItems } from '../../utilities/mapping';
import { ScreenSize } from '../../models/IDeviceInfo';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

export type Props = {
    page: number;
    search?: boolean;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    films: IFilm[];
    screenSize: ScreenSize;
    status: ILoadingStatus;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmListComponent extends React.Component<CombinedProps> {
    public render() {
        const { status, films, page, total, pageSize } = this.props;
        if (!films.length) {
            return status.loading ? <Loading /> : status.loaded ? <Empty /> : null;
        }

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

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const list = props.search ? state.sealed.film.search : state.sealed.film.list;
    const page = list.pages[props.page];
    return {
        total: list.count,
        pageSize: list.pageSize,
        screenSize: state.deviceInfo.screenSize,
        status: page ? page.status : defaultStatus,
        films: getNodeItems({
            page: props.page,
            byId: state.sealed.film.byId,
            pages: list.pages
        })
    };
};

const FilmList: React.ComponentClass<Props> =
    connect(mapStateToProps)(FilmListComponent);
export default FilmList;
