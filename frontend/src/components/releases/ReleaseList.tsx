import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import Empty from '../generic/Empty';
import ReleaseRow from './ReleaseRow';
import Loading from '../generic/Loading';
import IRelease from '../../models/IRelease';
import { ScreenSize } from '../../models/IDeviceInfo';
import { getNodeItems } from '../../utilities/mapping';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

export type Props = {
    page: number;
    search?: boolean;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    releases: IRelease[];
    screenSize: ScreenSize;
    status: ILoadingStatus;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ReleaseListComponent extends React.Component<CombinedProps> {
    public render() {
        const { status, releases, page, total, pageSize } = this.props;
        if (!releases.length) {
            return status.loading ? <Loading /> : status.loaded ? <Empty /> : null;
        }

        const pager = <Pager uri="/releases" total={total} page={page} pageSize={pageSize} />;
        const rows = releases.map((release: IRelease) => {
            return (<ReleaseRow release={release} key={release.id} page={page} />);
        });

        return (
            <div>
                {pager}
                <Table className="table-borderless" striped hover>
                    <thead>
                        <tr>
                            <th>Film</th>
                            <th>Info</th>
                            <th>Name</th>
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
    const list = state.sealed.release.list;
    const page = list.pages[props.page];
    return {
        total: list.count,
        pageSize: list.pageSize,
        screenSize: state.deviceInfo.screenSize,
        status: page ? page.status : defaultStatus,
        releases: getNodeItems({
            page: props.page,
            byId: state.sealed.release.byId,
            pages: list.pages
        })
    };
};

const ReleaseList: React.ComponentClass<Props> =
    connect(mapStateToProps)(ReleaseListComponent);
export default ReleaseList;
