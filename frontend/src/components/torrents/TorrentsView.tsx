import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Empty from '../Empty';
import Store from '../../store';
import TorrentList from './TorrentList';
import ITorrent from '../../models/ITorrent';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    torrents: ITorrent[];
    loading: boolean;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const torrents = this.props.torrents;
        if (!torrents.length) {
            return <Empty loading={this.props.loading} />;
        }
        const pager = <Pager uri="/torrents" total={this.props.total} page={this.props.page} />;
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
    const page = state.sealed.torrents.pages[ownProps.page];
    return {
        total: state.sealed.torrents.count,
        loading: page ? page.loading : false,
        torrents: page ? page.items : []
    };
};

const TorrentsView: React.ComponentClass<Props> =
    connect(mapStateToProps)(TorrentsViewComponent);
export default TorrentsView;
