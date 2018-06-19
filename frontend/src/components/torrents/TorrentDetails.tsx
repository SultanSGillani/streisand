import * as React from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';

import IFilm from '../../models/IFilm';
// import TextView from '../bbcode/TextView';
import ITorrent from '../../models/ITorrent';

export type Props = {
    film: IFilm;
    torrent: ITorrent;
};

type State = {
    activeTab: string;
};

export default class TorrentDetails extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeTab: 'general'
        };
    }

    public render() {
        const torrent = this.props.torrent;
        return (
            <div>
                <Nav tabs>
                    {this._getTab({ id: 'general', title: 'General' })}
                    {this._getTab({ id: 'video', title: 'Video' })}
                    {this._getTab({ id: 'torrent', title: 'Torrent' })}
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="general" id="general">
                        <GeneralContent torrent={torrent} />
                    </TabPane>
                    <TabPane tabId="video" id="video">
                        <MediaContent torrent={torrent} />
                    </TabPane>
                    <TabPane tabId="torrent" id="torrent">
                        <TorrentContent torrent={torrent} />
                    </TabPane>
                </TabContent>
            </div>
        );
    }

    private _getTab(props: { id: string; title: string; }) {
        const classes = this.state.activeTab === props.id ? 'active' : '';
        const onClick = () => { this.setState({ activeTab: props.id }); };
        return (
            <NavItem key={props.id}>
                <NavLink className={classes} onClick={onClick} href={`#${props.id}`}>
                    {props.title}
                </NavLink>
            </NavItem>
        );
    }
}

interface IRowProps {
    label: string;
    value: string | number;
}

function InfoRow(props: IRowProps) {
    return (
        <ListGroupItem>
            <strong>{props.label}</strong>: <span className="text-muted">{props.value}</span>
        </ListGroupItem>
    );
}

function GeneralContent(props: { torrent: ITorrent }) {
    const torrentRelease = props.torrent.release;
    if (!torrentRelease) {
        return <div style={{ marginTop: '8px' }}>No information provided.</div>;
    }
    return (
        <div style={{ marginTop: '8px' }}>
            {/* <TextView content={torrentRelease.description} /> */}
        </div>
    );
}

function TorrentContent(props: { torrent: ITorrent }) {
    const torrent = props.torrent;
    const torrentRelease = props.torrent.release;
    if (!torrentRelease) {
        return <label style={{ marginTop: '8px' }}>Release is not tied to a torrent.</label>;
    }
    return (
        <ListGroup className="mt-2">
            {/* <InfoRow label="Release name" value={torrentRelease.releaseName} />
            <InfoRow label="Release group" value={torrentRelease.releaseGroup} /> */}
            <InfoRow label="Uploaded at" value={torrent.uploadedAt} />
        </ListGroup>
    );
}

function MediaContent(props: { torrent: ITorrent }) {
    // const torrent = props.torrent;
    // const info = torrent.release.mediainfo;
    return (
        <ListGroup className="mt-2">
            {/* {info && <InfoRow label="Runtime" value={info.runtime} />}
            <InfoRow label="Codec" value={torrent.release.codec} />
            <InfoRow label="Container" value={torrent.release.container} />
            <InfoRow label="Cut" value={torrent.release.cut} />
            {info && <InfoRow label="Bite rate" value={info.bitRate} />}
            {info && <InfoRow label="Frame rate" value={info.frameRate} />}
            <InfoRow label="Source" value={torrent.release.sourceMedia} />
            {info && <InfoRow label="Aspect ratio" value={info.displayAspectRatio} />}
            <InfoRow label="Resolution" value={torrent.release.resolution} />
            {info && <InfoRow label="Width" value={info.resolutionWidth} />}
            {info && <InfoRow label="Height" value={info.resolutionHeight} />} */}
        </ListGroup>
    );
}
