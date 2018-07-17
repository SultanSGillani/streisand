import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../state/store';
import IUser from '../../models/IUser';
import IFilm from '../../models/IFilm';
import DataSize from '../generic/DataSize';
import IRelease from '../../models/IRelease';
import TorrentInfoRow from './TorrentInfoRow';
import { ITorrent } from '../../models/ITorrent';
import { getItem } from '../../utilities/mapping';
import TorrentActionCell from './TorrentActionCell';
import { IDeviceInfo } from '../../models/IDeviceInfo';

export type Props = {
    film: IFilm;
    urlPrefix: string;
    torrent: ITorrent;
    startOpen: boolean;
    includeReleaseInfo: boolean;
};

type State = {
    isOpen: boolean;
    activeTab: string;
};

type ConnectedState = {
    uploader?: IUser;
    release?: IRelease;
    deviceInfo: IDeviceInfo;
};

type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentRowComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isOpen: props.startOpen,
            activeTab: 'general'
        };
    }

    public render() {
        const { isOpen } = this.state;
        const { torrent, release, uploader, deviceInfo, includeReleaseInfo } = this.props;
        const name = (release && includeReleaseInfo) ? getReleaseName(release) : getTorrentName(torrent);
        const toggle = () => this.setState({ isOpen: !this.state.isOpen });
        const secondRowProps = {
            torrent, uploader, isOpen, deviceInfo,
            release: includeReleaseInfo ? release : undefined
        };
        const link = `${this.props.urlPrefix}/${torrent.id}`;
        return (
            <>
                <tr>
                    <td className="align-middle">
                        <Link to={link} title={name} onClick={toggle}>{name}</Link>
                    </td>
                    <td className="align-middle">{torrent.snatchCount}</td>
                    <td className="align-middle"><DataSize size={torrent.totalSizeInBytes} /></td>
                    <TorrentActionCell torrent={torrent}
                        includeDelete={!(release && includeReleaseInfo)}
                        includeRelease={!!(release && includeReleaseInfo)} />
                </tr>
                <TorrentInfoRow {...secondRowProps} />
            </>
        );
    }
}

function getTorrentName(torrent: ITorrent): string {
    if (torrent.directoryName) {
        return torrent.directoryName;
    }

    if (torrent.files && torrent.files.length) {
        return torrent.files[0].path;
    }

    return '<Empty torrent>';
}

function getReleaseName(release: IRelease): string {
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
        deviceInfo: state.deviceInfo,
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