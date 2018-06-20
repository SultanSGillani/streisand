import * as React from 'react';
import { Collapse, CardBody, Card, Nav, TabContent, TabPane } from 'reactstrap';

import IUser from '../../models/IUser';
import { ScreenSize } from '../../models/IDeviceInfo';
import { ITorrent } from '../../models/ITorrent';
import IRelease from '../../models/IRelease';
import TabHeader from '../generic/TabHeader';
import GeneralContent from './tabs/GeneralContent';
import TorrentFiles from './tabs/TorrentFiles';
import TorrentInfo from './tabs/TorrentInfo';
import TorrentMedia from './tabs/TorrentMedia';

export type Props = {
    isOpen: boolean;
    torrent: ITorrent;
    uploader?: IUser;
    release: IRelease;
    screenSize: ScreenSize;
};

type State = {
    activeTab: string;
};

export default class TorrentInfoRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeTab: 'general'
        };
    }

    public render() {
        const activeTab = this.state.activeTab;
        const { torrent, release, uploader, isOpen } = this.props;
        const setActiveTab = (id: string) => this.setState({ activeTab: id });
        return (
            <tr>
                <td colSpan={4} className="p-0">
                    <Collapse isOpen={isOpen}>
                        <Card>
                            <CardBody className="pt-0">
                                <Nav tabs>
                                    <TabHeader id="general" title="General" activeTab={activeTab} setActiveTab={setActiveTab} />
                                    <TabHeader id="files" title="Files" activeTab={activeTab} setActiveTab={setActiveTab} />
                                    <TabHeader id="nfo" title="NFO" activeTab={activeTab} setActiveTab={setActiveTab} />
                                    <TabHeader id="media" title="Media" activeTab={activeTab} setActiveTab={setActiveTab} />
                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="general" id="general">
                                        <GeneralContent release={release} uploader={uploader} torrent={torrent} />
                                    </TabPane>
                                    <TabPane tabId="files" id="files">
                                        <TorrentFiles torrent={torrent} />
                                    </TabPane>
                                    <TabPane tabId="nfo" id="nfo">
                                        <TorrentInfo release={release} />
                                    </TabPane>
                                    <TabPane tabId="media" id="media">
                                        <TorrentMedia release={release} />
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Collapse>
                </td>
            </tr>
        );
    }
}