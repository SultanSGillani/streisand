import * as React from 'react';
import { Collapse, Nav, TabContent, TabPane } from 'reactstrap';

import IUser from '../../models/IUser';
import IRelease from '../../models/IRelease';
import TabHeader from '../generic/TabHeader';
import TorrentInfo from './tabs/TorrentInfo';
import TorrentFiles from './tabs/TorrentFiles';
import TorrentMedia from './tabs/TorrentMedia';
import { ITorrent } from '../../models/ITorrent';
import ReleaseContent from './tabs/ReleaseContent';
import { IDeviceInfo } from '../../models/IDeviceInfo';

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
        const { torrent, release, uploader, isOpen } = this.props;
        const setActiveTab = (id: string) => this.setState({ activeTab: id });
        const containerStyle: React.CSSProperties = {
            maxWidth: this.props.deviceInfo.containerWidth
        };
        const contents = release
            ? <FullContents release={release} torrent={torrent} uploader={uploader}
                activeTab={activeTab} setActiveTab={setActiveTab} />
            : <TorrentOnlyContents {...this.props} />;
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

function TorrentOnlyContents(props: Props) {
    const { torrent, uploader } = props;
    return (
        <TorrentFiles torrent={torrent} uploader={uploader} />
    );
}

interface IFullContentsProps {
    torrent: ITorrent;
    uploader?: IUser;
    release: IRelease;
    activeTab: string;
    setActiveTab: (id: string) => void;
}

function FullContents(props: IFullContentsProps) {
    const { torrent, release, uploader, activeTab, setActiveTab } = props;
    return (
        <>
            <Nav tabs>
                <TabHeader id="files" title="Files" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabHeader id="release" title="Release" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabHeader id="nfo" title="NFO" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabHeader id="media" title="Media" activeTab={activeTab} setActiveTab={setActiveTab} />
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
            </TabContent>
        </>
    );
}