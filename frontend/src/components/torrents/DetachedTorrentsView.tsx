import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import Empty from '../generic/Empty';
import Loading from '../generic/Loading';
import { ITorrent } from '../../models/ITorrent';
import { ScreenSize } from '../../models/IDeviceInfo';
import DetachedTorrentRow from './DetachedTorrentRow';
import { getNodeItems } from '../../utilities/mapping';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    torrents: ITorrent[];
    screenSize: ScreenSize;
    status: ILoadingStatus;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class DetachedTorrentsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const { status, torrents, page, total, pageSize } = this.props;
        if (!torrents.length) {
            return status.loading ? <Loading /> : status.loaded ? <Empty /> : null;
        }

        const pager = <Pager uri="/torrents/detached" total={total} page={page} pageSize={pageSize} />;
        const rows = torrents.map((torrent: ITorrent) => {
            return (<DetachedTorrentRow torrent={torrent} key={torrent.id} page={page} />);
        });

        // const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <div>
                {pager}
                <Table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Uploader</th>
                            <th>Uploaded</th>
                            <th colSpan={2}>Size</th>
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
    const list = state.sealed.torrent.detached;
    const page = list.pages[props.page];
    return {
        total: list.count,
        pageSize: list.pageSize,
        screenSize: state.deviceInfo.screenSize,
        status: page ? page.status : defaultStatus,
        torrents: getNodeItems({
            page: props.page,
            byId: state.sealed.torrent.byId,
            pages: list.pages
        })
    };
};

const DetachedTorrentsView: React.ComponentClass<Props> =
    connect(mapStateToProps)(DetachedTorrentsViewComponent);
export default DetachedTorrentsView;
