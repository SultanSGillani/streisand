import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import DataSize from '../generic/DataSize';
import { ITorrent } from '../../models/ITorrent';
import { getItem } from '../../utilities/mapping';
import { ITrackerPeer } from '../../models/ITrackerPeer';

export type Props = {
    torrent: ITorrent;
    peer: ITrackerPeer;
};

type ConnectedState = {
    user?: IUser;
};

type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class PeerRowComponent extends React.Component<CombinedProps> {
    public render() {
        const { torrent, peer, user } = this.props;
        const total = torrent.totalSizeInBytes || 1;
        const percentage = (total - peer.bytesRemaining) / total * 100;
        return (
            <tr>
                <td className="align-middle"><UserLink user={user} /></td>
                <td className="align-middle">{peer.isActive ? 'Yes' : 'No'}</td>
                <td className="align-middle"><DataSize size={peer.bytesUploaded} /></td>
                <td className="align-middle"><DataSize size={peer.bytesDownloaded} /></td>
                <td className="align-middle">{percentage}%</td>
                <td className="align-middle">{peer.userAgent}</td>
            </tr>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        user: getItem({
            id: props.peer.user,
            byId: state.sealed.user.byId
        })
    };
};

const PeerRow: React.ComponentClass<Props> =
    connect(mapStateToProps)(PeerRowComponent);
export default PeerRow;