import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import TorrentList from './TorrentList';
import ITorrent from '../../models/ITorrent';
import { getNodeItems } from '../../utilities/mapping';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    torrents: ITorrent[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const { page, total, pageSize, torrents } = this.props;
        const pager = <Pager uri="/torrents" total={total} page={page} pageSize={pageSize} />;
        return (
            <div>
                {pager}
                <TorrentList torrents={torrents} />
                {pager}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    return {
        total: state.sealed.torrents.count,
        pageSize: state.sealed.torrents.pageSize,
        torrents: getNodeItems({
            page: ownProps.page,
            byId: state.sealed.torrents.byId,
            pages: state.sealed.torrents.pages
        })
    };
};

const TorrentsView: React.ComponentClass<Props> =
    connect(mapStateToProps)(TorrentsViewComponent);
export default TorrentsView;
