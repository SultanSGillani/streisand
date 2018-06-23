import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import IFilm from '../../models/IFilm';
import DataSize from '../generic/DataSize';
import IRelease from '../../models/IRelease';
import TorrentInfoRow from './TorrentInfoRow';
import { ITorrent } from '../../models/ITorrent';
import { getItem } from '../../utilities/mapping';
import TorrentActionCell from './TorrentActionCell';
import { ScreenSize } from '../../models/IDeviceInfo';

export type Props = {
    film: IFilm;
    torrent: ITorrent;
};

type State = {
    isOpen: boolean;
    activeTab: string;
};

type ConnectedState = {
    uploader?: IUser;
    release?: IRelease;
    screenSize: ScreenSize;
};

type ConnectedDispatch = { };

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentRowComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isOpen: false,
            activeTab: 'general'
        };
    }

    public render() {
        const { isOpen } = this.state;
        const { film, torrent, release, uploader, screenSize } = this.props;
        if (!release) {
            return <tr><td colSpan={3}>Torrent is not connected to a release.</td></tr>;
        }

        const name = getTorrentName(release);
        const toggle = () => this.setState({ isOpen: !this.state.isOpen });
        const secondRowProps = { torrent, release, uploader, isOpen, screenSize };
        return (
            <>
                <tr>
                    <td className="align-middle"><a href="javascript:void 0" color="link" onClick={toggle} title={name}>{name}</a></td>
                    <td className="align-middle">{torrent.snatchCount}</td>
                    <td className="align-middle"><DataSize size={torrent.totalSizeInBytes} /></td>
                    <TorrentActionCell film={film} torrent={torrent} />
                </tr>
                <TorrentInfoRow {...secondRowProps} />
            </>
        );
    }
}

function getTorrentName(release: IRelease) {
    let name = `${release.codec} / ${release.container} / ${release.sourceMedia} / ${release.resolution}`;
    if (release.is3d) {
        name += ' / 3D';
    }
    if (release.isScene) {
        name += ' / Scene';
    }

    return name;
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        screenSize: state.deviceInfo.screenSize,
        release: getItem({
            id: props.torrent.release,
            byId: state.sealed.release.byId
        }),
        uploader: getItem({
            id: props.torrent.uploadedBy,
            byId: state.sealed.user.byId
        })
    };
};

const TorrentRow: React.ComponentClass<Props> =
    connect(mapStateToProps)(TorrentRowComponent);
export default TorrentRow;