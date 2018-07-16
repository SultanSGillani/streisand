import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import PeerRow from './PeerRow';
import Empty from '../generic/Empty';
import Loading from '../generic/Loading';
import { ITorrent } from '../../models/ITorrent';
import { IDispatch } from '../../actions/ActionTypes';
import { ITrackerPeer } from '../../models/ITrackerPeer';
import { getPeers } from '../../actions/peers/PeersAction';
import ILoadingStatus from '../../models/base/ILoadingStatus';
import { getNodeItems, getItemPage, getList } from '../../utilities/mapping';

export type Props = {
    page: number;
    active: boolean;
    torrent: ITorrent;
    changePage: (page: number) => void;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    peers: ITrackerPeer[];
    status: ILoadingStatus;
};
type ConnectedDispatch = {
    getPeers: (id: number, page?: number) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class PeerListComponent extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (this.props.active && !this.props.status.loading) {
            this.props.getPeers(this.props.torrent.id, this.props.page);
        }
    }

    public componentDidUpdate(props: CombinedProps) {
        const status = this.props.status;
        const changed = props.torrent.id !== this.props.torrent.id
            || props.page !== this.props.page
            || props.active !== this.props.active;
        const needUpdate = !status.failed && (!status.loaded || status.outdated);
        if (this.props.active && !status.loading && (changed || needUpdate)) {
            this.props.getPeers(this.props.torrent.id, this.props.page);
        }
    }

    public render() {
        const { torrent, peers, page, total, pageSize, changePage } = this.props;
        if (!peers.length) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        const pager = <Pager onPageChange={changePage} total={total} page={page} pageSize={pageSize} />;
        const rows = peers.map((peer: ITrackerPeer) => {
            return (<PeerRow torrent={torrent} peer={peer} key={peer.id} />);
        });
        return (
            <div>
                <Table className="table-borderless" striped hover>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Active</th>
                            <th>Up</th>
                            <th>Down</th>
                            <th>%</th>
                            <th>Client</th>
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
    const list = getList(state.sealed.peer.byTorrentId[props.torrent.id]);
    const page = getItemPage({ list, page: props.page });
    return {
        total: list.count,
        pageSize: list.pageSize,
        status: page.status,
        peers: getNodeItems({
            page: props.page,
            byId: state.sealed.peer.byId,
            pages: list.pages
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getPeers: (id: number, page?: number) => dispatch(getPeers(id, page))
});

const PeerList: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(PeerListComponent);
export default PeerList;
