import * as React from 'react';
import { Collapse, Nav, TabContent, TabPane } from 'reactstrap';

import IUser from '../../models/IUser';
import PeerInfo from './tabs/PeerInfo';
import IRelease from '../../models/IRelease';
import TabHeader from '../generic/TabHeader';
import TorrentInfo from './tabs/TorrentInfo';
import TorrentFiles from './tabs/TorrentFiles';
import TorrentMedia from './tabs/TorrentMedia';
import { ITorrent } from '../../models/ITorrent';
import ReleaseContent from './tabs/ReleaseContent';
import { IDeviceInfo, ScreenSize } from '../../models/IDeviceInfo';

export type Props = {
    isOpen: boolean;
    torrent: ITorrent;
    uploader?: IUser;
    release?: IRelease;
    deviceInfo: IDeviceInfo;
};

type State = {
    activeTab: string;
};

export default class TorrentInfoRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeTab: 'files'
        };
    }

    public render() {
        const activeTab = this.state.activeTab;
        const { torrent, release, uploader, isOpen, deviceInfo } = this.props;
        const setActiveTab = (id: string) => this.setState({ activeTab: id });
        const containerStyle: React.CSSProperties = {
            maxWidth: deviceInfo.containerWidth
        };
        const contents = release
            ? <FullContents release={release} torrent={torrent} uploader={uploader}
                activeTab={activeTab} setActiveTab={setActiveTab} screenSize={deviceInfo.screenSize} />
            : <TorrentOnlyContents torrent={torrent} uploader={uploader}
                activeTab={activeTab} setActiveTab={setActiveTab} screenSize={deviceInfo.screenSize} />;
        return (
            <tr>
                <td colSpan={4} className="p-0">
                    <Collapse isOpen={isOpen} className="row no-gutters mb-2" style={containerStyle}>
                        <div className="col-sm-12">
                            {contents}
                        </div>
                    </Collapse>
                </td>
            </tr>
        );
    }
}

interface IFullContentsProps {
    torrent: ITorrent;
    uploader?: IUser;
    release: IRelease;
    activeTab: string;
    screenSize: ScreenSize;
    setActiveTab: (id: string) => void;
}

function FullContents(props: IFullContentsProps) {
    const { torrent, release, uploader, activeTab, setActiveTab } = props;
    const includePeers = props.screenSize > ScreenSize.small;
    return (
        <>
            <Nav tabs>
                <TabHeader id="files" title="Files" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabHeader id="release" title="Release" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabHeader id="nfo" title="NFO" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabHeader id="media" title="Media" activeTab={activeTab} setActiveTab={setActiveTab} />
                {includePeers &&
                    <TabHeader id="peers" title="Peers" activeTab={activeTab} setActiveTab={setActiveTab} />
                }
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="files" id="files">
                    <TorrentFiles torrent={torrent} uploader={uploader} />
                </TabPane>
                <TabPane tabId="release" id="release">
                    <ReleaseContent release={release} />
                </TabPane>
                <TabPane tabId="nfo" id="nfo">
                    <TorrentInfo release={release} />
                </TabPane>
                <TabPane tabId="media" id="media">
                    <TorrentMedia release={release} />
                </TabPane>
                {includePeers &&
                    <TabPane tabId="peers" id="peers">
                        <PeerInfo torrent={torrent} active={activeTab === 'peers'} />
                    </TabPane>
                }
            </TabContent>
        </>
    );
}

interface ITorrentContentsProps {
    torrent: ITorrent;
    uploader?: IUser;
    activeTab: string;
    screenSize: ScreenSize;
    setActiveTab: (id: string) => void;
}

function TorrentOnlyContents(props: ITorrentContentsProps) {
    const { torrent, uploader, activeTab, setActiveTab } = props;
    const includePeers = props.screenSize > ScreenSize.small;
    if (includePeers) {
        return (
            <>
                <Nav tabs>
                    <TabHeader id="files" title="Files" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabHeader id="peers" title="Peers" activeTab={activeTab} setActiveTab={setActiveTab} />
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="files" id="files">
                        <TorrentFiles torrent={torrent} uploader={uploader} />
                    </TabPane>
                    <TabPane tabId="peers" id="peers">
                        <PeerInfo torrent={torrent} active={activeTab === 'peers'} />
                    </TabPane>
                </TabContent>
            </>
        );
    }
    return (
        <TorrentFiles torrent={torrent} uploader={uploader} />
    );
}