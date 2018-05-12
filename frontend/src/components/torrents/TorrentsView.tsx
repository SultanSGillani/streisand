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
    torrents: ITorrent[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const torrents = this.props.torrents;
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
    return {
        total: state.sealed.torrents.count,
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
